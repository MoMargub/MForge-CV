export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string | { text: string; url: string };
  location: string;
}

export interface Skill {
  category: string;
  details: string;
}

export interface ProfessionalExperience {
  title: string;
  company: string;
  dates: string;
  location: string;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  dates: string;
  location: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary?: string;
  careerSummary?: string;
  technicalSkills?: Skill[];
  skills?: Skill[];
  professionalExperience?: ProfessionalExperience[];
  workExperience?: ProfessionalExperience[];
  projects?: Project[];
  education?: Education[];
}

export interface AtsScoreBreakdown {
  skills: number;
  summary: number;
  experience: number;
  projects: number;
  format: number;
  density: number;
}

export interface AtsScoreResult {
  score: number;
  breakdown: AtsScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  jdSkills: string[];
}
