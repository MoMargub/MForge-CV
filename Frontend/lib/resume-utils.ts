import fs from 'fs';
import path from 'path';
import { skillAliases } from '../types';

export const defaultDataPath: string = path.join(process.cwd(), 'resume-data.json');
export const defaultOutputPath: string = path.join(process.cwd(), 'Mohammad_Margub_Ahmad_Shaikh_CV.pdf');

export function normalizeResumeData(data: any): any {
  return {
    ...data,
    careerSummary: data.careerSummary || data.professionalSummary || '',
    skills: data.skills || data.technicalSkills || [],
    professionalExperience: (data.professionalExperience || data.workExperience || []).map((exp: { title: any; role: any; bullets: any; projects: any[]; }) => ({
      ...exp,
      title: exp.title || exp.role || '',
      bullets: exp.bullets || (exp.projects ? exp.projects.flatMap((p: { highlights: any; }) => p.highlights || []) : [])
    })),
    projects: data.projects || [],
    education: data.education || [],
  };
}

export function loadResumeData(dataPath: string = defaultDataPath): any {
  let data: any = {};
  try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    // Return empty if file not found to prevent ENOENT crashes
  }
  return normalizeResumeData(data);
}


export function normalize(value: any): string {
  return String(value || '').toLowerCase().replace(/[^a-z0-9.+#/]+/g, ' ').trim();
}

export function getMatchedSkills(jdText: string): string[] {
  const normalizedJd = ` ${normalize(jdText)} `;
  return skillAliases
    .filter(([, aliases]) => aliases.some((alias) => normalizedJd.includes(` ${normalize(alias)} `)))
    .map(([label]) => label);
}

export function hasSkillInText(text: string, skill: string): boolean {
  const normalizedText = ` ${normalize(text)} `;
  const aliases = skillAliases.find(([label]) => label === skill)?.[1] || [skill];
  return aliases.some((alias) => normalizedText.includes(` ${normalize(alias)} `));
}

export function scoreText(value: string, matchedSkills: string[]): number {
  const text = normalize(value);
  return matchedSkills.reduce((score, skill) => {
    const aliases = skillAliases.find(([label]) => label === skill)?.[1] || [skill];
    return score + (aliases.some((alias) => text.includes(normalize(alias))) ? 1 : 0);
  }, 0);
}

export function reorderByScore<T>(items: T[], scorer: (item: T) => number): T[] {
  return [...items]
    .map((item, index) => ({ item, index, score: scorer(item) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}

export function reorderCommaList(details: string, matchedSkills: string[]): string {
  const parts = details.split(',').map((part) => part.trim()).filter(Boolean);
  return reorderByScore(parts, (part) => scoreText(part, matchedSkills)).join(', ');
}

export function tailorResumeData(data: any, jdText: string = ''): any {
  const matchedSkills = getMatchedSkills(jdText);
  if (!jdText.trim() || matchedSkills.length === 0) {
    return { data: structuredClone(data), matchedSkills };
  }

  const tailored = structuredClone(data);
  const topSkills = matchedSkills.slice(0, 8).join(', ');

  tailored.careerSummary = `Software Engineer with 4+ years of experience aligned with roles requiring ${topSkills}. ${data.careerSummary}`;

  tailored.skills = reorderByScore(
    tailored.skills.map((skill: any) => ({
      ...skill,
      details: reorderCommaList(skill.details, matchedSkills),
    })),
    (skill: any) => scoreText(`${skill.category} ${skill.details}`, matchedSkills),
  );

  tailored.professionalExperience = tailored.professionalExperience.map((experience: any) => ({
    ...experience,
    bullets: reorderByScore(experience.bullets, (bullet: string) => scoreText(bullet, matchedSkills)),
  }));

  tailored.projects = reorderByScore(
    tailored.projects.map((project: any) => ({
      ...project,
      bullets: reorderByScore(project.bullets, (bullet: string) => scoreText(bullet, matchedSkills)),
    })),
    (project: any) => scoreText(`${project.name} ${project.description} ${project.bullets.join(' ')}`, matchedSkills),
  );

  return { data: tailored, matchedSkills };
}

export function flattenResumeText(data: any): string {
  return [
    data.personalInfo?.title,
    data.careerSummary,
    ...(data.skills || []).flatMap((skill: { category: any; details: any; }) => [skill.category, skill.details]),
    ...(data.professionalExperience || []).flatMap((experience: { title: any; company: any; bullets: any[]; }) => [
      experience.title,
      experience.company,
      experience.bullets?.join(' '),
    ]),
    ...(data.projects || []).flatMap((project: { name: any; description: any; bullets: any[]; }) => [
      project.name,
      project.description,
      project.bullets?.join(' '),
    ]),
    ...(data.education || []).flatMap((education: { degree: any; institution: any; }) => [
      education.degree,
      education.institution,
    ]),
  ].filter(Boolean).join(' ');
}

export function getMissingSkills(data: any, jdSkills: string[]): string[] {
  const resumeText = flattenResumeText(data);
  return jdSkills.filter((skill) => !hasSkillInText(resumeText, skill));
}

export function calculateAtsScore(data: any, jdText: string = ''): any {
  const jdSkills = getMatchedSkills(jdText);
  const missingSkills = getMissingSkills(data, jdSkills);
  const matchedSkills = jdSkills.filter((skill) => !missingSkills.includes(skill));
  const resumeText = flattenResumeText(data);

  const skillCoverage = jdSkills.length ? matchedSkills.length / jdSkills.length : 0;
  const summaryCoverage = jdSkills.length
    ? matchedSkills.filter((skill) => hasSkillInText(data.careerSummary, skill)).length / jdSkills.length
    : 0;
  const experienceCoverage = jdSkills.length
    ? matchedSkills.filter((skill) => hasSkillInText((data.professionalExperience || []).flatMap((experience: { bullets: any; }) => experience.bullets || []).join(' '), skill)).length / jdSkills.length
    : 0;
  const projectCoverage = jdSkills.length
    ? matchedSkills.filter((skill) => hasSkillInText((data.projects || []).map((project: { description: any; bullets: any; }) => `${project.description} ${(project.bullets || []).join(' ')}`).join(' '), skill)).length / jdSkills.length
    : 0;

  const structureChecks = [
    data.personalInfo?.email,
    data.personalInfo?.phone,
    data.personalInfo?.linkedin,
    data.careerSummary,
    data.skills?.length,
    data.professionalExperience?.length,
    data.projects?.length,
    data.education?.length,
  ];
  const structureScore = structureChecks.filter(Boolean).length / structureChecks.length;
  const keywordDensityScore = Math.min(1, matchedSkills.reduce((total, skill) => {
    const aliases = skillAliases.find(([label]) => label === skill)?.[1] || [skill];
    return total + (aliases.some((alias) => normalize(resumeText).includes(normalize(alias))) ? 1 : 0);
  }, 0) / Math.max(1, Math.min(jdSkills.length, 10)));

  const breakdown = {
    skills: Math.round(skillCoverage * 45),
    summary: Math.round(summaryCoverage * 15),
    experience: Math.round(experienceCoverage * 20),
    projects: Math.round(projectCoverage * 10),
    format: Math.round(structureScore * 5),
    density: Math.round(keywordDensityScore * 5),
  };
  const score = Object.values(breakdown).reduce((total, value) => total + value, 0);

  return {
    score: Math.min(100, score),
    breakdown,
    matchedSkills,
    missingSkills,
    jdSkills,
  };
}


