import { sampleResumeData } from './defaultData.js';
import { atsGuideData } from './atsGuide.js';

/**
 * Generate a complete, ready-to-copy prompt for ChatGPT, Claude, Gemini, or DeepSeek.
 */
export function generateAIPrompt(customInstructions = '') {
  const schemaExample = JSON.stringify(sampleResumeData, null, 2);

  return `You are an elite ATS-Resume Optimization Specialist & Executive Tech Recruiter.
Your task is to transform my raw career background, notes, or existing resume details into a structured, single-page ATS-optimized resume JSON.

CRITICAL INSTRUCTIONS & RULES:
1. OUTPUT FORMAT: Respond ONLY with a valid, raw JSON object matching the exact schema below. Do NOT wrap in markdown codeblocks if possible, or provide ONLY the JSON.
2. ACTION VERBS & METRICS: Every experience and project bullet point MUST follow the formula:
   [Strong Action Verb] + [Specific Task / Architecture] + [Technologies Used] + [Quantifiable Business Impact/Metric %].
3. BOLD HIGHLIGHTS: Wrap critical metrics (e.g., <strong>75%</strong>, <strong>100,000+ records</strong>, <strong>sub-50ms latency</strong>) and key technologies (e.g., <strong>FastAPI</strong>, <strong>PostgreSQL</strong>, <strong>Docker</strong>) inside HTML <strong>...</strong> tags within the text.
4. SUMMARY: Must be 2-3 impactful sentences highlighting primary role, key stack, and key strengths.
5. TECHNICAL SKILLS: Categorize cleanly into Languages, Frameworks & Libraries, Databases & Caching, Cloud & DevOps, Core Competencies.
6. A4 SINGLE PAGE FIT: Keep bullet points concise and high-impact (3-5 bullets for experience, 2-4 for projects) so it fits perfectly on a single A4 page.

${customInstructions ? `USER CUSTOM INSTRUCTIONS:\n${customInstructions}\n` : ''}

EXACT JSON SCHEMA & EXAMPLE TO FOLLOW:
${schemaExample}

---
MY RAW CAREER DETAILS / NOTES (Please extract and convert into the JSON schema above):
[Paste your details, project descriptions, skills, job history, or LinkedIn export here]`;
}

/**
 * Validate imported JSON structure
 */
export function validateResumeJSON(jsonString) {
  try {
    const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    
    // Check required top-level keys
    const requiredKeys = ['personalInfo', 'summary', 'technicalSkills', 'experience', 'projects', 'education', 'certificationsAndAchievements'];
    const missingKeys = requiredKeys.filter(k => !(k in data));

    if (missingKeys.length > 0) {
      return {
        valid: false,
        error: `Missing required sections: ${missingKeys.join(', ')}`,
        data: null
      };
    }

    // Check personal info fields
    if (!data.personalInfo.name || !data.personalInfo.email) {
      return {
        valid: false,
        error: 'personalInfo must contain at least "name" and "email".',
        data: null
      };
    }

    // Ensure arrays exist
    data.experience = Array.isArray(data.experience) ? data.experience : [];
    data.projects = Array.isArray(data.projects) ? data.projects : [];
    data.education = Array.isArray(data.education) ? data.education : [];
    data.certificationsAndAchievements = Array.isArray(data.certificationsAndAchievements) ? data.certificationsAndAchievements : [];
    data.technicalSkills = typeof data.technicalSkills === 'object' && data.technicalSkills !== null ? data.technicalSkills : {};

    return {
      valid: true,
      error: null,
      data
    };
  } catch (err) {
    return {
      valid: false,
      error: `Invalid JSON syntax: ${err.message}`,
      data: null
    };
  }
}

/**
 * Generate printable ATS Reference Guide HTML
 */
export function generateATSGuideHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ATS Resume Writing Guide & Formulas</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 800px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    h1 { color: #0f172a; border-bottom: 2px solid #1e40af; padding-bottom: 8px; font-size: 22pt; }
    h2 { color: #1e40af; margin-top: 24px; font-size: 14pt; }
    .badge { background: #eff6ff; color: #1e40af; padding: 4px 10px; border-radius: 6px; font-weight: 600; display: inline-block; margin-bottom: 15px; }
    .formula-box { background: #f8fafc; border-left: 4px solid #1e40af; padding: 14px 18px; margin: 15px 0; border-radius: 0 8px 8px 0; font-size: 11pt; font-weight: 600; }
    .tip-section { margin-bottom: 20px; }
    .tip-section h3 { margin-bottom: 6px; color: #0f172a; font-size: 11pt; }
    ul { padding-left: 20px; margin-top: 4px; }
    li { margin-bottom: 4px; font-size: 10pt; color: #334155; }
    .verbs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 10px; }
    .verb-category { background: #f1f5f9; padding: 10px 14px; border-radius: 6px; font-size: 9.5pt; }
    .verb-category strong { color: #1e40af; display: block; margin-bottom: 4px; }
    @media print {
      body { padding: 0; }
      @page { margin: 15mm; }
    }
  </style>
</head>
<body>
  <h1>${atsGuideData.title}</h1>
  <div class="badge">🚀 ATS Optimization Cheatsheet</div>
  <p>${atsGuideData.subtitle}</p>

  <div class="formula-box">
    ${atsGuideData.bulletFormula}
  </div>

  <h2>📋 Section-by-Section ATS Guidelines</h2>
  ${atsGuideData.tips.map(t => `
    <div class="tip-section">
      <h3>${t.category}</h3>
      <ul>
        ${t.rules.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <h2>⚡ High-Impact Power Action Verbs</h2>
  <div class="verbs-grid">
    ${Object.entries(atsGuideData.actionVerbs).map(([cat, verbs]) => `
      <div class="verb-category">
        <strong>${cat}</strong>
        ${verbs.join(', ')}
      </div>
    `).join('')}
  </div>

  <h2>💡 Predefined Template Snippets</h2>
  <div class="tip-section">
    <h3>Professional Summary Template</h3>
    <p style="background:#f8fafc; padding:10px; border-radius:6px; font-size:9.5pt;">${atsGuideData.predefinedTemplates.summary}</p>
  </div>
  <div class="tip-section">
    <h3>Experience Bullet Template</h3>
    <p style="background:#f8fafc; padding:10px; border-radius:6px; font-size:9.5pt;">${atsGuideData.predefinedTemplates.bulletExperience}</p>
  </div>
</body>
</html>`;
}
