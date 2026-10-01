import { readFileSync, existsSync } from 'fs';
import path from 'path';
import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest): Promise<Response> {
  const outputPath = path.join(process.cwd(), 'Mohammad_Margub_Ahmad_Shaikh_CV.pdf');

  if (!existsSync(outputPath)) {
    return Response.json({ error: 'Generate the CV first.' }, { status: 404 });
  }

  const resumeFileName = path.basename(outputPath);
  const fileBuffer = readFileSync(outputPath);

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${resumeFileName}"`,
    },
  });
}
