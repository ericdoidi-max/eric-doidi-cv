/**
 * CO-PILOTE PLANIFICATION & LOGISTIQUE PRO
 * Script d'Arrière-Plan (Backend Google Apps Script)
 * Liaison temps réel haute performance avec Google Agenda et Gmail.
 *
 * @author Expert Web & Apps Script
 * @version 3.4 Optimisé
 */

// Point d'entrée de l'application Web
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Co-Pilote Planification & Logistique Pro')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Retourne la config (emoji, label, couleur) d'une position.
 * Centralise la logique dupliquée entre syncSingleDay et syncAll.
 */
function getPositionConfig(position) {
  const configs = {
    'TT_Tours':    { emoji: '🏠', label: 'TT Tours',         color: CalendarApp.EventColor.PALE_GREEN },
    'Acticampus':  { emoji: '🏭', label: 'Acticampus',       color: CalendarApp.EventColor.CYAN },
    'Deplacement': { emoji: '🚗', label: 'Déplacement',      color: CalendarApp.EventColor.ORANGE },
    'RTT':         { emoji: '⏳', label: 'RTT',              color: CalendarApp.EventColor.MAUVE },
    'CP':          { emoji: '🌴', label: 'Congé Payé',       color: CalendarApp.EventColor.PALE_RED },
    'Repos_JF':    { emoji: '🎉', label: 'Repos Jour Férié', color: CalendarApp.EventColor.YELLOW },
    'Hors_site':   { emoji: '🌍', label: 'Hors site',        color: CalendarApp.EventColor.TURQUOISE }
  };
  return configs[position] || { emoji: '🏢', label: 'Lille Bureau', color: CalendarApp.EventColor.PALE_BLUE };
}

/**
 * Crée l'événement de formation minuté si actif pour le jour donné.
 * Élimine la duplication entre syncSingleDay et syncAll.
 */
function createFormationEventIfNeeded(calendar, day, parts) {
  if (!day.formation || day.formation === 'none') return;

  const startParts = day.formationStart ? day.formationStart.split(':') : ['09', '00'];
  const endParts   = day.formationEnd   ? day.formationEnd.split(':')   : ['17', '00'];
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);

  const startDateTime = new Date(y, m, d, parseInt(startParts[0], 10), parseInt(startParts[1], 10));
  const endDateTime   = new Date(y, m, d, parseInt(endParts[0],   10), parseInt(endParts[1],   10));

  const isVisio = day.formation === 'visio';
  const formEvent = calendar.createEvent(
    `${isVisio ? '💻' : '👨‍🏫'} Co-Pilote: Formation ${isVisio ? 'Visio' : 'Présentiel'}`,
    startDateTime,
    endDateTime,
    {
      description: "Session de formation planifiée via l'application Co-Pilote Logistique.",
      location: isVisio ? 'En distanciel (Visioconférence)' : 'Lille Bureau'
    }
  );
  formEvent.setColor(CalendarApp.EventColor.EMERALD);
}

/**
 * Récupère les événements réels de l'Agenda Google par défaut sur l'intervalle donné.
 * CORRECTIF : parse manuel des dates pour éviter les décalages de fuseau horaire.
 */
function getCalendarEvents(startStr, endStr) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const sp = startStr.split('-');
    const ep = endStr.split('-');
    const startDate = new Date(parseInt(sp[0], 10), parseInt(sp[1], 10) - 1, parseInt(sp[2], 10));
    const endDate   = new Date(parseInt(ep[0], 10), parseInt(ep[1], 10) - 1, parseInt(ep[2], 10));
    endDate.setDate(endDate.getDate() + 1);

    const events = calendar.getEvents(startDate, endDate);
    const mappedEvents = {};

    events.forEach(event => {
      const title      = event.getTitle();
      const dateStr    = formatDateStr(event.getStartTime());
      const lowerTitle = title.toLowerCase();

      let position = 'Lille';
      if (lowerTitle.includes('télétravail') || /\btt\b/.test(lowerTitle)) {
        position = 'TT_Tours';
      } else if (lowerTitle.includes('acticampus')) {
        position = 'Acticampus';
      } else if (lowerTitle.includes('déplacement') || lowerTitle.includes('seminaire') || lowerTitle.includes('comité')) {
        position = 'Deplacement';
      } else if (lowerTitle.includes('rtt')) {
        position = 'RTT';
      } else if (/\bcp\b/.test(lowerTitle) || lowerTitle.includes('congé')) {
        position = 'CP';
      } else if (lowerTitle.includes('repos_jf') || lowerTitle.includes('férié')) {
        position = 'Repos_JF';
      } else if (lowerTitle.includes('repos')) {
        position = 'Repos';
      }

      mappedEvents[dateStr] = { position, title };
    });

    return mappedEvents;
  } catch (error) {
    Logger.log('Erreur [getCalendarEvents] : ' + error.toString());
    return {};
  }
}

/**
 * Synchronise en temps réel une journée spécifique avec suppression de l'ancien événement Co-Pilote.
 * OPTIMISATION : utilise getPositionConfig() et createFormationEventIfNeeded() pour éliminer la duplication.
 */
function syncSingleDayToGoogleCalendar(dateStr, dayJson) {
  try {
    const day      = JSON.parse(dayJson);
    const calendar = CalendarApp.getDefaultCalendar();
    const parts    = dateStr.split('-');
    const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

    // 1. Nettoyage ciblé des événements "Co-Pilote" existants pour ce jour
    calendar.getEventsForDay(targetDate).forEach(evt => {
      if (evt.getTitle().includes('Co-Pilote')) evt.deleteEvent();
    });

    // 2. Pas d'événement pour les jours de repos simple
    if (day.position === 'Repos') return true;

    // 3. Création de l'événement principal
    const cfg = getPositionConfig(day.position);
    let description = `Régime Logistique : ${day.regime === 'Sur_place' ? 'Sur Place' : day.regime}`;
    if (day.notes) description += `\nNotes : ${day.notes}`;

    const location = day.position === 'TT_Tours' ? 'Tours (Domicile)' : (day.position === 'Lille' ? 'Lille Bureau' : '');
    const mainEvent = calendar.createAllDayEvent(
      `${cfg.emoji} Co-Pilote: ${cfg.label}`,
      targetDate,
      { description, location }
    );
    mainEvent.setColor(cfg.color);

    // 4. Événement de formation minuté si actif
    createFormationEventIfNeeded(calendar, day, parts);

    return true;
  } catch (error) {
    Logger.log('Erreur [syncSingleDayToGoogleCalendar] : ' + error.toString());
    throw new Error(error.toString());
  }
}

/**
 * Synchronisation globale par période avec nettoyage de masse préalable.
 * CORRECTIF : startStr/endStr sont maintenant optionnels — calculés depuis appState si absents.
 * (Le frontend appelait cette fonction sans ces paramètres, ce qui causait une erreur silencieuse.)
 */
function syncAllToGoogleCalendar(appStateJson, startStr, endStr) {
  try {
    const appState = JSON.parse(appStateJson);
    const calendar = CalendarApp.getDefaultCalendar();

    // Calcul de la plage depuis les clés de appState si les paramètres ne sont pas fournis
    const dateKeys     = Object.keys(appState).sort();
    const resolvedStart = startStr || dateKeys[0];
    const resolvedEnd   = endStr   || dateKeys[dateKeys.length - 1];

    if (!resolvedStart || !resolvedEnd) {
      Logger.log('[syncAllToGoogleCalendar] appState vide, rien à synchroniser.');
      return true;
    }

    const sp = resolvedStart.split('-');
    const ep = resolvedEnd.split('-');
    const startDate = new Date(parseInt(sp[0], 10), parseInt(sp[1], 10) - 1, parseInt(sp[2], 10));
    const endDate   = new Date(parseInt(ep[0], 10), parseInt(ep[1], 10) - 1, parseInt(ep[2], 10));
    endDate.setDate(endDate.getDate() + 1);

    // 1. Suppression globale des événements "Co-Pilote" sur l'intervalle
    calendar.getEvents(startDate, endDate).forEach(evt => {
      if (evt.getTitle().includes('Co-Pilote')) evt.deleteEvent();
    });

    // 2. Régénération propre
    Object.keys(appState).forEach(dateStr => {
      const day = appState[dateStr];
      if (!day || day.position === 'Repos') return;

      const parts = dateStr.split('-');
      const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      if (targetDate < startDate || targetDate > endDate) return;

      const cfg = getPositionConfig(day.position);
      let description = `Régime Logistique : ${day.regime === 'Sur_place' ? 'Sur Place' : day.regime}`;
      if (day.notes) description += `\nNotes : ${day.notes}`;

      const location = day.position === 'TT_Tours' ? 'Tours (Domicile)' : (day.position === 'Lille' ? 'Lille Bureau' : '');
      const mainEvent = calendar.createAllDayEvent(
        `${cfg.emoji} Co-Pilote: ${cfg.label}`,
        targetDate,
        { description, location }
      );
      mainEvent.setColor(cfg.color);

      createFormationEventIfNeeded(calendar, day, parts);
    });

    return true;
  } catch (error) {
    Logger.log('Erreur [syncAllToGoogleCalendar] : ' + error.toString());
    throw new Error(error.toString());
  }
}

/**
 * Analyse intelligente Gmail pour détecter les déplacements et séminaires.
 * CORRECTIF : regex avec année obligatoire pour éliminer les faux positifs.
 */
function scanWorkspaceGmail() {
  try {
    const thirtyDaysAgo = formatDateStr(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const query = `(subject:dalkia OR subject:séminaire OR subject:soutenance OR subject:"comité national") after:${thirtyDaysAgo}`;
    const threads = GmailApp.search(query, 0, 15);
    const detectedEvents = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    threads.forEach(thread => {
      const messages    = thread.getMessages();
      const lastMessage = messages[messages.length - 1];
      const subject     = thread.getFirstMessageSubject();
      const body        = lastMessage.getPlainBody();

      // Regex avec année à 4 chiffres obligatoire pour éviter les faux positifs
      const dateRegex = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})\b/g;
      let match;

      while ((match = dateRegex.exec(body)) !== null) {
        const day   = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year  = parseInt(match[3], 10);

        if (month < 0 || month > 11 || day < 1 || day > 31) continue;

        const detectedDate = new Date(year, month, day);
        if (detectedDate < today) continue;

        const lowerBody = body.toLowerCase();
        let destination = 'Paris';
        let type = 'Site';

        if (lowerBody.includes('acticampus')) {
          destination = 'Acticampus Lille'; type = 'Acticampus';
        } else if (lowerBody.includes('lyon')) {
          destination = 'Lyon';
        } else if (lowerBody.includes('bordeaux')) {
          destination = 'Bordeaux';
        } else if (lowerBody.includes('lille') && !lowerBody.includes('paris')) {
          destination = 'Lille Bureau';
        }

        detectedEvents.push({
          date: formatDateStr(detectedDate),
          subject,
          destination,
          type,
          snippet: body.substring(0, 150).replace(/\n/g, ' ') + '...'
        });
        break;
      }
    });

    return JSON.stringify(detectedEvents);
  } catch (error) {
    Logger.log('Erreur [scanWorkspaceGmail] : ' + error.toString());
    return JSON.stringify([]);
  }
}

/**
 * Sauvegarde persistante de l'état utilisateur dans le cloud Properties Google.
 */
function saveStateToProperties(stateJson) {
  try {
    PropertiesService.getUserProperties().setProperty('copilot_state_v3', stateJson);
    return true;
  } catch (error) {
    Logger.log('Erreur [saveStateToProperties] : ' + error.toString());
    return false;
  }
}

/**
 * Récupère l'état utilisateur sauvegardé.
 */
function getStateFromProperties() {
  try {
    return PropertiesService.getUserProperties().getProperty('copilot_state_v3') || '';
  } catch (error) {
    Logger.log('Erreur [getStateFromProperties] : ' + error.toString());
    return '';
  }
}

function formatDateStr(d) {
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
}
