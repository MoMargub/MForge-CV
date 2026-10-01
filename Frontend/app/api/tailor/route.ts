import { execFile } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import os from 'os';
import type { NextRequest } from 'next/server';
import { normalizeResumeData, tailorResumeData } from '../../../lib/resume-utils';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const jdRaw = formData.get('jd');
    const resumeDataRaw = formData.get('resumeData');

    if (!jdRaw || typeof jdRaw !== 'string' || !jdRaw.trim()) {
      return Response.json({ error: 'Please paste a JD before submitting.' }, { status: 400 });
    }
    
    if (!resumeDataRaw || typeof resumeDataRaw !== 'string') {
      return Response.json({ error: 'Please upload your CV first.' }, { status: 400 });
    }

    const jd = jdRaw.trim();
    let parsedData;
    try {
      parsedData = JSON.parse(resumeDataRaw);
    } catch {
      return Response.json({ error: 'Invalid CV data.' }, { status: 400 });
    }

    const resumeData = normalizeResumeData(parsedData);
    const { data: tailoredData, matchedSkills } = tailorResumeData(resumeData, jd);

    const tempId = Math.random().toString(36).substring(7);
    const tempPath = path.join(os.tmpdir(), `.tailored-data-${tempId}.json`);
    writeFileSync(tempPath, JSON.stringify(tailoredData, null, 2));

    await new Promise<void>((resolve, reject) => {
      const workerFile = 'generate-worker.ts';
      const workerPath = path.join(process.cwd(), 'lib', workerFile);
      
      execFile(
        process.platform === 'win32' ? 'npx.cmd' : 'npx',
        ['tsx', workerPath, tempPath],
        { cwd: process.cwd(), timeout: 30000 },
        (error, _stdout, stderr) => {
          try { unlinkSync(tempPath); } catch { /* ignore */ }
          if (error) {
            reject(new Error(stderr || error.message || 'PDF generation failed'));
          } else {
            resolve();
          }
        }
      );
    });

    return Response.json({
      jd,
      matchedSkills,
      generated: true,
      status: '✅ CV tailored and PDF generated!',
    });
  } catch (error) {
    console.error('[/api/tailor]', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Something went wrong.' },
      { status: 500 }
    );
  }
}
