// ── Domain Models ──────────────────────────────────────────────────────────

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

// ── ATS & Parsing Models ───────────────────────────────────────────────────

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
  suggestions?: string[];
}

export interface AtsResult {
  score: number;
  breakdown?: AtsScoreBreakdown;
  matchedSkills?: string[];
  missingSkills?: string[];
  jdSkills?: string[];
  suggestions?: string[];
}

// ── API & UI State Models ─────────────────────────────────────────────────

export interface StatusMsg {
  type: 'success' | 'error' | 'info';
  text: string;
}

export type JdTab = 'paste' | 'upload' | 'url' | 'input' | 'preview' | 'diff';

export interface UploadResumePreview {
  name: string;
  email: string;
  phone: string;
  skillCount: number;
  experienceCount: number;
  experienceYears?: number;
  experienceMonths?: number;
  experienceTotalMonths?: number;
  experienceFormatted?: string;
  experience?: {
    years: number;
    months: number;
    totalMonths: number;
    formatted: string;
  };
  skills?: string[];
}

export type UploadPreview = UploadResumePreview;
export type ResumeJsonData = ResumeData;

export interface UploadResumeResponse {
  status: string;
  message?: string;
  filename?: string;
  preview: UploadResumePreview;
  resumeData?: ResumeData;
  success?: boolean;
}

export interface ScoreResumeResponse {
  status: string;
  ats: AtsResult;
  matchedSkills?: string[];
  jd?: string;
  success?: boolean;
}

export interface TailorResumeResponse {
  status: string;
  generated: boolean;
  matchedSkills?: string[];
  jd?: string;
  error?: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  detail?: string | Array<{ msg: string; loc?: string[] }>;
  status?: number;
}

// ── Constants & Aliases ───────────────────────────────────────────────────

export const skillAliases: [string, string[]][] = [
  ['React.js', ['react', 'reactjs', 'react.js']],
  ['Next.js', ['next', 'nextjs', 'next.js']],
  ['TypeScript', ['typescript', 'ts']],
  ['JavaScript', ['javascript', 'js', 'es6']],
  ['Node.js', ['node', 'nodejs', 'node.js']],
  ['Express.js', ['express', 'expressjs', 'express.js']],
  ['MongoDB', ['mongodb', 'mongo']],
  ['PostgreSQL', ['postgresql', 'postgres']],
  ['SQL', ['sql']],
  ['RESTful APIs', ['rest api', 'restful api', 'rest apis', 'api development']],
  ['JWT', ['jwt', 'json web token']],
  ['RBAC', ['rbac', 'role based access']],
  ['OAuth 2.0', ['oauth', 'oauth2', 'oauth 2.0']],
  ['Socket.IO', ['socket.io', 'socketio']],
  ['WebSockets', ['websocket', 'websockets']],
  ['Redux Toolkit', ['redux', 'redux toolkit']],
  ['Tailwind CSS', ['tailwind', 'tailwind css']],
  ['TanStack Query', ['tanstack', 'react query', 'tanstack query']],
  ['Jest', ['jest']],
  ['React Testing Library', ['react testing library', 'rtl']],
  ['Docker', ['docker', 'container']],
  ['AWS', ['aws', 'ec2', 's3', 'lambda']],
  ['CI/CD Pipelines', ['ci/cd', 'cicd', 'pipeline', 'pipelines']],
  ['GitHub Actions', ['github actions']],
  ['FastAPI', ['fastapi']],
  ['GraphQL', ['graphql']],
  ['Stripe', ['stripe']],
  ['Razorpay', ['razorpay']],
  ['OpenAI API', ['openai', 'openai api']],
  ['LangChain', ['langchain']],
  ['RAG', ['rag', 'retrieval augmented generation']],
  ['MERN', ['mern', 'mern stack']],
  ['SaaS', ['saas']],
  ['Agile', ['agile', 'scrum']],
];
