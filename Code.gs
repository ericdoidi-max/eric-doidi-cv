/**
 * CO-PILOTE PLANIFICATION & LOGISTIQUE PRO
 * Script d'Arrière-Plan (Backend Google Apps Script)
 * Liaison temps réel haute performance avec Google Agenda et Gmail.
 *
 * @author Expert Web & Apps Script
 * @version 3.4 Optimized
 */

// ─── Constantes ────────────────────────────────────────────────────────────────

var COPILOT_MARKER = "Co-Pilote";
var STATE_KEY = "copilot_state_v3";
var PROPS_CHUNK_PREFIX = "copilot_chunk_";
var PROPS_MAX_SIZE = 8500; // marge sécuritaire sous la limite de 9 KB

// ─── Point d'entrée ────────────────────────────────────────────────────────────

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Co-Pilote Planification & Logistique Pro')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ─── Helper : configuration visuelle par position ──────────────────────────────

/**
 * Retourne emoji, label, couleur Google Calendar et localisation pour une position.
 * Centralise la logique dupliquée entre syncSingle et syncAll.
 */
function getPositionConfig(position) {
  var configs = {
    TT_Tours:    { emoji: "🏠", label: "TT Tours",          color: CalendarApp.EventColor.PALE_GREEN,  location: "Tours (Domicile)" },
    Acticampus:  { emoji: "🏭", label: "Acticampus",        color: CalendarApp.EventColor.CYAN,        location: "Acticampus Lille" },
    Deplacement: { emoji: "🚗", label: "Déplacement",       color: CalendarApp.EventColor.ORANGE,      location: "" },
    RTT:         { emoji: "⏳", label: "RTT",               color: CalendarApp.EventColor.MAUVE,       location: "" },
    CP:          { emoji: "🌴", label: "Congé Payé",        color: CalendarApp.EventColor.PALE_RED,    location: "" },
    Repos_JF:    { emoji: "🎉", label: "Repos Jour Férié",  color: CalendarApp.EventColor.YELLOW,      location: "" },
    Hors_site:   { emoji: "🌍", label: "Hors site",         color: CalendarApp.EventColor.TURQUOISE,   location: "" },
    Lille:       { emoji: "🏢", label: "Lille Bureau",      color: CalendarApp.EventColor.PALE_BLUE,   location: "Lille Bureau" },
  };
  return configs[position] || configs['Lille'];
}

// ─── Agenda ────────────────────────────────────────────────────────────────────

/**
 * Récupère les événements réels de l'Agenda Google par défaut sur l'intervalle donné.
 * BUG FIX : priorité au premier événement trouvé par jour (plus de double-écrasement).
 * BUG FIX : Hors_site ajouté, détection "tt" renforcée contre les faux positifs.
 */
function getCalendarEvents(startStr, endStr) {
  try {
    if (!startStr || !endStr) throw new Error("Paramètres startStr/endStr manquants.");

    var calendar = CalendarApp.getDefaultCalendar();
    var startDate = new Date(startStr);
    var endDate = new Date(endStr);
    endDate.setDate(endDate.getDate() + 1);

    var events = calendar.getEvents(startDate, endDate);
    var mappedEvents = {};

    events.forEach(function(event) {
      var dateStr = formatDateStr(event.getStartTime());
      // Priorité au premier événement classifié — ne pas écraser
      if (mappedEvents[dateStr]) return;

      var title = event.getTitle();
      var lower = title.toLowerCase().trim();
      var position = "Lille";

      // Détection "tt" avec limites de mots pour éviter les faux positifs
      if (lower.includes("télétravail") || /\btt\b/.test(lower)) {
        position = "TT_Tours";
      } else if (lower.includes("acticampus")) {
        position = "Acticampus";
      } else if (lower.includes("hors site") || lower.includes("hors_site")) {
        position = "Hors_site";
      } else if (lower.includes("déplacement") || lower.includes("séminaire") || lower.includes("seminaire") || lower.includes("comité")) {
        position = "Deplacement";
      } else if (lower.includes("rtt")) {
        position = "RTT";
      } else if (/\bcp\b/.test(lower) || lower.includes("congé")) {
        position = "CP";
      } else if (lower.includes("repos_jf") || lower.includes("jour férié") || lower.includes("férié")) {
        position = "Repos_JF";
      } else if (lower.includes("repos")) {
        position = "Repos";
      }

      mappedEvents[dateStr] = { position: position, title: title };
    });

    return mappedEvents;
  } catch (error) {
    Logger.log("Erreur [getCalendarEvents] : " + error.toString());
    return {};
  }
}

/**
 * Supprime tous les événements Co-Pilote sur un jour cible.
 * Fonction privée mutualisée.
 */
function _deleteCopilotEventsForDay(calendar, targetDate) {
  calendar.getEventsForDay(targetDate).forEach(function(evt) {
    if (evt.getTitle().indexOf(COPILOT_MARKER) !== -1) {
      evt.deleteEvent();
    }
  });
}

/**
 * Crée l'événement Co-Pilote journée entière + l'événement de formation minuté si actif.
 * Fonction privée mutualisée — élimine la duplication entre syncSingle et syncAll.
 */
function _createCopilotEvents(calendar, dateStr, day) {
  var parts = dateStr.split('-');
  var y  = parseInt(parts[0], 10);
  var mo = parseInt(parts[1], 10) - 1;
  var d  = parseInt(parts[2], 10);
  var targetDate = new Date(y, mo, d);

  var cfg = getPositionConfig(day.position);
  var eventTitle = cfg.emoji + " " + COPILOT_MARKER + ": " + cfg.label;
  var description = "Régime Logistique : " + (day.regime === 'Sur_place' ? 'Sur Place' : (day.regime || ''));
  if (day.notes) description += "\nNotes : " + day.notes;

  var mainEvent = calendar.createAllDayEvent(eventTitle, targetDate, {
    description: description,
    location: cfg.location,
  });
  mainEvent.setColor(cfg.color);

  // Événement de formation minuté (optionnel)
  if (day.formation && day.formation !== 'none') {
    var startParts = (day.formationStart || '09:00').split(':');
    var endParts   = (day.formationEnd   || '17:00').split(':');
    var startDT = new Date(y, mo, d, parseInt(startParts[0], 10), parseInt(startParts[1], 10));
    var endDT   = new Date(y, mo, d, parseInt(endParts[0],   10), parseInt(endParts[1],   10));

    var isVisio    = (day.formation === 'visio');
    var formEmoji  = isVisio ? '💻' : '👨‍🏫';
    var formLabel  = isVisio ? 'Formation Visio' : 'Formation Présentiel';
    var formTitle  = formEmoji + " " + COPILOT_MARKER + ": " + formLabel;
    var formEvent  = calendar.createEvent(formTitle, startDT, endDT, {
      description: "Session de formation planifiée via l'application Co-Pilote Logistique.",
      location: isVisio ? 'En distanciel (Visioconférence)' : 'Lille Bureau',
    });
    formEvent.setColor(CalendarApp.EventColor.EMERALD);
  }
}

/**
 * Synchronise en temps réel une journée spécifique.
 */
function syncSingleDayToGoogleCalendar(dateStr, dayJson) {
  try {
    if (!dateStr || !dayJson) throw new Error("Paramètres dateStr/dayJson manquants.");

    var day = JSON.parse(dayJson);
    var calendar = CalendarApp.getDefaultCalendar();
    var parts = dateStr.split('-');
    var targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

    _deleteCopilotEventsForDay(calendar, targetDate);

    // Repos simple : pas d'événement à créer
    if (day.position === 'Repos') return true;

    _createCopilotEvents(calendar, dateStr, day);
    return true;
  } catch (error) {
    Logger.log("Erreur [syncSingleDayToGoogleCalendar] : " + error.toString());
    throw new Error(error.toString());
  }
}

/**
 * Synchronisation globale par période avec nettoyage de masse préalable.
 * BUG FIX : condition corrigée de <= à < endDate (endDate étant déjà +1 jour,
 *           l'ancienne condition incluait un jour hors intervalle).
 */
function syncAllToGoogleCalendar(appStateJson, startStr, endStr) {
  try {
    if (!appStateJson || !startStr || !endStr) throw new Error("Paramètres manquants.");

    var appState = JSON.parse(appStateJson);
    var calendar = CalendarApp.getDefaultCalendar();
    var startDate = new Date(startStr);
    var endDate   = new Date(endStr);
    endDate.setDate(endDate.getDate() + 1); // borne exclusive (+1 pour englober le dernier jour)

    // 1. Nettoyage global de tous les événements Co-Pilote sur l'intervalle
    calendar.getEvents(startDate, endDate).forEach(function(evt) {
      if (evt.getTitle().indexOf(COPILOT_MARKER) !== -1) {
        evt.deleteEvent();
      }
    });

    // 2. Régénération propre
    Object.keys(appState).forEach(function(dateStr) {
      var day = appState[dateStr];
      if (!day || day.position === 'Repos') return;

      var parts = dateStr.split('-');
      var targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

      // CORRECTION : < endDate (exclusive) et non <= endDate
      if (targetDate >= startDate && targetDate < endDate) {
        _createCopilotEvents(calendar, dateStr, day);
      }
    });

    return true;
  } catch (error) {
    Logger.log("Erreur [syncAllToGoogleCalendar] : " + error.toString());
    throw new Error(error.toString());
  }
}

// ─── Gmail ─────────────────────────────────────────────────────────────────────

/**
 * Analyse intelligente Gmail pour détecter les déplacements et séminaires.
 * BUG FIX : regex élargie à 20[2-3]\d (couvre jusqu'à 2039 vs 2029 avant).
 * BUG FIX : validation des dates (mois hors plage, rollover de mois ex. 31/02).
 * BUG FIX : vérification body non-null avant traitement.
 */
function scanWorkspaceGmail() {
  try {
    var since = formatDateStr(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    var query = '(subject:dalkia OR "séminaire" OR "soutenance" OR "comité national" OR "lille" OR "tours") after:' + since;
    var threads = GmailApp.search(query, 0, 15);
    var now = new Date();
    var detectedEvents = [];

    // Regex améliorée : année optionnelle, couvre 2020–2039
    var dateRegex = /\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](20[2-3]\d))?\b/g;

    threads.forEach(function(thread) {
      var messages = thread.getMessages();
      if (!messages.length) return;

      var lastMessage = messages[messages.length - 1];
      var subject = thread.getFirstMessageSubject();
      var body = lastMessage.getPlainBody();
      if (!body) return; // BUG FIX : body peut être null sur certains messages

      var lowerBody = body.toLowerCase(); // calculé une seule fois
      var match;

      while ((match = dateRegex.exec(body)) !== null) {
        var day   = parseInt(match[1], 10);
        var month = parseInt(match[2], 10) - 1; // 0-indexé
        var year  = match[3] ? parseInt(match[3], 10) : now.getFullYear();

        // BUG FIX : validation plage mois et jour avant construction Date
        if (month < 0 || month > 11 || day < 1 || day > 31) continue;
        var detectedDate = new Date(year, month, day);
        // BUG FIX : détecte les rollovers silencieux (ex: 31/02 → 03/03)
        if (detectedDate.getMonth() !== month) continue;
        if (detectedDate <= now) continue;

        var destination = "Paris";
        var type = "Site";

        if (lowerBody.includes("acticampus")) {
          destination = "Acticampus Lille"; type = "Acticampus";
        } else if (lowerBody.includes("bureau") || lowerBody.includes("lille")) {
          destination = "Lille Bureau"; type = "Site";
        } else if (lowerBody.includes("lyon")) {
          destination = "Lyon"; type = "Site";
        } else if (lowerBody.includes("bordeaux")) {
          destination = "Bordeaux"; type = "Site";
        }

        detectedEvents.push({
          date:        formatDateStr(detectedDate),
          subject:     subject,
          destination: destination,
          type:        type,
          snippet:     body.substring(0, 150).replace(/\n/g, ' ') + '...',
        });
        break; // une détection par thread suffit
      }
    });

    return JSON.stringify(detectedEvents);
  } catch (error) {
    Logger.log("Erreur [scanWorkspaceGmail] : " + error.toString());
    return JSON.stringify([]);
  }
}

// ─── Persistance ───────────────────────────────────────────────────────────────

/**
 * Sauvegarde persistante avec découpage automatique si dépassement de la limite 9 KB.
 * BUG FIX : l'ancienne version échouait silencieusement sur les états > 9 KB.
 */
function saveStateToProperties(stateJson) {
  try {
    var props = PropertiesService.getUserProperties();

    // Nettoyage des anciens chunks éventuels
    props.getKeys().forEach(function(k) {
      if (k.indexOf(PROPS_CHUNK_PREFIX) === 0) props.deleteProperty(k);
    });

    if (stateJson.length <= PROPS_MAX_SIZE) {
      props.setProperty(STATE_KEY, stateJson);
      props.deleteProperty(STATE_KEY + '_chunks');
    } else {
      // Découpage en chunks de PROPS_MAX_SIZE octets
      var chunks = [];
      for (var i = 0; i < stateJson.length; i += PROPS_MAX_SIZE) {
        chunks.push(stateJson.slice(i, i + PROPS_MAX_SIZE));
      }
      for (var j = 0; j < chunks.length; j++) {
        props.setProperty(PROPS_CHUNK_PREFIX + j, chunks[j]);
      }
      props.setProperty(STATE_KEY + '_chunks', String(chunks.length));
      props.deleteProperty(STATE_KEY);
    }
    return true;
  } catch (error) {
    Logger.log("Erreur [saveStateToProperties] : " + error.toString());
    return false;
  }
}

/**
 * Récupère l'état utilisateur sauvegardé (supporte la reconstitution depuis chunks).
 */
function getStateFromProperties() {
  try {
    var props = PropertiesService.getUserProperties();
    var chunkCount = props.getProperty(STATE_KEY + '_chunks');

    if (chunkCount) {
      var result = '';
      var count = parseInt(chunkCount, 10);
      for (var i = 0; i < count; i++) {
        result += props.getProperty(PROPS_CHUNK_PREFIX + i) || '';
      }
      return result;
    }
    return props.getProperty(STATE_KEY) || '';
  } catch (error) {
    Logger.log("Erreur [getStateFromProperties] : " + error.toString());
    return '';
  }
}

// ─── Utilitaires ───────────────────────────────────────────────────────────────

function formatDateStr(d) {
  var y   = d.getFullYear();
  var m   = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}
