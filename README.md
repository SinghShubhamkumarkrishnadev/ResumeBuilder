<div align="center">

# 📄 ATS Single-Page Resume Builder & AI Assistant

**A modern, responsive, production-ready ATS Resume Builder web application featuring real-time A4 live preview, live single-page height detection, Dark/Light mode, custom resume accent colors, AI master prompt generation, JSON import/export, and 1-click pixel-perfect PDF export.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![A4 Single Page](https://img.shields.io/badge/Template-Fixed%20A4%20ATS-1e40af)

</div>

---

## 🌟 Key Features

- 🎯 **Fixed ATS Single-Page A4 Template**: Strictly engineered with standard ATS typography, exact Inter font hierarchy, SVG contact icons, and impact bullet formatting.
- 📏 **Real-Time A4 Single-Page Height Meter**: Live gauge displaying percentage of A4 page height (e.g. `95% of A4 - Single Page Perfect`) with a visual 297mm cutoff marker to prevent accidental overflow.
- 🎨 **Resume Style & Accent Customizer**:
  - Color presets: Classic Navy, Emerald Teal, Royal Indigo, Deep Crimson, Warm Amber, Slate Obsidian, Monochrome Minimal.
  - Spacing density modes: **Compact (Fit More)**, **Balanced (Default)**, and **Spacious**.
- 🌓 **Dark & Light Theme Mode**: Switch effortlessly between sleek Dark and crisp Light UI with persistent local preferences.
- ⚡ **Real-Time Live Preview**: Instant synchronized preview canvas with smooth zoom controls (Fit Width, Fit Page, 100%, + / -).
- 🤖 **AI Prompt & JSON Auto-Fill Hub**:
  - 1-Click copy of a structured master prompt + exact JSON schema for ChatGPT, Claude, Gemini, or DeepSeek.
  - 1-Click paste/import of AI-generated JSON into the editor to automatically populate your entire resume in milliseconds!
- 📝 **Section-by-Section Form Editor**:
  - Personal & Contact Info (Phone, Email, Location, LinkedIn, GitHub)
  - Professional Summary with bolding helper tool
  - Technical Skills categories (dynamic add/remove)
  - Work Experience entries with dynamic bullet points and Move Up/Down reordering (`↑` / `↓`)
  - Project entries with dynamic bullet points, tech stack tags, and reordering
  - Education history with GPA & honors details
  - Certifications & Achievements entries
- 💾 **Local Auto-Save & Backup**:
  - Automatically saves all your edits to browser `localStorage`.
  - Import/Export `.json` backup files at any time.
- 🖨️ **1-Click Pixel-Perfect PDF Export**:
  - Client-side high-resolution PDF download (`html2pdf.js`).
  - Native print stylesheet (`@media print`) matching standard A4 dimensions (`210mm x 297mm`) with 0mm margins.
- 📱 **100% Mobile & Tablet Responsive**:
  - Desktop: Split-screen editor + live A4 preview.
  - Mobile: Sticky tab switcher (Form Editor <-> Live Preview) with responsive `... More` dropdown menu.

---

## 🚀 Quick Start & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/SinghShubhamkumarkrishnadev/ResumeBuilder.git
cd ResumeBuilder
```

### 2. Run Locally
```bash
# Start lightweight local server
npm run dev

# Or with python
python -m http.server 3000
```
Open **`http://localhost:3000`** in your browser.

---

## ☁️ Deploying to Vercel (1-Click)

### Option 1: Via Vercel Dashboard
1. Push your repository to GitHub.
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Leave all build settings as default (Framework Preset: **Other**).
5. Click **"Deploy"** — your resume builder will be live globally!

### Option 2: Via Vercel CLI
```bash
npx vercel
```

---

## 🤖 Using the AI Prompt & JSON Assistant

Entering extensive job details manually can be slow. With the built-in AI Assistant:

1. Click **`AI Prompt & Fill`** in the top navigation bar.
2. Click **`Copy Prompt`** (copies the fine-tuned system prompt + complete JSON schema).
3. Paste the prompt into **ChatGPT**, **Claude**, or **Gemini**, and append your raw resume notes/LinkedIn profile text at the bottom.
4. Copy the AI's JSON output.
5. Paste it into the **`AI JSON Input`** box and click **`Apply AI Resume Data`**.
6. Your entire resume and form will be filled instantly!

---

## 📋 Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6 Modules), Vanilla CSS Design Tokens
- **PDF Engine**: Client-side `html2pdf.js` + Native CSS `@page` Print Engine
- **Typography**: Google Fonts (`Inter`, `JetBrains Mono`)
- **Hosting / Deploy**: Vercel Static Deployment (`vercel.json`)

---

## 📄 License

Distributed under the MIT License.
