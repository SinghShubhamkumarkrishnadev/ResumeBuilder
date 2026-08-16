import { sampleResumeData, blankResumeData } from './defaultData.js';
import { generateAIPrompt, validateResumeJSON, generateATSGuideHTML } from './aiAssistant.js';
import { atsGuideData } from './atsGuide.js';

// Local storage keys
const STORAGE_KEY = 'ats_resume_builder_data_v2';
const THEME_KEY = 'ats_resume_theme';

// Reactive App State
let state = {
  resume: null,
  style: {
    accentColor: '#1e40af',
    accentDark: '#1e3a8a',
    density: 'balanced' // 'compact' | 'balanced' | 'spacious'
  },
  zoomLevel: 0.85,
  activeMobileTab: 'editor', // 'editor' | 'preview'
  theme: 'dark' // 'dark' | 'light'
};

// Common ATS Action Verbs for quick bullet insertion
const ACTION_VERBS = [
  'Architected', 'Engineered', 'Optimized', 'Automated', 
  'Spearheaded', 'Deployed', 'Designed', 'Orchestrated'
];

// Initialize App
function init() {
  initTheme();
  loadStoredData();
  setupEventListeners();
  populateFormFields();
  applyResumeStyles();
  renderLivePreview();
  setupZoom();
  initModals();
  initGuideContent();
  adjustInitialZoom();
}

/**
 * Initialize Dark / Light Theme
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  setTheme(savedTheme === 'light' ? 'light' : 'dark');

  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} mode`, 'info');
    });
  }
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const iconDisplay = document.getElementById('theme-icon-display');
  const labelDisplay = document.getElementById('theme-label-display');
  if (iconDisplay && labelDisplay) {
    if (theme === 'light') {
      iconDisplay.textContent = '☀️';
      labelDisplay.textContent = 'Light';
    } else {
      iconDisplay.textContent = '🌙';
      labelDisplay.textContent = 'Dark';
    }
  }
}

/**
 * Load state from localStorage or sample fallback
 */
function loadStoredData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.resume) {
        const validation = validateResumeJSON(parsed.resume);
        if (validation.valid) {
          state.resume = validation.data;
          if (parsed.style) state.style = { ...state.style, ...parsed.style };
          return;
        }
      } else {
        const validation = validateResumeJSON(parsed);
        if (validation.valid) {
          state.resume = validation.data;
          return;
        }
      }
    }
  } catch (e) {
    console.warn('Could not load local storage:', e);
  }
  // Fallback to sample data
  state.resume = JSON.parse(JSON.stringify(sampleResumeData));
}

/**
 * Persist state to localStorage and update live preview & height gauge
 */
function saveAndRender() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      resume: state.resume,
      style: state.style
    }));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
  renderLivePreview();
}

/**
 * Apply Style & Density customizer options to the live preview container
 */
function applyResumeStyles() {
  const root = document.getElementById('resume-preview-root');
  if (!root) return;

  root.style.setProperty('--resume-accent', state.style.accentColor);
  root.style.setProperty('--resume-accent-dark', state.style.accentDark);

  root.classList.remove('density-compact', 'density-balanced', 'density-spacious');
  root.classList.add(`density-${state.style.density}`);

  // Highlight active swatches and pills in UI
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.classList.toggle('active', swatch.dataset.color === state.style.accentColor);
  });

  document.querySelectorAll('.density-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.density === state.style.density);
  });
}

/**
 * Render the fixed ATS HTML template into the preview container
 */
function renderLivePreview() {
  const root = document.getElementById('resume-preview-root');
  if (!root || !state.resume) return;

  const { personalInfo, summary, technicalSkills, experience, projects, education, certificationsAndAchievements } = state.resume;

  // Technical Skills HTML
  const skillsHTML = Object.entries(technicalSkills || {})
    .filter(([cat, skills]) => cat.trim() || skills.trim())
    .map(([category, skills]) => `
      <div class="skill-item">
        <span class="skill-label">${escapeHTML(category)}:</span>
        <span class="skill-text">${formatInlineHTML(skills)}</span>
      </div>`
    ).join('');

  // Experience HTML
  const experienceHTML = (experience || []).map(exp => `
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title-wrap">
          <span class="entry-primary">${escapeHTML(exp.company || '')}</span>
          ${exp.location ? `<span class="entry-sep">—</span><span class="entry-location">${escapeHTML(exp.location)}</span>` : ''}
        </div>
        <span class="entry-date">${escapeHTML(exp.duration || '')}</span>
      </div>
      <div class="entry-subheader">
        <span class="entry-role">${escapeHTML(exp.role || '')}</span>
        ${exp.project ? `<span class="entry-project"><strong>Project:</strong> ${escapeHTML(exp.project)}</span>` : ''}
      </div>
      ${exp.bulletPoints && exp.bulletPoints.length > 0 ? `
        <ul class="bullet-list">
          ${exp.bulletPoints.map(bp => bp.trim() ? `<li>${formatInlineHTML(bp)}</li>` : '').join('')}
        </ul>
      ` : ''}
    </div>`
  ).join('');

  // Projects HTML
  const projectsHTML = (projects || []).map(proj => `
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title-wrap">
          <span class="entry-primary">${escapeHTML(proj.title || '')}</span>
        </div>
        <span class="entry-date">${escapeHTML(proj.duration || '')}</span>
      </div>
      ${proj.techStack ? `
        <div class="entry-subheader">
          <span class="tech-stack-tag"><strong>Tech Stack:</strong> ${formatInlineHTML(proj.techStack)}</span>
        </div>
      ` : ''}
      ${proj.bulletPoints && proj.bulletPoints.length > 0 ? `
        <ul class="bullet-list">
          ${proj.bulletPoints.map(bp => bp.trim() ? `<li>${formatInlineHTML(bp)}</li>` : '').join('')}
        </ul>
      ` : ''}
    </div>`
  ).join('');

  // Education HTML
  const educationHTML = (education || []).map(edu => `
    <div class="entry edu-entry">
      <div class="entry-header">
        <div class="entry-title-wrap">
          <span class="entry-primary">${escapeHTML(edu.institution || '')}</span>
          ${edu.location ? `<span class="entry-sep">—</span><span class="entry-location">${escapeHTML(edu.location)}</span>` : ''}
        </div>
        <span class="entry-date">${escapeHTML(edu.duration || '')}</span>
      </div>
      <div class="entry-subheader">
        <span class="edu-degree">${escapeHTML(edu.degree || '')}</span>
        ${edu.gpa ? `<span class="edu-gpa">${escapeHTML(edu.gpa)}</span>` : ''}
      </div>
    </div>`
  ).join('');

  // Certifications HTML
  const certsHTML = (certificationsAndAchievements || []).map(cert => `
    <li>
      <span class="cert-title">${escapeHTML(cert.title || '')}:</span>
      <span class="cert-desc">${formatInlineHTML(cert.description || '')}</span>
    </li>`
  ).join('');

  // Contact Row Items
  const contactItems = [];

  if (personalInfo.location) {
    contactItems.push(`
      <span class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        ${escapeHTML(personalInfo.location)}
      </span>
    `);
  }

  if (personalInfo.phone) {
    const rawPhone = personalInfo.phoneRaw || personalInfo.phone.replace(/[^0-9+]/g, '');
    contactItems.push(`
      <span class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <a href="tel:${escapeHTML(rawPhone)}">${escapeHTML(personalInfo.phone)}</a>
      </span>
    `);
  }

  if (personalInfo.email) {
    contactItems.push(`
      <span class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <a href="mailto:${escapeHTML(personalInfo.email)}">${escapeHTML(personalInfo.email)}</a>
      </span>
    `);
  }

  if (personalInfo.linkedin) {
    const label = personalInfo.linkedinLabel || 'LinkedIn';
    contactItems.push(`
      <span class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        <a href="${escapeHTML(personalInfo.linkedin)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>
      </span>
    `);
  }

  if (personalInfo.github) {
    const label = personalInfo.githubLabel || 'GitHub';
    contactItems.push(`
      <span class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        <a href="${escapeHTML(personalInfo.github)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>
      </span>
    `);
  }

  // Render Inner HTML
  root.innerHTML = `
    <!-- Header Section -->
    <header class="header">
      <h1 class="header-name">${escapeHTML(personalInfo.name || 'Your Name')}</h1>
      <div class="header-title">${escapeHTML(personalInfo.title || '')}</div>
      <div class="contact-row">
        ${contactItems.join('<span class="contact-sep">•</span>')}
      </div>
    </header>

    <!-- Professional Summary -->
    ${summary ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Professional Summary</h2>
          <div class="section-line"></div>
        </div>
        <p class="summary-text">${formatInlineHTML(summary)}</p>
      </section>
    ` : ''}

    <!-- Technical Skills -->
    ${skillsHTML ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Technical Skills</h2>
          <div class="section-line"></div>
        </div>
        <div class="skills-list">
          ${skillsHTML}
        </div>
      </section>
    ` : ''}

    <!-- Work Experience -->
    ${experienceHTML ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Work Experience</h2>
          <div class="section-line"></div>
        </div>
        ${experienceHTML}
      </section>
    ` : ''}

    <!-- Projects -->
    ${projectsHTML ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Projects</h2>
          <div class="section-line"></div>
        </div>
        ${projectsHTML}
      </section>
    ` : ''}

    <!-- Education -->
    ${educationHTML ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Education</h2>
          <div class="section-line"></div>
        </div>
        ${educationHTML}
      </section>
    ` : ''}

    <!-- Certifications & Achievements -->
    ${certsHTML ? `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Certifications & Achievements</h2>
          <div class="section-line"></div>
        </div>
        <ul class="bullet-list">
          ${certsHTML}
        </ul>
      </section>
    ` : ''}
  `;

  // Update Page Height Overflow Gauge
  setTimeout(updatePageHeightGauge, 50);
}

/**
 * Real-time Single-Page A4 Height Overflow Detection Engine
 * Standard A4 is 297mm. At 96 DPI: 1mm = 3.7795px => 297mm = 1122.5px
 */
function updatePageHeightGauge() {
  const root = document.getElementById('resume-preview-root');
  const gauge = document.getElementById('a4-height-gauge');
  if (!root || !gauge) return;

  const a4TargetHeightPx = 1122.5;
  const currentHeightPx = root.scrollHeight;
  const percentage = Math.round((currentHeightPx / a4TargetHeightPx) * 100);

  gauge.classList.remove('gauge-warning', 'gauge-overflow');

  if (percentage <= 98) {
    gauge.innerHTML = `<span>🟢 ${percentage}% of A4 (1-Page Perfect)</span>`;
    gauge.title = `Your resume content fills ${percentage}% of a single A4 page. Perfect for ATS!`;
  } else if (percentage <= 101) {
    gauge.classList.add('gauge-warning');
    gauge.innerHTML = `<span>🟡 ${percentage}% of A4 (Page Limit Reached)</span>`;
    gauge.title = `Warning: Close to the 1-page boundary limit.`;
  } else {
    gauge.classList.add('gauge-overflow');
    gauge.innerHTML = `<span>🔴 ${percentage}% of A4 (Overflows 1 Page)</span>`;
    gauge.title = `Caution: Content overflows Page 1 by ${percentage - 100}%. Switch to Compact density or trim text.`;
  }
}

/**
 * Populate all form fields and dynamic sections from state
 */
function populateFormFields() {
  const p = state.resume.personalInfo || {};
  document.getElementById('input-name').value = p.name || '';
  document.getElementById('input-title').value = p.title || '';
  document.getElementById('input-location').value = p.location || '';
  document.getElementById('input-phone').value = p.phone || '';
  document.getElementById('input-email').value = p.email || '';
  document.getElementById('input-linkedin').value = p.linkedin || '';
  document.getElementById('input-linkedin-label').value = p.linkedinLabel || 'LinkedIn';
  document.getElementById('input-github').value = p.github || '';
  document.getElementById('input-github-label').value = p.githubLabel || 'GitHub';

  document.getElementById('input-summary').value = state.resume.summary || '';

  renderSkillsInputs();
  renderExperienceInputs();
  renderProjectsInputs();
  renderEducationInputs();
  renderCertificationsInputs();
}

/**
 * Render dynamic Skills Inputs
 */
function renderSkillsInputs() {
  const container = document.getElementById('skills-inputs-container');
  container.innerHTML = '';

  const skillsObj = state.resume.technicalSkills || {};
  Object.entries(skillsObj).forEach(([cat, text], index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">Category #${index + 1}: ${escapeHTML(cat || 'New Category')}</span>
        <button type="button" class="btn-danger-ghost" data-action="remove-skill" data-key="${escapeAttribute(cat)}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
      <div class="form-group">
        <label class="form-label">Category Name <span class="req-star">*</span></label>
        <input type="text" class="input-text skill-cat-name" value="${escapeAttribute(cat)}" placeholder="e.g. Languages">
      </div>
      <div class="form-group">
        <label class="form-label">Skills List (Comma separated) <span class="req-star">*</span></label>
        <input type="text" class="input-text skill-cat-text" value="${escapeAttribute(text)}" placeholder="e.g. Python, JavaScript, TypeScript, SQL">
      </div>
    `;

    const nameInput = item.querySelector('.skill-cat-name');
    const textInput = item.querySelector('.skill-cat-text');
    const removeBtn = item.querySelector('[data-action="remove-skill"]');

    function updateSkills() {
      const newSkills = {};
      container.querySelectorAll('.dynamic-item').forEach(el => {
        const k = el.querySelector('.skill-cat-name').value.trim();
        const v = el.querySelector('.skill-cat-text').value.trim();
        if (k) newSkills[k] = v;
      });
      state.resume.technicalSkills = newSkills;
      saveAndRender();
    }

    nameInput.addEventListener('input', updateSkills);
    textInput.addEventListener('input', updateSkills);
    removeBtn.addEventListener('click', () => {
      item.remove();
      updateSkills();
      showToast('Skill category removed', 'info');
    });

    container.appendChild(item);
  });
}

/**
 * Render dynamic Work Experience Inputs with Move Up / Down
 */
function renderExperienceInputs() {
  const container = document.getElementById('experience-inputs-container');
  container.innerHTML = '';

  (state.resume.experience || []).forEach((exp, index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">💼 Position #${index + 1}: ${escapeHTML(exp.company || 'New Position')}</span>
        <div class="dynamic-item-actions">
          ${index > 0 ? `<button type="button" class="btn-icon-xs btn-move-up" title="Move Up">↑</button>` : ''}
          ${index < state.resume.experience.length - 1 ? `<button type="button" class="btn-icon-xs btn-move-down" title="Move Down">↓</button>` : ''}
          <button type="button" class="btn-danger-ghost" data-action="remove-exp">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Company Name <span class="req-star">*</span></label>
          <input type="text" class="input-text exp-company" value="${escapeAttribute(exp.company || '')}" placeholder="e.g. Lanet Team">
        </div>
        <div class="form-group">
          <label class="form-label">Location <span class="req-star">*</span></label>
          <input type="text" class="input-text exp-location" value="${escapeAttribute(exp.location || '')}" placeholder="e.g. Surat, Gujarat">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Job Role / Title <span class="req-star">*</span></label>
          <input type="text" class="input-text exp-role" value="${escapeAttribute(exp.role || '')}" placeholder="e.g. Full-Stack Developer">
        </div>
        <div class="form-group">
          <label class="form-label">Duration <span class="req-star">*</span></label>
          <input type="text" class="input-text exp-duration" value="${escapeAttribute(exp.duration || '')}" placeholder="e.g. Jan 2026 – Present">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Project / Area (Subheader)</label>
        <input type="text" class="input-text exp-project" value="${escapeAttribute(exp.project || '')}" placeholder="e.g. AI-Based Document Reviewer System">
      </div>
      <div class="form-group">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
          <label class="form-label">Bullet Points (Action Verb + Tech + Metric)</label>
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            ${ACTION_VERBS.slice(0, 4).map(v => `
              <button type="button" class="btn btn-outline btn-verb-chip" data-verb="${v}" style="padding:1px 6px; font-size:0.68rem;">+ ${v}</button>
            `).join('')}
          </div>
        </div>
        <div class="exp-bullets-container" style="display:flex; flex-direction:column; gap:8px;"></div>
        <button type="button" class="btn btn-outline btn-add-exp-bullet" style="margin-top:4px; font-size:0.75rem;">
          + Add Bullet Point
        </button>
      </div>
    `;

    // Bind fields
    ['company', 'location', 'role', 'duration', 'project'].forEach(field => {
      const inp = item.querySelector(`.exp-${field}`);
      inp.addEventListener('input', (e) => {
        state.resume.experience[index][field] = e.target.value;
        saveAndRender();
      });
    });

    // Reorder buttons
    const moveUpBtn = item.querySelector('.btn-move-up');
    if (moveUpBtn) {
      moveUpBtn.addEventListener('click', () => {
        const temp = state.resume.experience[index];
        state.resume.experience[index] = state.resume.experience[index - 1];
        state.resume.experience[index - 1] = temp;
        saveAndRender();
        renderExperienceInputs();
      });
    }

    const moveDownBtn = item.querySelector('.btn-move-down');
    if (moveDownBtn) {
      moveDownBtn.addEventListener('click', () => {
        const temp = state.resume.experience[index];
        state.resume.experience[index] = state.resume.experience[index + 1];
        state.resume.experience[index + 1] = temp;
        saveAndRender();
        renderExperienceInputs();
      });
    }

    // Delete button
    item.querySelector('[data-action="remove-exp"]').addEventListener('click', () => {
      state.resume.experience.splice(index, 1);
      saveAndRender();
      renderExperienceInputs();
      showToast('Experience entry deleted', 'info');
    });

    // Render bullets
    const bulletsContainer = item.querySelector('.exp-bullets-container');
    const bulletPoints = exp.bulletPoints || [];

    function renderBullets() {
      bulletsContainer.innerHTML = '';
      bulletPoints.forEach((bp, bIndex) => {
        const bRow = document.createElement('div');
        bRow.className = 'bullet-entry';
        bRow.innerHTML = `
          <textarea class="input-textarea bullet-input" rows="2" placeholder="e.g. Architected and deployed...">${escapeHTML(bp)}</textarea>
          <button type="button" class="btn-danger-ghost btn-remove-bullet" title="Remove bullet" style="padding:6px;">✕</button>
        `;

        bRow.querySelector('.bullet-input').addEventListener('input', (e) => {
          bulletPoints[bIndex] = e.target.value;
          state.resume.experience[index].bulletPoints = bulletPoints;
          saveAndRender();
        });

        bRow.querySelector('.btn-remove-bullet').addEventListener('click', () => {
          bulletPoints.splice(bIndex, 1);
          state.resume.experience[index].bulletPoints = bulletPoints;
          saveAndRender();
          renderBullets();
        });

        bulletsContainer.appendChild(bRow);
      });
    }

    renderBullets();

    // Verb chip listener
    item.querySelectorAll('.btn-verb-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const verb = chip.dataset.verb;
        bulletPoints.push(`${verb} scalable features utilizing <strong>technology</strong>, improving efficiency by <strong>30%</strong>.`);
        state.resume.experience[index].bulletPoints = bulletPoints;
        saveAndRender();
        renderBullets();
      });
    });

    item.querySelector('.btn-add-exp-bullet').addEventListener('click', () => {
      bulletPoints.push('Engineered scalable features utilizing <strong>key technology</strong>, boosting performance by <strong>30%</strong>.');
      state.resume.experience[index].bulletPoints = bulletPoints;
      saveAndRender();
      renderBullets();
    });

    container.appendChild(item);
  });
}

/**
 * Render dynamic Projects Inputs with Move Up / Down
 */
function renderProjectsInputs() {
  const container = document.getElementById('projects-inputs-container');
  container.innerHTML = '';

  (state.resume.projects || []).forEach((proj, index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">🚀 Project #${index + 1}: ${escapeHTML(proj.title || 'New Project')}</span>
        <div class="dynamic-item-actions">
          ${index > 0 ? `<button type="button" class="btn-icon-xs btn-move-up" title="Move Up">↑</button>` : ''}
          ${index < state.resume.projects.length - 1 ? `<button type="button" class="btn-icon-xs btn-move-down" title="Move Down">↓</button>` : ''}
          <button type="button" class="btn-danger-ghost" data-action="remove-proj">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Delete
          </button>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project Title <span class="req-star">*</span></label>
          <input type="text" class="input-text proj-title" value="${escapeAttribute(proj.title || '')}" placeholder="e.g. Student Attendance Management System">
        </div>
        <div class="form-group">
          <label class="form-label">Duration <span class="req-star">*</span></label>
          <input type="text" class="input-text proj-duration" value="${escapeAttribute(proj.duration || '')}" placeholder="e.g. Feb 2025 – April 2025">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Tech Stack (Highlighted) <span class="req-star">*</span></label>
        <input type="text" class="input-text proj-tech" value="${escapeAttribute(proj.techStack || '')}" placeholder="e.g. FastAPI, React.js, PostgreSQL, Docker">
      </div>
      <div class="form-group">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
          <label class="form-label">Bullet Points</label>
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            ${ACTION_VERBS.slice(0, 4).map(v => `
              <button type="button" class="btn btn-outline btn-verb-chip" data-verb="${v}" style="padding:1px 6px; font-size:0.68rem;">+ ${v}</button>
            `).join('')}
          </div>
        </div>
        <div class="proj-bullets-container" style="display:flex; flex-direction:column; gap:8px;"></div>
        <button type="button" class="btn btn-outline btn-add-proj-bullet" style="margin-top:4px; font-size:0.75rem;">
          + Add Project Bullet
        </button>
      </div>
    `;

    // Bind inputs
    item.querySelector('.proj-title').addEventListener('input', (e) => {
      state.resume.projects[index].title = e.target.value;
      saveAndRender();
    });
    item.querySelector('.proj-duration').addEventListener('input', (e) => {
      state.resume.projects[index].duration = e.target.value;
      saveAndRender();
    });
    item.querySelector('.proj-tech').addEventListener('input', (e) => {
      state.resume.projects[index].techStack = e.target.value;
      saveAndRender();
    });

    const moveUpBtn = item.querySelector('.btn-move-up');
    if (moveUpBtn) {
      moveUpBtn.addEventListener('click', () => {
        const temp = state.resume.projects[index];
        state.resume.projects[index] = state.resume.projects[index - 1];
        state.resume.projects[index - 1] = temp;
        saveAndRender();
        renderProjectsInputs();
      });
    }

    const moveDownBtn = item.querySelector('.btn-move-down');
    if (moveDownBtn) {
      moveDownBtn.addEventListener('click', () => {
        const temp = state.resume.projects[index];
        state.resume.projects[index] = state.resume.projects[index + 1];
        state.resume.projects[index + 1] = temp;
        saveAndRender();
        renderProjectsInputs();
      });
    }

    item.querySelector('[data-action="remove-proj"]').addEventListener('click', () => {
      state.resume.projects.splice(index, 1);
      saveAndRender();
      renderProjectsInputs();
      showToast('Project deleted', 'info');
    });

    const bulletsContainer = item.querySelector('.proj-bullets-container');
    const bulletPoints = proj.bulletPoints || [];

    function renderProjBullets() {
      bulletsContainer.innerHTML = '';
      bulletPoints.forEach((bp, bIndex) => {
        const bRow = document.createElement('div');
        bRow.className = 'bullet-entry';
        bRow.innerHTML = `
          <textarea class="input-textarea bullet-input" rows="2" placeholder="e.g. Built asynchronous RESTful APIs...">${escapeHTML(bp)}</textarea>
          <button type="button" class="btn-danger-ghost btn-remove-bullet" title="Remove bullet" style="padding:6px;">✕</button>
        `;

        bRow.querySelector('.bullet-input').addEventListener('input', (e) => {
          bulletPoints[bIndex] = e.target.value;
          state.resume.projects[index].bulletPoints = bulletPoints;
          saveAndRender();
        });

        bRow.querySelector('.btn-remove-bullet').addEventListener('click', () => {
          bulletPoints.splice(bIndex, 1);
          state.resume.projects[index].bulletPoints = bulletPoints;
          saveAndRender();
          renderProjBullets();
        });

        bulletsContainer.appendChild(bRow);
      });
    }

    renderProjBullets();

    item.querySelectorAll('.btn-verb-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const verb = chip.dataset.verb;
        bulletPoints.push(`${verb} and deployed platform using <strong>React</strong> and <strong>FastAPI</strong>, serving <strong>5,000+ active users</strong>.`);
        state.resume.projects[index].bulletPoints = bulletPoints;
        saveAndRender();
        renderProjBullets();
      });
    });

    item.querySelector('.btn-add-proj-bullet').addEventListener('click', () => {
      bulletPoints.push('Architected and deployed platform using <strong>React</strong> and <strong>FastAPI</strong>, serving <strong>5,000+ active users</strong>.');
      state.resume.projects[index].bulletPoints = bulletPoints;
      saveAndRender();
      renderProjBullets();
    });

    container.appendChild(item);
  });
}

/**
 * Render dynamic Education Inputs
 */
function renderEducationInputs() {
  const container = document.getElementById('education-inputs-container');
  container.innerHTML = '';

  (state.resume.education || []).forEach((edu, index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">🎓 Education #${index + 1}</span>
        <button type="button" class="btn-danger-ghost" data-action="remove-edu" data-index="${index}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Institution Name <span class="req-star">*</span></label>
          <input type="text" class="input-text edu-inst" value="${escapeAttribute(edu.institution || '')}" placeholder="e.g. Government Engineering College">
        </div>
        <div class="form-group">
          <label class="form-label">Location <span class="req-star">*</span></label>
          <input type="text" class="input-text edu-loc" value="${escapeAttribute(edu.location || '')}" placeholder="e.g. Patan, Gujarat">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Degree & Major <span class="req-star">*</span></label>
        <input type="text" class="input-text edu-degree" value="${escapeAttribute(edu.degree || '')}" placeholder="e.g. Bachelor of Engineering in Computer Science">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Duration / Graduation Year <span class="req-star">*</span></label>
          <input type="text" class="input-text edu-duration" value="${escapeAttribute(edu.duration || '')}" placeholder="e.g. May 2022 – May 2026">
        </div>
        <div class="form-group">
          <label class="form-label">GPA / SPI / Honors</label>
          <input type="text" class="input-text edu-gpa" value="${escapeAttribute(edu.gpa || '')}" placeholder="e.g. Cumulative GPA: 8.64 / 10.0">
        </div>
      </div>
    `;

    ['institution', 'location', 'degree', 'duration', 'gpa'].forEach(field => {
      const cls = field === 'institution' ? 'edu-inst' : field === 'location' ? 'edu-loc' : `edu-${field}`;
      item.querySelector(`.${cls}`).addEventListener('input', (e) => {
        state.resume.education[index][field] = e.target.value;
        saveAndRender();
      });
    });

    item.querySelector('[data-action="remove-edu"]').addEventListener('click', () => {
      state.resume.education.splice(index, 1);
      saveAndRender();
      renderEducationInputs();
      showToast('Education entry removed', 'info');
    });

    container.appendChild(item);
  });
}

/**
 * Render dynamic Certifications Inputs
 */
function renderCertificationsInputs() {
  const container = document.getElementById('certifications-inputs-container');
  container.innerHTML = '';

  (state.resume.certificationsAndAchievements || []).forEach((cert, index) => {
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.innerHTML = `
      <div class="dynamic-item-header">
        <span class="dynamic-item-title">🏆 Certification / Award #${index + 1}</span>
        <button type="button" class="btn-danger-ghost" data-action="remove-cert" data-index="${index}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete
        </button>
      </div>
      <div class="form-group">
        <label class="form-label">Title / Event Name <span class="req-star">*</span></label>
        <input type="text" class="input-text cert-title-inp" value="${escapeAttribute(cert.title || '')}" placeholder="e.g. Smart India Hackathon (SIH) 2024">
      </div>
      <div class="form-group">
        <label class="form-label">Description / Achievement Summary <span class="req-star">*</span></label>
        <textarea class="input-textarea cert-desc-inp" rows="2" placeholder="e.g. SSIP Participation Certificate – Built scalable AI/web solutions.">${escapeHTML(cert.description || '')}</textarea>
      </div>
    `;

    item.querySelector('.cert-title-inp').addEventListener('input', (e) => {
      state.resume.certificationsAndAchievements[index].title = e.target.value;
      saveAndRender();
    });

    item.querySelector('.cert-desc-inp').addEventListener('input', (e) => {
      state.resume.certificationsAndAchievements[index].description = e.target.value;
      saveAndRender();
    });

    item.querySelector('[data-action="remove-cert"]').addEventListener('click', () => {
      state.resume.certificationsAndAchievements.splice(index, 1);
      saveAndRender();
      renderCertificationsInputs();
      showToast('Certification removed', 'info');
    });

    container.appendChild(item);
  });
}

/**
 * Setup Event Listeners for Personal Info, Summary, Add Buttons, Tabs, Dropdowns, etc.
 */
function setupEventListeners() {
  // Personal Info inputs
  const bindPersonal = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      state.resume.personalInfo[key] = e.target.value;
      saveAndRender();
    });
  };

  bindPersonal('input-name', 'name');
  bindPersonal('input-title', 'title');
  bindPersonal('input-location', 'location');
  bindPersonal('input-phone', 'phone');
  bindPersonal('input-email', 'email');
  bindPersonal('input-linkedin', 'linkedin');
  bindPersonal('input-linkedin-label', 'linkedinLabel');
  bindPersonal('input-github', 'github');
  bindPersonal('input-github-label', 'githubLabel');

  // Summary
  const summaryEl = document.getElementById('input-summary');
  summaryEl.addEventListener('input', (e) => {
    state.resume.summary = e.target.value;
    saveAndRender();
  });

  // Summary Bold Helper Button
  document.getElementById('btn-insert-bold-summary').addEventListener('click', () => {
    const start = summaryEl.selectionStart;
    const end = summaryEl.selectionEnd;
    const val = summaryEl.value;
    const selectedText = val.substring(start, end) || 'Key Skill / Metric';
    const replacement = `<strong>${selectedText}</strong>`;
    summaryEl.value = val.substring(0, start) + replacement + val.substring(end);
    state.resume.summary = summaryEl.value;
    saveAndRender();
    summaryEl.focus();
    summaryEl.setSelectionRange(start + 8, start + 8 + selectedText.length);
  });

  // Add Item Buttons
  document.getElementById('btn-add-skill-category').addEventListener('click', () => {
    const key = `Category ${Object.keys(state.resume.technicalSkills || {}).length + 1}`;
    state.resume.technicalSkills[key] = 'Tool 1, Tool 2, Tool 3';
    saveAndRender();
    renderSkillsInputs();
    showToast('New skill category added', 'success');
  });

  document.getElementById('btn-add-experience').addEventListener('click', () => {
    state.resume.experience.push({
      company: 'New Company',
      location: 'City, State',
      role: 'Software Engineer',
      duration: 'Month Year – Present',
      project: 'Core Architecture',
      bulletPoints: [
        'Engineered scalable microservices utilizing <strong>technology</strong>, improving processing speed by <strong>35%</strong>.'
      ]
    });
    saveAndRender();
    renderExperienceInputs();
    showToast('New experience entry added', 'success');
  });

  document.getElementById('btn-add-project').addEventListener('click', () => {
    state.resume.projects.push({
      title: 'New Featured Project',
      duration: 'Month Year – Month Year',
      techStack: 'FastAPI, React.js, PostgreSQL, Docker',
      bulletPoints: [
        'Architected an end-to-end full-stack web application serving <strong>1,000+ users</strong>.'
      ]
    });
    saveAndRender();
    renderProjectsInputs();
    showToast('New project entry added', 'success');
  });

  document.getElementById('btn-add-education').addEventListener('click', () => {
    state.resume.education.push({
      institution: 'University Name',
      location: 'City, State',
      degree: 'Bachelor of Technology in Computer Science',
      duration: '2022 – 2026',
      gpa: 'GPA: 8.5 / 10.0'
    });
    saveAndRender();
    renderEducationInputs();
    showToast('New education entry added', 'success');
  });

  document.getElementById('btn-add-certification').addEventListener('click', () => {
    state.resume.certificationsAndAchievements.push({
      title: 'New Certification / Honor',
      description: 'Issuing Organization – Description of key concepts and achievements.'
    });
    saveAndRender();
    renderCertificationsInputs();
    showToast('New certification added', 'success');
  });

  // Accordion Expand / Collapse with smooth auto-scroll to view
  document.querySelectorAll('.section-card-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.section-card');
      card.classList.toggle('active');
      if (card.classList.contains('active')) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  });

  // Collapse / Expand All toggle
  let allExpanded = true;
  document.getElementById('btn-collapse-all').addEventListener('click', () => {
    allExpanded = !allExpanded;
    document.querySelectorAll('.section-card').forEach(card => {
      if (allExpanded) card.classList.add('active');
      else card.classList.remove('active');
    });
  });

  // Customizer: Color Swatches
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      state.style.accentColor = swatch.dataset.color;
      state.style.accentDark = swatch.dataset.dark;
      applyResumeStyles();
      saveAndRender();
      showToast('Accent color updated!', 'info');
    });
  });

  // Customizer: Density Pills
  document.querySelectorAll('.density-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.style.density = pill.dataset.density;
      applyResumeStyles();
      saveAndRender();
      showToast(`Spacing set to ${pill.textContent}`, 'info');
    });
  });

  // Mobile Tab Navigation
  const tabEditor = document.getElementById('tab-btn-editor');
  const tabPreview = document.getElementById('tab-btn-preview');
  const sidebar = document.getElementById('app-sidebar');
  const previewPane = document.getElementById('preview-pane');

  tabEditor.addEventListener('click', () => {
    tabEditor.classList.add('active');
    tabPreview.classList.remove('active');
    sidebar.classList.remove('mobile-hidden');
    previewPane.classList.remove('mobile-active');
    state.activeMobileTab = 'editor';
  });

  tabPreview.addEventListener('click', () => {
    tabPreview.classList.add('active');
    tabEditor.classList.remove('active');
    sidebar.classList.add('mobile-hidden');
    previewPane.classList.add('mobile-active');
    state.activeMobileTab = 'preview';
    setTimeout(() => {
      adjustInitialZoom();
      updatePageHeightGauge();
    }, 100);
  });

  // Mobile More Dropdown
  const btnMobileMore = document.getElementById('btn-mobile-more');
  const mobileDropdown = document.getElementById('mobile-more-dropdown');

  if (btnMobileMore && mobileDropdown) {
    btnMobileMore.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!mobileDropdown.contains(e.target) && e.target !== btnMobileMore) {
        mobileDropdown.classList.remove('show');
      }
    });

    document.getElementById('menu-item-json').addEventListener('click', () => {
      mobileDropdown.classList.remove('show');
      openModalDirect('modal-json');
    });

    document.getElementById('menu-item-guide').addEventListener('click', () => {
      mobileDropdown.classList.remove('show');
      openModalDirect('modal-guide');
    });

    document.getElementById('menu-item-sample').addEventListener('click', () => {
      mobileDropdown.classList.remove('show');
      loadSampleDataAction();
    });

    document.getElementById('menu-item-reset').addEventListener('click', () => {
      mobileDropdown.classList.remove('show');
      if (confirm('Are you sure you want to reset to a blank template? All current data will be cleared.')) {
        state.resume = JSON.parse(JSON.stringify(blankResumeData));
        populateFormFields();
        saveAndRender();
        showToast('Reset to blank template', 'info');
      }
    });
  }

  // Sample Data Loading
  const loadSampleDataAction = () => {
    if (confirm('Load sample tech resume data? (This will overwrite current inputs)')) {
      state.resume = JSON.parse(JSON.stringify(sampleResumeData));
      populateFormFields();
      saveAndRender();
      showToast('Sample resume data loaded!', 'success');
    }
  };

  const sampleBtn = document.getElementById('btn-load-sample');
  if (sampleBtn) sampleBtn.addEventListener('click', loadSampleDataAction);

  // PDF Export
  document.getElementById('btn-download-pdf').addEventListener('click', exportPDF);
  document.getElementById('btn-print-dialog').addEventListener('click', () => {
    window.print();
  });
}

/**
 * Zoom and Canvas Scaling Engine with Fit Width & Fit Page
 */
function setupZoom() {
  const wrapper = document.getElementById('preview-wrapper');
  const label = document.getElementById('zoom-value-label');

  function updateZoom(newZoom) {
    state.zoomLevel = Math.max(0.35, Math.min(1.5, parseFloat(newZoom.toFixed(2))));
    wrapper.style.transform = `scale(${state.zoomLevel})`;
    label.textContent = `${Math.round(state.zoomLevel * 100)}%`;
  }

  document.getElementById('btn-zoom-in').addEventListener('click', () => updateZoom(state.zoomLevel + 0.1));
  document.getElementById('btn-zoom-out').addEventListener('click', () => updateZoom(state.zoomLevel - 0.1));
  document.getElementById('btn-zoom-100').addEventListener('click', () => updateZoom(1.0));
  
  document.getElementById('btn-zoom-fit').addEventListener('click', () => {
    const container = document.getElementById('preview-container');
    const containerWidth = container.clientWidth - (window.innerWidth < 768 ? 16 : 48);
    const a4WidthPx = 794; // 210mm
    const fitScale = Math.min(1.2, Math.max(0.38, containerWidth / a4WidthPx));
    updateZoom(fitScale);
  });

  document.getElementById('btn-zoom-page').addEventListener('click', () => {
    const container = document.getElementById('preview-container');
    const containerWidth = container.clientWidth - (window.innerWidth < 768 ? 16 : 48);
    const containerHeight = container.clientHeight - 40;
    const a4WidthPx = 794;
    const a4HeightPx = 1123;
    const fitScale = Math.min(containerWidth / a4WidthPx, containerHeight / a4HeightPx);
    updateZoom(Math.max(0.38, fitScale));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 992) {
      adjustInitialZoom();
    }
  });
}

function adjustInitialZoom() {
  const container = document.getElementById('preview-container');
  if (!container) return;
  const containerWidth = container.clientWidth - (window.innerWidth < 768 ? 16 : 48);
  const a4WidthPx = 794;
  let scale = containerWidth / a4WidthPx;
  if (scale > 0.95) scale = 0.95;
  if (scale < 0.42) scale = 0.42;
  state.zoomLevel = scale;
  const wrapper = document.getElementById('preview-wrapper');
  const label = document.getElementById('zoom-value-label');
  if (wrapper) wrapper.style.transform = `scale(${scale})`;
  if (label) label.textContent = `${Math.round(scale * 100)}%`;
}

/**
 * Export PDF using html2pdf.js for 1-click download with fallback to print dialog
 */
function exportPDF() {
  const element = document.getElementById('resume-preview-root');
  if (!element) return;

  const candidateName = (state.resume.personalInfo?.name || 'Resume').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${candidateName}_Resume.pdf`;

  showToast('Generating pixel-perfect A4 PDF...', 'info');

  if (typeof window.html2pdf === 'function') {
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2.5, 
        useCORS: true, 
        letterRendering: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    window.html2pdf().set(opt).from(element).save().then(() => {
      showToast(`🎉 PDF downloaded: ${filename}`, 'success');
    }).catch(err => {
      console.warn('html2pdf fallback triggering print dialog:', err);
      window.print();
    });
  } else {
    window.print();
  }
}

/**
 * Modals Controller (AI Assistant, JSON Data, ATS Guide)
 */
function openModalDirect(id) {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  const target = document.getElementById(id);
  if (target) target.classList.add('open');

  if (id === 'modal-json') {
    const jsonExportText = document.getElementById('json-export-textarea');
    if (jsonExportText) jsonExportText.value = JSON.stringify(state.resume, null, 2);
  }
}

function initModals() {
  const openModal = openModalDirect;

  const closeModal = () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  };

  document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));

  // AI Modal
  const btnOpenAI = document.getElementById('btn-open-ai');
  const aiPromptBox = document.getElementById('ai-prompt-display');
  const btnCopyPrompt = document.getElementById('btn-copy-ai-prompt');
  const btnApplyAIJSON = document.getElementById('btn-apply-ai-json');
  const aiJSONInput = document.getElementById('ai-json-input');

  if (btnOpenAI) {
    btnOpenAI.addEventListener('click', () => {
      aiPromptBox.textContent = generateAIPrompt();
      aiJSONInput.value = '';
      openModal('modal-ai');
    });
  }

  if (btnCopyPrompt) {
    btnCopyPrompt.addEventListener('click', () => {
      navigator.clipboard.writeText(generateAIPrompt()).then(() => {
        btnCopyPrompt.innerHTML = `✓ Copied to Clipboard!`;
        setTimeout(() => {
          btnCopyPrompt.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy Prompt`;
        }, 2500);
        showToast('AI prompt copied! Paste into ChatGPT or Claude.', 'success');
      });
    });
  }

  if (btnApplyAIJSON) {
    btnApplyAIJSON.addEventListener('click', () => {
      const raw = aiJSONInput.value.trim();
      if (!raw) {
        showToast('Please paste the JSON response from the AI.', 'error');
        return;
      }

      let cleaned = raw;
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      }

      const validation = validateResumeJSON(cleaned);
      if (!validation.valid) {
        showToast(`Validation Error: ${validation.error}`, 'error');
        return;
      }

      state.resume = validation.data;
      populateFormFields();
      saveAndRender();
      closeModal();
      showToast('✨ AI resume data imported successfully!', 'success');
    });
  }

  // JSON Modal
  const btnOpenJSON = document.getElementById('btn-open-json');
  const tabJSONImport = document.getElementById('tab-json-import');
  const tabJSONExport = document.getElementById('tab-json-export');
  const viewJSONImport = document.getElementById('json-import-view');
  const viewJSONExport = document.getElementById('json-export-view');
  const jsonImportText = document.getElementById('json-import-textarea');
  const jsonExportText = document.getElementById('json-export-textarea');
  const btnSubmitImport = document.getElementById('btn-submit-import-json');
  const btnDownloadJSON = document.getElementById('btn-download-json-file');
  const btnTriggerUpload = document.getElementById('btn-trigger-upload');
  const fileInput = document.getElementById('json-file-upload');

  if (btnOpenJSON) {
    btnOpenJSON.addEventListener('click', () => {
      jsonExportText.value = JSON.stringify(state.resume, null, 2);
      openModal('modal-json');
    });
  }

  if (tabJSONImport && tabJSONExport) {
    tabJSONImport.addEventListener('click', () => {
      tabJSONImport.className = 'btn btn-primary';
      tabJSONExport.className = 'btn btn-outline';
      viewJSONImport.style.display = 'block';
      viewJSONExport.style.display = 'none';
      btnSubmitImport.style.display = 'inline-flex';
      btnDownloadJSON.style.display = 'none';
    });

    tabJSONExport.addEventListener('click', () => {
      tabJSONExport.className = 'btn btn-primary';
      tabJSONImport.className = 'btn btn-outline';
      viewJSONExport.style.display = 'block';
      viewJSONImport.style.display = 'none';
      btnSubmitImport.style.display = 'none';
      btnDownloadJSON.style.display = 'inline-flex';
      jsonExportText.value = JSON.stringify(state.resume, null, 2);
    });
  }

  if (btnTriggerUpload && fileInput) {
    btnTriggerUpload.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        jsonImportText.value = event.target.result;
        showToast(`Loaded ${file.name}`, 'info');
      };
      reader.readAsText(file);
    });
  }

  if (btnSubmitImport) {
    btnSubmitImport.addEventListener('click', () => {
      const raw = jsonImportText.value.trim();
      if (!raw) {
        showToast('Please paste or upload JSON content.', 'error');
        return;
      }
      const validation = validateResumeJSON(raw);
      if (!validation.valid) {
        showToast(`Invalid JSON: ${validation.error}`, 'error');
        return;
      }
      state.resume = validation.data;
      populateFormFields();
      saveAndRender();
      closeModal();
      showToast('JSON imported successfully!', 'success');
    });
  }

  if (btnDownloadJSON) {
    btnDownloadJSON.addEventListener('click', () => {
      const candidateName = (state.resume.personalInfo?.name || 'Resume').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
      const blob = new Blob([JSON.stringify(state.resume, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName}_ResumeData.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('JSON file downloaded!', 'success');
    });
  }

  // ATS Guide Modal
  const btnOpenGuide = document.getElementById('btn-open-guide');
  if (btnOpenGuide) {
    btnOpenGuide.addEventListener('click', () => openModal('modal-guide'));
  }

  const printGuideBtn = document.getElementById('btn-print-ats-guide');
  if (printGuideBtn) {
    printGuideBtn.addEventListener('click', () => {
      const guideWindow = window.open('', '_blank');
      guideWindow.document.write(generateATSGuideHTML());
      guideWindow.document.close();
      guideWindow.focus();
      setTimeout(() => {
        guideWindow.print();
      }, 500);
    });
  }
}

/**
 * Initialize ATS Guide Modal Content
 */
function initGuideContent() {
  const container = document.getElementById('guide-modal-content');
  if (!container) return;

  container.innerHTML = `
    <div style="background:rgba(37,99,235,0.1); border-left:4px solid #2563eb; padding:12px 16px; border-radius:0 8px 8px 0; font-size:0.88rem; font-weight:600; color:#93c5fd;">
      ${atsGuideData.bulletFormula}
    </div>

    <div style="margin-top:16px;">
      <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:10px; color:var(--text-primary);">📋 Essential ATS Rules</h3>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${atsGuideData.tips.map(t => `
          <div style="background:var(--bg-tertiary); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
            <strong style="color:#60a5fa; font-size:0.85rem; display:block; margin-bottom:4px;">${t.category}</strong>
            <ul style="padding-left:18px; font-size:0.8rem; color:var(--text-secondary); line-height:1.45;">
              ${t.rules.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="margin-top:16px;">
      <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:10px; color:var(--text-primary);">⚡ High-Impact Power Action Verbs</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">
        ${Object.entries(atsGuideData.actionVerbs).map(([cat, verbs]) => `
          <div style="background:var(--bg-tertiary); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); font-size:0.8rem;">
            <strong style="color:#a855f7; display:block; margin-bottom:4px;">${cat}</strong>
            <span style="color:var(--text-secondary);">${verbs.join(', ')}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : type === 'error'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Security & String Sanitization Helpers
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(str) {
  if (!str) return '';
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Safely format inline HTML like <strong> and <b> while escaping malicious tags
 */
function formatInlineHTML(str) {
  if (!str) return '';
  let text = String(str);
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/<(?!\/?(strong|b|em|i)\b)[^>]+>/gi, '');
  return text;
}

// Kickoff on DOM Ready
document.addEventListener('DOMContentLoaded', init);
