import type { NextRequest } from 'next/server';
import path from 'path';
interface UploadPreview {
  name: string;
  email: string;
  phone: string;
  skillCount: number;
  experienceCount: number;
}

interface ResumeJsonData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: { text: string; url: string };
    location: string;
  };
  professionalSummary: string;
  technicalSkills: Array<{ category: string; details: string }>;
  professionalExperience: Array<{
    title: string;
    company: string;
    dates: string;
    location: string;
    bullets: string[];
  }>;
  projects: Array<{ name: string; description: string; bullets: string[] }>;
  education: Array<{ degree: string; institution: string; dates: string; location: string }>;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('resumeFile');

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided. Please upload a PDF or DOCX file.' }, { status: 400 });
    }

    const fileName = (file as File).name?.toLowerCase() ?? '';
    const isPdf  = fileName.endsWith('.pdf');
    const isDocx = fileName.endsWith('.docx');

    if (!isPdf && !isDocx) {
      return Response.json({ error: 'Unsupported file type. Please upload a .pdf or .docx file.' }, { status: 400 });
    }

    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let rawText = '';

    if (isPdf) {
      const pdfParseModule = await import('pdf-parse');
      const pdf = pdfParseModule.default || pdfParseModule;
      const result = await pdf(buffer);
      rawText = result.text ?? '';
    } else {
      rawText = extractDocxText(buffer);
    }

    if (!rawText || rawText.trim().length < 50) {
      return Response.json(
        { error: 'Could not extract text from file. Ensure it is not a scanned image.' },
        { status: 422 }
      );
    }

    const resumeData = parseResumeText(rawText, (file as File).name);

    const ownerName = resumeData.personalInfo?.name ?? 'Unknown';
    const preview: UploadPreview = {
      name: ownerName,
      email: resumeData.personalInfo?.email ?? '',
      phone: resumeData.personalInfo?.phone ?? '',
      skillCount: (resumeData.technicalSkills ?? []).length,
      experienceCount: (resumeData.professionalExperience ?? []).length,
    };

    return Response.json({
      success: true,
      status: `✅ Resume for "${ownerName}" uploaded and parsed successfully!`,
      name: ownerName,
      preview,
      resumeData,
    });
  } catch (error) {
    console.error('[/api/upload-resume]', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Upload failed.' },
      { status: 500 }
    );
  }
}

// ── DOCX text extraction ──────────────────────────────────────────────────

function extractDocxText(buffer: Buffer): string {
  const str = buffer.toString('latin1');
  const startIdx = str.indexOf('<w:body');
  const endIdx   = str.indexOf('</w:body>');
  const slice = startIdx !== -1 && endIdx !== -1
    ? str.slice(startIdx, endIdx + 9)
    : str;
  return slice
    .replace(/<w:br[^/]*/g, '\n')
    .replace(/<w:p[ >]/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// ── Heuristic resume parser ───────────────────────────────────────────────

function parseResumeText(text: string, fileName: string): ResumeJsonData {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const emailMatch    = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const phoneMatch    = text.match(/(?<=^|[\s\xA0|:])(?:\+?\(?\d[\d\-\.\s()]{8,18}\d)\b/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w\-_%]+/i);
  const locationMatch = text.match(/\b([A-Z][a-zA-Z\s]+,\s*(?:India|US|UK|USA|Canada|Australia|[A-Z]{2}))\b/);
  const nameLine      = lines.find(l => /^[A-Z][a-z]+(?: [A-Z][a-z]+){1,4}$/.test(l));

  const titlePatterns = [
    /Software\s+Engineer/i, /Full.Stack\s+Developer/i, /Frontend\s+Developer/i,
    /Backend\s+Developer/i, /Web\s+Developer/i, /Data\s+Engineer/i,
    /DevOps\s+Engineer/i, /ML\s+Engineer/i,
  ];
  let jobTitle = '';
  for (const pat of titlePatterns) {
    const m = text.match(pat);
    if (m) { jobTitle = m[0].replace(/\s+/g, ' ').trim(); break; }
  }

  const sectionHeaders: Record<string, RegExp> = {
    summary:    /^(professional\s+summary|career\s+summary|summary|objective|about)/i,
    skills:     /^(technical\s+skills?|skills?|core\s+competencies|technologies)/i,
    experience: /^(professional\s+experience|work\s+experience|experience|employment)/i,
    projects:   /^(projects?|personal\s+projects?|key\s+projects?)/i,
    education:  /^(education|academic|qualification)/i,
  };

  const sections: Record<string, string[]> = { summary: [], skills: [], experience: [], projects: [], education: [] };
  let currentSection: string | null = null;

  for (const line of lines) {
    let matched = false;
    for (const [key, pat] of Object.entries(sectionHeaders)) {
      if (pat.test(line) && line.length < 60) { currentSection = key; matched = true; break; }
    }
    if (!matched && currentSection) sections[currentSection].push(line);
  }

  const technicalSkills: Array<{ category: string; details: string }> = [];
  for (const line of sections.skills) {
    const ci = line.indexOf(':');
    if (ci > 0 && ci < 40) {
      technicalSkills.push({ category: line.slice(0, ci).trim(), details: line.slice(ci + 1).trim() });
    } else if (technicalSkills.length > 0) {
      technicalSkills[technicalSkills.length - 1].details += `, ${line}`;
    } else {
      technicalSkills.push({ category: 'Skills', details: line });
    }
  }

  return {
    personalInfo: {
      name: nameLine ?? path.basename(fileName, path.extname(fileName)).replace(/[-_]/g, ' '),
      title: jobTitle || 'Software Engineer',
      email: emailMatch?.[0] ?? '',
      phone: phoneMatch?.[0]?.trim() ?? '',
      linkedin: linkedinMatch
        ? { text: linkedinMatch[0], url: `https://${linkedinMatch[0]}` }
        : { text: '', url: '' },
      location: locationMatch?.[1] ?? '',
    },
    professionalSummary: sections.summary.join(' ').trim(),
    technicalSkills: technicalSkills.length ? technicalSkills : [{ category: 'Skills', details: '' }],
    professionalExperience: parseExperience(sections.experience),
    projects: parseProjects(sections.projects),
    education: parseEducation(sections.education),
  };
}

function parseExperience(lines: string[]) {
  const results: ResumeJsonData['professionalExperience'] = [];
  let current: ResumeJsonData['professionalExperience'][number] | null = null;
  const dateRe = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*\d{4}\s*[-–—]\s*(?:\w+\s+)?\d{4}|(?:\w{3})\s+\d{4}\s*[-–—]\s*(?:Present|Current)|(?:\b\d{4}\s*[-–—]\s*(?:Present|Current|\d{4})\b)/i;

  let pendingHeaderLines: string[] = [];

  for (const line of lines) {
    const isBullet = /^[•\-*]/.test(line) || line.length > 70; // long lines are usually descriptions
    const hasDate = dateRe.test(line) && !isBullet;

    if (hasDate) {
      if (current) results.push(current);
      
      const dates = (line.match(dateRe) ?? [''])[0];
      const rest = line.replace(dateRe, '').trim();
      const parts = rest.split(/[,|@]|\s{2,}/).map(p => p.trim()).filter(Boolean);

      // If we gathered lines BEFORE the date, they are likely Title & Company
      let title = '';
      let company = '';
      let location = '';

      if (pendingHeaderLines.length > 0) {
        // e.g., "Software Engineer, Shine Infosoft"
        const topParts = pendingHeaderLines.join(', ').split(/[,|]|\s{2,}/).map(p => p.trim()).filter(Boolean);
        title = topParts[0] || '';
        company = topParts[1] || parts[0] || '';
        location = parts[1] || '';
      } else {
        title = parts[0] || '';
        company = parts[1] || '';
      }

      current = { title, company, dates, location, bullets: [] };
      pendingHeaderLines = [];
    } else if (isBullet && current) {
      current.bullets.push(line.replace(/^[•\-*]\s*/, ''));
    } else if (current) {
      if (!current.title) current.title = line;
      else if (!current.company) current.company = line;
      else current.bullets.push(line);
    } else {
      // No current job yet, these might be title/company for the next job
      if (line.length < 60) {
        pendingHeaderLines.push(line);
      }
    }
  }
  if (current) results.push(current);
  return results;
}

function parseProjects(lines: string[]) {
  const results: ResumeJsonData['projects'] = [];
  let current: ResumeJsonData['projects'][number] | null = null;
  for (const line of lines) {
    const isBullet = /^[•\-*]/.test(line);
    if (!isBullet && line.length < 80 && line.length > 3 && !/^https?:/i.test(line)) {
      if (current) results.push(current);
      current = { name: line, description: '', bullets: [] };
    } else if (current) {
      if (isBullet) current.bullets.push(line.replace(/^[•\-*]\s*/, ''));
      else if (!current.description) current.description = line;
      else current.bullets.push(line);
    }
  }
  if (current) results.push(current);
  return results;
}

function parseEducation(lines: string[]) {
  const results: ResumeJsonData['education'] = [];
  let current: ResumeJsonData['education'][number] | null = null;
  const dateRe = /\d{4}\s*[-–—]\s*\d{4}|\d{4}/;
  for (const line of lines) {
    if (dateRe.test(line)) {
      if (current) results.push(current);
      const dates = (line.match(dateRe) ?? [''])[0];
      const rest  = line.replace(dateRe, '').trim();
      const parts = rest.split(/[,|]|\s{2,}/);
      current = { degree: parts[0]?.trim() ?? '', institution: parts[1]?.trim() ?? '', dates, location: '' };
    } else if (current) {
      if (!current.degree) current.degree = line;
      else if (!current.institution) current.institution = line;
      else current.location = line;
    }
  }
  if (current) results.push(current);
  return results;
}
