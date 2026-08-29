export interface GitHubRepoItem {
  id: string;
  rank: number;
  name: string;
  repoOwner: string;
  repoName: string;
  githubUrl: string;
  domain: string;
  domainCategory: 'DSA' | 'Web Development' | 'System Design' | 'Machine Learning' | 'AI' | 'DevOps' | 'Open Source' | 'CS Fundamentals';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Intermediate' | 'Intermediate to Advanced' | 'Beginner to Advanced';
  targetAudience: 'Beginner' | 'Intermediate' | 'Advanced';
  isStartHere?: boolean;
  startHereReason?: string;
  shortDescription: string;
  whyStudentsShouldKnow: string;
  keyTopics: string[];
}

export interface RelatedResourceCard {
  title: string;
  slug: string;
  category: string;
  description: string;
  badgeText: string;
  items: {
    name: string;
    description: string;
    url: string;
    badge: string;
  }[];
}

export const GITHUB_REPOSITORIES_LIST: GitHubRepoItem[] = [
  {
    id: 'ossu-computer-science',
    rank: 1,
    name: 'ossu / computer-science',
    repoOwner: 'ossu',
    repoName: 'computer-science',
    githubUrl: 'https://github.com/ossu/computer-science',
    domain: 'Computer Science Fundamentals',
    domainCategory: 'CS Fundamentals',
    difficulty: 'Beginner to Advanced',
    targetAudience: 'Beginner',
    isStartHere: true,
    startHereReason: 'The gold standard foundation. If you are wondering where to begin your CS journey or need to fill gaps in theory, start with OSSU.',
    shortDescription: 'Path to a free, self-taught undergraduate education in Computer Science. It curates world-class courses from institutions like MIT, Harvard, and UC Berkeley into a structured degree curriculum.',
    whyStudentsShouldKnow: 'Traditional college curricula often leave gaps in distributed systems, operating systems, or computer architecture. OSSU provides a structured, verified, tuition-free roadmap that equips you with university-grade theoretical mastery.',
    keyTopics: ['Core CS', 'Discrete Math', 'Operating Systems', 'Compilers', 'Data Structures', 'Computer Architecture'],
  },
  {
    id: 'the-algorithms-python',
    rank: 2,
    name: 'TheAlgorithms / Python',
    repoOwner: 'TheAlgorithms',
    repoName: 'Python',
    githubUrl: 'https://github.com/TheAlgorithms/Python',
    domain: 'Data Structures & Algorithms (DSA)',
    domainCategory: 'DSA',
    difficulty: 'Beginner to Intermediate',
    targetAudience: 'Beginner',
    shortDescription: 'All Algorithms implemented in Python for educational purposes. It hosts reference code for hundreds of classic computer science algorithms, from sorting and dynamic programming to complex graph theory.',
    whyStudentsShouldKnow: 'Reading idiomatic, well-commented implementations of standard algorithms helps bridge the gap between abstract textbook pseudocode and real-world implementation. It is an indispensable companion for coding interviews.',
    keyTopics: ['Sorting & Searching', 'Dynamic Programming', 'Graph Theory', 'Backtracking', 'Tree Traversals', 'Bit Manipulation'],
  },
  {
    id: 'developer-roadmap',
    rank: 3,
    name: 'kamranahmedse / developer-roadmap',
    repoOwner: 'kamranahmedse',
    repoName: 'developer-roadmap',
    githubUrl: 'https://github.com/kamranahmedse/developer-roadmap',
    domain: 'Web Development & Career Pathways',
    domainCategory: 'Web Development',
    difficulty: 'Beginner to Intermediate',
    targetAudience: 'Beginner',
    shortDescription: 'Interactive roadmaps, guides, and learning paths for Frontend, Backend, DevOps, Full-Stack, and AI engineers. It prevents tutorial hell by visually organizing modern technology stacks.',
    whyStudentsShouldKnow: 'The web ecosystem moves fast and can easily overwhelm students with framework fatigue. This repository outlines exact prerequisites and step-by-step milestones to focus on what industry actually hires for.',
    keyTopics: ['Frontend Roadmap', 'Backend APIs', 'React / Node.js', 'DevOps Pipelines', 'System Architecture', 'Career Roadmaps'],
  },
  {
    id: 'system-design-primer',
    rank: 4,
    name: 'donnemartin / system-design-primer',
    repoOwner: 'donnemartin',
    repoName: 'system-design-primer',
    githubUrl: 'https://github.com/donnemartin/system-design-primer',
    domain: 'System Design & Scalability',
    domainCategory: 'System Design',
    difficulty: 'Intermediate to Advanced',
    targetAudience: 'Intermediate',
    shortDescription: 'An organized collection of resources and visual diagrams teaching you how to build large-scale, high-concurrency systems. It includes step-by-step interview problem breakdowns and Anki flashcards.',
    whyStudentsShouldKnow: 'Junior engineers often only know how to build apps for single users on localhost. This repository teaches you how to think like a staff engineer—covering horizontal scaling, caching strategies, load balancers, and CAP theorem trade-offs.',
    keyTopics: ['Scalability', 'Microservices', 'Load Balancing', 'Database Sharding', 'Caching (Redis/Memcached)', 'Message Queues'],
  },
  {
    id: 'build-your-own-x',
    rank: 5,
    name: 'codecrafters-io / build-your-own-x',
    repoOwner: 'codecrafters-io',
    repoName: 'build-your-own-x',
    githubUrl: 'https://github.com/codecrafters-io/build-your-own-x',
    domain: 'CS Engineering & Deep Mastery',
    domainCategory: 'CS Fundamentals',
    difficulty: 'Intermediate to Advanced',
    targetAudience: 'Intermediate',
    shortDescription: 'Master programming by recreating your favorite technologies from scratch. Contains curated tutorials for building your own Git, Docker, Redis, Operating System, Database, Programming Language, and Web Server.',
    whyStudentsShouldKnow: 'Nothing proves engineering depth on a resume like building a database engine or a mini-Git version control tool from first principles. It turns you from an API consumer into a true systems architect.',
    keyTopics: ['Build Git', 'Build Docker', 'Build Redis', 'Build a Compiler', 'Build a Database Engine', 'Build a Web Server'],
  },
  {
    id: 'free-for-dev',
    rank: 6,
    name: 'ripienaar / free-for-dev',
    repoOwner: 'ripienaar',
    repoName: 'free-for-dev',
    githubUrl: 'https://github.com/ripienaar/free-for-dev',
    domain: 'DevOps, Cloud & Infrastructure',
    domainCategory: 'DevOps',
    difficulty: 'Beginner to Advanced',
    targetAudience: 'Beginner',
    shortDescription: 'A comprehensive list of SaaS, PaaS, IaaS, and API services that have free tiers for developers. It empowers students and indie developers to build and host production projects without burning money.',
    whyStudentsShouldKnow: 'Students frequently struggle to deploy personal portfolio projects due to cloud billing fears. This repository unlocks free hosting, free PostgreSQL/MongoDB tiers, free authentication, CI/CD runners, and monitoring.',
    keyTopics: ['Free Cloud Hosting', 'Free Databases', 'CI/CD Runners', 'API Gateways', 'Log Monitoring', 'Domain & SSL'],
  },
  {
    id: 'ml-for-beginners',
    rank: 7,
    name: 'microsoft / ML-For-Beginners',
    repoOwner: 'microsoft',
    repoName: 'ML-For-Beginners',
    githubUrl: 'https://github.com/microsoft/ML-For-Beginners',
    domain: 'Machine Learning',
    domainCategory: 'Machine Learning',
    difficulty: 'Beginner',
    targetAudience: 'Beginner',
    shortDescription: 'A 12-week, 24-lesson curriculum on Machine Learning created by Microsoft engineers. It uses hands-on Scikit-learn code, project-based assignments, and visual sketchnotes to demystify complex algorithms.',
    whyStudentsShouldKnow: 'Many ML courses get bogged down in heavy mathematical proofs before students ever train a model. Microsoft’s curriculum is pragmatic, code-first, and emphasizes applied predictive modeling on real-world datasets.',
    keyTopics: ['Regression', 'Classification', 'Clustering', 'Natural Language Processing', 'Time Series Forecasting', 'Scikit-Learn'],
  },
  {
    id: 'generative-ai-for-beginners',
    rank: 8,
    name: 'microsoft / generative-ai-for-beginners',
    repoOwner: 'microsoft',
    repoName: 'generative-ai-for-beginners',
    githubUrl: 'https://github.com/microsoft/generative-ai-for-beginners',
    domain: 'Artificial Intelligence & LLMs',
    domainCategory: 'AI',
    difficulty: 'Beginner to Intermediate',
    targetAudience: 'Intermediate',
    shortDescription: 'A 21-lesson comprehensive course teaching developers how to build Generative AI applications. Covers LLMs, prompt engineering, Retrieval Augmented Generation (RAG), embeddings, and autonomous AI agents.',
    whyStudentsShouldKnow: 'Modern software engineering increasingly requires integrating LLMs and vector embeddings into production apps. This course provides direct hands-on blueprints for architecting AI-powered solutions.',
    keyTopics: ['Large Language Models', 'Prompt Engineering', 'RAG Architectures', 'Vector Databases', 'AI Agents', 'Fine-Tuning'],
  },
  {
    id: 'first-contributions',
    rank: 9,
    name: 'firstcontributions / first-contributions',
    repoOwner: 'firstcontributions',
    repoName: 'first-contributions',
    githubUrl: 'https://github.com/firstcontributions/first-contributions',
    domain: 'Open Source',
    domainCategory: 'Open Source',
    difficulty: 'Beginner',
    targetAudience: 'Beginner',
    isStartHere: true,
    startHereReason: 'The absolute easiest way to make your first GitHub Pull Request without fear of breaking anything. Do this on day one!',
    shortDescription: 'Hands-on guide and sandbox repository designed to help beginners make their very first open-source contribution in less than 5 minutes. Available in dozens of languages.',
    whyStudentsShouldKnow: 'Open-source contributions look stellar on student resumes, but the fear of making a mistake in public keeps many students from starting. This repo provides a friendly sandbox to master the Git PR workflow.',
    keyTopics: ['Git Branching', 'Forking Repositories', 'Submitting Pull Requests', 'Git CLI Commands', 'Open Source Etiquette'],
  },
  {
    id: 'coding-interview-university',
    rank: 10,
    name: 'jwasham / coding-interview-university',
    repoOwner: 'jwasham',
    repoName: 'coding-interview-university',
    githubUrl: 'https://github.com/jwasham/coding-interview-university',
    domain: 'DSA & Tech Interview Prep',
    domainCategory: 'DSA',
    difficulty: 'Intermediate to Advanced',
    targetAudience: 'Intermediate',
    shortDescription: 'A complete multi-month study plan to become a software engineer for top tech companies like Google, Amazon, and Meta. Created by an engineer who used it to land a Software Development Engineer role at Amazon.',
    whyStudentsShouldKnow: 'Provides an exhaustive study checklist covering data structures, algorithmic complexity, bitwise tricks, system design basics, and behavioral questions with curated free video and book references.',
    keyTopics: ['Interview Roadmaps', 'Big-O Analysis', 'Bit Manipulation', 'Dynamic Programming', 'Graph Theory', 'Mock Interview Prep'],
  },
];

export const RELATED_RESOURCES_LIST: RelatedResourceCard[] = [
  {
    title: 'Best Free Coding Resources for CS Students',
    slug: 'best-free-coding-resources',
    category: 'Free Learning Platforms',
    description: 'Comprehensive, interactive platforms to learn full-stack development, algorithms, and systems without paying for bootcamps.',
    badgeText: 'Curated 2026',
    items: [
      {
        name: 'freeCodeCamp',
        description: 'Interactive coding certifications covering responsive web design, JavaScript algorithms, backend APIs, and machine learning.',
        url: 'https://www.freecodecamp.org',
        badge: 'Web & Certifications',
      },
      {
        name: 'CS50: Introduction to Computer Science (Harvard)',
        description: 'Universally acclaimed entry point into computer science covering C, memory management, algorithms, Python, SQL, and Flask.',
        url: 'https://pll.harvard.edu/course/cs50-introduction-computer-science',
        badge: 'Harvard University',
      },
      {
        name: 'The Odin Project',
        description: 'Full-stack open-source curriculum focusing heavily on building portfolio-grade Ruby on Rails and Node/React projects.',
        url: 'https://www.theodinproject.com',
        badge: 'Full Stack',
      },
      {
        name: 'Full Stack Open (University of Helsinki)',
        description: 'Modern web development with React, Redux, Node.js, Express, MongoDB, GraphQL, TypeScript, and CI/CD containers.',
        url: 'https://fullstackopen.com/en/',
        badge: 'Advanced Web',
      },
    ],
  },
  {
    title: 'Best Websites for DSA & Coding Practice',
    slug: 'best-websites-dsa-practice',
    category: 'Interview & Competitive Coding',
    description: 'The premier problem-solving platforms to sharpen algorithmic intuition, practice time complexity, and ace technical coding interviews.',
    badgeText: 'Top Practice Hubs',
    items: [
      {
        name: 'LeetCode',
        description: 'The industry benchmark for technical interview questions with company tags, topic filters, and weekly contests.',
        url: 'https://leetcode.com',
        badge: 'Interview Standard',
      },
      {
        name: 'NeetCode.io',
        description: 'Structured roadmaps (NeetCode 150 & All Patterns) with high-clarity video explanations for key algorithmic patterns.',
        url: 'https://neetcode.io',
        badge: 'Pattern Mastery',
      },
      {
        name: 'CodeChef & Codeforces',
        description: 'Fast-paced algorithmic contests that train mathematical problem-solving, edge case handling, and optimal speed.',
        url: 'https://codeforces.com',
        badge: 'Competitive Coding',
      },
      {
        name: 'GeeksforGeeks',
        description: 'Vast repository of articles, data structure tutorials, company interview experiences, and practice questions.',
        url: 'https://www.geeksforgeeks.org',
        badge: 'Reference & Theory',
      },
    ],
  },
  {
    title: 'Best AI & Productivity Tools for Students',
    slug: 'best-ai-tools-for-students',
    category: 'Modern Engineering Workflows',
    description: 'Cutting-edge developer tools and AI assistants to accelerate debugging, understand legacy codebases, and supercharge research.',
    badgeText: 'AI Productivity',
    items: [
      {
        name: 'GitHub Student Developer Pack & Copilot',
        description: 'Free access to GitHub Copilot, cloud credits, domain names, and developer tools for verified college students.',
        url: 'https://education.github.com/pack',
        badge: 'Free for Students',
      },
      {
        name: 'Cursor IDE',
        description: 'AI-first code editor with integrated codebase indexing, multi-file edits, and inline code explanation capabilities.',
        url: 'https://www.cursor.com',
        badge: 'AI Code Editor',
      },
      {
        name: 'Phind & Perplexity AI',
        description: 'Search engines tuned for developers providing grounded technical answers with direct documentation citations.',
        url: 'https://www.phind.com',
        badge: 'Technical Search',
      },
      {
        name: 'Google AI Studio & Gemini',
        description: 'Multimodal foundation models with massive context windows to ingest complete codebases, textbooks, and documentation.',
        url: 'https://aistudio.google.com',
        badge: 'Long Context AI',
      },
    ],
  },
];
