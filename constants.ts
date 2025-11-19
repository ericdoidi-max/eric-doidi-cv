import { Experience, Education, Skill, ContactInfo } from './types';

export const CONTACT: ContactInfo = {
  address: "8 rue de Rigny Ussé, 37300 Joué Lès Tours",
  phone: "06 50 62 76 58",
  email: "eric.doidi@free.fr"
};

export const EXPERIENCES: Experience[] = [
  {
    id: 'curr',
    role: "Responsable d'Unité Opérationnelle",
    company: "DALKIA EN (Groupe EDF)",
    period: "Depuis 2023",
    context: "Sur 3 CNPE (Centrales Nucléaires) et 1 CPT",
    details: [
      "Gestion PAO 4M€ avec progression de la marge.",
      "Multi technique : CVC, Electricité, Plomberie.",
      "Services de Proximité : petit entretien technique et services à l'occupant.",
      "Gestion Magasin Pièce de rechange CNPE de Civaux UTO."
    ],
    kpis: [
      { label: "Budget Géré", value: "4 M€" },
      { label: "Sites Gérés", value: "4" }
    ],
    tags: ["Management", "Nucléaire", "Budget", "CVC"]
  },
  {
    id: '2021',
    role: "Responsable Services de Proximité",
    company: "DALKIA",
    period: "2021 – 2023",
    context: "Sur 9 CNPE",
    details: [
      "Mise en œuvre du contrat de petit entretien technique et prestations de services.",
      "Création du service et déploiement du modèle contractuel en partenariat avec le client EDF DIRGO et DIG.",
      "Analyse des contrats et indicateurs de suivi/performance.",
      "Recrutement des effectifs."
    ],
    kpis: [
      { label: "Budget", value: "2.7 M€" },
      { label: "Satisfaction Client", value: "8.4/10" }
    ],
    tags: ["Création de Service", "Recrutement", "KPIs"]
  },
  {
    id: '2018',
    role: "Pilotage des prestataires tertiaires",
    company: "DALKIA",
    period: "2018 – 2021",
    context: "Sur 9 CNPE",
    details: [
      "Pilotage des Prestataires Multi techniques et de Services."
    ],
    tags: ["Pilotage", "Sous-traitance"]
  },
  {
    id: '2011',
    role: "Responsable de Service / Chargé d'affaires",
    company: "DIKEOS (Futuroscope) / filiale DALKIA",
    period: "2011 – 2018",
    details: [
      "Responsable Système d'Information : Déploiement GMAO (CARL Source) pour 11000 équipements.",
      "Déploiement Mobilité et Cloud (Google Suite).",
      "Centre de relation clients : Management de 5 assistantes.",
      "Déploiement et structuration des Méthodes Maintenance tertiaire & Attractions."
    ],
    kpis: [
      { label: "Équipements", value: "11,000" },
      { label: "Équipe", value: "5 Assistantes" }
    ],
    tags: ["GMAO", "Digitalisation", "Management", "Méthodes"]
  },
  {
    id: '2007',
    role: "Responsable de Maintenance",
    company: "DIKEOS / filiale DALKIA",
    period: "2007 - 2010",
    details: [
      "Maintenance corrective et préventive des installations techniques des attractions du Futuroscope.",
      "Automatisme, électricité, mécanique, hydraulique, pneumatique.",
      "Relation Client / Fournisseur / Gestion Sous-traitance (IMAX Toronto)."
    ],
    tags: ["Technique", "Terrain", "Attractions"]
  },
  {
    id: 'pre2006',
    role: "Technicien Maintenance Industrielle",
    company: "Divers",
    period: "Avant 2006",
    details: [
      "Maintenance des systèmes de projection automatiques et manuels.",
      "Automatisme, électrotechnique, mécanique industrielle."
    ],
    tags: ["Opérationnel", "Expertise Technique"]
  }
];

export const EDUCATION: Education[] = [
  { year: "2017", title: "PASS MPL1 EDF", institution: "EDF", details: "Management individuel (MBTI), Stratégie Finance, Efficacité Collective" },
  { year: "2010", title: "Management", institution: "Campus VEOLIA Environnement" },
  { year: "2006", title: "Formation IMAX", institution: "Toronto, Canada", details: "Maintenance des systèmes" },
  { year: "1995", title: "BTS Maintenance", institution: "Lycée", details: "Automatismes Industriels" }
];

export const SKILLS: Skill[] = [
  { category: "Management", items: ["Gestion d'équipe", "Recrutement", "Pilotage sous-traitance", "Relation Client"], level: 90 },
  { category: "Technique", items: ["CVC", "Electricité", "Plomberie", "Automatisme", "Hydraulique"], level: 85 },
  { category: "Digital / Méthodes", items: ["GMAO (Carl Source)", "Suite Google", "Process Méthodes", "KPIs"], level: 95 },
  { category: "Savoir-être", items: ["Esprit d'équipe", "Polyvalence", "Adaptabilité", "Rigueur"], level: 100 }
];

export const HOBBIES = ["Cinéma", "Littérature", "Vélo", "Ski"];

export const BIO_SUMMARY = `
Professionnel de la maintenance et des services tertiaires avec une solide expérience en management, méthodes et pilotage opérationnel.
Expertise confirmée sur sites sensibles (CNPE - Nucléaire) et grand public (Futuroscope).
Capacité démontrée à gérer des budgets importants (4M€), à digitaliser les processus (GMAO) et à structurer des services de proximité.
`;