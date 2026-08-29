export type ResourceCategory =
  | 'Coding'
  | 'DSA'
  | 'AI/ML'
  | 'Computer Science'
  | 'Mathematics'
  | 'English & Writing'
  | 'Resume Building'
  | 'Interview Prep'
  | 'Certifications'
  | 'Productivity'
  | 'Research Papers'
  | 'Student Packs & Perks'
  | 'Internships & Careers';

export type FreeStatus = '100% Free' | 'Freemium' | 'Free with Student ID' | 'Free to Audit';
export type AudienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface FreeWebsiteItem {
  id: string;
  name: string;
  url: string;
  category: ResourceCategory;
  freeStatus: FreeStatus;
  statusDetails: string;
  bestFor: string;
  audienceLevel: AudienceLevel;
  shortDescription: string;
  whyStudentsShouldUse: string;
  isEditorsPick?: boolean;
  editorsNote?: string;
  keyFeatures: string[];
}

export interface WebsiteFaq {
  question: string;
  answer: string;
}

export const LAST_REVIEWED_DATE = 'August 2026';

export const FREE_WEBSITES_LIST: FreeWebsiteItem[] = [
  // 1. Coding & Full Stack
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org',
    category: 'Coding',
    freeStatus: '100% Free',
    statusDetails: 'Completely free, open-source nonprofit with verified certificates.',
    bestFor: 'Interactive Web Dev & Core Certifications',
    audienceLevel: 'Beginner',
    isEditorsPick: true,
    editorsNote: 'The gold-standard zero-cost platform for mastering HTML, CSS, JavaScript, Python, and backend APIs with 300+ hour project certifications.',
    shortDescription: 'A world-renowned nonprofit platform offering an entirely free 3,000+ hour interactive coding curriculum and verified career certifications.',
    whyStudentsShouldUse: 'Unlike paid bootcamps that charge thousands of dollars, freeCodeCamp offers browser-based coding challenges, hands-on portfolio projects, and a global student support community.',
    keyFeatures: ['Interactive in-browser IDE', 'Verified certification upon project completion', 'Zero paywalls or hidden fees', 'Real-world nonprofit project building'],
  },
  {
    id: 'the-odin-project',
    name: 'The Odin Project',
    url: 'https://www.theodinproject.com',
    category: 'Coding',
    freeStatus: '100% Free',
    statusDetails: 'Open-source, free curriculum maintained by active software engineers.',
    bestFor: 'Self-Directed Full-Stack Portfolio Building',
    audienceLevel: 'Beginner',
    isEditorsPick: true,
    editorsNote: 'Forces you out of the browser sandbox to set up a real local development environment with Git, Node.js, and command line tools.',
    shortDescription: 'An open-source full-stack curriculum designed to take beginners to job-ready engineers using real local tools, Git workflows, and portfolio projects.',
    whyStudentsShouldUse: 'Many online tutorials keep students trapped in browser sandboxes. The Odin Project teaches professional command-line setup, Git version control, and building authentic full-stack applications.',
    keyFeatures: ['Node.js and Ruby on Rails tracks', 'Portfolio-ready full-stack projects', 'Active Discord community for peer code review', 'Focus on local development workflows'],
  },
  {
    id: 'w3schools',
    name: 'W3Schools',
    url: 'https://www.w3schools.com',
    category: 'Coding',
    freeStatus: '100% Free',
    statusDetails: 'All documentation, tutorials, and TryIt code editors are 100% free.',
    bestFor: 'Instant Syntax Reference & Quick Code Sandboxes',
    audienceLevel: 'Beginner',
    shortDescription: 'The web’s most accessible reference encyclopedia for web technologies, databases, and programming syntax with instant interactive code playgrounds.',
    whyStudentsShouldUse: 'When you quickly need to remember how a CSS grid property, SQL JOIN, or JavaScript array method behaves, W3Schools gives instant, runnable sandbox examples without fluff.',
    keyFeatures: ['Interactive "TryIt" Live Editor', 'Reference guides for SQL, HTML, CSS, JS, Python, C++', 'Concise syntax cheatsheets', 'Free quizzes to test comprehension'],
  },

  // 2. Data Structures & Algorithms (DSA)
  {
    id: 'leetcode',
    name: 'LeetCode',
    url: 'https://leetcode.com',
    category: 'DSA',
    freeStatus: 'Freemium',
    statusDetails: 'Hundreds of questions, discussion forums, and weekly contests are 100% free. Premium adds company tags and video solutions.',
    bestFor: 'Technical Interview & Algorithmic Problem Solving',
    audienceLevel: 'Intermediate',
    isEditorsPick: true,
    editorsNote: 'The global benchmark platform for software engineering coding rounds. Mastering the core 150 questions is key for campus placement interviews.',
    shortDescription: 'The premier competitive programming and interview preparation platform featuring 3,000+ algorithmic problems, contest leaderboards, and code submission judges.',
    whyStudentsShouldUse: 'Almost all top tech companies base their technical screening rounds on LeetCode-style data structure and algorithm problems. Practicing here builds optimal time and space complexity intuition.',
    keyFeatures: ['Supports 14+ programming languages', 'Weekly real-time coding contests', 'Community solution discussion forums', 'Detailed time/space complexity runtime benchmarks'],
  },
  {
    id: 'neetcode',
    name: 'NeetCode.io',
    url: 'https://neetcode.io',
    category: 'DSA',
    freeStatus: '100% Free',
    statusDetails: 'NeetCode 150 roadmap and in-depth video explanations are completely free on YouTube and the web platform.',
    bestFor: 'Structured Algorithmic Pattern Roadmaps',
    audienceLevel: 'Beginner',
    isEditorsPick: true,
    editorsNote: 'Eliminates LeetCode overwhelm by curating the top 150 essential pattern questions with world-class whiteboard walkthroughs.',
    shortDescription: 'A structured roadmap and video tutorial platform that categorizes coding interview problems by repeatable algorithmic patterns (Sliding Window, Two Pointers, Trees, DP).',
    whyStudentsShouldUse: 'Instead of aimlessly solving random problems, NeetCode groups questions by core patterns so you learn problem archetypes rather than memorizing individual solutions.',
    keyFeatures: ['Interactive NeetCode 75 and 150 checklists', 'Crystal-clear visual video explanations', 'Categorized pattern progression tree', 'Direct LeetCode problem links'],
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    url: 'https://www.hackerrank.com',
    category: 'DSA',
    freeStatus: '100% Free',
    statusDetails: '100% free for individual developers and students to practice and earn badges.',
    bestFor: 'Language-Specific Fundamentals & Skill Badges',
    audienceLevel: 'Beginner',
    shortDescription: 'A skill practice and benchmarking platform where students can solve language-specific challenges (Java, C++, Python, SQL) and earn verified proficiency badges.',
    whyStudentsShouldUse: 'Great for 1st and 2nd year college students who want to build syntax muscle memory in specific programming languages before jumping into complex LeetCode algorithms.',
    keyFeatures: ['Verified skill certification tests', '30 Days of Code beginner tracks', 'Domain-specific tracks for SQL and Algorithms', 'Used by university placement drives'],
  },

  // 3. AI & Machine Learning
  {
    id: 'kaggle',
    name: 'Kaggle',
    url: 'https://www.kaggle.com',
    category: 'AI/ML',
    freeStatus: '100% Free',
    statusDetails: 'Free access to GPU/TPU cloud Jupyter notebooks, open datasets, and micro-courses.',
    bestFor: 'Free Cloud GPUs, Open Datasets & ML Competitions',
    audienceLevel: 'Beginner',
    isEditorsPick: true,
    editorsNote: 'Provides up to 30 hours per week of free NVIDIA GPUs/TPUs directly in your browser without requiring a credit card.',
    shortDescription: 'The world’s largest data science and machine learning community offering free cloud notebooks, massive datasets, educational micro-courses, and competitive hackathons.',
    whyStudentsShouldUse: 'Students without expensive gaming laptops can train deep learning and machine learning models in the cloud for free, access real-world datasets, and build impressive data science portfolios.',
    keyFeatures: ['Free weekly GPU (P100/T4) and TPU quota', 'Over 50,000+ public datasets', 'Practical micro-courses on Pandas, Python, and Deep Learning', 'Community notebook code forks'],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co',
    category: 'AI/ML',
    freeStatus: 'Freemium',
    statusDetails: 'Free access to explore, download, and host open-weight models and demo Spaces. Paid compute available for large dedicated instances.',
    bestFor: 'Open-Source AI Models, Datasets & Web Demos',
    audienceLevel: 'Intermediate',
    shortDescription: 'The central hub of modern open-source AI, hosting hundreds of thousands of pre-trained models (LLMs, vision, audio), datasets, and interactive Gradio/Streamlit Spaces.',
    whyStudentsShouldUse: 'Allows college students to integrate state-of-the-art transformer models into college capstone projects and host interactive web application demos for free on Hugging Face Spaces.',
    keyFeatures: ['Open-weight LLM repository (Llama, Mistral, Gemma)', 'Free Gradio and Streamlit app hosting on Spaces', 'Python `transformers` and `diffusers` library integration', 'Open-source dataset catalog'],
  },
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    category: 'AI/ML',
    freeStatus: '100% Free',
    statusDetails: 'Generous free tier with high rate limits for experimenting with Gemini multimodal models and obtaining API keys.',
    bestFor: 'Long-Context LLM Prototyping & Generative AI APIs',
    audienceLevel: 'Beginner',
    shortDescription: 'Google’s rapid prototyping web environment for exploring and building with Gemini foundation models, featuring a massive context window for text, code, audio, and video.',
    whyStudentsShouldUse: 'Students can ingest entire textbooks, research papers, or massive codebases into the million-token context window to get code explanations, generate unit tests, and obtain free API keys.',
    keyFeatures: ['Million-token context window capacity', 'Free API keys for hackathon and side projects', 'System instructions and structured JSON output testing', 'Multimodal audio/video analysis'],
  },

  // 4. Computer Science & Foundational Curricula
  {
    id: 'cs50-harvard',
    name: 'CS50: Introduction to Computer Science (Harvard)',
    url: 'https://cs50.harvard.edu',
    category: 'Computer Science',
    freeStatus: '100% Free',
    statusDetails: 'All lectures, problem sets, virtual lab environments, and course materials are 100% free online.',
    bestFor: 'World-Class Computer Science Foundation',
    audienceLevel: 'Beginner',
    isEditorsPick: true,
    editorsNote: 'Taught by Professor David J. Malan, this is widely regarded as the highest quality introductory computer science course in the world.',
    shortDescription: 'Harvard University’s legendary entry-level CS course covering algorithmic thinking, computational problem solving, C, memory allocation, Python, SQL, and web development.',
    whyStudentsShouldUse: 'Provides a rigorous, cinematic, and inspiring foundation in how computers actually work at the memory level (pointers, heap vs stack) before moving to high-level frameworks.',
    keyFeatures: ['Cinematic lectures with interactive problem sets', 'Automated grading via `check50`', 'Online Cloud IDE (CS50 Codespaces)', 'Free certificate of completion via CS50 Portal'],
  },
  {
    id: 'ossu-cs',
    name: 'Open Source Society University (OSSU)',
    url: 'https://github.com/ossu/computer-science',
    category: 'Computer Science',
    freeStatus: '100% Free',
    statusDetails: '100% open-source curriculum curating verified free university courses.',
    bestFor: 'Tuition-Free Undergraduate CS Degree Roadmap',
    audienceLevel: 'All Levels',
    shortDescription: 'A complete, self-taught undergraduate curriculum in Computer Science curated from top universities (MIT, Harvard, UC Berkeley) into a structured 4-year equivalent guide.',
    whyStudentsShouldUse: 'College curricula often have gaps in distributed systems, operating systems, or computer architecture. OSSU provides a structured roadmap to fill those gaps with university-grade rigor.',
    keyFeatures: ['Covers Core CS, Advanced CS, and Capstone projects', 'Prerequisite tree from discrete math to compilers', 'Global Discord study groups', 'Completely free course selections'],
  },

  // 5. Mathematics & Visual Learning
  {
    id: 'wolfram-alpha',
    name: 'Wolfram Alpha',
    url: 'https://www.wolframalpha.com',
    category: 'Mathematics',
    freeStatus: 'Freemium',
    statusDetails: 'Free computational engine with instant calculations, graphs, and solutions. Pro plan unlocks step-by-step breakdowns.',
    bestFor: 'Calculus, Linear Algebra & Computational Solutions',
    audienceLevel: 'All Levels',
    shortDescription: 'A computational knowledge engine capable of solving complex mathematical equations, evaluating integrals, computing matrix eigenvalues, and visualizing 3D plots.',
    whyStudentsShouldUse: 'An essential tool for engineering and CS students to verify homework solutions, plot multi-variable calculus graphs, and solve differential equations.',
    keyFeatures: ['Natural language mathematical query input', 'Computes derivatives, integrals, limits, and ODEs', 'Interactive 2D/3D function plotting', 'Physics and chemistry constant computations'],
  },
  {
    id: '3blue1brown',
    name: '3Blue1Brown',
    url: 'https://www.3blue1brown.com',
    category: 'Mathematics',
    freeStatus: '100% Free',
    statusDetails: 'All video series, interactive lessons, and visual animations are 100% free.',
    bestFor: 'Visual Intuition of Linear Algebra & Neural Networks',
    audienceLevel: 'All Levels',
    isEditorsPick: true,
    editorsNote: 'The "Essence of Linear Algebra" and "Essence of Calculus" playlists are mandatory viewing for any student wanting genuine conceptual intuition.',
    shortDescription: 'Grant Sanderson’s masterclass in visual mathematics, using custom Python animations (Manim) to build geometric intuition for linear transformations, calculus, and neural networks.',
    whyStudentsShouldUse: 'Instead of memorizing mechanical matrix multiplication formulas, students develop a deep geometric and spatial understanding of why math theorems work.',
    keyFeatures: ['Essence of Linear Algebra series', 'Neural Networks and Deep Learning visual series', 'Interactive web simulations', 'Open-source Manim animation engine'],
  },
  {
    id: 'pauls-online-math-notes',
    name: 'Paul’s Online Math Notes',
    url: 'https://tutorial.math.lamar.edu',
    category: 'Mathematics',
    freeStatus: '100% Free',
    statusDetails: '100% free comprehensive math tutorials and downloadable PDF cheat sheets.',
    bestFor: 'College Calculus I-III & Differential Equations Cheat Sheets',
    audienceLevel: 'Beginner',
    shortDescription: 'Written by Lamar University professor Paul Dawkins, this site contains the most complete, clean tutorials and worked-out examples for college-level Calculus and Algebra.',
    whyStudentsShouldUse: 'The holy grail for cramming before university semester math exams. Contains clear step-by-step example problems with full explanations and downloadable summary cheat sheets.',
    keyFeatures: ['Complete Calculus I, II, III and Differential Equations notes', 'Comprehensive PDF cheat sheets and formula tables', 'Practice problems with togglable solutions', 'No ads or paywalls'],
  },

  // 6. English, Writing & Communication
  {
    id: 'hemingway-editor',
    name: 'Hemingway Editor',
    url: 'https://hemingwayapp.com',
    category: 'English & Writing',
    freeStatus: '100% Free',
    statusDetails: 'The web version is 100% free to use in any browser without signing up.',
    bestFor: 'Writing Clear, Concise Emails & Academic Reports',
    audienceLevel: 'All Levels',
    isEditorsPick: true,
    editorsNote: 'Highlights overly complex sentences, passive voice, and unnecessary jargon with color-coded clarity ratings.',
    shortDescription: 'A writing app that highlights wordy sentences, excessive passive voice, and convoluted phrasing to make your essays, resumes, and cold emails bold and clear.',
    whyStudentsShouldUse: 'College students often write overly complex, difficult-to-read essays and project proposals. Hemingway helps you trim fluff and communicate with crisp executive clarity.',
    keyFeatures: ['Color-coded readability diagnostics', 'Readability grade level scoring', 'Passive voice and adverb counter', 'No login or account required for web app'],
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    url: 'https://quillbot.com',
    category: 'English & Writing',
    freeStatus: 'Freemium',
    statusDetails: 'Free tier allows paraphrasing up to 125 words at a time with Standard and Fluency modes.',
    bestFor: 'Sentence Rephrasing & Tone Refinement',
    audienceLevel: 'All Levels',
    shortDescription: 'An AI-powered paraphrasing and grammar refinement tool that helps students rephrase awkward sentences, avoid repetition, and polish research summaries.',
    whyStudentsShouldUse: 'Helps non-native English speakers and students polish cover letters, professional emails, and presentation slides to sound natural and confident.',
    keyFeatures: ['Standard and Fluency paraphrasing modes', 'Built-in interactive synonym slider', 'Grammar checker and word summarizer', 'Chrome browser extension'],
  },

  // 7. Resume Building & Portfolio
  {
    id: 'reactive-resume',
    name: 'Reactive Resume',
    url: 'https://rx-resume.org',
    category: 'Resume Building',
    freeStatus: '100% Free',
    statusDetails: '100% free and open-source forever. No paywalls, no watermarks, no subscriptions.',
    bestFor: '100% Free ATS-Friendly Resumes without Watermarks',
    audienceLevel: 'All Levels',
    isEditorsPick: true,
    editorsNote: 'The ultimate anti-scam resume builder. Unlike commercial sites that lock your PDF download behind a credit card paywall, Reactive Resume is completely free and privacy-respecting.',
    shortDescription: 'A free, open-source resume builder that lets you create clean, single-page, ATS-optimized resumes with modern typography and zero paywalls.',
    whyStudentsShouldUse: 'Commercial resume builders trick students by allowing them to design a resume and then demanding $15 to download the PDF. Reactive Resume gives you complete control with free PDF/JSON exports.',
    keyFeatures: ['ATS-friendly single and two-column layouts', 'No watermarks and no hidden subscriptions', 'Export to PDF and JSON Resume standard', 'Data stored locally in your browser or self-hosted'],
  },
  {
    id: 'flowcv',
    name: 'FlowCV',
    url: 'https://flowcv.com',
    category: 'Resume Building',
    freeStatus: 'Freemium',
    statusDetails: 'One full multi-page resume and cover letter with PDF download is 100% free forever without watermarks.',
    bestFor: 'Modern Visual Resume Design & Cover Letters',
    audienceLevel: 'All Levels',
    shortDescription: 'An intuitive, modern design tool for crafting sleek, professionally formatted resumes and matching cover letters with precision font, margin, and color controls.',
    whyStudentsShouldUse: 'Provides a drag-and-drop interface with real-time typography scaling, making sure your resume looks polished and executive without manual LaTeX formatting struggles.',
    keyFeatures: ['Pixel-perfect layout customization', 'Free watermark-free PDF download for first resume', 'Pre-configured section templates', 'Matching cover letter designer'],
  },

  // 8. Interview Preparation & Placement
  {
    id: 'interviewbit',
    name: 'InterviewBit',
    url: 'https://www.interviewbit.com',
    category: 'Interview Prep',
    freeStatus: '100% Free',
    statusDetails: '100% free coding track, company-specific tracks, and flashcards.',
    bestFor: 'Timed Placement Coding Tests & Company-Wise Questions',
    audienceLevel: 'Intermediate',
    shortDescription: 'A structured placement preparation platform designed around Indian and global engineering campus hiring rounds with time-bounded tests and topic milestones.',
    whyStudentsShouldUse: 'Simulates real-world timed online assessment (OA) environments, complete with day-by-day practice streaks, system design topics, and company-specific question archives.',
    keyFeatures: ['Company-tagged archives (Google, Amazon, Microsoft, TCS, Infosys)', 'Timed coding environments to simulate exam pressure', 'System design and SQL practice modules', 'Gamified practice streaks'],
  },
  {
    id: 'tech-interview-handbook',
    name: 'Tech Interview Handbook',
    url: 'https://www.techinterviewhandbook.org',
    category: 'Interview Prep',
    freeStatus: '100% Free',
    statusDetails: '100% free open-source guide created by former Meta senior engineers.',
    bestFor: 'Behavioral Questions, Resume Review & Offer Negotiation',
    audienceLevel: 'All Levels',
    isEditorsPick: true,
    editorsNote: 'Covers everything that LeetCode ignores: how to write resume bullet points, answer behavioral questions using the STAR framework, and negotiate internships.',
    shortDescription: 'A curated, open-source guide covering the complete technical interviewing lifecycle—from algorithmic cheatsheets and resume tips to behavioral questions and offer negotiation.',
    whyStudentsShouldUse: 'Many technically strong students fail interviews due to poor communication or weak resume formatting. This guide provides actionable frameworks to master the non-coding parts of tech hiring.',
    keyFeatures: ['Blind 75 algorithm question breakdown', 'STAR method behavioral interview cheatsheet', 'Software engineer resume formatting checklist', 'Internship offer evaluation and negotiation guide'],
  },

  // 9. Free Courses & Audited University Certifications
  {
    id: 'edx',
    name: 'edX',
    url: 'https://www.edx.org',
    category: 'Certifications',
    freeStatus: 'Free to Audit',
    statusDetails: 'Free "Audit" mode allows access to all course lectures, videos, and reading materials for free. Verified certificates are paid.',
    bestFor: 'Auditing MIT, Harvard & Berkeley University Courses',
    audienceLevel: 'All Levels',
    shortDescription: 'A leading online learning platform founded by Harvard and MIT offering university-level courses across computer science, engineering, business, and humanities.',
    whyStudentsShouldUse: 'You can access identical lecture content, assignments, and reading material from world-class Ivy League and global top-10 university courses for zero dollars via the "Free Audit" option.',
    keyFeatures: ['Courses from MIT, Harvard, Berkeley, and Oxford', 'Self-paced and instructor-led options', 'Free access to complete video lectures and reading material', 'Wide range of advanced topics from Quantum Computing to Bioengineering'],
  },
  {
    id: 'coursera',
    name: 'Coursera',
    url: 'https://www.coursera.org',
    category: 'Certifications',
    freeStatus: 'Free to Audit',
    statusDetails: 'Free "Audit" option on almost all courses. Generous 100% Financial Aid available for students seeking free verified certificates.',
    bestFor: 'Industry Certificates (Google, IBM, Meta, Stanford)',
    audienceLevel: 'All Levels',
    isEditorsPick: true,
    editorsNote: 'Students can use Coursera’s simple "Financial Aid" application to get 100% free verified certificates for career certificates from Google, DeepLearning.AI, and Meta.',
    shortDescription: 'A premier educational platform partnering with 275+ leading universities and industry leaders (Stanford, Google, DeepLearning.AI, Meta) to offer world-class courses.',
    whyStudentsShouldUse: 'Enables students to learn cutting-edge topics (like Andrew Ng’s Machine Learning Specialization or Google Cyber Security) with the option of full financial aid for certificates.',
    keyFeatures: ['Audit mode for free lecture viewing', 'Financial aid program for verified certificate waivers', 'Specializations and professional certificates from top tech giants', 'Interactive programming assignments in Jupyter notebooks'],
  },

  // 10. Productivity, Notes & Student Workspace
  {
    id: 'notion',
    name: 'Notion for Education',
    url: 'https://www.notion.so/product/notion-for-education',
    category: 'Productivity',
    freeStatus: 'Free with Student ID',
    statusDetails: '100% free upgrade to the Notion Plus Plan ($120/yr value) using your valid college or school (.edu / college domain) email.',
    bestFor: 'Semester Planners, Lecture Notes & Knowledge Base',
    audienceLevel: 'All Levels',
    isEditorsPick: true,
    editorsNote: 'Sign up with your college email to unlock unlimited file uploads, version history, and collaborative workspace features completely free.',
    shortDescription: 'An all-in-one customizable workspace for note-taking, project management, course databases, syllabus tracking, and personal wiki organization.',
    whyStudentsShouldUse: 'Replaces scattered notebooks and Google Docs with a centralized dashboard where you can link syllabus databases, lecture summaries, assignment deadlines, and project roadmaps.',
    keyFeatures: ['Free Notion Plus Plan for verified students', 'Unlimited file uploads and page history', 'Rich databases with Kanban, Calendar, and Table views', 'Pre-built student and syllabus templates'],
  },

  // 11. Research Papers & Academic Literature
  {
    id: 'google-scholar',
    name: 'Google Scholar',
    url: 'https://scholar.google.com',
    category: 'Research Papers',
    freeStatus: '100% Free',
    statusDetails: '100% free search engine for academic papers, theses, citations, and patents.',
    bestFor: 'Finding Peer-Reviewed Academic Literature & Citations',
    audienceLevel: 'All Levels',
    shortDescription: 'A freely accessible web search engine that indexes the full text or metadata of scholarly literature across all publishing formats and scientific disciplines.',
    whyStudentsShouldUse: 'The essential starting point for college literature reviews, B.Tech/M.Tech capstone project research, and generating one-click APA/BibTeX bibliography citations.',
    keyFeatures: ['Indexes peer-reviewed journals, conference proceedings, and patents', 'One-click citation generator (APA, MLA, Harvard, BibTeX)', 'Author citation and h-index metrics tracking', 'Direct links to free open-access PDF preprints'],
  },
  {
    id: 'arxiv',
    name: 'arXiv.org (Cornell University)',
    url: 'https://arxiv.org',
    category: 'Research Papers',
    freeStatus: '100% Free',
    statusDetails: '100% free, open-access preprint archive funded by Cornell University and the NSF.',
    bestFor: 'Cutting-Edge AI, Computer Science & Physics Preprints',
    audienceLevel: 'Intermediate',
    shortDescription: 'A free distribution service and open-access archive for nearly 2.4 million scholarly articles in computer science, mathematics, physics, and quantitative biology.',
    whyStudentsShouldUse: 'Major breakthroughs in AI (like Transformer papers, diffusion models, and LLMs) appear on arXiv months before formal journal publication. Allows students to stay ahead of the curve.',
    keyFeatures: ['100% open-access PDFs with zero paywalls', 'Daily email digests for specific CS/AI subject subcategories', 'Direct source code LaTeX and figure downloads', 'Global repository standard for modern AI research'],
  },

  // 12. Student Perks & Internships
  {
    id: 'github-student-pack',
    name: 'GitHub Student Developer Pack',
    url: 'https://education.github.com/pack',
    category: 'Student Packs & Perks',
    freeStatus: 'Free with Student ID',
    statusDetails: '100% free bundle worth over $200,000 in free tools for actively enrolled students.',
    bestFor: 'Free GitHub Copilot, Cloud Credits, Domain Names & Dev Tools',
    audienceLevel: 'All Levels',
    isEditorsPick: true,
    editorsNote: 'The single most valuable perk available to any student. Unlocks free GitHub Copilot, JetBrains IDE licenses, free .me domains, and cloud server credits.',
    shortDescription: 'A massive bundle of free developer tools, cloud hosting credits, domain names, and software licenses curated by GitHub for verified college students.',
    whyStudentsShouldUse: 'Gives you free access to professional developer tools that would otherwise cost thousands of dollars, allowing you to build and host production projects on a student budget.',
    keyFeatures: ['Free GitHub Pro and GitHub Copilot access', 'Free Namecheap / Name.com domain name & SSL certificates', '$100–$200 in free cloud credits on DigitalOcean and Azure', 'Free JetBrains All Products pack (IntelliJ, PyCharm, WebStorm)'],
  },
  {
    id: 'wellfound',
    name: 'Wellfound (formerly AngelList Talent)',
    url: 'https://wellfound.com',
    category: 'Internships & Careers',
    freeStatus: '100% Free',
    statusDetails: '100% free for job seekers and students looking for internships and entry-level roles.',
    bestFor: 'Direct Founder Access & Startup Tech Internships',
    audienceLevel: 'All Levels',
    shortDescription: 'The premier global platform for discovering startup internships and engineering roles with transparent salary ranges, equity data, and direct applications to hiring founders.',
    whyStudentsShouldUse: 'Unlike traditional job portals where resumes disappear into automated black holes, Wellfound lets students connect directly with startup CTOs and engineering leads.',
    keyFeatures: ['Transparent salary, stipend, and remote policies', 'Direct messaging with startup founders and recruiters', 'One-click application profile', 'Specialized filter for entry-level and student internships'],
  },
];

export const EDITORIAL_FAQS: WebsiteFaq[] = [
  {
    question: 'Are all 25 websites on this list genuinely free for students?',
    answer:
      'Yes. Every platform listed has been manually tested and categorized. We clearly distinguish between 100% completely free platforms (like freeCodeCamp, Reactive Resume, CS50, and 3Blue1Brown), platforms with rich free audit options (like Coursera and edX), and tools that grant free premium upgrades with a valid student ID (like GitHub Student Pack and Notion for Education). We never list tools with surprise credit card paywalls.',
  },
  {
    question: 'How do I unlock free student perks on tools like Notion and GitHub?',
    answer:
      'To unlock verified student perks, you simply need to register or verify your account using your college-provided email address (e.g., yourname@college.edu or institutional domain) or upload a photo of your valid student ID card / college enrollment receipt.',
  },
  {
    question: 'Which website should I start with for coding from scratch?',
    answer:
      'If you are an absolute beginner, we recommend starting with CS50 (for computational thinking), freeCodeCamp (for interactive web development), and NeetCode.io (for structured coding interview patterns).',
  },
  {
    question: 'Why should I avoid commercial resume builders that advertise as "free"?',
    answer:
      'Many commercial resume builders allow you to spend an hour designing a resume, only to require a paid subscription or credit card when you click "Download PDF". We recommend Reactive Resume (100% open-source, no watermarks) and FlowCV to avoid these paywalls.',
  },
];
