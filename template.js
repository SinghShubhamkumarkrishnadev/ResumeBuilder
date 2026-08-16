export function generateHTML(data) {
  const { personalInfo, summary, technicalSkills, experience, projects, education, certificationsAndAchievements } = data;

  const skillsHTML = Object.entries(technicalSkills)
    .map(
      ([category, skills]) => `
      <div class="skill-item">
        <span class="skill-label">${category}:</span>
        <span class="skill-text">${skills}</span>
      </div>`
    )
    .join('');

  const experienceHTML = experience
    .map(
      exp => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title-wrap">
            <span class="entry-primary">${exp.company}</span>
            <span class="entry-sep">—</span>
            <span class="entry-location">${exp.location}</span>
          </div>
          <span class="entry-date">${exp.duration}</span>
        </div>
        <div class="entry-subheader">
          <span class="entry-role">${exp.role}</span>
          <span class="entry-project"><strong>Project:</strong> ${exp.project}</span>
        </div>
        <ul class="bullet-list">
          ${exp.bulletPoints.map(bp => `<li>${bp}</li>`).join('')}
        </ul>
      </div>`
    )
    .join('');

  const projectsHTML = projects
    .map(
      proj => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title-wrap">
            <span class="entry-primary">${proj.title}</span>
          </div>
          <span class="entry-date">${proj.duration}</span>
        </div>
        <div class="entry-subheader">
          <span class="tech-stack-tag"><strong>Tech Stack:</strong> ${proj.techStack}</span>
        </div>
        <ul class="bullet-list">
          ${proj.bulletPoints.map(bp => `<li>${bp}</li>`).join('')}
        </ul>
      </div>`
    )
    .join('');

  const educationHTML = education
    .map(
      edu => `
      <div class="entry edu-entry">
        <div class="entry-header">
          <div class="entry-title-wrap">
            <span class="entry-primary">${edu.institution}</span>
            <span class="entry-sep">—</span>
            <span class="entry-location">${edu.location}</span>
          </div>
          <span class="entry-date">${edu.duration}</span>
        </div>
        <div class="entry-subheader">
          <span class="edu-degree">${edu.degree}</span>
          <span class="edu-gpa">${edu.gpa}</span>
        </div>
      </div>`
    )
    .join('');

  const certsHTML = certificationsAndAchievements
    .map(
      cert => `
      <li>
        <span class="cert-title">${cert.title}:</span>
        <span class="cert-desc">${cert.description}</span>
      </li>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name} - Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      font-size: 8.65pt;
      line-height: 1.40;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 12mm 12mm 11mm 12mm;
    }

    /* Typography Utilities */
    strong {
      font-weight: 600;
      color: #0f172a;
    }

    a {
      color: inherit;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    a:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }

    /* Header Section */
    .header {
      text-align: center;
      padding-bottom: 10px;
      margin-bottom: 14px;
      border-bottom: 1.5px solid #1e3a8a;
    }

    .header-name {
      font-size: 20.5pt;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: 0.8px;
      line-height: 1.15;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .header-title {
      font-size: 9.5pt;
      font-weight: 600;
      color: #1e40af;
      letter-spacing: 0.25px;
      margin-bottom: 7.5px;
    }

    .contact-row {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      gap: 14px;
      font-size: 8.25pt;
      color: #475569;
    }

    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4.5px;
      white-space: nowrap;
    }

    .contact-sep {
      color: #cbd5e1;
      font-size: 8pt;
    }

    .contact-icon {
      width: 12px;
      height: 12px;
      fill: none;
      stroke: #1e40af;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex-shrink: 0;
    }

    /* Section Styling */
    .section {
      margin-bottom: 15px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5.5px;
    }

    .section-title {
      font-size: 9.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.75px;
      color: #0f172a;
      white-space: nowrap;
    }

    .section-line {
      flex-grow: 1;
      height: 1.2px;
      background: #cbd5e1;
    }

    /* Professional Summary */
    .summary-text {
      font-size: 8.45pt;
      line-height: 1.40;
      color: #334155;
      text-align: left;
    }

    /* Technical Skills */
    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 3.5px;
    }

    .skill-item {
      font-size: 8.35pt;
      line-height: 1.36;
      color: #334155;
      text-align: left;
    }

    .skill-label {
      font-weight: 600;
      color: #0f172a;
      margin-right: 4px;
    }

    .skill-text {
      color: #334155;
    }

    /* Experience & Projects Entries */
    .entry {
      margin-bottom: 9px;
    }

    .entry:last-child {
      margin-bottom: 0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      line-height: 1.25;
    }

    .entry-title-wrap {
      display: flex;
      align-items: baseline;
      gap: 5px;
    }

    .entry-primary {
      font-size: 8.9pt;
      font-weight: 700;
      color: #0f172a;
    }

    .entry-sep {
      color: #94a3b8;
      font-weight: 400;
      font-size: 8pt;
    }

    .entry-location {
      font-size: 8.35pt;
      color: #475569;
      font-weight: 500;
    }

    .entry-date {
      font-size: 8.15pt;
      font-weight: 600;
      color: #475569;
      white-space: nowrap;
    }

    .entry-subheader {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 8.3pt;
      margin-top: 1.5px;
      margin-bottom: 3.5px;
    }

    .entry-role {
      font-weight: 600;
      color: #1e40af;
    }

    .entry-project {
      font-size: 8.15pt;
      color: #475569;
    }

    .tech-stack-tag {
      font-size: 8.3pt;
      color: #334155;
    }

    .edu-degree {
      font-size: 8.35pt;
      font-weight: 600;
      color: #1e40af;
    }

    .edu-gpa {
      font-size: 8.3pt;
      font-weight: 600;
      color: #0f172a;
    }

    /* Bullet Points */
    .bullet-list {
      list-style: none;
      padding-left: 0;
      margin-top: 2.5px;
    }

    .bullet-list li {
      position: relative;
      padding-left: 12px;
      font-size: 8.3pt;
      line-height: 1.38;
      color: #334155;
      margin-bottom: 3.2px;
      text-align: left;
    }

    .bullet-list li:last-child {
      margin-bottom: 0;
    }

    .bullet-list li::before {
      content: "•";
      position: absolute;
      left: 1px;
      top: -0.5px;
      color: #1e40af;
      font-weight: 700;
      font-size: 8.8pt;
    }

    /* Certifications & Achievements */
    .cert-title {
      font-weight: 600;
      color: #0f172a;
    }

    .cert-desc {
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="resume-wrapper">

    <!-- Header Section -->
    <header class="header">
      <h1 class="header-name">${personalInfo.name}</h1>
      <div class="header-title">${personalInfo.title}</div>
      <div class="contact-row">
        <span class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          ${personalInfo.location}
        </span>
        <span class="contact-sep">•</span>
        <span class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <a href="tel:${personalInfo.phoneRaw}">${personalInfo.phone}</a>
        </span>
        <span class="contact-sep">•</span>
        <span class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
        </span>
        <span class="contact-sep">•</span>
        <span class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          <a href="${personalInfo.linkedin}" target="_blank">${personalInfo.linkedinLabel}</a>
        </span>
        <span class="contact-sep">•</span>
        <span class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          <a href="${personalInfo.github}" target="_blank">${personalInfo.githubLabel}</a>
        </span>
      </div>
    </header>

    <!-- Professional Summary -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Professional Summary</h2>
        <div class="section-line"></div>
      </div>
      <p class="summary-text">${summary}</p>
    </section>

    <!-- Technical Skills -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Technical Skills</h2>
        <div class="section-line"></div>
      </div>
      <div class="skills-list">
        ${skillsHTML}
      </div>
    </section>

    <!-- Work Experience -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Work Experience</h2>
        <div class="section-line"></div>
      </div>
      ${experienceHTML}
    </section>

    <!-- Projects -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Projects</h2>
        <div class="section-line"></div>
      </div>
      ${projectsHTML}
    </section>

    <!-- Education -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Education</h2>
        <div class="section-line"></div>
      </div>
      ${educationHTML}
    </section>

    <!-- Certifications & Achievements -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">Certifications & Achievements</h2>
        <div class="section-line"></div>
      </div>
      <ul class="bullet-list">
        ${certsHTML}
      </ul>
    </section>

  </div>
</body>
</html>`;
}
