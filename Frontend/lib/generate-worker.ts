/**
 * Standalone PDF generation worker.
 * Run via: node lib/generate-worker.js <path-to-tailored-data.json>
 * 
 * This runs in a clean Node.js process (outside Next.js bundler)
 * so puppeteer works correctly.
 */
import { generatePdf } from '../generate';
import path from 'path';
import fs from 'fs';

const dataPath = process.argv[2];
if (!dataPath) {
  console.error('Usage: node lib/generate-worker.ts <data-json-path>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path.resolve(dataPath), 'utf-8'));

generatePdf({ data })
  .then((outputPath: string) => {
    console.log(JSON.stringify({ success: true, outputPath }));
    process.exit(0);
  })
  .catch((err: any) => {
    console.error(JSON.stringify({ success: false, error: err.message }));
    process.exit(1);
  });
