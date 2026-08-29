import { apiClient } from '../api/apiClient';
import { Opportunity, OpportunityFilters, OpportunityStatus, OpportunityType } from '../types';

export const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    _id: 'opp-1',
    name: 'Google Summer of Code (GSoC) 2026',
    slug: 'google-summer-of-code-2026',
    organization: 'Google Open Source',
    organizationLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200',
    officialWebsite: 'https://summerofcode.withgoogle.com/',
    officialApplicationLink: 'https://summerofcode.withgoogle.com/how-it-works',
    opportunityType: 'Open Source',
    eligibility: '18+ years old, enrolled student or open source contributor globally',
    whoShouldApply: 'Software engineering, AI/ML, and system design students looking to write production code with global mentors and receive an international stipend.',
    shortDescription: 'A global, online mentorship program bringing new contributors into open source software development with top organizations and tech foundations.',
    fullDescription: 'Google Summer of Code is a global program focused on bringing new contributors into open source software development. GSoC contributors work with an open source organization on a 12+ week programming project under the guidance of mentors.',
    location: 'Global / Remote',
    locationType: 'Remote',
    deadline: '2026-04-08T18:00:00Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: 'Stipend: $1,500 – $6,000 (PPP adjusted)',
    tags: ['Open Source', 'Mentorship', 'Remote', 'Google', 'Python', 'Rust', 'C++', 'JavaScript'],
  },
  {
    id: 'opp-2',
    _id: 'opp-2',
    name: 'Smart India Hackathon (SIH) 2026',
    slug: 'smart-india-hackathon-2026',
    organization: 'Ministry of Education & AICTE, Govt. of India',
    organizationLogo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200',
    officialWebsite: 'https://www.sih.gov.in/',
    officialApplicationLink: 'https://www.sih.gov.in/',
    opportunityType: 'Hackathon',
    eligibility: 'Regular students studying in AICTE / UGC approved higher education institutions (Team of 6 with at least 1 female member)',
    whoShouldApply: 'Engineering, design, and tech students interested in solving real-world government and ministry problem statements.',
    shortDescription: 'World’s biggest open innovation hackathon by Govt of India solving digital governance, defense, clean energy, and healthcare challenges.',
    fullDescription: 'Smart India Hackathon is a nationwide initiative to provide students a platform to solve some of the pressing problems we face in our daily lives, and thus inculcate a culture of product innovation and a mindset of problem-solving.',
    location: 'India (Nodal Centers & Virtual)',
    locationType: 'Hybrid',
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming',
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: '₹1,00,000 per problem statement winner',
    tags: ['Hackathon', 'Govt of India', 'Hardware', 'Software', 'AICTE', 'Engineering'],
  },
  {
    id: 'opp-3',
    _id: 'opp-3',
    name: 'Reliance Foundation Undergraduate Scholarship 2026-27',
    slug: 'reliance-foundation-undergraduate-scholarship',
    organization: 'Reliance Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200',
    officialWebsite: 'https://www.reliancefoundation.org/',
    officialApplicationLink: 'https://scholarships.reliancefoundation.org/',
    opportunityType: 'Scholarship',
    eligibility: 'Resident Indian citizens enrolled in 1st year full-time undergraduate degree in any stream with minimum 60% marks in 12th standard and household income < ₹15 Lakhs/year.',
    whoShouldApply: 'Meritorious undergraduate students in need of financial empowerment to pursue holistic higher education in India.',
    shortDescription: 'Merit-cum-means scholarship awarding up to ₹2 Lakhs over degree duration to 5,000 selected first-year college students across India.',
    fullDescription: 'The Reliance Foundation Undergraduate Scholarship provides up to ₹2 Lakhs over the duration of the degree to support meritorious and underprivileged students pursuing undergraduate degrees in India.',
    location: 'India',
    locationType: 'In-Person',
    deadline: '2026-10-15T23:59:59Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: 'Grant up to ₹2,00,000 across degree',
    tags: ['Scholarship', 'Undergraduate', 'Financial Aid', 'Reliance Foundation', 'India'],
  },
  {
    id: 'opp-4',
    _id: 'opp-4',
    name: 'Major League Hacking (MLH) Fellowship',
    slug: 'mlh-fellowship-2026',
    organization: 'Major League Hacking (MLH)',
    organizationLogo: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200',
    officialWebsite: 'https://fellowship.mlh.io/',
    officialApplicationLink: 'https://fellowship.mlh.io/apply',
    opportunityType: 'Fellowship',
    eligibility: 'Current students or recent graduates globally with coding proficiency in at least one modern language and English conversational fluency.',
    whoShouldApply: 'Aspiring software engineers wanting an alternative to traditional tech internships by contributing to real open-source projects with industry mentors.',
    shortDescription: 'A remote 12-week internship alternative where fellows collaborate on open source tools used by millions while receiving educational stipends.',
    fullDescription: 'The MLH Fellowship is an internship alternative for software engineers. Instead of working at a single company, fellows contribute to major open source projects under the direct mentorship of senior industry engineers.',
    location: 'Global / Remote',
    locationType: 'Remote',
    deadline: '2026-05-31T23:59:59Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: 'Educational Stipend provided based on location',
    tags: ['Fellowship', 'Open Source', 'Software Engineering', 'Remote', 'Mentorship'],
  },
  {
    id: 'opp-5',
    _id: 'opp-5',
    name: 'Mitacs Globalink Research Internship (GRI) 2026',
    slug: 'mitacs-globalink-research-internship',
    organization: 'Mitacs Canada',
    organizationLogo: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200',
    officialWebsite: 'https://www.mitacs.ca/en/programs/globalink/globalink-research-internship',
    officialApplicationLink: 'https://globalink.mitacs.ca/',
    opportunityType: 'Research Program',
    eligibility: 'Full-time undergraduate students (entering 3rd/penultimate year) from partner countries including India with minimum GPA 8.0/10.',
    whoShouldApply: 'Pre-final year students passionate about academic research, publishing papers, and pursuing master’s or Ph.D. degrees in Canada.',
    shortDescription: 'Fully funded 12-week research internship pairing top international students with Canadian academic professors across diverse STEM and humanities fields.',
    fullDescription: 'The Mitacs Globalink Research Internship pairs high-achieving undergraduates from around the world with faculty mentors at Canadian universities for a 12-week funded summer research project.',
    location: 'Canada (Multiple Universities)',
    locationType: 'In-Person',
    deadline: '2026-09-20T20:00:00Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: 'Fully funded: Flight, housing, health insurance & living stipend',
    tags: ['Research', 'International', 'Canada', 'STEM', 'Academic Papers', 'Funded'],
  },
  {
    id: 'opp-6',
    _id: 'opp-6',
    name: 'ICPC (International Collegiate Programming Contest)',
    slug: 'icpc-collegiate-programming-contest',
    organization: 'ICPC Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200',
    officialWebsite: 'https://icpc.global/',
    officialApplicationLink: 'https://icpc.global/regionals',
    opportunityType: 'Coding Competition',
    eligibility: 'Enrolled university students competing in teams of 3 representing their institution (subject to ICPC eligibility trees).',
    whoShouldApply: 'Competitive programmers, algorithm enthusiasts, and ACM student chapter members aiming for regional and world finals.',
    shortDescription: 'The premier algorithmic programming competition for university students globally, testing high-speed problem solving and data structures.',
    fullDescription: 'The International Collegiate Programming Contest is the oldest, largest, and most prestigious algorithmic programming competition for university students.',
    location: 'Global (Regional Contests & World Finals)',
    locationType: 'In-Person',
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming',
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'World Finals Gold, Silver, Bronze medals & Global Tech Recognition',
    tags: ['Competitive Programming', 'Algorithms', 'DSA', 'C++', 'Java', 'ICPC'],
  },
  {
    id: 'opp-7',
    _id: 'opp-7',
    name: 'Microsoft Imagine Cup 2026',
    slug: 'microsoft-imagine-cup-2026',
    organization: 'Microsoft Corporation',
    organizationLogo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=200',
    officialWebsite: 'https://imaginecup.microsoft.com/',
    officialApplicationLink: 'https://imaginecup.microsoft.com/category/student',
    opportunityType: 'Entrepreneurship',
    eligibility: 'Students 16+ enrolled in accredited educational institutions (Teams of 1 to 4).',
    whoShouldApply: 'Student startup founders and AI innovators building software solutions utilizing Microsoft Azure and generative AI technologies.',
    shortDescription: 'Global premier student technology competition empowering student entrepreneurs to launch innovative startups using Azure and AI.',
    fullDescription: 'Imagine Cup is a global student technology competition that empowers students to build purposeful solutions with technology and turn their ideas into successful businesses.',
    location: 'Global / Remote & Seattle Finals',
    locationType: 'Hybrid',
    deadline: '2026-05-15T23:59:59Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: '$100,000 USD Grand Prize + Mentorship with Microsoft CEO',
    tags: ['Startup', 'AI', 'Azure', 'Innovation', 'Entrepreneurship', 'Global'],
  },
  {
    id: 'opp-8',
    _id: 'opp-8',
    name: 'GitHub Campus Expert Program',
    slug: 'github-campus-expert-program',
    organization: 'GitHub Education',
    organizationLogo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=200',
    officialWebsite: 'https://github.com/education/campus-experts',
    officialApplicationLink: 'https://github.com/education/campus-experts',
    opportunityType: 'Developer Program',
    eligibility: 'Enrolled college students 18+ with active GitHub student status and at least 1 year remaining before graduation.',
    whoShouldApply: 'Campus tech leaders, open source organizers, and hackathon managers wanting to build inclusive technical communities.',
    shortDescription: 'Leadership program providing training, swag, and financial grants to build and enrich technical developer communities on college campuses.',
    fullDescription: 'GitHub Campus Experts are student leaders that strive to build diverse and inclusive spaces to learn skills, share their experiences, and build software together on their campuses.',
    location: 'Global / On-Campus',
    locationType: 'Hybrid',
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming',
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'Event grants, swags, GitHub training & community funding',
    tags: ['Community', 'Leadership', 'GitHub', 'Developer Relations', 'Campus'],
  },
  {
    id: 'opp-9',
    _id: 'opp-9',
    name: 'Adobe India Women-in-Technology Scholarship',
    slug: 'adobe-india-women-in-technology-scholarship',
    organization: 'Adobe India',
    organizationLogo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    officialWebsite: 'https://www.adobe.com/careers/university/india-wit-scholarship.html',
    officialApplicationLink: 'https://www.adobe.com/careers/university/india-wit-scholarship.html',
    opportunityType: 'Scholarship',
    eligibility: 'Female students enrolled in full-time B.Tech/Dual Degree Computer Science, Information Science, or related engineering courses in India (3rd year).',
    whoShouldApply: 'Outstanding female computer science students demonstrating leadership, strong academic excellence, and technical creativity.',
    shortDescription: 'Merit scholarship covering tuition fees plus an internship interview opportunity with Adobe Research India.',
    fullDescription: 'Adobe created the Adobe India Women-in-Technology Scholarship to recognize outstanding undergraduate and master female students studying Computer Science in India.',
    location: 'India',
    locationType: 'In-Person',
    deadline: '2026-09-30T23:59:59Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: 'Tuition fees sponsorship + Opportunity to interview for internship',
    tags: ['Women in Tech', 'Scholarship', 'Engineering', 'Adobe', 'Computer Science'],
  },
  {
    id: 'opp-10',
    _id: 'opp-10',
    name: 'Linux Foundation Mentorship (LFX Mentorship)',
    slug: 'linux-foundation-mentorship-program',
    organization: 'The Linux Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=200',
    officialWebsite: 'https://lfx.linuxfoundation.org/tools/mentorship/',
    officialApplicationLink: 'https://mentorship.lfx.linuxfoundation.org/',
    opportunityType: 'Open Source',
    eligibility: 'Aspiring developers 18+ globally eligible to receive payments and contribute to CNCF, Linux Kernel, Hyperledger, or RISC-V projects.',
    whoShouldApply: 'Systems programmers, cloud-native developers, and open-source contributors wanting direct mentorship from foundational core maintainers.',
    shortDescription: 'Triannual structured mentorship matching open-source contributors with active Linux Foundation projects with full stipends.',
    fullDescription: 'LFX Mentorship is designed to help open source developers—many of whom are first-time open source contributors—with necessary skills to contribute effectively to open source communities.',
    location: 'Global / Remote',
    locationType: 'Remote',
    deadline: '2026-05-18T23:59:59Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: true,
    stipendOrPrize: 'Stipend: $3,000 – $6,600 USD based on country tier',
    tags: ['Linux', 'Cloud Native', 'Kubernetes', 'Kernel', 'Open Source', 'Mentorship'],
  },
  {
    id: 'opp-11',
    _id: 'opp-11',
    name: 'Hult Prize Global Challenge 2026',
    slug: 'hult-prize-global-challenge-2026',
    organization: 'Hult Prize Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200',
    officialWebsite: 'https://www.hultprize.org/',
    officialApplicationLink: 'https://www.hultprize.org/apply/',
    opportunityType: 'Entrepreneurship',
    eligibility: 'Currently enrolled undergraduate and graduate university students around the world (Teams of 3–5).',
    whoShouldApply: 'Social impact entrepreneurs, sustainability innovators, and business students building scalable social enterprises.',
    shortDescription: 'The world’s largest student social entrepreneurship competition awarding $1,000,000 USD in seed capital to the winning student startup.',
    fullDescription: 'The Hult Prize challenges young people to solve the world’s most pressing issues through social entrepreneurship. The winning team receives $1M USD in seed funding to launch their enterprise.',
    location: 'Global (On-Campus, Regional Summits & London Accelerator)',
    locationType: 'Hybrid',
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming',
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: '$1,00,000 USD Seed Funding to winning enterprise',
    tags: ['Social Impact', 'Startup', 'Entrepreneurship', 'Sustainability', 'Global'],
  },
  {
    id: 'opp-12',
    _id: 'opp-12',
    name: 'ACM India Summer & Winter Schools',
    slug: 'acm-india-summer-winter-schools',
    organization: 'ACM India (Association for Computing Machinery)',
    organizationLogo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200',
    officialWebsite: 'https://india.acm.org/education/acm-india-summer-winter-schools',
    officialApplicationLink: 'https://india.acm.org/education/acm-india-summer-winter-schools',
    opportunityType: 'Student Conference',
    eligibility: 'Undergraduate, Master’s, or Ph.D. students enrolled in computer science or related engineering programs in India.',
    whoShouldApply: 'Students keen to deep-dive into advanced topics (Quantum Computing, Cryptography, Cybersecurity, Compilers, ML) taught by premier researchers.',
    shortDescription: 'Intensive 2-week academic schools conducted by premier professors from IITs, IISc, and global corporate research labs.',
    fullDescription: 'ACM India Summer and Winter Schools offer a deep dive into selected computer science research topics. Each school is organized at an academic or research institution with lectures and hands-on lab sessions.',
    location: 'India (IITs / IIITs / IISc / Virtual)',
    locationType: 'In-Person',
    deadline: '2026-05-10T23:59:59Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: false,
    isThisWeek: true,
    stipendOrPrize: 'Subsidized academic registration + Industry certification',
    tags: ['Research', 'ACM India', 'IIT', 'Computer Science', 'Advanced Topics'],
  },
  {
    id: 'opp-13',
    _id: 'opp-13',
    name: 'L’Oréal India For Young Women In Science Scholarship',
    slug: 'loreal-india-for-young-women-in-science-scholarship',
    organization: 'L’Oréal India',
    organizationLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
    officialWebsite: 'https://www.loreal.com/en/india/articles/commitments/for-young-women-in-science/',
    officialApplicationLink: 'https://www.buddy4study.com/page/loreal-india-for-young-women-in-science-scholarships',
    opportunityType: 'Scholarship',
    eligibility: 'Female students who have passed Class 12 in the science stream with minimum 85% marks and enrolled in science/engineering/medical undergraduate programs in India (family income < ₹6 Lakhs/yr).',
    whoShouldApply: 'Talented young women in India pursuing bachelor’s degrees in Pure Science, Engineering, Medicine, or Biotechnology.',
    shortDescription: 'Scholarship granting up to ₹2.5 Lakhs to support promising young women to pursue graduation studies in scientific disciplines in India.',
    fullDescription: 'The L’Oréal India For Young Women in Science Scholarship encourages and supports young women to pursue college education in scientific fields.',
    location: 'India',
    locationType: 'In-Person',
    deadline: null,
    isDeadlineVerified: false,
    status: 'Upcoming',
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'Up to ₹2,50,000 for entire graduation duration',
    tags: ['Women in STEM', 'Scholarship', 'Science', 'Engineering', 'Medical', 'India'],
  },
  {
    id: 'opp-14',
    _id: 'opp-14',
    name: 'ETHGlobal Hackathons 2026',
    slug: 'ethglobal-hackathons-2026',
    organization: 'ETHGlobal',
    organizationLogo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200',
    officialWebsite: 'https://ethglobal.com/',
    officialApplicationLink: 'https://ethglobal.com/events',
    opportunityType: 'Hackathon',
    eligibility: 'Open to all developers, designers, and web3 researchers worldwide (Free application).',
    whoShouldApply: 'Solidity developers, smart contract engineers, cryptography researchers, and frontend developers building on EVM blockchains.',
    shortDescription: 'The leading global Web3 and Ethereum hackathon series hosting both in-person flagship events and virtual global competitions.',
    fullDescription: 'ETHGlobal coordinates the world’s top Web3 hackathons, connecting developers with the Ethereum ecosystem to build decentralized applications.',
    location: 'Global (Tokyo, Brussels, Bangkok & Virtual)',
    locationType: 'Hybrid',
    deadline: '2026-06-25T23:59:59Z',
    isDeadlineVerified: true,
    status: 'Open',
    isFeatured: true,
    isThisWeek: false,
    stipendOrPrize: '$500,000+ total prizes per flagship hackathon event',
    tags: ['Web3', 'Ethereum', 'Smart Contracts', 'Hackathon', 'Blockchain'],
  },
  {
    id: 'opp-15',
    _id: 'opp-15',
    name: 'Postman Student Leader Program',
    slug: 'postman-student-leader-program',
    organization: 'Postman',
    organizationLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
    officialWebsite: 'https://www.postman.com/student-program/',
    officialApplicationLink: 'https://www.postman.com/student-program/student-expert/',
    opportunityType: 'Developer Program',
    eligibility: 'Enrolled students who have completed the Postman Student Expert certification training.',
    whoShouldApply: 'API enthusiasts, student developers, and campus tech ambassadors interested in teaching APIs to their peers.',
    shortDescription: 'Global educational initiative helping students become certified API leaders and organize developer workshops on campus.',
    fullDescription: 'The Postman Student Program empowers students with API knowledge and skills through self-paced learning certifications and campus workshop leader roles.',
    location: 'Global / Virtual',
    locationType: 'Remote',
    deadline: null,
    isDeadlineVerified: false,
    status: 'Open',
    isFeatured: false,
    isThisWeek: false,
    stipendOrPrize: 'Official Certification, Swag Kits & Workshop Funding',
    tags: ['APIs', 'Developer Relations', 'Postman', 'Certification', 'Remote'],
  }
];

export const opportunityService = {
  async getOpportunities(params: OpportunityFilters = {}): Promise<{
    opportunities: Opportunity[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const res: any = await apiClient.get('/opportunities', { params });
      if (res?.data?.opportunities) {
        return res.data;
      }
      if (res?.opportunities) {
        return res;
      }
    } catch (e) {
      console.warn('API fetch failed for opportunities, using client-side fallback:', e);
    }

    // Client-side fallback filter
    let items = [...FALLBACK_OPPORTUNITIES];

    // Check expiry
    const now = Date.now();
    items = items.map((item) => {
      if (item.isDeadlineVerified && item.deadline && new Date(item.deadline).getTime() < now) {
        return { ...item, status: 'Expired' as OpportunityStatus };
      }
      return item;
    });

    if (params.opportunityType && params.opportunityType !== 'All') {
      items = items.filter(
        (i) => i.opportunityType.toLowerCase() === params.opportunityType?.toLowerCase()
      );
    }

    if (params.status && params.status !== 'All') {
      items = items.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params.isFeatured) {
      items = items.filter((i) => i.isFeatured);
    }

    if (params.isThisWeek) {
      items = items.filter((i) => i.isThisWeek);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.organization.toLowerCase().includes(q) ||
          i.eligibility.toLowerCase().includes(q) ||
          i.shortDescription.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.sort === 'deadline') {
      items.sort((a, b) => {
        if (a.deadline && b.deadline) return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        return 0;
      });
    } else if (params.sort === 'recommended') {
      items.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isThisWeek && !b.isThisWeek) return -1;
        if (!a.isThisWeek && b.isThisWeek) return 1;
        return 0;
      });
    }

    return {
      opportunities: items,
      total: items.length,
      page: 1,
      totalPages: 1,
    };
  },

  async getThisWeek(): Promise<Opportunity[]> {
    try {
      const res: any = await apiClient.get('/opportunities/this-week');
      if (res?.data && Array.isArray(res.data)) return res.data;
    } catch (e) {
      console.warn('Failed to fetch this-week opportunities from API:', e);
    }
    return FALLBACK_OPPORTUNITIES.filter((i) => i.isThisWeek);
  },

  async getOpportunityBySlug(slug: string): Promise<{ opportunity: Opportunity; jsonLd?: any }> {
    try {
      const res: any = await apiClient.get(`/opportunities/${slug}`);
      if (res?.data?.opportunity) {
        return res.data;
      }
    } catch (e) {
      console.warn('Failed to fetch opportunity by slug from API:', e);
    }

    const cleanSlug = slug.toLowerCase().trim();
    const fallback = FALLBACK_OPPORTUNITIES.find((o) => o.slug === cleanSlug);
    if (fallback) {
      return { opportunity: fallback };
    }

    throw new Error('Opportunity not found');
  },

  async createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
    const res: any = await apiClient.post('/opportunities', data);
    return res?.data || res;
  },

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const res: any = await apiClient.put(`/opportunities/${id}`, data);
    return res?.data || res;
  },

  async deleteOpportunity(id: string): Promise<boolean> {
    const res: any = await apiClient.delete(`/opportunities/${id}`);
    return res?.success !== false;
  },

  async cleanupExpired(): Promise<number> {
    const res: any = await apiClient.post('/opportunities/cleanup-expired');
    return res?.data?.deletedCount || 0;
  },
};
