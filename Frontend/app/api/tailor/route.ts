import { execFile } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import type { NextRequest } from 'next/server';
import { loadResumeData, tailorResumeData } from '../../../lib/resume-utils';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const jdRaw = formData.get('jd');

    if (!jdRaw || typeof jdRaw !== 'string' || !jdRaw.trim()) {
      return Response.json({ error: 'Please paste a JD before submitting.' }, { status: 400 });
    }

    const jd = jdRaw.trim();
    const resumeData = loadResumeData();
    const { data: tailoredData, matchedSkills } = tailorResumeData(resumeData, jd);

    const tempPath = path.join(process.cwd(), '.tailored-data.tmp.json');
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
