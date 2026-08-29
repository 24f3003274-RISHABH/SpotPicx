export type AiToolCategory =
  | 'Studying'
  | 'Coding'
  | 'Research'
  | 'Writing'
  | 'Presentations'
  | 'Note taking'
  | 'Productivity'
  | 'Resume/Career'
  | 'Design'
  | 'Data Analysis';

export type AiPricingModel = '100% Free' | 'Freemium' | 'Free with Student Discount' | 'Paid (Free Trial)';
export type AiProficiencyLevel = 'Beginner Friendly' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface AiTool {
  id: string;
  name: string;
  url: string;
  pricingUrl?: string;
  category: AiToolCategory;
  tagline: string;
  whatItDoes: string;
  bestUseCase: string;
  pricingModel: AiPricingModel;
  pricingNote: string;
  beginnerFriendliness: AiProficiencyLevel;
  practicalStudentUseCases: string[];
  limitations: string[];
  isRecommended?: boolean;
  spotlightBadge?: 'Best for Studying' | 'Best for Coding' | 'Best for Research' | 'Best for Presentations' | 'Best for Writing' | 'Best for Resume' | 'Best for Data Analysis' | 'Best for Note Taking';
  tags: string[];
}

export interface AiBestForSpotlight {
  award: string;
  toolName: string;
  toolId: string;
  category: string;
  reason: string;
  badgeColor: string;
}

export interface AiToolFaq {
  question: string;
  answer: string;
}

export const LAST_VERIFIED_DATE = 'August 2026';

export const AI_TOOLS_LIST: AiTool[] = [
  // 1. Studying & Document Grounding
  {
    id: 'notebooklm',
    name: 'Google NotebookLM',
    url: 'https://notebooklm.google.com',
    pricingUrl: 'https://notebooklm.google.com',
    category: 'Studying',
    tagline: 'Your personalized, source-grounded AI research assistant & Audio Overviews generator',
    whatItDoes:
      'Uploads your course PDFs, lecture slides, YouTube video transcripts, and Google Docs to create a private AI tutor grounded strictly in your uploaded materials with exact citation footnotes.',
    bestUseCase:
      'Synthesizing messy 200-page semester textbooks into interactive Q&A notes and converting course slides into conversational 2-person podcast study overviews.',
    pricingModel: '100% Free',
    pricingNote: 'Free to use with any standard Google account. (Pricing & feature limits may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Upload 4 PDF lecture slide decks before midterm exams to generate instant self-quizzes and key term study guides.',
      'Generate interactive 15-minute "Audio Overviews" (AI podcast discussions) to review complex biology or law concepts while walking or commuting.',
      'Ask complex conceptual questions and click citation markers to jump to the exact paragraph in your syllabus or reading list.',
    ],
    limitations: [
      'Only answers questions based on uploaded sources (cannot browse the live internet for external citations beyond provided documents).',
      'Upload size limits apply per source document (up to 500k words or 200MB per file).',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Studying',
    tags: ['Google', 'Source Grounded', 'Podcast Audio', 'PDF Summaries', 'Study Guide', 'Free'],
  },

  // 2. Research & Academic Literature
  {
    id: 'consensus',
    name: 'Consensus',
    url: 'https://consensus.app',
    pricingUrl: 'https://consensus.app/pricing',
    category: 'Research',
    tagline: 'AI search engine for peer-reviewed academic scientific papers',
    whatItDoes:
      'Searches over 200 million peer-reviewed scientific papers and uses AI to extract evidence-based findings, synthesize scientific consensus meters, and generate APA/BibTeX citations.',
    bestUseCase:
      'Finding real scientific paper citations for academic literature reviews and evaluating whether scientific consensus supports a thesis hypothesis.',
    pricingModel: 'Freemium',
    pricingNote: 'Generous free tier with unlimited basic searches and monthly AI synthesis credits; paid plan available for unlimited deep summaries. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Ask direct questions like "Does caffeine improve short-term cognitive memory?" to see a consensus meter (% of studies showing positive vs. negative effects).',
      'Export formatted citations in APA, MLA, Chicago, or BibTeX formats directly into your research paper bibliography.',
      'Filter papers strictly by study type (e.g., Randomized Controlled Trials, Systematic Reviews, Meta-Analyses).',
    ],
    limitations: [
      'Advanced synthesis credits are capped on the free tier.',
      'Only covers academic and scientific papers; not suitable for general non-scholarly news or casual queries.',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Research',
    tags: ['Academic Papers', 'Peer Reviewed', 'Consensus Meter', 'Literature Review', 'Citations'],
  },
  {
    id: 'elicit',
    name: 'Elicit',
    url: 'https://elicit.com',
    pricingUrl: 'https://elicit.com/pricing',
    category: 'Research',
    tagline: 'The AI research assistant for systematic literature reviews and data extraction',
    whatItDoes:
      'Automates academic literature reviews by searching semantic scholarship databases, extracting structured data columns (sample size, methodology, key findings), and summarizing research papers.',
    bestUseCase:
      'Building systematic comparison tables of 20+ research papers for thesis chapters and university capstone research projects.',
    pricingModel: 'Freemium',
    pricingNote: 'Free trial credits provided upon signup; subscription required for continuous high-volume extraction. (Pricing may change)',
    beginnerFriendliness: 'Intermediate',
    practicalStudentUseCases: [
      'Enter your thesis research question to instantly get a structured summary matrix comparing 10 related papers.',
      'Extract custom data attributes (e.g. "What dataset was used?" or "What was the statistical p-value?") across multiple PDF papers simultaneously.',
      'Find foundational papers in unfamiliar academic subdisciplines without knowing the exact jargon keywords.',
    ],
    limitations: [
      'Credit consumption model means high-volume research requires budget planning or institutional access.',
      'Requires basic familiarity with research methodologies to interpret extracted study attributes accurately.',
    ],
    tags: ['Systematic Review', 'Data Extraction', 'Research Matrix', 'Thesis', 'Academic'],
  },

  // 3. Coding & Software Development
  {
    id: 'cursor-ai',
    name: 'Cursor',
    url: 'https://www.cursor.com',
    pricingUrl: 'https://www.cursor.com/pricing',
    category: 'Coding',
    tagline: 'The AI-first code editor built as a high-velocity fork of VS Code',
    whatItDoes:
      'An intelligent fork of Visual Studio Code that indexes your entire codebase, predicts multi-line edits, and allows multi-file refactoring using Claude 3.5 Sonnet and GPT-4o.',
    bestUseCase:
      'Rapidly building full-stack college project prototypes, diagnosing terminal runtime errors across multiple files, and understanding complex open-source repos.',
    pricingModel: 'Freemium',
    pricingNote: 'Free hobby tier includes generous daily fast completions and monthly premium requests. (Pricing may change)',
    beginnerFriendliness: 'Intermediate',
    practicalStudentUseCases: [
      'Press Cmd/Ctrl + K in any file to generate boilerplate APIs, React hooks, or SQL queries with instant diff review.',
      'Use @Files or @Docs in the chat panel to ask Cursor how your frontend state connects with backend routes across 15 different files.',
      'Paste cryptic terminal compile errors directly into the composer to get instant automated patches across all affected files.',
    ],
    limitations: [
      'Can make students reliant on auto-generated code if used without understanding the underlying syntax and data structures.',
      'Advanced agent composer features consume monthly fast-request allowances on the free plan.',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Coding',
    tags: ['Code Editor', 'VS Code Fork', 'Full Codebase Indexing', 'Multi-File Edit', 'Claude 3.5'],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    pricingUrl: 'https://github.com/pricing',
    category: 'Coding',
    tagline: 'AI pair programmer integrated into your favorite IDE',
    whatItDoes:
      'Suggests entire functions and real-time code completions as you type in VS Code, JetBrains IDEs, and Neovim, with built-in chat for debugging and unit testing.',
    bestUseCase:
      'Writing repetitive algorithmic boilerplate, unit tests, and inline docstrings during college programming lab assignments.',
    pricingModel: 'Free with Student Discount',
    pricingNote: '100% Free for verified students via the GitHub Student Developer Pack ($10/mo value). (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Write a comment like `// Function to perform binary search on sorted array` and let Copilot autocomplete the implementation.',
      'Highlight a buggy function and select "Explain This Code" or "Generate Unit Tests" inside VS Code.',
      'Use Copilot in GitHub CLI in the terminal to suggest shell commands and git rebasing flags.',
    ],
    limitations: [
      'Requires verifying student status via official university email/ID on the GitHub Education portal.',
      'Context window is primarily localized around the active open tab rather than deep multi-repo architecture.',
    ],
    tags: ['GitHub', 'Free with Student Pack', 'Autocomplete', 'Unit Tests', 'VS Code Plugin'],
  },
  {
    id: 'phind',
    name: 'Phind',
    url: 'https://www.phind.com',
    pricingUrl: 'https://www.phind.com/pricing',
    category: 'Coding',
    tagline: 'AI search engine optimized specifically for developers and technical documentation',
    whatItDoes:
      'Combines web search with generative code synthesis to provide verified answers to complex developer questions with direct links to official API documentation and GitHub threads.',
    bestUseCase:
      'Debugging obscure framework errors and finding up-to-date documentation for newly released programming libraries.',
    pricingModel: 'Freemium',
    pricingNote: 'Free tier with daily high-speed search queries; optional subscription for advanced models. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Search modern framework syntax (e.g. Next.js 15 App Router server actions) to get tested code snippets with official docs citations.',
      'Troubleshoot Docker configuration and package version mismatch errors in 1 click.',
      'Compare library alternatives (e.g. Tailwind vs. CSS Modules vs. Styled Components) with technical benchmark pros and cons.',
    ],
    limitations: [
      'Specialized purely for software engineering; not suitable for non-technical subjects.',
      'Requires reading generated code carefully to verify compatibility with your exact compiler version.',
    ],
    tags: ['Developer Search', 'Technical Docs', 'Frameworks', 'Instant Debugging', 'Free'],
  },

  // 4. Writing & Academic Communication
  {
    id: 'claude-ai',
    name: 'Anthropic Claude',
    url: 'https://claude.ai',
    pricingUrl: 'https://claude.ai/pricing',
    category: 'Writing',
    tagline: 'State-of-the-art conversational AI with nuanced writing, reasoning, and Artifacts preview',
    whatItDoes:
      'A leading frontier model renowned for natural, articulate prose, nuanced academic writing feedback, and interactive interactive "Artifacts" that render live code, charts, and SVGs.',
    bestUseCase:
      'Drafting nuanced essay outlines, refining sentence structure, proofreading lab reports, and building interactive web visualizers in Artifacts.',
    pricingModel: 'Freemium',
    pricingNote: 'Free tier with daily rate limits on Sonnet/Haiku models; Claude Pro tier available for high-volume usage. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Paste your draft essay and ask Claude to critique tone, logical flow, and identify weak argumentative transitions.',
      'Use Claude Artifacts to generate interactive React dashboards, flowcharts, and SVG diagrams for engineering and economics reports.',
      'Summarize long research PDFs (up to 200k tokens) into clear, bulleted executive takeaways.',
    ],
    limitations: [
      'Free tier imposes message limits during peak hours.',
      'Does not have a built-in search consensus engine like specialized academic search tools.',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Writing',
    tags: ['Anthropic', 'Artifacts', 'Natural Prose', 'Essay Outlining', 'Reasoning', 'Large Context'],
  },
  {
    id: 'chatgpt',
    name: 'OpenAI ChatGPT',
    url: 'https://chatgpt.com',
    pricingUrl: 'https://openai.com/chatgpt/pricing',
    category: 'Writing',
    tagline: 'Versatile conversational AI for brainstorming, custom GPTs, and multimodal reasoning',
    whatItDoes:
      'Provides versatile multimodal AI capabilities including real-time web browsing, Python code interpreter, image generation via DALL-E, voice mode, and Custom GPTs.',
    bestUseCase:
      'General academic brainstorming, explaining complex lecture concepts like a patient tutor, and analyzing data spreadsheets via Advanced Data Analysis.',
    pricingModel: 'Freemium',
    pricingNote: 'Free tier includes access to GPT-4o with rate limits, browsing, and custom GPTs; ChatGPT Plus ($20/mo) unlocks unlimited high-speed access. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Prompt: "Explain Fourier Transforms like I am a 2nd-year physics undergraduate using an intuitive musical instrument analogy."',
      'Upload a smartphone photo of a whiteboard math equation or circuit diagram for step-by-step mathematical breakdown.',
      'Practice mock behavioral job interviews using ChatGPT Voice Mode on your mobile phone.',
    ],
    limitations: [
      'May produce plausible-sounding hallucinations on niche citations; always verify source references.',
      'Free tier switches to standard mini models once daily GPT-4o quotas are reached.',
    ],
    tags: ['OpenAI', 'GPT-4o', 'Multimodal', 'Voice Mode', 'General Tutor', 'Brainstorming'],
  },
  {
    id: 'quillbot',
    name: 'QuillBot',
    url: 'https://quillbot.com',
    pricingUrl: 'https://quillbot.com/pricing',
    category: 'Writing',
    tagline: 'AI paraphrasing, grammar checker, and citation generator',
    whatItDoes:
      'Specialized writing tool that rewires awkward sentences, checks grammar in real time, summarizes text, and generates standardized academic citations.',
    bestUseCase:
      'Polishing English clarity for non-native speakers, rephrasing clunky sentences, and fixing grammatical punctuation in essays and applications.',
    pricingModel: 'Freemium',
    pricingNote: 'Free mode includes standard paraphrasing (up to 125 words per batch) and basic grammar checking; Premium unlocks unlimited words and tone modes. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Paste draft sentences to see multiple tone variations (Formal, Simple, Creative, Shorten) to enhance vocabulary.',
      'Generate instant bibliography citations for web pages, books, and journal articles in APA, MLA, and Harvard formats.',
      'Check grammar and punctuation before submitting college assignments or scholarship statements.',
    ],
    limitations: [
      'Free word limit per paraphrase is restricted to 125 words.',
      'Must be used ethically to rephrase your own original thoughts rather than masking plagiarized content.',
    ],
    tags: ['Paraphrasing', 'Grammar Check', 'Citation Generator', 'Vocabulary', 'Free Tier'],
  },

  // 5. Presentations & Visual Pitching
  {
    id: 'gamma-app',
    name: 'Gamma',
    url: 'https://gamma.app',
    pricingUrl: 'https://gamma.app/pricing',
    category: 'Presentations',
    tagline: 'Generate beautiful presentation slides, documents, and webpages from text prompts',
    whatItDoes:
      'Creates professional presentation decks, interactive documents, and web pages in seconds using AI prompt generation with rich typography, layouts, cards, and embeds.',
    bestUseCase:
      'Generating high-polish presentation slide decks for college group projects, startup pitch competitions, and seminar presentations in minutes.',
    pricingModel: 'Freemium',
    pricingNote: 'Includes 400 free AI generation credits upon signup; earn more credits through referrals or upgrade to Plus/Pro. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Paste a 3-page research summary or project document and have Gamma convert it into a structured 10-slide presentation deck with one click.',
      'Export decks directly to PowerPoint (.pptx) or PDF formats for classroom projectors.',
      'Embed interactive polls, live web links, and YouTube videos directly inside presentation slides.',
    ],
    limitations: [
      'Consumes 40 credits per generated presentation on the free plan.',
      'Custom fine-grained brand themes require premium tiers, though default themes are high quality.',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Presentations',
    tags: ['Presentations', 'Slide Decks', 'Export to PPTX', 'Pitch Deck', 'Group Projects'],
  },

  // 6. Note Taking & Meeting Summaries
  {
    id: 'otter-ai',
    name: 'Otter.ai',
    url: 'https://otter.ai',
    pricingUrl: 'https://otter.ai/pricing',
    category: 'Note taking',
    tagline: 'AI meeting assistant that records, transcribes, and summarizes spoken audio in real time',
    whatItDoes:
      'Transcribes live college lectures, Zoom webinars, and group study discussions with speaker identification, automated timestamped summaries, and action item extraction.',
    bestUseCase:
      'Capturing verbatim lecture transcripts when professors speak quickly and generating automated study notes from group project meetings.',
    pricingModel: 'Freemium',
    pricingNote: 'Free Basic plan includes 300 monthly transcription minutes (30 minutes per conversation). (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Record classroom lectures on your phone with live real-time transcription and synchronized audio playback.',
      'Use Otter AI Chat during or after lectures to ask "What homework deadlines did the professor mention?"',
      'Share timestamped collaborative transcripts with your college study group.',
    ],
    limitations: [
      '30-minute recording limit per session on the free tier requires restarting for longer 90-minute lectures.',
      'Accuracy depends on microphone quality and classroom ambient background noise.',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Note Taking',
    tags: ['Lecture Transcription', 'Audio to Text', 'Action Items', 'Zoom Integration', 'Study Notes'],
  },
  {
    id: 'audiopen',
    name: 'AudioPen',
    url: 'https://audiopen.ai',
    pricingUrl: 'https://audiopen.ai/pricing',
    category: 'Note taking',
    tagline: 'Converts rambling voice notes into structured, clear written text',
    whatItDoes:
      'You record your unstructured, rambling voice thoughts, and AudioPen uses AI to clean up filler words, organize ideas, and produce clear, eloquent written summaries.',
    bestUseCase:
      'Brainstorming essay theses, writing daily study reflections, and capturing fast thoughts while walking across campus.',
    pricingModel: 'Freemium',
    pricingNote: 'Free tier allows recording up to 3-minute voice notes; Prime tier unlocks longer recordings and custom styles. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Speak your raw ideas for an essay introduction into your phone and get a coherent 3-paragraph draft in seconds.',
      'Record quick post-lecture voice debriefs to solidify what you just learned before you forget.',
      'Dictate email drafts or project updates without typing.',
    ],
    limitations: [
      'Free version limits voice recordings to 3 minutes maximum per note.',
      'Cannot transcribe multi-speaker classroom conversations with speaker separation (designed for solo dictation).',
    ],
    tags: ['Voice Dictation', 'Rambling to Clear Text', 'Mobile Friendly', 'Essay Brainstorming'],
  },

  // 7. General Productivity & AI Search
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai',
    pricingUrl: 'https://www.perplexity.ai/pro',
    category: 'Productivity',
    tagline: 'Conversational answer engine with real-time web search and live footnotes',
    whatItDoes:
      'Replaces traditional search engine browsing by providing direct, synthesized answers to complex questions, backed by clickable, real-time source citations and follow-up query suggestions.',
    bestUseCase:
      'Fact-checking current affairs, researching technical definitions, and exploring unfamiliar topics with verified, clickable web references.',
    pricingModel: 'Freemium',
    pricingNote: 'Free tier includes unlimited standard searches and 5 Pro Searches every 4 hours. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Use the "Academic" focus filter to restrict search results purely to scholarly papers and university archives.',
      'Get concise, structured breakdowns of complex historical events or economic policies with verified footnotes.',
      'Create shareable research collections ("Pages") for group study projects.',
    ],
    limitations: [
      'Pro searches (which use Claude 3.5 Sonnet / GPT-4o with multi-step reasoning) are limited on the free tier.',
      'Always click citation links to confirm nuanced context on controversial topics.',
    ],
    isRecommended: true,
    tags: ['AI Search', 'Live Citations', 'Academic Filter', 'Research Engine', 'Footnotes'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    pricingUrl: 'https://www.deepseek.com',
    category: 'Productivity',
    tagline: 'Open-weight frontier reasoning model specializing in mathematics, logic, and coding',
    whatItDoes:
      'Provides high-performance reasoning (DeepSeek-R1) and general chat with detailed step-by-step thinking traces, excelling at math problem-solving, algorithms, and logic puzzles.',
    bestUseCase:
      'Solving multi-step discrete mathematics, calculus proofs, physics equations, and competitive coding logic.',
    pricingModel: '100% Free',
    pricingNote: 'Free web interface and mobile apps; extremely low-cost API for developers. (Pricing may change)',
    beginnerFriendliness: 'Intermediate',
    practicalStudentUseCases: [
      'Click "DeepThink (R1)" to inspect the full internal reasoning chain as the model solves complex engineering mathematics step-by-step.',
      'Debug algorithmic time/space complexity tradeoffs for computer science coursework.',
      'Explain theoretical computer science proofs (e.g. P vs NP, Turing completeness) with rigorous logical steps.',
    ],
    limitations: [
      'Server capacity may experience high demand during peak international usage hours.',
      'Thinking mode takes slightly longer to generate responses due to extensive step-by-step reasoning.',
    ],
    isRecommended: true,
    tags: ['DeepSeek-R1', 'Reasoning Chain', 'Mathematics Proofs', 'Logic', 'Free Open Weights'],
  },

  // 8. Resume & Career Intelligence
  {
    id: 'teal-resume',
    name: 'Teal AI Resume Builder',
    url: 'https://www.tealhq.com',
    pricingUrl: 'https://www.tealhq.com/pricing',
    category: 'Resume/Career',
    tagline: 'AI resume builder, job application tracker, and keyword ATS optimizer',
    whatItDoes:
      'Builds ATS-friendly single-column resumes, compares your resume text against specific job descriptions to calculate keyword match scores, and provides AI bullet point rewrites.',
    bestUseCase:
      'Tailoring your college resume to specific internship job descriptions to maximize ATS keyword scoring and track application pipelines.',
    pricingModel: 'Freemium',
    pricingNote: 'Free version allows building unlimited resumes and tracking job applications; Teal+ unlocks unlimited AI keyword matching. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Paste the text of a software internship listing to see a match score and a checklist of missing technical keywords in your resume.',
      'Use the AI bullet point generator to format achievements using the Google XYZ formula ("Achieved [X], measured by [Y], by doing [Z]").',
      'Track all your internship applications in an integrated Kanban board directly in your browser.',
    ],
    limitations: [
      'Full automated keyword matching highlights are limited on the free plan.',
      'Never let AI inject technical skills you cannot personally defend during a live technical interview.',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Resume',
    tags: ['ATS Resume', 'Keyword Matcher', 'Job Tracker', 'Career Intelligence', 'XYZ Formula'],
  },

  // 9. Design & Visual Assets
  {
    id: 'canva-magic-studio',
    name: 'Canva Magic Studio',
    url: 'https://www.canva.com/magic-home',
    pricingUrl: 'https://www.canva.com/pricing',
    category: 'Design',
    tagline: 'All-in-one AI visual design suite for college posters, infographics, and social graphics',
    whatItDoes:
      'Suite of AI design tools inside Canva including Magic Design (text-to-graphic generation), Magic Eraser, background remover, text-to-image, and auto-translations.',
    bestUseCase:
      'Designing college festival posters, club event banners, LinkedIn project infographics, and presentation graphics with zero prior design experience.',
    pricingModel: 'Freemium',
    pricingNote: 'Free standard Canva account with basic Magic tools; free Canva for Education available for eligible schools. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Describe a college tech club hackathon in 1 sentence to generate 5 complete poster layout options instantly.',
      'Create high-contrast infographics explaining project architecture diagrams for your portfolio.',
      'Remove photo backgrounds and clean up presentation asset images in 1 click.',
    ],
    limitations: [
      'Certain advanced Magic features (like one-click resizing and unlimited background removal) require Canva Pro/Education.',
      'Templates can look recognizable if not customized with original typography and colors.',
    ],
    tags: ['Poster Design', 'Infographics', 'Club Banners', 'Visual Assets', 'Magic Studio'],
  },

  // 10. Data Analysis & Computational AI
  {
    id: 'julius-ai',
    name: 'Julius AI',
    url: 'https://julius.ai',
    pricingUrl: 'https://julius.ai/pricing',
    category: 'Data Analysis',
    tagline: 'AI data analyst that analyzes spreadsheets, runs Python scripts, and builds statistical charts',
    whatItDoes:
      'Upload Excel, CSV, or Google Sheets files and ask questions in plain English. Julius writes and executes Python/R code in the background to generate statistical graphs, regressions, and heatmaps.',
    bestUseCase:
      'Analyzing lab experiment data, performing regression statistics for economics assignments, and generating publication-ready matplotlib/seaborn charts.',
    pricingModel: 'Freemium',
    pricingNote: 'Free tier includes 15 monthly computational messages; paid subscriptions for unlimited high-capacity data science workloads. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Upload a 5,000-row survey dataset and ask: "Calculate the Pearson correlation between study hours and GPA and plot a scatter chart with a trendline."',
      'Identify and clean missing values or outliers in laboratory research measurements.',
      'Export the exact underlying Python (Pandas/Seaborn) code to include in your project submission appendix.',
    ],
    limitations: [
      '15 free computational messages per month means complex multi-step analyses require mindful prompt structuring on the free tier.',
      'Always inspect the underlying Python code to verify the statistical methodology aligns with your course syllabus.',
    ],
    isRecommended: true,
    spotlightBadge: 'Best for Data Analysis',
    tags: ['Data Analysis', 'Python Code', 'CSV Spreadsheets', 'Statistics', 'Charts & Graphs'],
  },
  {
    id: 'wolfram-alpha',
    name: 'Wolfram|Alpha',
    url: 'https://www.wolframalpha.com',
    pricingUrl: 'https://www.wolframalpha.com/pricing',
    category: 'Data Analysis',
    tagline: 'Computational intelligence engine for symbolic mathematics, physics, and science',
    whatItDoes:
      'Unlike probabilistic LLMs that guess words, Wolfram|Alpha uses curated computational algorithms and symbolic mathematics to compute exact answers, derivatives, integrals, and physics equations.',
    bestUseCase:
      'Step-by-step calculus integration, differential equations, matrix linear algebra, and verifying exact engineering calculations with zero hallucinations.',
    pricingModel: 'Freemium',
    pricingNote: 'Free computation on standard web portal; Wolfram|Alpha Pro unlocks step-by-step solution breakdowns ($5.50/mo for students). (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Type `integrate x^2 * sin(x) dx` or `eigenvalues {{1,2},{3,4}}` for instant symbolic solutions and 2D/3D plots.',
      'Look up chemical reaction balancing, thermodynamic constants, and astronomical orbital calculations.',
      'Verify that generative AI math explanations are numerically and symbolically correct.',
    ],
    limitations: [
      'Step-by-step solution derivation requires the student Pro subscription (though the final computed answer is always free).',
      'Requires standard mathematical notation input for advanced syntax.',
    ],
    tags: ['Exact Math', 'Calculus', 'Differential Equations', 'Zero Hallucinations', 'Physics'],
  },

  // 11. Coding Sandbox & AI Environments
  {
    id: 'google-aistudio',
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    pricingUrl: 'https://ai.google.dev/pricing',
    category: 'Coding',
    tagline: 'Rapid prototyping environment for Gemini 1.5 Pro & Flash with massive 2M token context',
    whatItDoes:
      'Developer sandbox to experiment with Google Gemini models, test multimodal prompts (video, audio, codebases), and generate API keys for your student projects.',
    bestUseCase:
      'Building college hackathon projects with free Gemini API keys and analyzing entire textbooks or 1-hour video lectures in 1 massive prompt.',
    pricingModel: '100% Free',
    pricingNote: 'Generous free tier with high rate limits for developers and students building applications. (Pricing may change)',
    beginnerFriendliness: 'Intermediate',
    practicalStudentUseCases: [
      'Generate a free Gemini API key to power your final year college web or mobile application.',
      'Upload a 45-minute lecture video (.mp4) directly into the prompt to ask questions about specific whiteboard diagrams.',
      'Export prompt setups directly into working Python, JavaScript, or cURL starter code.',
    ],
    limitations: [
      'Designed primarily for developers and builders rather than casual non-technical chat.',
      'Free tier API requests may be used to improve Google products per terms of service.',
    ],
    tags: ['Gemini', 'Google', '2M Context', 'Free API Key', 'Developer Sandbox', 'Video Analysis'],
  },

  // 12. Productivity & Automation
  {
    id: 'notion-ai',
    name: 'Notion AI for Education',
    url: 'https://www.notion.so/product/ai',
    pricingUrl: 'https://www.notion.so/pricing',
    category: 'Productivity',
    tagline: 'Connected workspace AI that searches across your notes, docs, and course databases',
    whatItDoes:
      'Integrated AI inside your Notion workspace that auto-fills database properties, drafts meeting notes, translates text, and searches across all your semester notebooks.',
    bestUseCase:
      'Organizing semester course databases, auto-summarizing lecture notes inside Notion pages, and tracking assignments with automated property tags.',
    pricingModel: 'Freemium',
    pricingNote: 'Notion Plus is 100% Free for students using their .edu email; Notion AI is an optional add-on with free trial prompts included. (Pricing may change)',
    beginnerFriendliness: 'Beginner Friendly',
    practicalStudentUseCases: [
      'Use Q&A inside Notion to ask "What did I write in my CS201 notes about Dijkstra algorithm complexity?"',
      'Auto-generate action items and executive summaries at the top of long meeting and project notes.',
      'Translate project requirements into 20+ languages for international student group collaborations.',
    ],
    limitations: [
      'Notion AI features have a limited number of free trial prompts before requiring a paid add-on.',
      'Best suited for students who already use Notion as their primary knowledge base.',
    ],
    tags: ['Notion', 'Free Student Plus Plan', 'Connected Workspace', 'Database Autofill', 'Semester Tracker'],
  },
];

export const AI_SPOTLIGHT_AWARDS: AiBestForSpotlight[] = [
  {
    award: 'Best AI for Studying',
    toolName: 'Google NotebookLM',
    toolId: 'notebooklm',
    category: 'Studying',
    reason: 'Zero hallucinations due to strict source grounding, plus revolutionary 2-person podcast Audio Overviews generated from your course slides.',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
  },
  {
    award: 'Best AI for Coding',
    toolName: 'Cursor AI & Copilot',
    toolId: 'cursor-ai',
    category: 'Coding',
    reason: 'Full-codebase indexing in Cursor combined with free GitHub Copilot for students via the GitHub Student Pack.',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-300',
  },
  {
    award: 'Best AI for Research',
    toolName: 'Consensus & Elicit',
    toolId: 'consensus',
    category: 'Research',
    reason: 'Evidence-based consensus meters and structured data extraction across 200M+ peer-reviewed academic papers.',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-300',
  },
  {
    award: 'Best AI for Presentations',
    toolName: 'Gamma App',
    toolId: 'gamma-app',
    category: 'Presentations',
    reason: 'Turns plain markdown notes or documents into professional, interactive 10-slide decks ready for class export.',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-300',
  },
  {
    award: 'Best AI for Writing',
    toolName: 'Anthropic Claude 3.5',
    toolId: 'claude-ai',
    category: 'Writing',
    reason: 'Exceptional natural prose, nuanced tone feedback, and interactive live Artifacts for visual reports.',
    badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-300',
  },
  {
    award: 'Best AI for Resume Building',
    toolName: 'Teal AI Resume',
    toolId: 'teal-resume',
    category: 'Resume/Career',
    reason: 'Job description ATS keyword scoring, single-column templates, and Google XYZ achievement bullet formatting.',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-300',
  },
  {
    award: 'Best AI for Data Analysis',
    toolName: 'Julius AI & Wolfram',
    toolId: 'julius-ai',
    category: 'Data Analysis',
    reason: 'Julius executes Python data science scripts on spreadsheets, while Wolfram guarantees zero math hallucinations.',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-300',
  },
  {
    award: 'Best AI for Note Taking',
    toolName: 'Otter.ai & AudioPen',
    toolId: 'otter-ai',
    category: 'Note taking',
    reason: 'Real-time lecture speech transcription and transforming rambling thoughts into clean, structured summaries.',
    badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-300',
  },
];

export const AI_TOOLS_FAQS: AiToolFaq[] = [
  {
    question: 'How can college students use AI tools ethically without committing academic misconduct?',
    answer:
      'Use AI as an active tutor, brainstormer, and feedback critic rather than a copy-paste shortcut. Always write your own original drafts, cite any generative AI assistance where permitted by your university guidelines, and verify all facts and citations using primary sources.',
  },
  {
    question: 'Why does Google NotebookLM produce fewer hallucinations than ChatGPT for studying?',
    answer:
      'Standard LLMs generate responses by predicting likely next words across their entire internet training set. NotebookLM uses "source grounding"—it restricts its answers strictly to the specific PDFs, lecture notes, and transcripts you upload, appending clickable footnote citations to verify every sentence.',
  },
  {
    question: 'How do students get GitHub Copilot and other developer AI tools for free?',
    answer:
      'College students can apply for the free GitHub Student Developer Pack using their official college-issued email (.edu or institutional domain) or student ID card. This unlocks GitHub Copilot, Canva Pro access, free cloud credits, and domain names at zero cost.',
  },
  {
    question: 'What is the difference between Consensus and standard Google search for research papers?',
    answer:
      'Standard Google matches keywords across blogs, news, and forums without peer-review validation. Consensus searches 200M+ peer-reviewed scientific papers and uses AI to summarize scientific consensus percentages, filter by study type (RCTs, Meta-Analyses), and export verified citations.',
  },
  {
    question: 'Why should college students be cautious about AI-generated mathematics and coding?',
    answer:
      'LLMs are probabilistic text generators and can make subtle logical or arithmetic errors while sounding confident. For exact mathematical proofs and calculus, use computational engines like Wolfram|Alpha. For coding, always run unit tests and understand every line in your codebase.',
  },
];
