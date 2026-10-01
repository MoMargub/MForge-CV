import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export const defaultDataPath: string = path.join(process.cwd(), 'resume-data.json');
export const defaultOutputPath: string = path.join(process.cwd(), 'Mohammad_Margub_Ahmad_Shaikh_CV.pdf');

export function loadResumeData(dataPath: string = defaultDataPath): any {
  let data: any = {};
  try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    // Return empty if file not found to prevent ENOENT crashes
  }
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

export function escapeHtml(value: any): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderInline(value: any): string {
  return escapeHtml(value).replace(/\*\*(.*?)\*\*/g, '$1');
}

export function renderIcon(svg: string): string {
  return `<span class="icon">${svg}</span>`;
}

export const icons: Record<string, string> = {
  email: renderIcon('<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l217.6 163.2c11.4 8.5 27 8.5 38.4 0l217.6-163.2C504.9 141.3 512 127.1 512 112c0-26.5-21.5-48-48-48H48zM0 176v208c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>'),
  phone: renderIcon('<svg viewBox="0 0 512 512" aria-hidden="true"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64c0 247.4 200.6 448 448 448 18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368c-70.4-33.3-127.4-90.3-160.7-160.7l49.3-40.3c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>'),
  linkedin: renderIcon('<svg viewBox="0 0 448 512" aria-hidden="true"><path d="M100.3 448H7.4V148.9h92.9V448zM53.8 108.1C24.1 108.1 0 83.5 0 53.8 0 24.1 24.1 0 53.8 0s53.8 24.1 53.8 53.8c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>'),
  location: renderIcon('<svg viewBox="0 0 384 512" aria-hidden="true"><path d="M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2 12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>'),
};

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
    bullets: reorderByScore(experience.bullets, (bullet: any) => scoreText(bullet, matchedSkills)),
  }));

  tailored.projects = reorderByScore(
    tailored.projects.map((project: any) => ({
      ...project,
      bullets: reorderByScore(project.bullets, (bullet: any) => scoreText(bullet, matchedSkills)),
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

export function createHtml(data: any): string {
  const { personalInfo } = data;
  const linkedinStr = typeof personalInfo.linkedin === 'object' ? personalInfo.linkedin.url || personalInfo.linkedin.text : (personalInfo.linkedin || '');
  const linkedinDisplay = typeof personalInfo.linkedin === 'object' ? personalInfo.linkedin.text || personalInfo.linkedin.url : (personalInfo.linkedin || '');
  const linkedinUrl = linkedinStr.startsWith('http')
    ? linkedinStr
    : `https://${linkedinStr}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(personalInfo.name)} - CV</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #000;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13.5px;
      line-height: 1.38;
    }
    a { color: inherit; text-decoration: none; }
    .header { margin-bottom: 14px; }
    .name {
      margin: 0 0 4px;
      font-size: 34px;
      line-height: 1.08;
      font-weight: 700;
    }
    .title {
      margin: 0 0 14px;
      font-size: 24px;
      line-height: 1.1;
      font-style: italic;
      font-weight: 400;
    }
    .contact-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px 16px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      min-width: 0;
    }
    .icon {
      width: 18px;
      height: 18px;
      margin-right: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 18px;
      background: #000;
      border-radius: 4px;
    }
    .icon svg {
      width: 10.5px;
      height: 10.5px;
      fill: #fff;
      display: block;
    }
    .section { margin-bottom: 14px; }
    .section-title {
      margin: 0 0 9px;
      padding: 4px 0;
      background: #e8e8e8;
      text-align: center;
      text-transform: uppercase;
      font-size: 14.5px;
      line-height: 1.15;
      font-weight: 700;
    }
    .summary, .project-desc { text-align: justify; }
    ul {
      margin: 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 3px;
      padding-left: 2px;
    }
    .skills-list li { margin-bottom: 2px; }
    .experience-item, .project-item {
      margin-bottom: 13px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .experience-header, .education-header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .experience-right, .education-right {
      text-align: right;
      font-style: italic;
      white-space: nowrap;
    }
    .project-name {
      margin-bottom: 4px;
      font-weight: 700;
    }
    .project-desc { margin-bottom: 4px; }
  </style>
</head>
<body>
  <header class="header">
    <h1 class="name">${escapeHtml(personalInfo.name)}</h1>
    <h2 class="title">${escapeHtml(personalInfo.title)}</h2>
    <div class="contact-info">
      <div class="contact-item">${icons.email}<a href="mailto:${escapeHtml(personalInfo.email)}">${escapeHtml(personalInfo.email)}</a></div>
      <div class="contact-item">${icons.phone}<a href="tel:${escapeHtml(personalInfo.phone)}">${escapeHtml(personalInfo.phone)}</a></div>
      <div class="contact-item">${icons.linkedin}<a href="${escapeHtml(linkedinUrl)}">${escapeHtml(linkedinDisplay)}</a></div>
      <div class="contact-item">${icons.location}<span>${escapeHtml(personalInfo.location)}</span></div>
    </div>
  </header>

  <section class="section">
    <h3 class="section-title">Career Summary</h3>
    <div class="summary">${renderInline(data.careerSummary)}</div>
  </section>

  <section class="section">
    <h3 class="section-title">Skills</h3>
    <ul class="skills-list">
      ${data.skills.map((skill: { category: any; details: any; }) => `<li><strong>${escapeHtml(skill.category)}</strong> : ${renderInline(skill.details)}</li>`).join('')}
    </ul>
  </section>

  <section class="section">
    <h3 class="section-title">Professional Experience</h3>
    ${data.professionalExperience.map((experience: { title: any; company: any; dates: any; location: any; bullets: any[]; }) => `
      <div class="experience-item">
        <div class="experience-header">
          <div><strong>${escapeHtml(experience.title)}</strong>, <em>${escapeHtml(experience.company)}</em></div>
          <div class="experience-right">${escapeHtml(experience.dates)}<br>${escapeHtml(experience.location)}</div>
        </div>
        <ul>${experience.bullets.map((bullet: any) => `<li>${renderInline(bullet)}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </section>

  <section class="section">
    <h3 class="section-title">Projects</h3>
    ${data.projects.map((project: { name: any; description: any; bullets: any[]; }) => `
      <div class="project-item">
        <div class="project-name">${escapeHtml(project.name)}</div>
        <div class="project-desc">${renderInline(project.description)}</div>
        <ul>${project.bullets.map((bullet: any) => `<li>${renderInline(bullet)}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </section>

  <section class="section">
    <h3 class="section-title">Education</h3>
    ${data.education.map((education: { degree: any; institution: any; dates: any; location: any; }) => `
      <div class="education-header">
        <div><strong>${escapeHtml(education.degree)}</strong>, <em>${escapeHtml(education.institution)}</em></div>
        <div class="education-right">${escapeHtml(education.dates)}<br>${escapeHtml(education.location)}</div>
      </div>
    `).join('')}
  </section>
</body>
</html>`;
}

export async function generatePdf(options: any = {}): Promise<string> {
  const data = options.data || loadResumeData(options.dataPath || defaultDataPath);
  const outputPath = options.outputPath || defaultOutputPath;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(createHtml(data), { waitUntil: 'domcontentloaded' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '40px', bottom: '40px', left: '55px', right: '55px' },
  });
  await browser.close();
  return outputPath;
}

// if (require.main === module) removed for ES modules compatibility
const isMainModule = typeof require !== 'undefined' && require.main === module;
if (isMainModule || process.argv[1]?.endsWith('generate.ts')) {
  generatePdf()
    .then((outputPath) => {
      console.log(`PDF generated successfully as ${path.basename(outputPath)}`);
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
      process.exit(1);
    });
}
