export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  context?: string; // e.g., "sur 3 CNPE"
  details: string[];
  kpis?: { label: string; value: string }[];
  tags: string[];
}

export interface Education {
  year: string;
  title: string;
  institution: string;
  details?: string;
}

export interface Skill {
  category: string;
  items: string[];
  level: number; // 0-100 for charts
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  linkedin?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LOGS = 'LOGS', // Experience
  SPECS = 'SPECS', // Skills & Formation
  COMMUNICATION = 'COMMUNICATION', // Chat & Contact
}
