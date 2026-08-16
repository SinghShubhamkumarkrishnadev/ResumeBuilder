export const sampleResumeData = {
  personalInfo: {
    name: "Singh Shubham Kumar",
    title: "Full-Stack Developer | Python, Java, React",
    location: "Ahmedabad, Gujarat",
    phone: "+91 70414 84034",
    phoneRaw: "+917041484034",
    email: "singhshubhamk287@gmail.com",
    linkedin: "https://www.linkedin.com/in/singh-shubhamkumar-krishnadev-b581952a9/",
    linkedinLabel: "LinkedIn",
    github: "https://github.com/SinghShubhamkumarkrishnadev",
    githubLabel: "GitHub"
  },
  summary:
    "Results-driven <strong>Full-Stack Developer</strong> specializing in <strong>Python (FastAPI)</strong>, <strong>React.js</strong>, <strong>Next.js</strong>, and <strong>PostgreSQL</strong> with hands-on experience engineering scalable microservices, automated anti-bot web scraping pipelines, and AI execution workflows. Proficient in monorepo management with <strong>Turborepo</strong>, enterprise Role-Based Access Control (<strong>RBAC IAM</strong>) via Microsoft Entra ID, and containerized cloud deployments on <strong>AWS (ECS, S3, Secrets Manager)</strong>.",
  technicalSkills: {
    "Languages": "Python, JavaScript (ES6+), TypeScript, Java (J2SE, J2EE), SQL",
    "Frameworks & Libraries": "FastAPI, Django(DRF), React.js, Next.js, Spring Boot, RESTful APIs, Tailwind CSS",
    "Databases & Caching": "PostgreSQL, MongoDB, MySQL, Redis, SQLAlchemy",
    "Cloud & DevOps": "AWS (ECS, S3, Secrets Manager), Docker, Turborepo, uv, Git, GitHub, CI/CD, Render, Vercel",
    "Core Competencies": "Microservices, Monorepo Architecture, AI Execution Pipelines, Anti-Bot Scraping, RBAC, System Design, DSA"
  },
  experience: [
    {
      company: "Lanet Team",
      location: "Surat, Gujarat",
      role: "Full-Stack & AI Integration Developer Intern",
      duration: "Jan 2026 – Present",
      project: "AI-Based Document Reviewer System",
      bulletPoints: [
        "Architected and deployed an end-to-end enterprise AI document review system inside a <strong>Turborepo monorepo</strong>, integrating <strong>Next.js</strong> frontend interfaces with <strong>FastAPI</strong> microservices.",
        "Engineered a modular <strong>7-step AI execution pipeline</strong> (Document Splitting → Chunking → First Analyzer → Deep Reviewer → Critical Issue Checker → Summarizer → Report Generation), cutting manual document review time by <strong>75%</strong>.",
        "Implemented <strong>uv</strong> for high-performance Python virtual environment and dependency management, accelerating build cycles and package resolution by over <strong>3x</strong>.",
        "Designed normalized <strong>PostgreSQL schemas</strong> with compound indexing for audit logging, relational metadata, and pipeline execution tracking.",
        "Managed cloud container infrastructure using <strong>AWS ECS</strong>, stored secure file assets in <strong>AWS S3</strong>, handled credentials via <strong>AWS Secrets Manager</strong>, and enforced enterprise-grade <strong>RBAC IAM</strong> via Microsoft Entra ID."
      ]
    }
  ],
  projects: [
    {
      title: "Student Attendance Management System",
      duration: "Feb 2025 – April 2025",
      techStack: "FastAPI, MongoDB, React.js, JWT Authentication, RBAC, Docker, Render, Vercel",
      bulletPoints: [
        "Architected an automated role-based attendance management system for professors, HODs, and students featuring secure <strong>JWT authentication</strong> and granular <strong>RBAC</strong>.",
        "Built asynchronous RESTful APIs using <strong>FastAPI</strong> and <strong>MongoDB (NoSQL)</strong> with compound index optimization, achieving <strong>sub-50ms response latency</strong> under concurrent load.",
        "Developed an interactive <strong>React.js dashboard</strong> supporting real-time attendance tracking, automated CSV/PDF report generation, and analytics visualizations.",
        "Containerized microservices with <strong>Docker</strong> and established automated CI/CD pipelines via <strong>Render</strong> (backend) and <strong>Vercel</strong> (frontend)."
      ]
    },
    {
      title: "E-Commerce Scraping & Real-Time Analytics Platform",
      duration: "Nov 2025 – Jan 2026",
      techStack: "Python, FastAPI, React.js, PostgreSQL, Redis, Proxy Rotation, Docker",
      bulletPoints: [
        "Engineered automated scraping engines with anti-bot evasion: residential proxy pool rotation, user-agent randomization, CAPTCHA bypass routines, and stealth headless browser automation.",
        "Designed a high-throughput data pipeline storing <strong>100,000+ scraped price records</strong> in <strong>PostgreSQL</strong>, leveraging a <strong>Redis caching layer</strong> to lower database query load by <strong>60%</strong>.",
        "Built a responsive <strong>React.js analytics dashboard</strong> with dynamic price tracking charts, competitor price drop alerts, and low-latency <strong>FastAPI</strong> querying endpoints."
      ]
    }
  ],
  education: [
    {
      institution: "Government Engineering College (GEC)",
      location: "Patan, Gujarat",
      degree: "Bachelor of Engineering in Computer Science and Engineering",
      duration: "May 2022 – May 2026",
      gpa: "Cumulative GPA: 8.64 / 10.0 (Semester 5 SPI: 9.04 / 10.0)"
    }
  ],
  certificationsAndAchievements: [
    {
      title: "Smart India Hackathon (SIH) 2024",
      description: "SSIP Participation Certificate (Team CodeSweepers) – Built scalable AI/web solutions for national hackathon."
    },
    {
      title: "Prompt Engineering for Developers",
      description: "Comprehensive coursework in LLM orchestration, structured JSON parsing, and context optimization."
    },
    {
      title: "Cloud & Infrastructure Deployment",
      description: "Containerized and deployed production microservices across AWS ECS, Docker, Render, and Vercel."
    }
  ]
};

export const blankResumeData = {
  personalInfo: {
    name: "Your Full Name",
    title: "Software Engineer | Specialization & Key Tech",
    location: "City, Country",
    phone: "+1 (555) 000-0000",
    phoneRaw: "+15550000000",
    email: "your.name@example.com",
    linkedin: "https://linkedin.com/in/yourprofile",
    linkedinLabel: "LinkedIn",
    github: "https://github.com/yourusername",
    githubLabel: "GitHub"
  },
  summary:
    "Results-driven <strong>Software Engineer</strong> with strong experience in <strong>Technologies</strong>, building scalable applications and high-impact solutions.",
  technicalSkills: {
    "Languages": "Python, JavaScript, TypeScript, Java, C++, SQL",
    "Frameworks & Libraries": "React, Node.js, Express, Next.js, Django, FastAPI",
    "Databases & Tools": "PostgreSQL, MongoDB, Redis, Docker, Git, AWS"
  },
  experience: [
    {
      company: "Company Name",
      location: "City, State / Remote",
      role: "Job Title",
      duration: "Jan 2024 – Present",
      project: "Key Project / Product Name",
      bulletPoints: [
        "Architected and deployed <strong>key feature</strong> resulting in a <strong>40%</strong> increase in performance.",
        "Collaborated with cross-functional teams to deliver scalable microservices with 99.9% uptime.",
        "Optimized database queries and API response times by <strong>50%</strong>."
      ]
    }
  ],
  projects: [
    {
      title: "Project Name",
      duration: "Month Year – Month Year",
      techStack: "React, Node.js, PostgreSQL, Docker",
      bulletPoints: [
        "Developed a full-stack platform serving <strong>5,000+ active users</strong>.",
        "Integrated secure authentication and automated CI/CD pipeline for instant deployments."
      ]
    }
  ],
  education: [
    {
      institution: "University / College Name",
      location: "City, State",
      degree: "Bachelor of Science in Computer Science",
      duration: "2020 – 2024",
      gpa: "GPA: 3.8 / 4.0"
    }
  ],
  certificationsAndAchievements: [
    {
      title: "Certification or Award Title",
      description: "Issuing Organization / Details – Highlight key milestone or score."
    }
  ]
};
