import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { resumeData } from './resumeData.js';
import { generateHTML } from './template.js';

async function buildResumePDF() {
  console.log('⚡ Generating Resume HTML template...');
  const htmlContent = generateHTML(resumeData);
  
  const htmlPath = path.join(process.cwd(), 'resume.html');
  const pdfPath = path.join(process.cwd(), 'Singh_Shubham_Kumar_Resume.pdf');
  const previewPath = path.join(process.cwd(), 'resume_preview.png');
  
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log(`📄 Saved HTML preview to: ${htmlPath}`);

  console.log('🚀 Launching Puppeteer browser engine...');
  let browser;
  const launchArgs = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  };

  try {
    browser = await puppeteer.launch(launchArgs);
  } catch (err) {
    console.log('🔄 Puppeteer Chrome binary fallback: attempting system installed Edge/Chrome...');
    try {
      browser = await puppeteer.launch({ ...launchArgs, channel: 'chrome' });
    } catch (e1) {
      browser = await puppeteer.launch({ ...launchArgs, channel: 'msedge' });
    }
  }

  const page = await browser.newPage();
  
  // Set viewport to standard A4 at 96 DPI (794 x 1123) with high scale factor for ultra crisp rendering
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('🖨️ Rendering single page A4 PDF document...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    pageRanges: '1',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  console.log('📸 Generating high-resolution preview image...');
  await page.screenshot({
    path: previewPath,
    fullPage: true
  });

  await browser.close();
  console.log(`\n🎉 SUCCESS! Resume PDF generated at:\n   ${pdfPath}\n📸 High-res preview generated at:\n   ${previewPath}\n`);
}

buildResumePDF().catch(err => {
  console.error('❌ Error generating resume PDF:', err);
  process.exit(1);
});
