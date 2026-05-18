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
    company: "DALKIA (Groupe EDF)",
    period: "Depuis 2023",
    context: "Périmètre : 3 CNPE (Centres Nucléaires) + 1 CPT",
    details: [
      "Piloter un Portefeuille d'Activité Opérationnelle (PAO) de 4 M€ avec progression de la marge.",
      "Superviser la maintenance multi-technique : CVC, électricité, plomberie.",
      "Manager les services de proximité : petit entretien technique et services à l'occupant.",
      "Gérer le magasin de pièces de rechange du CNPE de Civaux (UTO — Unité Technique Opérationnelle).",
      "Encadrer les équipes opérationnelles et garantir la qualité de service auprès du client EDF."
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
    company: "DALKIA EN (Énergie Nucléaire)",
    period: "2021 – 2023",
    context: "Sur 9 CNPE",
    details: [
      "Créer le service et déployer le modèle contractuel en partenariat avec le client EDF DIRGO et DIG.",
      "Piloter un PAO de 2,7 M€ — Satisfaction client de 8,4/10 dès la première année.",
      "Analyser les contrats, les indicateurs de suivi et la performance des fournisseurs.",
      "Recruter et structurer les effectifs sur l'ensemble du périmètre.",
      "Animer le déploiement opérationnel et la relation client EDF."
    ],
    kpis: [
      { label: "Budget", value: "2.7 M€" },
      { label: "Satisfaction Client", value: "8.4/10" }
    ],
    tags: ["Création de Service", "Recrutement", "KPIs"]
  },
  {
    id: '2018',
    role: "Pilote des Prestataires Tertiaires",
    company: "DALKIA EN (Énergie Nucléaire)",
    period: "2018 – 2021",
    context: "Sur 9 CNPE",
    details: [
      "Piloter les prestataires multi-techniques et de services sur 9 sites nucléaires.",
      "Suivre la performance contractuelle et la conformité des prestations.",
      "Coordonner les interfaces entre prestataires, client EDF et équipes internes."
    ],
    tags: ["Pilotage", "Sous-traitance", "Performance"]
  },
  {
    id: '2011',
    role: "Responsable de Service / Chargé d'affaires",
    company: "DIKEOS (Futuroscope) — Filiale DALKIA",
    period: "2011 – 2018",
    details: [
      "Méthodes & maintenance : Déployer et structurer les méthodes de maintenance : tertiaire, attractions, services généraux.",
      "Contrats : Piloter la maintenance des bâtiments et des équipements pour EDF CNPE Civaux et la ville d'Orléans.",
      "Système d'information : Déploiement GMAO et mobilité CARL Source — 11 000 équipements / 12 métiers.",
      "Transformation digitale : Migrer l'organisation vers le Cloud Google Workspace.",
      "Relation client : Manager un centre de relation clients de 5 assistantes — gestion et suivi des demandes d'intervention."
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
    company: "DIKEOS — Filiale DALKIA / VEOLIA Environnement",
    period: "2007 – 2010",
    context: "Attractions Futuroscope",
    details: [
      "Piloter la maintenance corrective et préventive des installations techniques : automatisme, électricité, mécanique, hydraulique, pneumatique.",
      "Gérer la relation client, fournisseurs et la sous-traitance (notamment IMAX Toronto).",
      "Assurer la maintenance des systèmes de projection automatiques et manuels."
    ],
    tags: ["Technique", "Terrain", "Attractions"]
  },
  {
    id: 'pre2006',
    role: "Technicien de Maintenance Industrielle",
    company: "Divers",
    period: "Avant 2006",
    details: [
      "Interventions de maintenance industrielle multi-technique en environnement de production."
    ],
    tags: ["Opérationnel", "Expertise Technique"]
  }
];

export const EDUCATION: Education[] = [
  { year: "2017", title: "PASS MPL1 — Management, Stratégie, Finance", institution: "EDF", details: "Programme de management individuel, stratégie financière et performance collective" },
  { year: "2010", title: "Cursus Management", institution: "Campus VEOLIA Environnement" },
  { year: "2006", title: "Formation technique IMAX", institution: "Toronto, Canada", details: "Maintenance des systèmes de projection" },
  { year: "1995", title: "BTS Maintenance en Automatismes Industriels", institution: "Lycée" }
];

export const SKILLS: Skill[] = [
  { category: "Management", items: ["Encadrement d'équipes", "Recrutement", "Pilotage sous-traitance", "Relation Client", "Animation"], level: 90 },
  { category: "Technique", items: ["CVC", "Electricité", "Plomberie", "Automatisme", "Mécanique", "Hydraulique"], level: 85 },
  { category: "IA Appliquée", items: ["Gemini", "NotebookLM", "Studio AI", "Productivité & Reporting"], level: 95 },
  { category: "Digital / Méthodes", items: ["GMAO (Carl Source)", "Google Workspace", "Looker Studio", "Smartsheet", "KPIs"], level: 95 },
  { category: "Savoir-être", items: ["Esprit d'équipe", "Adaptabilité", "Rigueur méthodologique", "Polyvalence"], level: 100 }
];

export const HOBBIES = ["Cinéma", "Littérature", "Vélo", "Ski"];

export const BIO_SUMMARY = `
Responsable d'unité opérationnelle avec plus de 20 ans d'expérience en maintenance multi-technique tertiaire (CVC, électricité, plomberie) et en pilotage de prestations de services. 
Expertise en gestion de contrats Facility Management chez EDF (CNPE), management d'équipes pluridisciplinaires, déploiement de GMAO et optimisation de la performance opérationnelle. 
Pilotage de portefeuilles d'activité (PAO) jusqu'à 4 M€ avec progression de marge.
`;
