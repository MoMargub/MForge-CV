import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { calculateAtsScore, normalizeResumeData, tailorResumeData } from '../../../lib/resume-utils';

export async function POST(request: NextRequest): Promise<Response> {
  const startTime = Date.now();

  try {
    const formData = await request.formData();
    const rawJd = formData.get('jd');
    const resumeDataRaw = formData.get('resumeData');

    if (!rawJd || typeof rawJd !== 'string' || !rawJd.trim()) {
      return NextResponse.json(
        { success: false, error: 'Job description is required.' },
        { status: 400 }
      );
    }
    
    if (!resumeDataRaw || typeof resumeDataRaw !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please upload your CV first.' },
        { status: 400 }
      );
    }

    const jd = rawJd.trim();
    if (jd.length < 20) {
      return NextResponse.json(
        { success: false, error: 'Job description is too short (minimum 20 characters).' },
        { status: 400 }
      );
    }

    let parsedData;
    try {
      parsedData = JSON.parse(resumeDataRaw);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid CV data.' }, { status: 400 });
    }

    const resumeData = normalizeResumeData(parsedData);
    const { data: tailoredData } = tailorResumeData(resumeData, jd);
    const ats = calculateAtsScore(tailoredData, jd);

    return NextResponse.json({
      success: true,
      jd,
      ats,
      matchedSkills: ats.matchedSkills ?? [],
      status: 'ATS score calculated.',
      meta: { executionTimeMs: Date.now() - startTime, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[/api/score]', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    );
  }
}
