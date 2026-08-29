import { Opportunity, IOpportunity, OpportunityType, OpportunityStatus } from '../models/Opportunity';

export interface OpportunityQueryOptions {
  opportunityType?: string;
  status?: string;
  search?: string;
  isFeatured?: boolean | string;
  isThisWeek?: boolean | string;
  locationType?: string;
  sort?: 'deadline' | 'newest' | 'recommended' | string;
  page?: number;
  limit?: number;
}

export const SEED_OPPORTUNITIES = [
  {
    name: 'Google Summer of Code (GSoC) 2026',
    slug: 'google-summer-of-code-2026',
    organization: 'Google Open Source',
    organizationLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200',
    officialWebsite: 'https://summerofcode.withgoogle.com/',
    officialApplicationLink: 'https://summerofcode.withgoogle.com/how-it-works',
    opportunityType: 'Open Source' as OpportunityType,
    eligibility: '18+ years old, enrolled student or open source contributor globally',
    whoShouldApply: 'Software engineering, AI/ML, and system design students looking to write production code with global mentors and receive an international stipend.',
    shortDescription: 'A global, online mentorship program bringing new contributors into open source software development with top organizations and tech foundations.',
    fullDescription: 'Google Summer of Code is a global program focused on bringing new contributors into open source software development. GSoC contributors work with an open source organization on a 12+ week programming project under the guidance of mentors.',
    location: 'Global / Remote',
    locationType: 'Remote' as const,
    deadline: new Date('2026-04-08T18:00:00Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: 'Stipend: $1,500 – $6,000 (PPP adjusted)',
    tags: ['Open Source', 'Mentorship', 'Remote', 'Google', 'Python', 'Rust', 'C++', 'JavaScript'],
  },
  {
    name: 'Smart India Hackathon (SIH) 2026',
    slug: 'smart-india-hackathon-2026',
    organization: 'Ministry of Education & AICTE, Govt. of India',
    organizationLogo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200',
    officialWebsite: 'https://www.sih.gov.in/',
    officialApplicationLink: 'https://www.sih.gov.in/',
    opportunityType: 'Hackathon' as OpportunityType,
    eligibility: 'Regular students studying in AICTE / UGC approved higher education institutions (Team of 6 with at least 1 female member)',
    whoShouldApply: 'Engineering, design, and tech students interested in solving real-world government and ministry problem statements.',
    shortDescription: 'World’s biggest open innovation hackathon by Govt of India solving digital governance, defense, clean energy, and healthcare challenges.',
    fullDescription: 'Smart India Hackathon is a nationwide initiative to provide students a platform to solve some of the pressing problems we face in our daily lives, and thus inculcate a culture of product innovation and a mindset of problem-solving.',
    location: 'India (Nodal Centers & Virtual)',
    locationType: 'Hybrid' as const,
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: '₹1,00,000 per problem statement winner',
    tags: ['Hackathon', 'Govt of India', 'Hardware', 'Software', 'AICTE', 'Engineering'],
  },
  {
    name: 'Reliance Foundation Undergraduate Scholarship 2026-27',
    slug: 'reliance-foundation-undergraduate-scholarship',
    organization: 'Reliance Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200',
    officialWebsite: 'https://www.reliancefoundation.org/',
    officialApplicationLink: 'https://scholarships.reliancefoundation.org/',
    opportunityType: 'Scholarship' as OpportunityType,
    eligibility: 'Resident Indian citizens enrolled in 1st year full-time undergraduate degree in any stream with minimum 60% marks in 12th standard and household income < ₹15 Lakhs/year.',
    whoShouldApply: 'Meritorious undergraduate students in need of financial empowerment to pursue holistic higher education in India.',
    shortDescription: 'Merit-cum-means scholarship awarding up to ₹2 Lakhs over degree duration to 5,000 selected first-year college students across India.',
    fullDescription: 'The Reliance Foundation Undergraduate Scholarship provides up to ₹2 Lakhs over the duration of the degree to support meritorious and underprivileged students pursuing undergraduate degrees in India.',
    location: 'India',
    locationType: 'In-Person' as const,
    deadline: new Date('2026-10-15T23:59:59Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: 'Grant up to ₹2,00,000 across degree',
    tags: ['Scholarship', 'Undergraduate', 'Financial Aid', 'Reliance Foundation', 'India'],
  },
  {
    name: 'Major League Hacking (MLH) Fellowship',
    slug: 'mlh-fellowship-2026',
    organization: 'Major League Hacking (MLH)',
    organizationLogo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200',
    officialWebsite: 'https://fellowship.mlh.io/',
    officialApplicationLink: 'https://fellowship.mlh.io/apply',
    opportunityType: 'Fellowship' as OpportunityType,
    eligibility: 'Current students or recent graduates globally with coding proficiency in at least one modern language and English conversational fluency.',
    whoShouldApply: 'Aspiring software engineers wanting an alternative to traditional tech internships by contributing to real open-source projects with industry mentors.',
    shortDescription: 'A remote 12-week internship alternative where fellows collaborate on open source tools used by millions while receiving educational stipends.',
    fullDescription: 'The MLH Fellowship is an internship alternative for software engineers. Instead of working at a single company, fellows contribute to major open source projects under the direct mentorship of senior industry engineers.',
    location: 'Global / Remote',
    locationType: 'Remote' as const,
    deadline: new Date('2026-05-31T23:59:59Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: 'Educational Stipend provided based on location',
    tags: ['Fellowship', 'Open Source', 'Software Engineering', 'Remote', 'Mentorship'],
  },
  {
    name: 'Mitacs Globalink Research Internship (GRI) 2026',
    slug: 'mitacs-globalink-research-internship',
    organization: 'Mitacs Canada',
    organizationLogo: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200',
    officialWebsite: 'https://www.mitacs.ca/en/programs/globalink/globalink-research-internship',
    officialApplicationLink: 'https://globalink.mitacs.ca/',
    opportunityType: 'Research Program' as OpportunityType,
    eligibility: 'Full-time undergraduate students (entering 3rd/penultimate year) from partner countries including India with minimum GPA 8.0/10.',
    whoShouldApply: 'Pre-final year students passionate about academic research, publishing papers, and pursuing master’s or Ph.D. degrees in Canada.',
    shortDescription: 'Fully funded 12-week research internship pairing top international students with Canadian academic professors across diverse STEM and humanities fields.',
    fullDescription: 'The Mitacs Globalink Research Internship pairs high-achieving undergraduates from around the world with faculty mentors at Canadian universities for a 12-week funded summer research project.',
    location: 'Canada (Multiple Universities)',
    locationType: 'In-Person' as const,
    deadline: new Date('2026-09-20T20:00:00Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: 'Fully funded: Flight, housing, health insurance & living stipend',
    tags: ['Research', 'International', 'Canada', 'STEM', 'Academic Papers', 'Funded'],
  },
  {
    name: 'ICPC (International Collegiate Programming Contest)',
    slug: 'icpc-collegiate-programming-contest',
    organization: 'ICPC Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200',
    officialWebsite: 'https://icpc.global/',
    officialApplicationLink: 'https://icpc.global/regionals',
    opportunityType: 'Coding Competition' as OpportunityType,
    eligibility: 'Enrolled university students competing in teams of 3 representing their institution (subject to ICPC eligibility trees).',
    whoShouldApply: 'Competitive programmers, algorithm enthusiasts, and ACM student chapter members aiming for regional and world finals.',
    shortDescription: 'The premier algorithmic programming competition for university students globally, testing high-speed problem solving and data structures.',
    fullDescription: 'The International Collegiate Programming Contest is the oldest, largest, and most prestigious algorithmic programming competition for university students.',
    location: 'Global (Regional Contests & World Finals)',
    locationType: 'In-Person' as const,
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming' as OpportunityStatus,
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'World Finals Gold, Silver, Bronze medals & Global Tech Recognition',
    tags: ['Competitive Programming', 'Algorithms', 'DSA', 'C++', 'Java', 'ICPC'],
  },
  {
    name: 'Microsoft Imagine Cup 2026',
    slug: 'microsoft-imagine-cup-2026',
    organization: 'Microsoft Corporation',
    organizationLogo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=200',
    officialWebsite: 'https://imaginecup.microsoft.com/',
    officialApplicationLink: 'https://imaginecup.microsoft.com/category/student',
    opportunityType: 'Entrepreneurship' as OpportunityType,
    eligibility: 'Students 16+ enrolled in accredited educational institutions (Teams of 1 to 4).',
    whoShouldApply: 'Student startup founders and AI innovators building software solutions utilizing Microsoft Azure and generative AI technologies.',
    shortDescription: 'Global premier student technology competition empowering student entrepreneurs to launch innovative startups using Azure and AI.',
    fullDescription: 'Imagine Cup is a global student technology competition that empowers students to build purposeful solutions with technology and turn their ideas into successful businesses.',
    location: 'Global / Remote & Seattle Finals',
    locationType: 'Hybrid' as const,
    deadline: new Date('2026-05-15T23:59:59Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: '$100,000 USD Grand Prize + Mentorship with Microsoft CEO',
    tags: ['Startup', 'AI', 'Azure', 'Innovation', 'Entrepreneurship', 'Global'],
  },
  {
    name: 'GitHub Campus Expert Program',
    slug: 'github-campus-expert-program',
    organization: 'GitHub Education',
    organizationLogo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=200',
    officialWebsite: 'https://github.com/education/campus-experts',
    officialApplicationLink: 'https://github.com/education/campus-experts',
    opportunityType: 'Developer Program' as OpportunityType,
    eligibility: 'Enrolled college students 18+ with active GitHub student status and at least 1 year remaining before graduation.',
    whoShouldApply: 'Campus tech leaders, open source organizers, and hackathon managers wanting to build inclusive technical communities.',
    shortDescription: 'Leadership program providing training, swag, and financial grants to build and enrich technical developer communities on college campuses.',
    fullDescription: 'GitHub Campus Experts are student leaders that strive to build diverse and inclusive spaces to learn skills, share their experiences, and build software together on their campuses.',
    location: 'Global / On-Campus',
    locationType: 'Hybrid' as const,
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming' as OpportunityStatus,
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'Event grants, swags, GitHub training & community funding',
    tags: ['Community', 'Leadership', 'GitHub', 'Developer Relations', 'Campus'],
  },
  {
    name: 'Adobe India Women-in-Technology Scholarship',
    slug: 'adobe-india-women-in-technology-scholarship',
    organization: 'Adobe India',
    organizationLogo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    officialWebsite: 'https://www.adobe.com/careers/university/india-wit-scholarship.html',
    officialApplicationLink: 'https://www.adobe.com/careers/university/india-wit-scholarship.html',
    opportunityType: 'Scholarship' as OpportunityType,
    eligibility: 'Female students enrolled in full-time B.Tech/Dual Degree Computer Science, Information Science, or related engineering courses in India (3rd year).',
    whoShouldApply: 'Outstanding female computer science students demonstrating leadership, strong academic excellence, and technical creativity.',
    shortDescription: 'Merit scholarship covering tuition fees plus an internship interview opportunity with Adobe Research India.',
    fullDescription: 'Adobe created the Adobe India Women-in-Technology Scholarship to recognize outstanding undergraduate and master female students studying Computer Science in India.',
    location: 'India',
    locationType: 'In-Person' as const,
    deadline: new Date('2026-09-30T23:59:59Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: 'Tuition fees sponsorship + Opportunity to interview for internship',
    tags: ['Women in Tech', 'Scholarship', 'Engineering', 'Adobe', 'Computer Science'],
  },
  {
    name: 'Linux Foundation Mentorship (LFX Mentorship)',
    slug: 'linux-foundation-mentorship-program',
    organization: 'The Linux Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200',
    officialWebsite: 'https://lfx.linuxfoundation.org/tools/mentorship/',
    officialApplicationLink: 'https://mentorship.lfx.linuxfoundation.org/',
    opportunityType: 'Open Source' as OpportunityType,
    eligibility: 'Aspiring developers 18+ globally eligible to receive payments and contribute to CNCF, Linux Kernel, Hyperledger, or RISC-V projects.',
    whoShouldApply: 'Systems programmers, cloud-native developers, and open-source contributors wanting direct mentorship from foundational core maintainers.',
    shortDescription: 'Triannual structured mentorship matching open-source contributors with active Linux Foundation projects with full stipends.',
    fullDescription: 'LFX Mentorship is designed to help open source developers—many of whom are first-time open source contributors—with necessary skills to contribute effectively to open source communities.',
    location: 'Global / Remote',
    locationType: 'Remote' as const,
    deadline: new Date('2026-05-18T23:59:59Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: 'Stipend: $3,000 – $6,600 USD based on country tier',
    tags: ['Linux', 'Cloud Native', 'Kubernetes', 'Kernel', 'Open Source', 'Mentorship'],
  },
  {
    name: 'Hult Prize Global Challenge 2026',
    slug: 'hult-prize-global-challenge-2026',
    organization: 'Hult Prize Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200',
    officialWebsite: 'https://www.hultprize.org/',
    officialApplicationLink: 'https://www.hultprize.org/apply/',
    opportunityType: 'Entrepreneurship' as OpportunityType,
    eligibility: 'Currently enrolled undergraduate and graduate university students around the world (Teams of 3–5).',
    whoShouldApply: 'Social impact entrepreneurs, sustainability innovators, and business students building scalable social enterprises.',
    shortDescription: 'The world’s largest student social entrepreneurship competition awarding $1,000,000 USD in seed capital to the winning student startup.',
    fullDescription: 'The Hult Prize challenges young people to solve the world’s most pressing issues through social entrepreneurship. The winning team receives $1M USD in seed funding to launch their enterprise.',
    location: 'Global (On-Campus, Regional Summits & London Accelerator)',
    locationType: 'Hybrid' as const,
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming' as OpportunityStatus,
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: '$1,000,000 USD Seed Funding to winning enterprise',
    tags: ['Social Impact', 'Startup', 'Entrepreneurship', 'Sustainability', 'Global'],
  },
  {
    name: 'ACM India Summer & Winter Schools',
    slug: 'acm-india-summer-winter-schools',
    organization: 'ACM India (Association for Computing Machinery)',
    organizationLogo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200',
    officialWebsite: 'https://india.acm.org/education/acm-india-summer-winter-schools',
    officialApplicationLink: 'https://india.acm.org/education/acm-india-summer-winter-schools',
    opportunityType: 'Student Conference' as OpportunityType,
    eligibility: 'Undergraduate, Master’s, or Ph.D. students enrolled in computer science or related engineering programs in India.',
    whoShouldApply: 'Students keen to deep-dive into advanced topics (Quantum Computing, Cryptography, Cybersecurity, Compilers, ML) taught by premier researchers.',
    shortDescription: 'Intensive 2-week academic schools conducted by premier professors from IITs, IISc, and global corporate research labs.',
    fullDescription: 'ACM India Summer and Winter Schools offer a deep dive into selected computer science research topics. Each school is organized at an academic or research institution with lectures and hands-on lab sessions.',
    location: 'India (IITs / IIITs / IISc / Virtual)',
    locationType: 'In-Person' as const,
    deadline: new Date('2026-05-10T23:59:59Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: false,
    isThisWeek: true,
    stipendOrPrize: 'Subsidized academic registration + Industry certification',
    tags: ['Research', 'ACM India', 'IIT', 'Computer Science', 'Advanced Topics'],
  },
  {
    name: 'L’Oréal India For Young Women In Science Scholarship',
    slug: 'loreal-india-for-young-women-in-science-scholarship',
    organization: 'L’Oréal India',
    organizationLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
    officialWebsite: 'https://www.loreal.com/en/india/articles/commitments/for-young-women-in-science/',
    officialApplicationLink: 'https://www.buddy4study.com/page/loreal-india-for-young-women-in-science-scholarships',
    opportunityType: 'Scholarship' as OpportunityType,
    eligibility: 'Female students who have passed Class 12 in the science stream with minimum 85% marks and enrolled in science/engineering/medical undergraduate programs in India (family income < ₹6 Lakhs/yr).',
    whoShouldApply: 'Talented young women in India pursuing bachelor’s degrees in Pure Science, Engineering, Medicine, or Biotechnology.',
    shortDescription: 'Scholarship granting up to ₹2.5 Lakhs to support promising young women to pursue graduation studies in scientific disciplines in India.',
    fullDescription: 'The L’Oréal India For Young Women in Science Scholarship encourages and supports young women to pursue college education in scientific fields.',
    location: 'India',
    locationType: 'In-Person' as const,
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming' as OpportunityStatus,
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'Up to ₹2,50,000 for entire graduation duration',
    tags: ['Women in STEM', 'Scholarship', 'Science', 'Engineering', 'Medical', 'India'],
  },
  {
    name: 'ETHGlobal Hackathons 2026',
    slug: 'ethglobal-hackathons-2026',
    organization: 'ETHGlobal',
    organizationLogo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200',
    officialWebsite: 'https://ethglobal.com/',
    officialApplicationLink: 'https://ethglobal.com/events',
    opportunityType: 'Hackathon' as OpportunityType,
    eligibility: 'Open to all developers, designers, and web3 researchers worldwide (Free application).',
    whoShouldApply: 'Solidity developers, smart contract engineers, cryptography researchers, and frontend developers building on EVM blockchains.',
    shortDescription: 'The leading global Web3 and Ethereum hackathon series hosting both in-person flagship events and virtual global competitions.',
    fullDescription: 'ETHGlobal coordinates the world’s top Web3 hackathons, connecting developers with the Ethereum ecosystem to build decentralized applications.',
    location: 'Global (Tokyo, Brussels, Bangkok & Virtual)',
    locationType: 'Hybrid' as const,
    deadline: new Date('2026-06-25T23:59:59Z'),
    isDeadlineVerified: true,
    status: 'Open' as OpportunityStatus,
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: '$500,000+ total prizes per flagship hackathon event',
    tags: ['Web3', 'Ethereum', 'Smart Contracts', 'Hackathon', 'Blockchain'],
  },
  {
    name: 'Postman Student Leader Program',
    slug: 'postman-student-leader-program',
    organization: 'Postman',
    organizationLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
    officialWebsite: 'https://www.postman.com/student-program/',
    officialApplicationLink: 'https://www.postman.com/student-program/student-expert/',
    opportunityType: 'Developer Program' as OpportunityType,
    eligibility: 'Enrolled students who have completed the Postman Student Expert certification training.',
    whoShouldApply: 'API enthusiasts, student developers, and campus tech ambassadors interested in teaching APIs to their peers.',
    shortDescription: 'Global educational initiative helping students become certified API leaders and organize developer workshops on campus.',
    fullDescription: 'The Postman Student Program empowers students with API knowledge and skills through self-paced learning certifications and campus workshop leader roles.',
    location: 'Global / Virtual',
    locationType: 'Remote' as const,
    deadline: null,
    isDeadlineVerified: false,
    status: 'Open' as OpportunityStatus,
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'Official Certification, Swag Kits & Workshop Funding',
    tags: ['APIs', 'Developer Relations', 'Postman', 'Certification', 'Remote'],
  }
];

export class OpportunityService {
  /**
   * Helper: check and update expired opportunities
   */
  public static async autoExpireOpportunities(): Promise<number> {
    try {
      const now = new Date();
      const result = await Opportunity.updateMany(
        {
          isDeadlineVerified: true,
          deadline: { $lt: now },
          status: { $ne: 'Expired' },
        },
        {
          $set: { status: 'Expired' },
        }
      );
      return result.modifiedCount || 0;
    } catch (e) {
      console.warn('Auto-expire check failed:', e);
      return 0;
    }
  }

  /**
   * Get all opportunities with filters, search, and sorting
   */
  public static async getAllOpportunities(options: OpportunityQueryOptions = {}) {
    await this.autoExpireOpportunities();

    const {
      opportunityType,
      status,
      search,
      isFeatured,
      isThisWeek,
      locationType,
      sort = 'recommended',
      page = 1,
      limit = 50,
    } = options;

    const query: any = {};

    if (opportunityType && opportunityType !== 'All') {
      query.opportunityType = opportunityType;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (isFeatured === true || isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (isThisWeek === true || isThisWeek === 'true') {
      query.isThisWeek = true;
    }

    if (locationType && locationType !== 'All') {
      query.locationType = locationType;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { organization: regex },
        { eligibility: regex },
        { whoShouldApply: regex },
        { shortDescription: regex },
        { tags: regex },
        { location: regex },
      ];
    }

    let sortOption: any = { isFeatured: -1, createdAt: -1 };
    if (sort === 'deadline') {
      // Sort by deadline ascending (verified closest dates first, then unverified/nulls)
      sortOption = { isDeadlineVerified: -1, deadline: 1, createdAt: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'recommended') {
      sortOption = { isFeatured: -1, isThisWeek: -1, status: 1, createdAt: -1 };
    }

    try {
      const skip = (Math.max(1, page) - 1) * Math.max(1, limit);
      const [items, total] = await Promise.all([
        Opportunity.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
        Opportunity.countDocuments(query),
      ]);

      if (items.length > 0 || total > 0) {
        return {
          opportunities: items,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      }
    } catch (e) {
      console.warn('DB query failed, filtering in-memory seed opportunities:', e);
    }

    // In-memory filter fallback
    let fallbackItems = [...SEED_OPPORTUNITIES].map((item, idx) => ({
      _id: `opp_${idx + 1}`,
      ...item,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Auto-expire in-memory items
    const now = Date.now();
    fallbackItems = fallbackItems.map((item) => {
      if (item.isDeadlineVerified && item.deadline && new Date(item.deadline).getTime() < now) {
        return { ...item, status: 'Expired' as OpportunityStatus };
      }
      return item;
    });

    if (opportunityType && opportunityType !== 'All') {
      fallbackItems = fallbackItems.filter((i) => i.opportunityType.toLowerCase() === opportunityType.toLowerCase());
    }

    if (status && status !== 'All') {
      fallbackItems = fallbackItems.filter((i) => i.status.toLowerCase() === status.toLowerCase());
    }

    if (isFeatured === true || isFeatured === 'true') {
      fallbackItems = fallbackItems.filter((i) => i.isFeatured);
    }

    if (isThisWeek === true || isThisWeek === 'true') {
      fallbackItems = fallbackItems.filter((i) => i.isThisWeek);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      fallbackItems = fallbackItems.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.organization.toLowerCase().includes(q) ||
          i.eligibility.toLowerCase().includes(q) ||
          i.shortDescription.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'deadline') {
      fallbackItems.sort((a, b) => {
        if (a.deadline && b.deadline) return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        return 0;
      });
    } else if (sort === 'recommended') {
      fallbackItems.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isThisWeek && !b.isThisWeek) return -1;
        if (!a.isThisWeek && b.isThisWeek) return 1;
        return 0;
      });
    }

    return {
      opportunities: fallbackItems,
      total: fallbackItems.length,
      page: 1,
      totalPages: 1,
    };
  }

  /**
   * Get single opportunity by slug or ID
   */
  public static async getOpportunityBySlugOrId(slugOrId: string) {
    await this.autoExpireOpportunities();

    try {
      let opp: any = null;
      if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        opp = await Opportunity.findById(slugOrId).lean();
      }
      if (!opp) {
        opp = await Opportunity.findOne({ slug: slugOrId.toLowerCase().trim() }).lean();
      }
      if (opp) {
        // Increment view count asynchronously
        Opportunity.updateOne({ _id: opp._id }, { $inc: { viewCount: 1 } }).exec();
        return opp;
      }
    } catch (e) {
      console.warn('DB query failed for opportunity:', e);
    }

    const cleanSlug = slugOrId.toLowerCase().trim();
    const fallback = SEED_OPPORTUNITIES.find((o) => o.slug === cleanSlug);
    if (fallback) {
      return {
        _id: 'opp_fallback',
        ...fallback,
        viewCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * Admin Create
   */
  public static async createOpportunity(data: Partial<IOpportunity>) {
    if (!data.name || !data.organization || !data.officialWebsite || !data.officialApplicationLink) {
      throw new Error('Name, organization, website, and application link are required');
    }

    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const exists = await Opportunity.findOne({ slug });
    if (exists) {
      throw new Error(`An opportunity with slug "${slug}" already exists`);
    }

    const opportunity = new Opportunity({
      ...data,
      slug,
      isDeadlineVerified: Boolean(data.deadline),
    });

    return await opportunity.save();
  }

  /**
   * Admin Update
   */
  public static async updateOpportunity(id: string, data: Partial<IOpportunity>) {
    const opp = await Opportunity.findById(id);
    if (!opp) throw new Error('Opportunity not found');

    if (data.deadline !== undefined) {
      data.isDeadlineVerified = Boolean(data.deadline);
      if (data.deadline && new Date(data.deadline).getTime() < Date.now()) {
        data.status = 'Expired';
      }
    }

    Object.assign(opp, data);
    return await opp.save();
  }

  /**
   * Admin Delete
   */
  public static async deleteOpportunity(id: string) {
    return await Opportunity.findByIdAndDelete(id);
  }

  /**
   * Admin Cleanup Expired
   */
  public static async cleanupExpiredOpportunities() {
    const now = new Date();
    const result = await Opportunity.deleteMany({
      status: 'Expired',
      isDeadlineVerified: true,
      deadline: { $lt: now },
    });
    return result.deletedCount || 0;
  }

  /**
   * Structured JSON-LD generator for Opportunity
   */
  public static generateJsonLd(opp: any) {
    const baseUrl = 'https://spotpicks.delhi';
    const oppUrl = `${baseUrl}/student-opportunities/${opp.slug}`;

    return [
      {
        '@context': 'https://schema.org',
        '@type': opp.opportunityType === 'Scholarship' ? 'Grant' : 'EducationEvent',
        name: opp.name,
        description: opp.shortDescription,
        url: oppUrl,
        provider: {
          '@type': 'Organization',
          name: opp.organization,
          sameAs: opp.officialWebsite,
        },
        offers: {
          '@type': 'Offer',
          url: opp.officialApplicationLink,
          price: '0',
          priceCurrency: 'INR',
          availability:
            opp.status === 'Open'
              ? 'https://schema.org/InStock'
              : opp.status === 'Closed' || opp.status === 'Expired'
              ? 'https://schema.org/Discontinued'
              : 'https://schema.org/PreOrder',
          validThrough: opp.deadline ? new Date(opp.deadline).toISOString() : undefined,
        },
        educationalLevel: opp.eligibility,
        audience: {
          '@type': 'Audience',
          audienceType: opp.whoShouldApply,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Student Opportunities Hub',
            item: `${baseUrl}/student-opportunities`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: opp.name,
            item: oppUrl,
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the eligibility for ${opp.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: opp.eligibility,
            },
          },
          {
            '@type': 'Question',
            name: `What is the application deadline for ${opp.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: opp.isDeadlineVerified && opp.deadline
                ? `The verified application deadline is ${new Date(opp.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`
                : 'The application deadline cannot be verified at this moment. Please check the official provider website.',
            },
          },
          {
            '@type': 'Question',
            name: `Where can I officially apply for ${opp.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `You can apply directly at the official portal: ${opp.officialApplicationLink}`,
            },
          },
        ],
      },
    ];
  }
}
