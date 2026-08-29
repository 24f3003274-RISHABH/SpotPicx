export interface BookCategoryDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: Array<{
    name: string;
    slug: string;
    description?: string;
    topics: string[];
  }>;
}

export interface ReadingPathDefinition {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetAudience: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'COMPREHENSIVE';
  estimatedDuration: string;
  steps: Array<{
    order: number;
    title: string;
    description: string;
    recommendedBookSlugs: string[];
    keyTakeaway: string;
  }>;
}

export interface EditorialCollectionDefinition {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  badge: string;
  bookSlugs: string[];
  categorySlug?: string;
  readingLevel?: string;
}

export const BOOK_CATEGORIES: BookCategoryDefinition[] = [
  {
    id: 'cat_cs_tech',
    name: 'Computer Science & Technology',
    slug: 'computer-science-technology',
    description: 'Fundamental algorithms, distributed systems, operating systems, AI, software design patterns, and programming mastery.',
    icon: 'Code2',
    color: 'from-blue-600 to-indigo-700',
    subcategories: [
      {
        name: 'Programming & Software Engineering',
        slug: 'programming-software-engineering',
        topics: ['Clean Code', 'Refactoring', 'Design Patterns', 'TypeScript', 'Python', 'Go', 'Rust', 'Testing'],
      },
      {
        name: 'Algorithms & Data Structures',
        slug: 'algorithms-data-structures',
        topics: ['Data Structures', 'Graph Algorithms', 'Dynamic Programming', 'Complexity Theory', 'Coding Interviews'],
      },
      {
        name: 'Systems, Networks & Distributed Systems',
        slug: 'systems-networks-distributed-systems',
        topics: ['Distributed Systems', 'Operating Systems', 'System Design', 'Databases', 'Computer Networks', 'Compilers'],
      },
      {
        name: 'Artificial Intelligence & Machine Learning',
        slug: 'ai-machine-learning',
        topics: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'LLMs', 'Generative AI', 'NLP', 'Computer Vision'],
      },
      {
        name: 'Cloud, DevOps & Cybersecurity',
        slug: 'cloud-devops-cybersecurity',
        topics: ['Docker', 'Kubernetes', 'AWS', 'Site Reliability Engineering', 'Information Security', 'Cryptography'],
      },
    ],
  },
  {
    id: 'cat_entrepreneurship',
    name: 'Entrepreneurship & Business',
    slug: 'entrepreneurship-business',
    description: 'Zero-to-one startup building, product-market fit, venture funding, corporate strategy, marketing, and scaling companies.',
    icon: 'Rocket',
    color: 'from-emerald-600 to-teal-700',
    subcategories: [
      {
        name: 'Startups & Venture Creation',
        slug: 'startups-venture-creation',
        topics: ['Startup Building', 'Product Market Fit', 'Fundraising', 'Lean Startup', 'Bootstrapping', 'Growth'],
      },
      {
        name: 'Business Strategy & Management',
        slug: 'business-strategy-management',
        topics: ['High Output Management', 'Competitive Strategy', 'Operations', 'Product Management', 'Organizational Scaling'],
      },
      {
        name: 'Marketing, Branding & Sales',
        slug: 'marketing-branding-sales',
        topics: ['Customer Acquisition', 'Brand Storytelling', 'B2B Sales', 'Positioning', 'Viral Growth'],
      },
    ],
  },
  {
    id: 'cat_personal_dev',
    name: 'Personal Development',
    slug: 'personal-development',
    description: 'Master your focus, time management, emotional resilience, decision-making frameworks, and high performance.',
    icon: 'Sparkles',
    color: 'from-amber-500 to-orange-600',
    subcategories: [
      {
        name: 'Productivity & Focus',
        slug: 'productivity-focus',
        topics: ['Deep Work', 'Time Management', 'Procrastination', 'Goal Setting', 'Attention Management'],
      },
      {
        name: 'Communication & Soft Skills',
        slug: 'communication-soft-skills',
        topics: ['Public Speaking', 'Negotiation', 'Interpersonal Skills', 'Storytelling', 'Conflict Resolution'],
      },
      {
        name: 'Mindset & Emotional Resilience',
        slug: 'mindset-emotional-resilience',
        topics: ['Growth Mindset', 'Stoic Discipline', 'Mental Toughness', 'Emotional Intelligence'],
      },
    ],
  },
  {
    id: 'cat_habits',
    name: 'Habits & Behavioral Science',
    slug: 'habits-behavioral-science',
    description: 'The science of micro-habits, behavioral conditioning, neuroplasticity, willpower, and breaking destructive loops.',
    icon: 'Flame',
    color: 'from-rose-500 to-pink-600',
    subcategories: [
      {
        name: 'Habit Formation & System Design',
        slug: 'habit-formation-system-design',
        topics: ['Atomic Habits', 'Cue-Routine-Reward', 'Identity-Based Habits', 'Environment Architecture'],
      },
      {
        name: 'Behavioral Economics & Nudges',
        slug: 'behavioral-economics-nudges',
        topics: ['Choice Architecture', 'Cognitive Biases', 'Heuristics', 'Decision Psychology'],
      },
    ],
  },
  {
    id: 'cat_psychology',
    name: 'Psychology & Cognitive Science',
    slug: 'psychology-cognitive-science',
    description: 'Human nature, developmental psychology, cognitive biases, memory systems, social dynamics, and mental wellness.',
    icon: 'Brain',
    color: 'from-purple-600 to-violet-700',
    subcategories: [
      {
        name: 'Cognitive & Behavioral Psychology',
        slug: 'cognitive-behavioral-psychology',
        topics: ['Dual Process Theory', 'Perception', 'Memory Systems', 'Rationality vs Intuition'],
      },
      {
        name: 'Social Psychology & Influence',
        slug: 'social-psychology-influence',
        topics: ['Persuasion', 'Social Proof', 'Group Dynamics', 'Ego & Empathy'],
      },
    ],
  },
  {
    id: 'cat_indian_knowledge',
    name: 'Indian Knowledge & Society',
    slug: 'indian-knowledge-society',
    description: 'Ancient and modern Indian philosophy, constitutional history, social reform, civilisational epics, and contemporary society.',
    icon: 'Landmark',
    color: 'from-amber-600 to-red-700',
    subcategories: [
      {
        name: 'Indian History & Civilisation',
        slug: 'indian-history-civilisation',
        topics: ['Ancient India', 'Mughal Era', 'Freedom Movement', 'Post-Independence India', 'Constitution of India'],
      },
      {
        name: 'Indian Philosophy & Epics',
        slug: 'indian-philosophy-epics',
        topics: ['Vedanta', 'Upanishads', 'Bhagavad Gita', 'Buddhist Philosophy', 'Bhakti Tradition', 'Modern Indian Thinkers'],
      },
      {
        name: 'Indian Society, Economy & Polity',
        slug: 'indian-society-economy-polity',
        topics: ['Democracy in India', 'Economic Reforms', 'Social Structures', 'Indian Literature & Arts'],
      },
    ],
  },
  {
    id: 'cat_history',
    name: 'History & Civilizations',
    slug: 'history-civilizations',
    description: 'Global empires, world wars, economic revolutions, ancient Mediterranean, and pivotal moments in human civilization.',
    icon: 'Globe',
    color: 'from-stone-600 to-stone-800',
    subcategories: [
      {
        name: 'World History & Empires',
        slug: 'world-history-empires',
        topics: ['Roman Empire', 'Silk Road', 'Industrial Revolution', 'World War I & II', 'Cold War'],
      },
      {
        name: 'Economic & Social History',
        slug: 'economic-social-history',
        topics: ['Origins of Capitalism', 'Agricultural Revolutions', 'Colonialism', 'Globalization'],
      },
    ],
  },
  {
    id: 'cat_philosophy',
    name: 'Philosophy & Ethics',
    slug: 'philosophy-ethics',
    description: 'Stoicism, existentialism, moral philosophy, epistemology, metaphysics, and timeless wisdom on the good life.',
    icon: 'Compass',
    color: 'from-cyan-600 to-blue-800',
    subcategories: [
      {
        name: 'Stoicism & Ancient Philosophy',
        slug: 'stoicism-ancient-philosophy',
        topics: ['Marcus Aurelius', 'Seneca', 'Epictetus', 'Socrates & Plato', 'Aristotelian Ethics'],
      },
      {
        name: 'Modern & Existential Philosophy',
        slug: 'modern-existential-philosophy',
        topics: ['Existentialism', 'Nietzsche', 'Ethics & Utilitarianism', 'Philosophy of Mind'],
      },
    ],
  },
  {
    id: 'cat_science',
    name: 'Science, Physics & Nature',
    slug: 'science-physics-nature',
    description: 'Quantum mechanics, astrophysics, evolutionary biology, neuroscience, and the wonders of the physical universe.',
    icon: 'Atom',
    color: 'from-teal-600 to-emerald-800',
    subcategories: [
      {
        name: 'Physics & Cosmology',
        slug: 'physics-cosmology',
        topics: ['Relativity', 'Quantum Physics', 'Astrophysics', 'Cosmology', 'Space Exploration'],
      },
      {
        name: 'Biology & Evolutionary Science',
        slug: 'biology-evolutionary-science',
        topics: ['Evolution', 'Genetics', 'Neuroscience', 'Ecology'],
      },
    ],
  },
  {
    id: 'cat_finance',
    name: 'Finance & Investing',
    slug: 'finance-investing',
    description: 'Value investing, personal wealth management, index investing, behavioral finance, macroeconomic cycles, and money psychology.',
    icon: 'TrendingUp',
    color: 'from-emerald-700 to-green-900',
    subcategories: [
      {
        name: 'Personal Finance & Wealth Creation',
        slug: 'personal-finance-wealth-creation',
        topics: ['Financial Independence', 'Budgeting', 'Compounding', 'Psychology of Money'],
      },
      {
        name: 'Investing & Capital Markets',
        slug: 'investing-capital-markets',
        topics: ['Value Investing', 'Stock Analysis', 'Asset Allocation', 'Economic Moats'],
      },
    ],
  },
  {
    id: 'cat_literature',
    name: 'Literature & Classics',
    slug: 'literature-classics',
    description: 'Masterpieces of world and Indian fiction, dystopian allegories, classic storytelling, and award-winning literature.',
    icon: 'BookOpen',
    color: 'from-rose-700 to-red-900',
    subcategories: [
      {
        name: 'Indian Literature in Translation & English',
        slug: 'indian-literature',
        topics: ['Malgudi Stories', 'Hindi Classics', 'Post-Colonial Novels', 'Indian Short Stories'],
      },
      {
        name: 'World Classics & Dystopian Fiction',
        slug: 'world-classics-fiction',
        topics: ['Dystopian Fiction', 'Philosophical Novels', 'Literary Classics', 'Historical Fiction'],
      },
    ],
  },
  {
    id: 'cat_biography',
    name: 'Biography & Memoir',
    slug: 'biography-memoir',
    description: 'Inspiring life accounts of scientists, statesmen, business builders, revolutionaries, and profound thinkers.',
    icon: 'UserCheck',
    color: 'from-amber-700 to-yellow-900',
    subcategories: [
      {
        name: 'Visionaries & Scientists',
        slug: 'visionaries-scientists',
        topics: ['A.P.J. Abdul Kalam', 'Richard Feynman', 'Albert Einstein', 'Steve Jobs'],
      },
      {
        name: 'Historical & Political Leaders',
        slug: 'historical-political-leaders',
        topics: ['Mahatma Gandhi', 'Nelson Mandela', 'Winston Churchill', 'Abraham Lincoln'],
      },
    ],
  },
];

export const BOOK_TYPES = [
  'Textbook',
  'Reference',
  'Academic',
  'Research',
  'Popular Science',
  'Self Help',
  'Business',
  'Biography',
  'Memoir',
  'Fiction',
  'Non Fiction',
  'Classic',
  'Philosophy',
  'History',
  'Essay',
  'Poetry',
  'Travel',
  'Exam Preparation',
  'Professional',
  'Technical',
  'Programming',
  'Children',
  'Young Adult',
];

export const READING_PURPOSES = [
  { id: 'learn-programming', label: 'Learn Programming & Software Craft', icon: 'Code' },
  { id: 'learn-ai', label: 'Learn Artificial Intelligence & ML', icon: 'Brain' },
  { id: 'become-better-developer', label: 'Become a Better Software Engineer', icon: 'Terminal' },
  { id: 'learn-data-science', label: 'Master Data Science & Systems', icon: 'Database' },
  { id: 'start-startup', label: 'Start a Startup & Build Companies', icon: 'Rocket' },
  { id: 'learn-business', label: 'Understand Business Strategy & Scaling', icon: 'Briefcase' },
  { id: 'build-habits', label: 'Build Atomic Habits & Daily Discipline', icon: 'Flame' },
  { id: 'become-productive', label: 'Deep Work & High Productivity', icon: 'Sparkles' },
  { id: 'understand-psychology', label: 'Understand Psychology & Biases', icon: 'Compass' },
  { id: 'learn-history', label: 'Explore World & Indian History', icon: 'Landmark' },
  { id: 'understand-indian-society', label: 'Understand Indian Society & Heritage', icon: 'Globe' },
  { id: 'learn-philosophy', label: 'Learn Stoicism & Timeless Philosophy', icon: 'BookOpen' },
  { id: 'improve-financial-knowledge', label: 'Master Investing & Money Psychology', icon: 'TrendingUp' },
  { id: 'learn-leadership', label: 'Develop Leadership & High Output Management', icon: 'Users' },
  { id: 'read-classics', label: 'Read World & Indian Classics', icon: 'Award' },
];

export const CAREER_PATHS = [
  { id: 'software-engineer', label: 'Software Engineer', icon: 'Code', description: 'Core CS theory, clean design, distributed systems, and real-world system design.' },
  { id: 'ai-ml-engineer', label: 'AI & ML Engineer', icon: 'Brain', description: 'Mathematical foundations, modern deep learning, neural networks, and generative models.' },
  { id: 'entrepreneur', label: 'Entrepreneur & Founder', icon: 'Rocket', description: 'Zero-to-one validation, management leverage, unit economics, and culture.' },
  { id: 'product-manager', label: 'Product Manager', icon: 'Layers', description: 'User psychology, product metrics, decision models, and strategic roadmaps.' },
  { id: 'data-scientist', label: 'Data Scientist', icon: 'Database', description: 'Statistical rigor, data engineering, exploratory analysis, and predictive models.' },
  { id: 'college-student', label: 'College & University Student', icon: 'GraduationCap', description: 'Foundational mental models, accelerated learning, study stamina, and career prep.' },
  { id: 'investor-finance', label: 'Finance & Value Investor', icon: 'TrendingUp', description: 'Margin of safety, balance sheet reading, behavioral discipline, and compounding.' },
  { id: 'civil-services-aspirant', label: 'Civil Services / UPSC Aspirant', icon: 'Landmark', description: 'Indian constitutional polity, economic history, sociology, and modern diplomacy.' },
];

export const EDITORIAL_COLLECTIONS: EditorialCollectionDefinition[] = [
  {
    id: 'col_cs_essentials',
    title: '10 Books Every Computer Science Student Should Read',
    slug: '10-books-every-cs-student-should-read',
    subtitle: 'From algorithmic beauty to hardware reality and production-grade architectures.',
    description: 'Hand-picked foundational texts that separate code typists from world-class software engineers.',
    badge: 'SpotPicx Core CS',
    bookSlugs: [
      'the-pragmatic-programmer',
      'structure-and-interpretation-of-computer-programs',
      'designing-data-intensive-applications',
      'introduction-to-algorithms-clrs',
      'clean-code',
      'computer-systems-a-programmers-perspective',
    ],
    categorySlug: 'computer-science-technology',
    readingLevel: 'ALL_LEVELS',
  },
  {
    id: 'col_entrepreneur_essentials',
    title: '15 Books Every Entrepreneur Should Know',
    slug: '15-books-every-entrepreneur-should-know',
    subtitle: 'Battle-tested mental models for turning raw ideas into resilient enterprises.',
    description: 'No fluff or hollow motivational slogans—concrete frameworks on distribution, product, and leadership.',
    badge: 'Founder Reading List',
    bookSlugs: [
      'the-lean-startup',
      'zero-to-one',
      'high-output-management',
      'the-hard-thing-about-hard-things',
      'the-psychology-of-money',
    ],
    categorySlug: 'entrepreneurship-business',
    readingLevel: 'BEGINNER',
  },
  {
    id: 'col_indian_history',
    title: '10 Books on Indian History & Thought',
    slug: '10-books-on-indian-history-and-thought',
    subtitle: 'From ancient civilization to post-independence democracy and modern aspirations.',
    description: 'Essential perspectives on the subcontinent’s civilisational tapestry, diversity, and constitution.',
    badge: 'SpotPicx Heritage',
    bookSlugs: [
      'the-discovery-of-india',
      'india-after-gandhi',
      'wings-of-fire',
      'the-wonder-that-was-india',
      'the-argumentative-indian',
      'my-experiments-with-truth',
    ],
    categorySlug: 'indian-knowledge-society',
    readingLevel: 'ALL_LEVELS',
  },
  {
    id: 'col_habits_mind',
    title: 'Books That Transform Your Habits & Thinking',
    slug: 'books-that-transform-your-habits-and-thinking',
    subtitle: 'Small system tweaks that yield compounding cognitive and professional dividends.',
    description: 'Rooted in cognitive neuroscience and behavioral economics to eliminate procrastination and cultivate deep work.',
    badge: 'Mindset & Habits',
    bookSlugs: [
      'atomic-habits',
      'thinking-fast-and-slow',
      'the-power-of-habit',
      'mans-search-for-meaning',
    ],
    categorySlug: 'habits-behavioral-science',
    readingLevel: 'BEGINNER',
  },
];

export const READING_PATHS: ReadingPathDefinition[] = [
  {
    id: 'path_cs_scratch',
    title: 'Learn Computer Science from Scratch',
    slug: 'learn-computer-science-from-scratch',
    description: 'A comprehensive, rigorous self-taught curriculum from basic programming abstractions to large-scale distributed architectures.',
    targetAudience: 'Aspiring and working software engineers seeking rock-solid theoretical fundamentals.',
    difficulty: 'COMPREHENSIVE',
    estimatedDuration: '6-12 Months',
    steps: [
      {
        order: 1,
        title: 'Abstractions & Functional Mental Models',
        description: 'Understand computational thinking, recursion, and higher-order procedures using classic computer science pedagogical purity.',
        recommendedBookSlugs: ['structure-and-interpretation-of-computer-programs'],
        keyTakeaway: 'Master procedures as first-class citizens and understand how interpreters evaluate code.',
      },
      {
        order: 2,
        title: 'Professional Software Craftsmanship',
        description: 'Write maintainable, robust, pragmatic software that handles edge cases and avoids unnecessary duplication.',
        recommendedBookSlugs: ['the-pragmatic-programmer', 'clean-code'],
        keyTakeaway: 'Adopt defensive programming, orthogonal architectures, and pragmatic testing discipline.',
      },
      {
        order: 3,
        title: 'Data Structures & Algorithmic Rigor',
        description: 'Analyze time/space complexity and conquer dynamic programming, graphs, and sorting routines.',
        recommendedBookSlugs: ['introduction-to-algorithms-clrs'],
        keyTakeaway: 'Choose optimal structures and prove computational efficiency asymptotically.',
      },
      {
        order: 4,
        title: 'Hardware & System Execution Models',
        description: 'Learn how your processor, caches, memory hierarchies, and operating system actually run binaries.',
        recommendedBookSlugs: ['computer-systems-a-programmers-perspective'],
        keyTakeaway: 'Bridge the gap between high-level code and low-level hardware memory performance.',
      },
      {
        order: 5,
        title: 'Distributed Systems & Data Scalability',
        description: 'Handle network partitions, replication, consensus, event-driven streams, and fault tolerance at internet scale.',
        recommendedBookSlugs: ['designing-data-intensive-applications'],
        keyTakeaway: 'Architect resilient data pipelines and distributed storage mechanisms.',
      },
    ],
  },
  {
    id: 'path_entrepreneur_playbook',
    title: 'The Founder’s Zero-to-Scale Playbook',
    slug: 'founders-zero-to-scale-playbook',
    description: 'From validating assumptions with minimal capital to managing executive teams and creating durable monopolies.',
    targetAudience: 'Founders, early-stage builders, and product operators building high-growth technology companies.',
    difficulty: 'INTERMEDIATE',
    estimatedDuration: '3-6 Months',
    steps: [
      {
        order: 1,
        title: 'Customer Discovery & Rapid Iteration',
        description: 'Validate problem-solution hypotheses with real users before writing months of code.',
        recommendedBookSlugs: ['the-lean-startup'],
        keyTakeaway: 'Build-Measure-Learn feedback loops to avoid wasting capital on unvalidated products.',
      },
      {
        order: 2,
        title: 'Defensible Moats & Contrarian Thinking',
        description: 'Discover non-obvious secrets and escape vicious price competition through proprietary tech and network effects.',
        recommendedBookSlugs: ['zero-to-one'],
        keyTakeaway: 'Build something 10x better in a targeted niche rather than competing in commoditized markets.',
      },
      {
        order: 3,
        title: 'Operational Leverage & Management',
        description: 'Design managerial output multipliers, one-on-ones, and task-relevant maturity frameworks.',
        recommendedBookSlugs: ['high-output-management'],
        keyTakeaway: 'A manager’s output equals the output of their organization plus the output of neighboring teams.',
      },
      {
        order: 4,
        title: 'Navigating Hard Times & High Stakes',
        description: 'Leading during crises, peacetime vs wartime leadership, and psychological fortitude.',
        recommendedBookSlugs: ['the-hard-thing-about-hard-things'],
        keyTakeaway: 'Make tough decisions without complete information and maintain focus when everything seems to fail.',
      },
    ],
  },
  {
    id: 'path_ai_mastery',
    title: 'Modern AI & Machine Learning Path',
    slug: 'modern-ai-machine-learning-path',
    description: 'From classical statistical learning to deep neural networks, backpropagation, and transformer architectures.',
    targetAudience: 'Software engineers and computer science students entering artificial intelligence.',
    difficulty: 'ADVANCED',
    estimatedDuration: '6-9 Months',
    steps: [
      {
        order: 1,
        title: 'Foundational Intelligence & Agent Systems',
        description: 'Understand search trees, heuristic algorithms, logical reasoning, and probabilistic agent frameworks.',
        recommendedBookSlugs: ['artificial-intelligence-a-modern-approach'],
        keyTakeaway: 'Grasp the classical theoretical foundations of rational decision agents.',
      },
      {
        order: 2,
        title: 'Deep Learning & Neural Architectures',
        description: 'Master linear algebra foundations, gradient descent optimization, convolutional networks, and transformers.',
        recommendedBookSlugs: ['deep-learning-goodfellow'],
        keyTakeaway: 'Understand the mathematical mechanics of deep learning representations and backpropagation.',
      },
    ],
  },
];
