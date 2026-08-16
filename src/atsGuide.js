export const atsGuideData = {
  title: "ATS Resume Writing Cheatsheet & Action Formulas",
  subtitle: "Standard guidelines, power action verbs, and structured templates for high-impact resumes",
  bulletFormula: "⚡ Formula: [Strong Action Verb] + [Specific Task / Scope] + [Technologies Used] + [Quantifiable Result / Metric %]",
  tips: [
    {
      category: "Header & Contact Info",
      rules: [
        "Include Full Name, Target Job Title, Location (City, State/Country), Phone, Email.",
        "Add clean hyperlinks for LinkedIn and GitHub (or Portfolio).",
        "Keep contact items on a single horizontal row for maximum space efficiency."
      ]
    },
    {
      category: "Professional Summary",
      rules: [
        "Keep it strictly between 2 to 4 impactful lines.",
        "Highlight your primary role title, top 3-4 core technologies, and standout achievements in <strong>bold</strong>.",
        "Avoid subjective buzzwords like 'hardworking' or 'passionate' — focus on concrete capabilities."
      ]
    },
    {
      category: "Technical Skills",
      rules: [
        "Organize skills into clean categories (e.g., Languages, Frameworks, Databases, Cloud & DevOps, Core Competencies).",
        "List technologies in descending order of proficiency.",
        "Keep syntax consistent (e.g., 'React.js', 'PostgreSQL', 'FastAPI')."
      ]
    },
    {
      category: "Work Experience & Projects",
      rules: [
        "Start every single bullet point with a past-tense action verb (e.g., 'Architected', 'Engineered', 'Optimized').",
        "Bold key metrics (e.g., <strong>75%</strong>, <strong>sub-50ms latency</strong>, <strong>100,000+ records</strong>) and tools (<strong>FastAPI</strong>, <strong>Docker</strong>).",
        "Include the project name/subheading and exact tech stack."
      ]
    },
    {
      category: "Education & Certifications",
      rules: [
        "Include Degree name, Major, University, Location, Graduation Year/Range, and GPA/SPI if competitive.",
        "For certifications, mention the issuing organization and a 1-line description of practical skills gained."
      ]
    }
  ],
  actionVerbs: {
    "Architect & Build": ["Architected", "Engineered", "Designed", "Developed", "Constructed", "Implemented", "Deployed", "Orchestrated"],
    "Optimize & Scale": ["Optimized", "Accelerated", "Streamlined", "Maximized", "Scaled", "Reduced", "Augmented", "Refactored"],
    "Lead & Manage": ["Spearheaded", "Directed", "Coordinated", "Led", "Governed", "Supervised", "Championed"],
    "Innovate & Integrate": ["Pioneered", "Integrated", "Automated", "Transformed", "Standardized", "Established"]
  },
  predefinedTemplates: {
    summary: "Results-driven <strong>Full-Stack Developer</strong> specializing in <strong>[Tech 1]</strong>, <strong>[Tech 2]</strong>, and <strong>[Tech 3]</strong> with proven expertise in building high-throughput microservices and scalable cloud architectures. Demonstrated history of cutting latency by <strong>[X]%</strong> and automating complex workflows on <strong>[Cloud Platform]</strong>.",
    bulletExperience: "Engineered scalable backend services using <strong>FastAPI</strong> and <strong>PostgreSQL</strong>, decreasing average API response latency by <strong>45%</strong> under concurrent load.",
    bulletProject: "Architected an automated <strong>[System Name]</strong> leveraging <strong>React.js</strong> and <strong>Docker</strong>, supporting <strong>10,000+ active monthly requests</strong> with zero downtime."
  }
};
