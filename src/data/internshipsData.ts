export type InternshipCategory =
  | 'Software Engineering'
  | 'Data Science & AI/ML'
  | 'Startup Jobs'
  | 'Remote Internships'
  | 'Government & Public Sector'
  | 'Research & Fellowships'
  | 'Open-Source Programs'
  | 'Freelancing & Contract';

export type OpportunityLocation = 'Remote' | 'On-site' | 'Hybrid' | 'Remote / Global' | 'India / Global';
export type CompensationModel = 'Paid / Stipend' | 'Competitive Stipend' | 'Grant / Stipend Provided' | 'Depends on Project' | 'Paid (Industry Benchmark)';
export type ApplicationDifficulty = 'Beginner Friendly' | 'Moderate' | 'Competitive' | 'Highly Competitive';

export interface InternshipPlatform {
  id: string;
  name: string;
  url: string;
  category: InternshipCategory;
  opportunityTypes: string[];
  suitableFor: string;
  locationType: OpportunityLocation;
  compensationStatus: CompensationModel;
  difficulty: ApplicationDifficulty;
  shortDescription: string;
  importantTips: string[];
  isRecommended?: boolean;
  recommendedReason?: string;
  primaryTrack: 'beginners' | 'software' | 'aiml' | 'remote' | 'research' | 'opensource' | 'government' | 'freelance';
  tags: string[];
}

export interface ApplicationMistake {
  id: string;
  title: string;
  mistake: string;
  whyItHurts: string;
  recommendedFix: string;
}

export interface ApplicationStrategyStep {
  stepNumber: string;
  title: string;
  description: string;
  actionItems: string[];
}

export interface InternshipFaq {
  question: string;
  answer: string;
}

export const LAST_VERIFIED_DATE = 'August 2026';

export const INTERNSHIP_PLATFORMS_LIST: InternshipPlatform[] = [
  // 1. Startup & Tech Direct Applications
  {
    id: 'wellfound',
    name: 'Wellfound (formerly AngelList Talent)',
    url: 'https://wellfound.com',
    category: 'Startup Jobs',
    opportunityTypes: ['Startup Internships', 'Early-Stage Roles', 'Full-Time Software Jobs'],
    suitableFor: 'Students with projects who want to bypass corporate recruiter black holes and pitch directly to founders/CTOs.',
    locationType: 'Remote / Global',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Moderate',
    isRecommended: true,
    recommendedReason: 'Top recommendation for high-ownership startup roles where you talk directly with engineering decision-makers.',
    primaryTrack: 'software',
    shortDescription: 'The premier global platform for early-stage and high-growth startup engineering roles with transparent compensation and direct founder messaging.',
    importantTips: [
      'Write a 3-sentence personalized pitch explaining exactly how your GitHub projects solve a problem their product faces.',
      'Filter by "Active in last 7 days" to only apply to teams currently reviewing candidate submissions.',
      'Link a live deployed demo rather than just a GitHub repository link.',
    ],
    tags: ['Startups', 'Direct Founder Pitch', 'Transparent Salary', 'High Ownership'],
  },
  {
    id: 'y-combinator-workatastartup',
    name: 'Work at a Startup (Y Combinator)',
    url: 'https://www.workatastartup.com',
    category: 'Startup Jobs',
    opportunityTypes: ['Y Combinator Startup Internships', 'Founding Engineer Roles', 'Summer Internships'],
    suitableFor: 'Ambitious undergraduate and graduate students looking to join hyper-growth Silicon Valley and global YC-backed companies.',
    locationType: 'Remote / Global',
    compensationStatus: 'Competitive Stipend',
    difficulty: 'Competitive',
    isRecommended: true,
    recommendedReason: 'Access to the world’s most prestigious tech accelerator startups with a single unified profile.',
    primaryTrack: 'software',
    shortDescription: 'The official hiring portal for Y Combinator startups (Airbnb, Stripe, Brex alumni). Apply to thousands of fast-growing funded startups with one application.',
    importantTips: [
      'Spend time polishing the "Notable Projects" section with concrete metrics (e.g., "1,000 active users", "Reduced query latency by 40%").',
      'Highlight open-source contributions or technical blog posts demonstrating independent initiative.',
      'Check the portal weekly around YC Demo Day batches (March and August) when hiring surges.',
    ],
    tags: ['Y Combinator', 'Venture Backed', 'Global Remote', 'Engineering Roles'],
  },

  // 2. Open-Source & Prestigious Fellowships
  {
    id: 'google-summer-of-code',
    name: 'Google Summer of Code (GSoC)',
    url: 'https://summerofcode.withgoogle.com',
    category: 'Open-Source Programs',
    opportunityTypes: ['Open Source Fellowships', 'Mentored Summer Internships'],
    suitableFor: 'Enrolled students and open-source beginners willing to contribute to real-world codebases with 1-on-1 mentorship.',
    locationType: 'Remote',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Highly Competitive',
    isRecommended: true,
    recommendedReason: 'The world benchmark open-source credential that opens doors to top global software engineering firms.',
    primaryTrack: 'opensource',
    shortDescription: 'Google’s international program introducing developers to open-source software development with a generous stipend and expert mentors.',
    importantTips: [
      'Start participating in chosen organization repos in December/January before official proposals open in March.',
      'Submit 2-3 well-reviewed pull requests (bug fixes or documentation) to build rapport with mentors beforehand.',
      'Draft a crystal-clear 10-12 week architectural roadmap in your proposal with realistic milestones.',
    ],
    tags: ['Google', 'Open Source', 'High Stipend', 'Mentorship', 'Remote'],
  },
  {
    id: 'outreachy',
    name: 'Outreachy',
    url: 'https://www.outreachy.org',
    category: 'Open-Source Programs',
    opportunityTypes: ['Remote Open Source Internships', 'Diversity Fellowships'],
    suitableFor: 'Students from groups systematically underrepresented in technical industries (women, LGBTQ+, racial minorities).',
    locationType: 'Remote',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Competitive',
    isRecommended: true,
    recommendedReason: 'Provides a fully remote $7,000 USD stipend plus $500 travel allowance with intensive 3-month mentorship.',
    primaryTrack: 'opensource',
    shortDescription: 'A paid, remote mentorship program providing internships in open-source software, documentation, data science, and UX design twice a year.',
    importantTips: [
      'The initial essay application is critical: explain your systemic barriers honestly and clearly.',
      'During the 1-month contribution period, prioritize collaborative community communication on public IRC/Zulip channels.',
      'Help other applicants in public channels—mentors actively evaluate collaborative attitude.',
    ],
    tags: ['Diversity', 'Open Source', '$7k Stipend', 'Global Remote'],
  },
  {
    id: 'lfx-mentorship',
    name: 'Linux Foundation (LFX) Mentorship',
    url: 'https://lfx.linuxfoundation.org/tools/mentorship',
    category: 'Open-Source Programs',
    opportunityTypes: ['Cloud Native Internships', 'Systems & Kernel Mentorships'],
    suitableFor: 'Students interested in Kubernetes, Cloud Native (CNCF), Linux Kernel, Hyperledger, and foundational infrastructure.',
    locationType: 'Remote',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Highly Competitive',
    primaryTrack: 'opensource',
    shortDescription: 'A program connecting open-source contributors with mentors across Linux Foundation and CNCF projects (Kubernetes, Envoy, OpenTelemetry).',
    importantTips: [
      'Runs three terms per year (Spring, Summer, Fall).',
      'Demonstrate familiarity with Go, C/C++, or Rust depending on the target CNCF project.',
      'Engage on CNCF Slack channels and solve "good first issues" before applying.',
    ],
    tags: ['Linux Foundation', 'Kubernetes', 'Cloud Native', 'Systems Engineering'],
  },
  {
    id: 'mlh-fellowship',
    name: 'Major League Hacking (MLH) Fellowship',
    url: 'https://fellowship.mlh.io',
    category: 'Open-Source Programs',
    opportunityTypes: ['Software Engineering Fellowship', 'SRE / Production Engineering'],
    suitableFor: 'Students who love hackathons, collaborative coding, and want real production engineering experience sponsored by GitHub & Meta.',
    locationType: 'Remote',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Competitive',
    isRecommended: true,
    recommendedReason: 'Outstanding 12-week educational stipend program with dedicated pod leaders and corporate sponsor mentorship.',
    primaryTrack: 'beginners',
    shortDescription: 'A 12-week remote internship alternative where fellows contribute to open-source software used by millions worldwide with educational stipends.',
    importantTips: [
      'Submit a code sample that you personally wrote from scratch—the technical interview revolves 100% around code walkthrough.',
      'Be prepared to explain why you made specific architectural tradeoffs in your code submission.',
      'Demonstrate enthusiasm for peer collaboration during the behavioral interview.',
    ],
    tags: ['MLH', 'GitHub Sponsored', 'Hackathons', 'Pod Mentorship'],
  },

  // 3. AI & Data Science Internships
  {
    id: 'kaggle-jobs-datasets',
    name: 'Kaggle Community & Hackathons',
    url: 'https://www.kaggle.com/competitions',
    category: 'Data Science & AI/ML',
    opportunityTypes: ['ML Hackathons', 'Data Science Portfolios', 'Industry Hiring Challenges'],
    suitableFor: 'Aspiring Data Scientists, ML Engineers, and quantitative analysts seeking proof-of-work visibility.',
    locationType: 'Remote / Global',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Moderate',
    isRecommended: true,
    recommendedReason: 'A verified Kaggle Competitions or Notebooks Master tier is stronger proof of practical ML ability than any generic certificate.',
    primaryTrack: 'aiml',
    shortDescription: 'The global home of data science competitions, open datasets, and shared cloud notebooks where top tech recruiters scout proven ML talent.',
    importantTips: [
      'Publish clean, well-commented EDA (Exploratory Data Analysis) notebooks on trending public datasets.',
      'Compete in "Featured" and "Community" competitions to show end-to-end model evaluation skills.',
      'Link your top Kaggle notebook writeups in your resume under "Machine Learning Projects".',
    ],
    tags: ['Kaggle', 'Machine Learning', 'Data Science', 'Competitions'],
  },
  {
    id: 'huggingface-jobs',
    name: 'Hugging Face Community & Spaces',
    url: 'https://huggingface.co/jobs',
    category: 'Data Science & AI/ML',
    opportunityTypes: ['AI Research Internships', 'Open-Source AI Fellowship', 'LLM Engineering'],
    suitableFor: 'Students fine-tuning transformers, building diffusion pipelines, and training multimodal LLM apps.',
    locationType: 'Remote / Global',
    compensationStatus: 'Paid (Industry Benchmark)',
    difficulty: 'Competitive',
    primaryTrack: 'aiml',
    shortDescription: 'The epicenter of modern Generative AI. Explore the official jobs board and build interactive Gradio/Streamlit Spaces that attract AI recruiters.',
    importantTips: [
      'Build and host a functioning Gradio/Streamlit demo space on Hugging Face—recruiters can test your model in 1 click.',
      'Contribute model weights, dataset cards, or documentation to popular transformer repositories.',
      'Follow AI startup founders on Hugging Face who actively hire top Space creators.',
    ],
    tags: ['Generative AI', 'Transformers', 'LLM', 'Gradio Demos'],
  },

  // 4. Research & Academic Fellowships
  {
    id: 'mitacs-globalink',
    name: 'Mitacs Globalink Research Internship',
    url: 'https://www.mitacs.ca/en/programs/globalink/globalink-research-internship',
    category: 'Research & Fellowships',
    opportunityTypes: ['Funded University Research', 'International Summer Fellowships'],
    suitableFor: 'Pre-final year undergraduate students (B.Tech, B.S., B.Sc.) with strong academic standing interested in academic research.',
    locationType: 'On-site',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Highly Competitive',
    isRecommended: true,
    recommendedReason: 'Prestigious 12-week fully funded summer research internship at top Canadian universities (Toronto, UBC, McGill) with flight and stipend covered.',
    primaryTrack: 'research',
    shortDescription: 'An elite 12-week international research internship matching top undergraduate students with Canadian university professors in STEM and humanities.',
    importantTips: [
      'Ensure a strong CGPA (typically 8.0/10 or top 20% of batch).',
      'Select a diverse range of 7 projects across multiple Canadian provinces to maximize professor match chances.',
      'Obtain 2 strong letters of recommendation from faculty who can vouch for your technical research ability.',
    ],
    tags: ['Canada', 'Fully Funded', 'Research Fellowship', 'Academic Ivy'],
  },
  {
    id: 'cern-summer-student',
    name: 'CERN Summer Student Programme',
    url: 'https://careers.cern/summer',
    category: 'Research & Fellowships',
    opportunityTypes: ['Nuclear Physics Research', 'High-Performance Computing', 'Applied Engineering'],
    suitableFor: '3rd and 4th year Bachelor or Master students in Physics, Computer Science, Mathematics, or Engineering.',
    locationType: 'On-site',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Highly Competitive',
    primaryTrack: 'research',
    shortDescription: 'Spend 8 to 13 weeks in Geneva, Switzerland working on cutting-edge experimental physics, data pipelines, distributed systems, and electronics at CERN.',
    importantTips: [
      'Applications typically open in November and close in January for the following summer.',
      'Highlight concrete experience in Linux, C++, Python, distributed computing, or hardware FPGA programming.',
      'A well-tailored Statement of Purpose linking your background to CERN computing challenges is essential.',
    ],
    tags: ['CERN', 'Switzerland', 'Distributed Computing', 'Physics & CS'],
  },
  {
    id: 'ias-summer-fellowship',
    name: 'Indian Academy of Sciences (IASc-INSA-NASI) Summer Research',
    url: 'https://web-japps.ias.ac.in',
    category: 'Research & Fellowships',
    opportunityTypes: ['Domestic Research Fellowships', 'IISc & IIT Lab Internships'],
    suitableFor: '1st, 2nd, and 3rd year science and engineering students in Indian universities seeking laboratory research experience.',
    locationType: 'On-site',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Competitive',
    primaryTrack: 'research',
    shortDescription: 'Two-month summer research fellowship placing Indian college students with distinguished scientists and professors at IISc, IITs, TIFR, and IISERs.',
    importantTips: [
      'Write a thoughtful, original 150-200 word write-up of your specific research interests without copying Wikipedia.',
      'Maintain strong academic marks (minimum 65% or equivalent grade throughout school and college).',
      'Teacher recommendation form must be completed punctually before the national deadline (usually November/December).',
    ],
    tags: ['IISc', 'IITs', 'Research Fellowship', 'Govt of India'],
  },
  {
    id: 'daad-wise',
    name: 'DAAD WISE (Working Internships in Science and Engineering)',
    url: 'https://www.daad.de',
    category: 'Research & Fellowships',
    opportunityTypes: ['German University Research', 'Funded Summer Internships'],
    suitableFor: 'Pre-final year Indian engineering and science students with an invitation letter from a German public university professor.',
    locationType: 'On-site',
    compensationStatus: 'Grant / Stipend Provided',
    difficulty: 'Highly Competitive',
    primaryTrack: 'research',
    shortDescription: 'A funded 2-to-3 month research stay at state-funded German higher education institutions and research institutes for Indian STEM students.',
    importantTips: [
      'Start emailing German professors in August/September with a customized research pitch to secure a formal invitation letter.',
      'Only students from eligible top Indian institutions with high academic standing are prioritized.',
      'Monthly scholarship covers living expenses, health insurance, and lump-sum travel allowance.',
    ],
    tags: ['Germany', 'Funded Research', 'STEM', 'DAAD'],
  },

  // 5. Government & Public Sector Opportunities
  {
    id: 'aicte-internship-portal',
    name: 'AICTE Internship Portal (Govt. of India)',
    url: 'https://internship.aicte-india.org',
    category: 'Government & Public Sector',
    opportunityTypes: ['Government Smart Cities', 'Public Sector Undertakings (PSUs)', 'Corporate CSR Internships'],
    suitableFor: 'Indian college students across B.Tech, BCA, Diploma, and Management seeking verified government and urban development projects.',
    locationType: 'India / Global',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Beginner Friendly',
    isRecommended: true,
    recommendedReason: 'Over 100,000+ verified national internships across NHAI, Smart City Missions, and public sector engineering bodies.',
    primaryTrack: 'government',
    shortDescription: 'The official Government of India portal connecting higher education students with Smart Cities, Urban Local Bodies, Ministries, and corporate internships.',
    importantTips: [
      'Complete your AICTE student profile 100% and link your college enrollment number.',
      'Search for "Smart City Mission" and "Urban Local Body" tech roles for impactful local governance projects.',
      'Certificates earned carry official Government of India validation for university academic credits.',
    ],
    tags: ['Govt of India', 'Smart Cities', 'Official Credits', 'PSUs'],
  },
  {
    id: 'nic-internship',
    name: 'National Informatics Centre (NIC) Internships',
    url: 'https://www.nic.in',
    category: 'Government & Public Sector',
    opportunityTypes: ['National e-Governance Tech', 'Cybersecurity & Cloud Infrastructure'],
    suitableFor: 'B.E./B.Tech/MCA students in Computer Science, IT, and Cybersecurity interested in sovereign technology.',
    locationType: 'On-site',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Moderate',
    primaryTrack: 'government',
    shortDescription: 'Intern with the Government of India’s premier technology organisation responsible for sovereign cloud, DigiLocker, UPI tech integrations, and national portals.',
    importantTips: [
      'Applications typically open bi-annually through national calls or official department circulars.',
      'Candidates must possess a minimum of 70% marks and submit a Bonafide Certificate from their Dean/HOD.',
      'Gain exposure to large-scale national infrastructure serving hundreds of millions of citizens.',
    ],
    tags: ['Cybersecurity', 'e-Governance', 'Govt Tech', 'DigiLocker'],
  },

  // 6. General Tech & Entry-Level Job Boards
  {
    id: 'linkedin-jobs',
    name: 'LinkedIn Jobs & Student Portal',
    url: 'https://www.linkedin.com/jobs/internship-jobs',
    category: 'Software Engineering',
    opportunityTypes: ['Corporate Internships', 'MNC Off-Campus Drives', 'On-Campus Referrals'],
    suitableFor: 'All college students building a professional presence and seeking employee referrals.',
    locationType: 'India / Global',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Moderate',
    isRecommended: true,
    recommendedReason: 'The world’s largest professional network. Leveraging employee referrals on LinkedIn is the #1 way to get shortlisted at tech MNCs.',
    primaryTrack: 'software',
    shortDescription: 'The definitive professional network for discovering enterprise internships, setting automated job alerts, and connecting with university alumni for referrals.',
    importantTips: [
      'Never use "Easy Apply" exclusively. Reach out to alumni working at the company for a formal employee referral.',
      'Optimize your headline: use "CS Undergrad @ [University] | Building [Key Tech Stack]" instead of generic "Aspiring Software Engineer".',
      'Post regular technical updates about projects you build to attract inbound recruiter messages.',
    ],
    tags: ['Networking', 'Referrals', 'Enterprise MNCs', 'Alumni Connections'],
  },
  {
    id: 'internshala',
    name: 'Internshala',
    url: 'https://internshala.com',
    category: 'Software Engineering',
    opportunityTypes: ['Beginner Internships', 'Part-Time Roles', 'Content & Web Dev'],
    suitableFor: '1st and 2nd year students looking for their very first internship or part-time work during semesters.',
    locationType: 'India / Global',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Beginner Friendly',
    primaryTrack: 'beginners',
    shortDescription: 'India’s largest entry-level internship portal featuring thousands of small business, agency, and startup openings across engineering, marketing, and design.',
    importantTips: [
      'Answer the "Why should you be hired?" question with specific project examples rather than boilerplate text.',
      'Be cautious: never pay any employer for training, registration fees, or "security deposits" (strictly avoid scams).',
      'Look for verified companies with historical hiring track records and transparent stipend amounts.',
    ],
    tags: ['India', 'Beginner Friendly', 'Semester Part-Time', 'Agency Roles'],
  },
  {
    id: 'unstop',
    name: 'Unstop (formerly Dare2Compete)',
    url: 'https://unstop.com',
    category: 'Software Engineering',
    opportunityTypes: ['Corporate Hiring Hackathons', 'Case Competitions', 'Campus Ambassador Programs'],
    suitableFor: 'Engineering and MBA students seeking fast-track interview bypasses via hackathons and coding challenges.',
    locationType: 'India / Global',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Competitive',
    isRecommended: true,
    recommendedReason: 'Top tech MNCs (Flipkart GRiD, Amazon, Walmart CodeHers, Tata Crucible) use Unstop to hire thousands of freshers via hackathons.',
    primaryTrack: 'software',
    shortDescription: 'A gamified talent discovery platform hosting national coding hackathons, corporate innovation challenges, and direct hiring fast-tracks.',
    importantTips: [
      'Form multidisciplinary teams with batchmates (Frontend + Backend + Pitch) for flagship company hackathons.',
      'Winning or placing in the top 10 of challenges like Flipkart GRiD or Walmart CodeHers grants direct Pre-Placement Interviews (PPIs).',
      'Maintain an updated Unstop resume profile to qualify for invite-only corporate hiring sprints.',
    ],
    tags: ['Hackathons', 'Direct PPIs', 'Corporate Contests', 'Flipkart & Amazon'],
  },

  // 7. Curated Remote & International Portals
  {
    id: 'remoteok',
    name: 'Remote OK',
    url: 'https://remoteok.com',
    category: 'Remote Internships',
    opportunityTypes: ['Global Remote Jobs', 'Contract Engineering', 'Junior Remote Roles'],
    suitableFor: 'Self-motivated students with strong English communication and proven asynchronous remote work capability.',
    locationType: 'Remote',
    compensationStatus: 'Paid (Industry Benchmark)',
    difficulty: 'Competitive',
    primaryTrack: 'remote',
    shortDescription: 'One of the most visited remote job directories featuring global distributed tech companies offering USD and EUR-denominated compensation.',
    importantTips: [
      'Filter by tags like "Junior", "React", "Python", and "Worldwide" to filter out US-only residency restrictions.',
      'Emphasize your asynchronous communication skills (Loom walkthroughs, clear GitHub PR documentation).',
      'Tailor your resume timezone compatibility (e.g., "Comfortable overlapping 4 hours with EST/PST").',
    ],
    tags: ['Remote', 'Global USD Pay', 'Asynchronous Work', 'Distributed Teams'],
  },
  {
    id: 'weworkremotely',
    name: 'We Work Remotely (WWR)',
    url: 'https://weworkremotely.com',
    category: 'Remote Internships',
    opportunityTypes: ['Full Remote Tech Roles', 'Customer Support / DevRel', 'Frontend & Full Stack'],
    suitableFor: 'Developers and technical writers looking for 100% remote-first companies with mature engineering cultures.',
    locationType: 'Remote',
    compensationStatus: 'Paid (Industry Benchmark)',
    difficulty: 'Competitive',
    primaryTrack: 'remote',
    shortDescription: 'The world’s largest remote work community with over 3 million visitors, listing verified remote software engineering and product positions.',
    importantTips: [
      'Check the "Anywhere in the World" section specifically to find companies open to hiring international student contractors.',
      'Submit a concise cover letter focused on your problem-solving speed and independent delivery track record.',
    ],
    tags: ['Remote First', 'Established Companies', 'Global Hiring'],
  },

  // 8. Freelancing & Student Client Work
  {
    id: 'upwork',
    name: 'Upwork',
    url: 'https://www.upwork.com',
    category: 'Freelancing & Contract',
    opportunityTypes: ['Freelance Web Development', 'Data Scraping', 'AI Model Integration'],
    suitableFor: 'Students with concrete, marketable skills (React, Next.js, Python automation, scraping) who want to earn while building client experience.',
    locationType: 'Remote',
    compensationStatus: 'Depends on Project',
    difficulty: 'Moderate',
    primaryTrack: 'freelance',
    shortDescription: 'The world’s leading freelance marketplace connecting independent developers and designers with international businesses for contract gigs.',
    importantTips: [
      'Start by bidding on small, well-defined projects (under $100) with ultra-fast turnaround to build your initial 5-star review history.',
      'Never send generic cut-and-paste proposals: answer the client’s exact question in the first two lines of your bid.',
      'Attach a customized Loom screen recording demonstrating you understand their technical problem.',
    ],
    tags: ['Freelance', 'Hourly / Fixed Price', 'Client Work', 'Global Income'],
  },
  {
    id: 'contra',
    name: 'Contra',
    url: 'https://contra.com',
    category: 'Freelancing & Contract',
    opportunityTypes: ['Commission-Free Freelancing', 'Independent Engineering', 'Design Contracts'],
    suitableFor: 'Modern tech freelancers and student builders who want a commission-free visual portfolio and contract platform.',
    locationType: 'Remote',
    compensationStatus: 'Paid / Stipend',
    difficulty: 'Moderate',
    primaryTrack: 'freelance',
    shortDescription: 'A modern, commission-free freelance network where Gen-Z builders and developers showcase verified projects and get hired by top startups.',
    importantTips: [
      'Set up your Contra portfolio with case studies featuring live interactive embeds, client goals, and tech stack badges.',
      'Contra charges 0% commission fees to freelancers, making it great for international student earners.',
      'Apply to curated opportunities on the "Discover Opportunities" feed.',
    ],
    tags: ['0% Commission', 'Portfolio First', 'Modern Startups'],
  },
];

export const APPLICATION_MISTAKES: ApplicationMistake[] = [
  {
    id: 'mistake-generic-resume',
    title: 'Sending 1 Generic Resume to 300 Companies',
    mistake: 'Using the exact same broad resume without tailoring keywords to the role or company tech stack.',
    whyItHurts: 'Applicant Tracking Systems (ATS) and recruiters scan for specific keywords (e.g. Next.js, Docker, PyTorch). A generic resume gets filtered out before a human ever reads it.',
    recommendedFix: 'Maintain a master resume, then create 2-3 tailored variants (e.g. Frontend/React focus, Backend/Node focus, ML focus) that match the specific job requirements.',
  },
  {
    id: 'mistake-no-live-demos',
    title: 'Listing GitHub Links with Broken or No Live Demos',
    mistake: 'Including GitHub repositories that have no README, no screenshots, and no deployed preview URL.',
    whyItHurts: 'Recruiters spend 6 to 10 seconds reviewing a student application. They will never clone and run your repository locally.',
    recommendedFix: 'Deploy every project for free on Vercel, Netlify, or Hugging Face Spaces. Put the clickable live demo link at the very top of your project bullet point.',
  },
  {
    id: 'mistake-tutorial-clones',
    title: 'Featuring Common YouTube Tutorial Clones as Main Projects',
    mistake: 'Showcasing a basic Todo App, Netflix clone, or Weather app that thousands of other students have copied step-by-step.',
    whyItHurts: 'Hiring managers instantly recognize boilerplate tutorial code. It demonstrates copying ability rather than independent problem-solving.',
    recommendedFix: 'Add unique business logic, real authentication, custom APIs, or build a tool that solves a real problem for your college club or local community.',
  },
  {
    id: 'mistake-ignoring-referrals',
    title: 'Relying Solely on "Easy Apply" Without Networking',
    mistake: 'Clicking "Easy Apply" on LinkedIn 50 times a day without reaching out to recruiters, founders, or alumni.',
    whyItHurts: 'Public Easy Apply listings often receive 1,000+ applicants within 24 hours. The conversion rate is typically under 1%.',
    recommendedFix: 'Identify university alumni or engineering leads at the company. Send a concise 3-sentence note highlighting your relevant project and asking for a referral.',
  },
  {
    id: 'mistake-ignoring-timelines',
    title: 'Starting the Search in May for Summer Internships',
    mistake: 'Waiting until final semester exams in April/May to begin applying for summer internships.',
    whyItHurts: 'Major tech companies and global programs (GSoC, Mitacs, Amazon, Google) finish their summer hiring between August and January.',
    recommendedFix: 'Begin preparing your resume and LeetCode/portfolio in July/August. Apply to off-campus and corporate internship cycles starting in August–October.',
  },
];

export const APPLICATION_PLAYBOOK: ApplicationStrategyStep[] = [
  {
    stepNumber: '01',
    title: 'Build Proof-of-Work Portfolios (Not Just Certificates)',
    description: 'Recruiters hire builders, not certificate collectors. 2 robust, deployed full-stack or ML projects with real users beat 15 passive video certificates every single time.',
    actionItems: [
      'Deploy 2 production projects on Vercel, Render, or Hugging Face.',
      'Write professional GitHub READMEs with architecture diagrams and live links.',
      'Record a 60-second Loom video walkthrough embedded in your portfolio.',
    ],
  },
  {
    stepNumber: '02',
    title: 'Format a Single-Page ATS-Optimized Resume',
    description: 'Keep your resume strictly to 1 page using clean, single-column formatting (use Reactive Resume or Overleaf LaTeX templates) without multi-column graphics.',
    actionItems: [
      'Use the XYZ framework for bullet points: "Accomplished [X], as measured by [Y], by doing [Z]".',
      'Remove high school marks, photos, home address, and soft skill buzzwords.',
      'Ensure contact links (LinkedIn, GitHub, Portfolio) are live and clickable in the PDF.',
    ],
  },
  {
    stepNumber: '03',
    title: 'Target High-Yield Channels Over Spray-and-Pray',
    description: 'Diversify your application funnel across high-conversion platforms rather than relying on one crowded job board.',
    actionItems: [
      'Direct founder outreach on Wellfound & Work at a Startup.',
      'Open-source contribution programs (GSoC, LFX, MLH Fellowship).',
      'Employee alumni referrals on LinkedIn for enterprise MNCs.',
      'Corporate hackathons on Unstop for direct interview fast-tracks.',
    ],
  },
  {
    stepNumber: '04',
    title: 'Master the 3-Sentence Cold Outreach Template',
    description: 'When reaching out to startup founders or engineering leads on LinkedIn or Twitter/X, keep it ultra-concise and value-first.',
    actionItems: [
      'Sentence 1: Compliment a specific product feature or recent company milestone.',
      'Sentence 2: Link a deployed project you built using the exact tech stack they hire for.',
      'Sentence 3: Ask a low-friction question (e.g., "Are you looking for an engineering intern this summer?").',
    ],
  },
];

export const INTERNSHIP_FAQS: InternshipFaq[] = [
  {
    question: 'When is the best time for college students to apply for summer internships?',
    answer:
      'For global tech MNCs (Google, Microsoft, Amazon) and international research fellowships (Mitacs, CERN, GSoC), applications open as early as August to November for the following summer. For startups and domestic Indian companies, hiring typically peaks between January and April.',
  },
  {
    question: 'How can 1st and 2nd year students get an internship without prior work experience?',
    answer:
      'Focus on open-source programs (like MLH Fellowship, GSoC, and Outreachy), hackathons on Unstop, student developer programs, or early-stage startups on Wellfound. Having 2 real deployed projects with clean code and a live URL is more than enough to prove your capability.',
  },
  {
    question: 'Are open-source programs like GSoC and MLH Fellowship paid?',
    answer:
      'Yes. Google Summer of Code provides stipends adjusted to the student’s country (typically $1,500 to $3,000+ USD), Outreachy provides a $7,000 USD stipend, and MLH Fellowship provides educational stipends to support full-time learning during the term.',
  },
  {
    question: 'How do I avoid unpaid internship scams or fake job postings?',
    answer:
      'Never pay any company for "training fees", "exam fees", or "security deposits". Legitimate companies pay you for your work—never the other way around. Always verify the company’s website, LinkedIn employee count, and glassdoor reviews before accepting an offer.',
  },
  {
    question: 'Should I apply if I do not meet 100% of the listed requirements?',
    answer:
      'Yes. Job descriptions are wishlists, not strict checklists. If you meet 50% to 60% of the core technical requirements (e.g. proficient in React and JavaScript even if you haven’t used their specific state library), you should apply with a customized project demo.',
  },
];
