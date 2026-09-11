/**
 * BRICS 2026 India Knowledge Hub - Curated Factual Seed Data
 *
 * Grounded in official sources:
 * - Official BRICS India 2026 Portal: https://www.brics2026.gov.in/
 * - Ministry of External Affairs, Government of India: https://www.mea.gov.in/
 * - Official BRICS Brazil 2025 Portal: https://brics.br/en
 * - New Development Bank (NDB): https://www.ndb.int/
 * - Official BRICS Summit Declarations (2009-2025)
 */

export interface BricsMemberSeed {
  name: string;
  officialName: string;
  slug: string;
  capital: string;
  region: string;
  isoCode: string;
  flagEmoji: string;
  flagUrl: string;
  joinedYear: number;
  membershipType: 'founding' | 'expanded_2011' | 'expanded_2024' | 'expanded_2025';
  status: 'full_member' | 'partner_country';
  description: string;
  bricsRole: string;
  economicProfile: {
    population: string;
    gdpNominal: string;
    currency: string;
    keyExports: string[];
    gdpPppShare: string;
  };
  presidenciesHeld: number[];
  officialSourceUrl: string;
  sourceName: string;
  displayOrder: number;
}

export interface BricsSummitSeed {
  summitNumber: number;
  year: number;
  hostCountry: string;
  hostCity: string;
  presidencyCountry: string;
  dates: string;
  status: 'completed' | 'scheduled';
  officialName: string;
  theme: string;
  declarationName: string;
  declarationUrl: string;
  summary: string;
  majorThemes: string[];
  keyOutcomes: string[];
  sourceUrls: Array<{ title: string; url: string }>;
}

export interface BricsPresidencySeed {
  year: number;
  presidencyCountry: string;
  summitHost: string;
  theme: string;
  importantInitiatives: string[];
  globalContext: string;
  status: 'completed' | 'current' | 'upcoming';
  officialSource: { title: string; url: string };
}

export interface BricsFactSeed {
  key: string;
  label: string;
  value: string;
  description: string;
  category: 'governance' | 'economy' | 'membership' | 'institutions' | 'summit_2026' | 'general';
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  displayOrder: number;
  featured: boolean;
}

export interface BricsInstitutionSeed {
  slug: string;
  name: string;
  acronym: string;
  yearEstablished: number;
  establishmentSummit: string;
  headquarters: string;
  purpose: string;
  keyFunctions: string[];
  significance: string;
  capitalStructure?: string;
  isIndependentLegalEntity: boolean;
  officialSourceUrl: string;
  sourceName: string;
  displayOrder: number;
}

export interface BricsFaqSeed {
  slug: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  sourceName: string;
  sourceUrl: string;
}

export interface BricsSourceSeed {
  sourceName: string;
  sourceUrl: string;
  sourceType:
    | 'government'
    | 'official_presidency'
    | 'multilateral_institution'
    | 'treaty_declaration'
    | 'academic_thinktank'
    | 'authoritative_media';
  description: string;
  publishedDate?: string;
  accessedDate: string;
  isPrimary: boolean;
  displayOrder: number;
}

// 1. VERIFIED CURRENT MEMBERS (11 Full Member Countries as of 2026)
export const SEED_BRICS_MEMBERS: BricsMemberSeed[] = [
  {
    name: 'India',
    officialName: 'Republic of India',
    slug: 'india',
    capital: 'New Delhi',
    region: 'South Asia',
    isoCode: 'IND',
    flagEmoji: '🇮🇳',
    flagUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400',
    joinedYear: 2009,
    membershipType: 'founding',
    status: 'full_member',
    description:
      'Founding member and chair of BRICS in 2012, 2016, 2021, and 2026. India represents the worlds most populous nation and fifth-largest economy, serving as a primary voice for the Global South.',
    bricsRole:
      'Champion of Digital Public Infrastructure (DPI), counter-terrorism cooperation, reform of multilateral development banks, and the 2026 theme of "Building for Resilience, Innovation, Cooperation and Sustainability".',
    economicProfile: {
      population: '1.43 Billion',
      gdpNominal: '$3.95 Trillion',
      currency: 'Indian Rupee (INR / ₹)',
      keyExports: ['Information Technology Services', 'Refined Petroleum', 'Pharmaceuticals', 'Machinery', 'Textiles'],
      gdpPppShare: '7.5% of World Total',
    },
    presidenciesHeld: [2012, 2016, 2021, 2026],
    officialSourceUrl: 'https://www.brics2026.gov.in/',
    sourceName: 'Official BRICS India 2026 Portal',
    displayOrder: 1,
  },
  {
    name: 'Brazil',
    officialName: 'Federative Republic of Brazil',
    slug: 'brazil',
    capital: 'Brasília',
    region: 'South America',
    isoCode: 'BRA',
    flagEmoji: '🇧🇷',
    flagUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400',
    joinedYear: 2009,
    membershipType: 'founding',
    status: 'full_member',
    description:
      'Founding member and host of the landmark 2014 Fortaleza Summit where the New Development Bank (NDB) and Contingent Reserve Arrangement (CRA) were created. Brazil served as BRICS chair in 2010, 2014, 2019, and 2025.',
    bricsRole:
      'Advocate for global financial architecture reform, South-South bioenergy partnerships, environmental sustainability, and agricultural food security.',
    economicProfile: {
      population: '215 Million',
      gdpNominal: '$2.17 Trillion',
      currency: 'Brazilian Real (BRL / R$)',
      keyExports: ['Soybeans', 'Iron Ore', 'Crude Petroleum', 'Raw Sugar', 'Poultry Meat'],
      gdpPppShare: '2.4% of World Total',
    },
    presidenciesHeld: [2010, 2014, 2019, 2025],
    officialSourceUrl: 'https://brics.br/en',
    sourceName: 'Official BRICS Brazil 2025 Portal',
    displayOrder: 2,
  },
  {
    name: 'Russia',
    officialName: 'Russian Federation',
    slug: 'russia',
    capital: 'Moscow',
    region: 'Eurasia',
    isoCode: 'RUS',
    flagEmoji: '🇷🇺',
    flagUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400',
    joinedYear: 2009,
    membershipType: 'founding',
    status: 'full_member',
    description:
      'Host of the inaugural BRIC Summit in Yekaterinburg in 2009, followed by presidencies in 2015 (Ufa), 2020 (Saint Petersburg / virtual), and 2024 (Kazan). Russia is one of the worlds premier energy producers and commodity suppliers.',
    bricsRole:
      'Focus on alternative international payment messaging mechanisms, cross-border settlements in national currencies, energy security, and science partnerships.',
    economicProfile: {
      population: '144 Million',
      gdpNominal: '$2.00 Trillion',
      currency: 'Russian Ruble (RUB / ₽)',
      keyExports: ['Crude Petroleum', 'Refined Petroleum', 'Natural Gas', 'Coal', 'Wheat', 'Fertilizers'],
      gdpPppShare: '3.1% of World Total',
    },
    presidenciesHeld: [2009, 2015, 2020, 2024],
    officialSourceUrl: 'http://en.brics-russia2024.ru/',
    sourceName: 'Official BRICS Russia 2024 Portal',
    displayOrder: 3,
  },
  {
    name: 'China',
    officialName: "People's Republic of China",
    slug: 'china',
    capital: 'Beijing',
    region: 'East Asia',
    isoCode: 'CHN',
    flagEmoji: '🇨🇳',
    flagUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400',
    joinedYear: 2009,
    membershipType: 'founding',
    status: 'full_member',
    description:
      'Founding member, worlds second-largest economy by nominal GDP and largest by PPP. Host of the 2011 Sanya Summit, 2017 Xiamen Summit, and 2022 Beijing Summit. Headquarters of the New Development Bank (NDB) are located in Shanghai.',
    bricsRole:
      'Major contributor to industrial manufacturing cooperation, trade finance, digital economy governance, green energy supply chains, and the "BRICS Plus" outreach framework.',
    economicProfile: {
      population: '1.41 Billion',
      gdpNominal: '$18.53 Trillion',
      currency: 'Chinese Yuan Renminbi (CNY / ¥)',
      keyExports: ['Broadcasting Equipment', 'Computers', 'Integrated Circuits', 'Electric Vehicles', 'Solar Cells'],
      gdpPppShare: '18.9% of World Total',
    },
    presidenciesHeld: [2011, 2017, 2022],
    officialSourceUrl: 'http://brics2022.mfa.gov.cn/',
    sourceName: 'Ministry of Foreign Affairs, PRC',
    displayOrder: 4,
  },
  {
    name: 'South Africa',
    officialName: 'Republic of South Africa',
    slug: 'south-africa',
    capital: 'Pretoria (Executive) / Cape Town (Legislative)',
    region: 'Southern Africa',
    isoCode: 'ZAF',
    flagEmoji: '🇿🇦',
    flagUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400',
    joinedYear: 2010,
    membershipType: 'expanded_2011',
    status: 'full_member',
    description:
      'Joined the grouping in late 2010 and attended its first summit in Sanya in April 2011, expanding the acronym from BRIC to BRICS. Host of summits in 2013 (Durban), 2018 (Johannesburg), and 2023 (Johannesburg).',
    bricsRole:
      'Gateway to the African Continental Free Trade Area (AfCFTA), host of the NDB Africa Regional Centre in Johannesburg, and architect of the historic 2023 Johannesburg expansion decision.',
    economicProfile: {
      population: '60 Million',
      gdpNominal: '$377 Billion',
      currency: 'South African Rand (ZAR / R)',
      keyExports: ['Platinum Group Metals', 'Gold', 'Iron Ore', 'Coal', 'Diamonds', 'Automobiles'],
      gdpPppShare: '0.6% of World Total',
    },
    presidenciesHeld: [2013, 2018, 2023],
    officialSourceUrl: 'https://www.brics2023.gov.za/',
    sourceName: 'Department of International Relations and Cooperation, South Africa',
    displayOrder: 5,
  },
  {
    name: 'Egypt',
    officialName: 'Arab Republic of Egypt',
    slug: 'egypt',
    capital: 'Cairo',
    region: 'North Africa / Middle East',
    isoCode: 'EGY',
    flagEmoji: '🇪🇬',
    flagUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400',
    joinedYear: 2024,
    membershipType: 'expanded_2024',
    status: 'full_member',
    description:
      'Admitted as a full member effective January 1, 2024 following the 15th Summit in Johannesburg. Controls the strategic Suez Canal maritime corridor connecting Mediterranean and Red Sea commerce.',
    bricsRole:
      'Facilitates Afro-Arab trade connectivity, regional supply chain resilience, agricultural food import diversification, and local currency trade arrangements.',
    economicProfile: {
      population: '105 Million',
      gdpNominal: '$395 Billion',
      currency: 'Egyptian Pound (EGP / E£)',
      keyExports: ['Natural Gas', 'Refined Petroleum', 'Fertilizers', 'Fruits & Vegetables', 'Plastics'],
      gdpPppShare: '1.1% of World Total',
    },
    presidenciesHeld: [],
    officialSourceUrl: 'https://www.sis.gov.eg/',
    sourceName: 'State Information Service, Egypt',
    displayOrder: 6,
  },
  {
    name: 'Ethiopia',
    officialName: 'Federal Democratic Republic of Ethiopia',
    slug: 'ethiopia',
    capital: 'Addis Ababa',
    region: 'East Africa',
    isoCode: 'ETH',
    flagEmoji: '🇪🇹',
    flagUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400',
    joinedYear: 2024,
    membershipType: 'expanded_2024',
    status: 'full_member',
    description:
      'Admitted as a full member effective January 1, 2024. Capital Addis Ababa serves as the headquarters of the African Union (AU), symbolizing pan-African multilateral governance.',
    bricsRole:
      'Focus on renewable hydroelectric energy integration, agricultural modernization, air cargo connectivity via Ethiopian Airlines, and African infrastructure development.',
    economicProfile: {
      population: '123 Million',
      gdpNominal: '$163 Billion',
      currency: 'Ethiopian Birr (ETB / Br)',
      keyExports: ['Coffee', 'Cut Flowers', 'Oilseeds', 'Gold', 'Pulses'],
      gdpPppShare: '0.25% of World Total',
    },
    presidenciesHeld: [],
    officialSourceUrl: 'https://www.mfa.gov.et/',
    sourceName: 'Ministry of Foreign Affairs, Ethiopia',
    displayOrder: 7,
  },
  {
    name: 'Iran',
    officialName: 'Islamic Republic of Iran',
    slug: 'iran',
    capital: 'Tehran',
    region: 'Middle East / West Asia',
    isoCode: 'IRN',
    flagEmoji: '🇮🇷',
    flagUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    joinedYear: 2024,
    membershipType: 'expanded_2024',
    status: 'full_member',
    description:
      'Admitted as a full member effective January 1, 2024. Commands vast natural gas and oil reserves and occupies a critical geographic position along the International North-South Transport Corridor (INSTC).',
    bricsRole:
      'Strengthening multi-modal transport transit corridors between Russia, Central Asia, and India, energy trade cooperation, and alternatives to Western clearing systems.',
    economicProfile: {
      population: '88 Million',
      gdpNominal: '$401 Billion',
      currency: 'Iranian Rial (IRR / ﷼)',
      keyExports: ['Crude Petroleum', 'Polymers', 'Petrochemicals', 'Iron & Steel', 'Nuts & Fruits'],
      gdpPppShare: '1.0% of World Total',
    },
    presidenciesHeld: [],
    officialSourceUrl: 'https://en.mfa.ir/',
    sourceName: 'Ministry of Foreign Affairs, Iran',
    displayOrder: 8,
  },
  {
    name: 'Saudi Arabia',
    officialName: 'Kingdom of Saudi Arabia',
    slug: 'saudi-arabia',
    capital: 'Riyadh',
    region: 'Middle East / West Asia',
    isoCode: 'SAU',
    flagEmoji: '🇸🇦',
    flagUrl: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400',
    joinedYear: 2024,
    membershipType: 'expanded_2024',
    status: 'full_member',
    description:
      'Invited at the 2023 Johannesburg Summit and admitted in January 2024. The largest economy in the Arab world and top global oil exporter, undergoing economic transformation under Vision 2030.',
    bricsRole:
      'Energy security dialog, sovereign wealth investments, logistics connectivity, hydrogen and green energy technologies, and capital markets integration.',
    economicProfile: {
      population: '36 Million',
      gdpNominal: '$1.07 Trillion',
      currency: 'Saudi Riyal (SAR / ﷼)',
      keyExports: ['Crude Petroleum', 'Refined Petroleum', 'Ethylene Polymers', 'Acyclic Alcohols'],
      gdpPppShare: '1.4% of World Total',
    },
    presidenciesHeld: [],
    officialSourceUrl: 'https://www.mofa.gov.sa/',
    sourceName: 'Ministry of Foreign Affairs, Saudi Arabia',
    displayOrder: 9,
  },
  {
    name: 'United Arab Emirates',
    officialName: 'United Arab Emirates',
    slug: 'united-arab-emirates',
    capital: 'Abu Dhabi',
    region: 'Middle East / West Asia',
    isoCode: 'ARE',
    flagEmoji: '🇦🇪',
    flagUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
    joinedYear: 2024,
    membershipType: 'expanded_2024',
    status: 'full_member',
    description:
      'Admitted as a full member effective January 1, 2024. Leading global trade, aviation, and financial hub, and shareholder of the New Development Bank since 2021.',
    bricsRole:
      'Cross-border financial services, port infrastructure, fintech innovation, renewable energy investments (IRENA host), and trade corridor development.',
    economicProfile: {
      population: '10 Million',
      gdpNominal: '$509 Billion',
      currency: 'UAE Dirham (AED / د.إ)',
      keyExports: ['Crude Petroleum', 'Refined Petroleum', 'Gold', 'Diamonds', 'Broadcasting Equipment'],
      gdpPppShare: '0.6% of World Total',
    },
    presidenciesHeld: [],
    officialSourceUrl: 'https://www.mofa.gov.ae/',
    sourceName: 'Ministry of Foreign Affairs, UAE',
    displayOrder: 10,
  },
  {
    name: 'Indonesia',
    officialName: 'Republic of Indonesia',
    slug: 'indonesia',
    capital: 'Jakarta / Nusantara',
    region: 'Southeast Asia',
    isoCode: 'IDN',
    flagEmoji: '🇮🇩',
    flagUrl: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?w=400',
    joinedYear: 2025,
    membershipType: 'expanded_2025',
    status: 'full_member',
    description:
      'Formally joined as a full member in January 2025 during Brazils presidency. The largest economy in Southeast Asia, fourth most populous country globally, and foundational voice in the Non-Aligned Movement (1955 Bandung Conference).',
    bricsRole:
      'Represents ASEAN economic dynamism, critical minerals and nickel supply chains for global battery manufacturing, sustainable forestry, and maritime South-South partnerships.',
    economicProfile: {
      population: '278 Million',
      gdpNominal: '$1.37 Trillion',
      currency: 'Indonesian Rupiah (IDR / Rp)',
      keyExports: ['Coal Briquettes', 'Palm Oil', 'Ferroalloys', 'Nickel', 'Petroleum Gas'],
      gdpPppShare: '2.6% of World Total',
    },
    presidenciesHeld: [],
    officialSourceUrl: 'https://kemlu.go.id/',
    sourceName: 'Ministry of Foreign Affairs, Republic of Indonesia',
    displayOrder: 11,
  },
];

// 2. ALL 18 ANNUAL BRICS SUMMITS (2009 to 2026)
export const SEED_BRICS_SUMMITS: BricsSummitSeed[] = [
  {
    summitNumber: 1,
    year: 2009,
    hostCountry: 'Russia',
    hostCity: 'Yekaterinburg',
    presidencyCountry: 'Russia',
    dates: 'June 16, 2009',
    status: 'completed',
    officialName: '1st BRIC Summit',
    theme: 'Emerging Markets Dialogue and Global Financial Stability',
    declarationName: 'Joint Statement of the BRIC Leaders',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2009-yekaterinburg/',
    summary:
      'The historic inaugural summit bringing together leaders of Brazil, Russia, India, and China in the wake of the 2008 global financial crisis to call for democratic and transparent international financial architecture.',
    majorThemes: [
      'Global financial crisis response',
      'Reform of international financial institutions (IMF & World Bank)',
      'Diversification of global monetary system',
    ],
    keyOutcomes: [
      'Institutionalized annual summit-level meetings of BRIC leaders',
      'Issued the first joint declaration demanding voice and quota reforms in the IMF and World Bank',
      'Agreed on energy security and agricultural cooperation',
    ],
    sourceUrls: [
      { title: 'Yekaterinburg Joint Statement', url: 'http://en.kremlin.ru/supplement/223' },
      { title: 'Ministry of External Affairs Archive', url: 'https://www.mea.gov.in/' },
    ],
  },
  {
    summitNumber: 2,
    year: 2010,
    hostCountry: 'Brazil',
    hostCity: 'Brasília',
    presidencyCountry: 'Brazil',
    dates: 'April 15, 2010',
    status: 'completed',
    officialName: '2nd BRIC Summit',
    theme: 'Cooperation for Sustainable Economic Growth and Multilateral Reform',
    declarationName: 'Brasília Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2010-brasilia/',
    summary:
      'Held in the Brazilian capital, emphasizing sustainable development, climate diplomacy, and trade financing cooperation through national development banks.',
    majorThemes: [
      'Interbank cooperation agreement',
      'Millennium Development Goals (MDGs)',
      'G20 coordination and United Nations reform',
    ],
    keyOutcomes: [
      'Signed the BRIC Interbank Cooperation Mechanism Agreement',
      'Convened the first BRIC Business Forum and statistical meeting',
      'Paved the way for inviting South Africa to join the grouping',
    ],
    sourceUrls: [
      { title: 'Brasília Joint Statement', url: 'https://brics.br/en' },
    ],
  },
  {
    summitNumber: 3,
    year: 2011,
    hostCountry: 'China',
    hostCity: 'Sanya (Hainan)',
    presidencyCountry: 'China',
    dates: 'April 14, 2011',
    status: 'completed',
    officialName: '3rd BRICS Summit',
    theme: 'Broad Vision, Shared Prosperity',
    declarationName: 'Sanya Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2011-sanya/',
    summary:
      'Historic summit marking the official entry of South Africa as a full member, formally transitioning the grouping name and acronym from BRIC to BRICS.',
    majorThemes: [
      'Inclusion of South Africa',
      'Commodity price volatility and food security',
      'Green economy and clean energy transitions',
    ],
    keyOutcomes: [
      'Formally welcomed South Africa into the expanded BRICS family',
      'Signed agreement establishing local currency credit lines among member development banks',
      'Established framework for BRICS health ministers and agriculture ministers meetings',
    ],
    sourceUrls: [
      { title: 'Sanya Declaration', url: 'https://www.mea.gov.in/' },
    ],
  },
  {
    summitNumber: 4,
    year: 2012,
    hostCountry: 'India',
    hostCity: 'New Delhi',
    presidencyCountry: 'India',
    dates: 'March 29, 2012',
    status: 'completed',
    officialName: '4th BRICS Summit',
    theme: 'BRICS Partnership for Global Stability, Security and Prosperity',
    declarationName: 'Delhi Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2012-delhi/',
    summary:
      'Indias first BRICS presidency. Crucial milestone where India proposed the creation of a South-South multilateral development bank, initiating the feasibility studies that created the New Development Bank (NDB).',
    majorThemes: [
      'Proposal for a new development bank',
      'Intra-BRICS trade and local currency letters of credit',
      'Global economic recovery and sustainable urban development',
    ],
    keyOutcomes: [
      'Leaders tasked finance ministers to examine the feasibility of a BRICS Development Bank',
      'Signed the Master Agreement on Extending Credit Facility in Local Currency',
      'Adopted the Delhi Action Plan establishing collaborative working groups',
    ],
    sourceUrls: [
      { title: 'Delhi Declaration 2012 (MEA)', url: 'https://www.mea.gov.in/bilateral-documents.htm?dtl/19158/Delhi+Declaration' },
      { title: 'Official BRICS India 2026 Portal Archive', url: 'https://www.brics2026.gov.in/' },
    ],
  },
  {
    summitNumber: 5,
    year: 2013,
    hostCountry: 'South Africa',
    hostCity: 'Durban',
    presidencyCountry: 'South Africa',
    dates: 'March 26–27, 2013',
    status: 'completed',
    officialName: '5th BRICS Summit',
    theme: 'BRICS and Africa: Partnership for Development, Integration and Industrialisation',
    declarationName: 'eThekwini Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2013-durban/',
    summary:
      'The first BRICS summit held on African soil, completing the first full cycle of rotational presidencies and formally establishing the BRICS Business Council.',
    majorThemes: [
      'African infrastructure integration',
      'Formal endorsement of the New Development Bank and Contingent Reserve Arrangement',
      'Private sector and academic institutionalization',
    ],
    keyOutcomes: [
      'Founding of the BRICS Business Council and BRICS Think Tanks Council (BTTC)',
      'Agreement that the establishment of the New Development Bank is feasible and viable',
      'Agreement to establish a $100 billion Contingent Reserve Arrangement (CRA)',
    ],
    sourceUrls: [
      { title: 'eThekwini Declaration', url: 'https://www.brics2023.gov.za/' },
    ],
  },
  {
    summitNumber: 6,
    year: 2014,
    hostCountry: 'Brazil',
    hostCity: 'Fortaleza',
    presidencyCountry: 'Brazil',
    dates: 'July 15–16, 2014',
    status: 'completed',
    officialName: '6th BRICS Summit',
    theme: 'Inclusive Growth: Sustainable Solutions',
    declarationName: 'Fortaleza Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2014-fortaleza/',
    summary:
      'The most institutionally consequential summit in BRICS history. Leaders signed the historic Treaty establishing the New Development Bank (NDB) and the Treaty establishing the Contingent Reserve Arrangement (CRA).',
    majorThemes: [
      'Signing of the Agreement establishing the New Development Bank (NDB)',
      'Establishment of the Contingent Reserve Arrangement (CRA)',
      'Engagement with Union of South American Nations (UNASUR) leaders',
    ],
    keyOutcomes: [
      'NDB established with initial authorized capital of $100 billion and initial subscribed capital of $50 billion equally split among founding members',
      'NDB headquarters situated in Shanghai with the first presidency awarded to India (K. V. Kamath)',
      'CRA established with initial volume of $100 billion to provide balance-of-payments mutual protection',
    ],
    sourceUrls: [
      { title: 'Fortaleza Declaration and NDB Agreement', url: 'https://www.ndb.int/about-us/corporate-governance/articles-of-agreement/' },
    ],
  },
  {
    summitNumber: 7,
    year: 2015,
    hostCountry: 'Russia',
    hostCity: 'Ufa (Bashkortostan)',
    presidencyCountry: 'Russia',
    dates: 'July 8–9, 2015',
    status: 'completed',
    officialName: '7th BRICS Summit',
    theme: 'BRICS Partnership – a Powerful Factor of Global Development',
    declarationName: 'Ufa Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2015-ufa/',
    summary:
      'Summit marking the formal entry into force of the New Development Bank and Contingent Reserve Arrangement, and adoption of the BRICS Economic Partnership Strategy.',
    majorThemes: [
      'Entry into force of NDB and CRA',
      'Adoption of the Strategy for BRICS Economic Partnership to 2020',
      'Joint summit with Shanghai Cooperation Organisation (SCO) and Eurasian Economic Union (EAEU)',
    ],
    keyOutcomes: [
      'First inaugural Board of Governors meeting of the NDB held in Ufa',
      'Agreement on cultural cooperation and youth forums',
      'Established the BRICS Working Group on Counter-Terrorism',
    ],
    sourceUrls: [
      { title: 'Ufa Declaration', url: 'http://en.kremlin.ru/' },
    ],
  },
  {
    summitNumber: 8,
    year: 2016,
    hostCountry: 'India',
    hostCity: 'Benaulim (Goa)',
    presidencyCountry: 'India',
    dates: 'October 15–16, 2016',
    status: 'completed',
    officialName: '8th BRICS Summit',
    theme: 'Building Responsive, Inclusive and Collective Solutions',
    declarationName: 'Goa Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2016-goa/',
    summary:
      'Indias second presidency, remembered for the BRICS-BIMSTEC Outreach Summit, people-to-people initiatives, smart cities cooperation, and strong focus on counter-terrorism.',
    majorThemes: [
      'Counter-terrorism cooperation and condemnation of cross-border terrorism',
      'BRICS-BIMSTEC Outreach Summit',
      'Creation of the BRICS Credit Rating Agency proposal and BRICS Agricultural Research Platform',
    ],
    keyOutcomes: [
      'Adopted comprehensive Goa Declaration and Action Plan',
      'Convened first BRICS Film Festival, Under-17 Football Tournament, and Smart Cities Conclave',
      'Signed regulations for the Customs Cooperation Committee',
    ],
    sourceUrls: [
      { title: 'Goa Declaration 2016 (MEA)', url: 'https://www.mea.gov.in/bilateral-documents.htm?dtl/27491/Goa+Declaration' },
    ],
  },
  {
    summitNumber: 9,
    year: 2017,
    hostCountry: 'China',
    hostCity: 'Xiamen (Fujian)',
    presidencyCountry: 'China',
    dates: 'September 3–5, 2017',
    status: 'completed',
    officialName: '9th BRICS Summit',
    theme: 'BRICS: Stronger Partnership for a Brighter Future',
    declarationName: 'Xiamen Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2017-xiamen/',
    summary:
      'Celebrated the start of BRICS "Golden Decade" and introduced the "BRICS Plus" outreach concept inviting Egypt, Guinea, Mexico, Tajikistan, and Thailand.',
    majorThemes: [
      '"BRICS Plus" dialogue with emerging and developing economies',
      'Deepening industrial capacity cooperation and digital economy',
      'Peaceful resolution of regional conflicts',
    ],
    keyOutcomes: [
      'Institutionalized "BRICS Plus" outreach framework',
      'Established the BRICS Energy Research Cooperation Platform',
      'Adopted the BRICS Action Plan for Innovation Cooperation (2017-2020)',
    ],
    sourceUrls: [
      { title: 'Xiamen Declaration', url: 'https://www.mea.gov.in/' },
    ],
  },
  {
    summitNumber: 10,
    year: 2018,
    hostCountry: 'South Africa',
    hostCity: 'Johannesburg',
    presidencyCountry: 'South Africa',
    dates: 'July 25–27, 2018',
    status: 'completed',
    officialName: '10th BRICS Summit',
    theme: 'BRICS in Africa: Collaboration for Inclusive Growth and Shared Prosperity in the 4th Industrial Revolution',
    declarationName: 'Johannesburg Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2018-johannesburg/',
    summary:
      'Tenth anniversary summit focusing on the Fourth Industrial Revolution (4IR), science and technology, and women empowerment.',
    majorThemes: [
      'Fourth Industrial Revolution (4IR) and digitalization',
      'Establishment of the Partnership on New Industrial Revolution (PartNIR)',
      'BRICS Vaccine R&D Centre initiative',
    ],
    keyOutcomes: [
      'Launched PartNIR advisory group to harness digital manufacturing',
      'Established BRICS Networks of Science Parks and Technology Incubators',
      'Creation of the BRICS Working Group on Tourism',
    ],
    sourceUrls: [
      { title: '10th BRICS Summit Declaration', url: 'https://www.brics2023.gov.za/' },
    ],
  },
  {
    summitNumber: 11,
    year: 2019,
    hostCountry: 'Brazil',
    hostCity: 'Brasília',
    presidencyCountry: 'Brazil',
    dates: 'November 13–14, 2019',
    status: 'completed',
    officialName: '11th BRICS Summit',
    theme: 'Economic Growth for an Innovative Future',
    declarationName: 'Brasília Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2019-brasilia/',
    summary:
      'Summit centered on science, technology, innovation, and fighting transnational crime and illicit financial flows.',
    majorThemes: [
      'Science, Technology, and Innovation (STI) cooperation',
      'Digital economy and customs data exchange',
      'Establishment of the BRICS Women Business Alliance',
    ],
    keyOutcomes: [
      'Launched the BRICS Women Business Alliance (WBA)',
      'Signed customs mutual administrative assistance agreement',
      'Reaffirmed commitment to open multilateral trading system under the WTO',
    ],
    sourceUrls: [
      { title: 'Brasília Declaration 2019', url: 'https://brics.br/en' },
    ],
  },
  {
    summitNumber: 12,
    year: 2020,
    hostCountry: 'Russia',
    hostCity: 'Saint Petersburg (Conducted Virtually)',
    presidencyCountry: 'Russia',
    dates: 'November 17, 2020',
    status: 'completed',
    officialName: '12th BRICS Summit',
    theme: 'BRICS Partnership for Global Stability, Shared Security and Innovative Growth',
    declarationName: 'Moscow Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2020-moscow/',
    summary:
      'First virtual leaders summit due to the global COVID-19 pandemic, focusing on pandemic containment, equitable vaccine access, and counter-terrorism.',
    majorThemes: [
      'COVID-19 pandemic response and healthcare solidarity',
      'Adoption of the BRICS Counter-Terrorism Strategy',
      'Economic Partnership Strategy up to 2025',
    ],
    keyOutcomes: [
      'Adopted the landmark BRICS Counter-Terrorism Strategy',
      'Updated the Strategy for BRICS Economic Partnership 2025',
      'Supported multilateral mechanisms to distribute diagnostics and therapeutics',
    ],
    sourceUrls: [
      { title: 'Moscow Declaration 2020', url: 'http://en.kremlin.ru/' },
    ],
  },
  {
    summitNumber: 13,
    year: 2021,
    hostCountry: 'India',
    hostCity: 'New Delhi (Conducted Virtually)',
    presidencyCountry: 'India',
    dates: 'September 9, 2021',
    status: 'completed',
    officialName: '13th BRICS Summit',
    theme: 'BRICS@15: Intra-BRICS Cooperation for Continuity, Consolidation and Consensus',
    declarationName: 'New Delhi Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2021-new-delhi/',
    summary:
      'Indias third presidency celebrating the 15th anniversary of BRICS. Chaired by Prime Minister Narendra Modi, the summit adopted the BRICS Counter-Terrorism Action Plan and the Agreement on Remote Sensing Satellite Constellation.',
    majorThemes: [
      '15th Anniversary of BRICS: Continuity, Consolidation and Consensus',
      'Reform of the multilateral system (UN, IMF, World Bank, WTO)',
      'Digital health, counter-terrorism action plan, and space cooperation',
    ],
    keyOutcomes: [
      'Adopted the BRICS Counter-Terrorism Action Plan',
      'Signed the historic Agreement on the Cooperation on BRICS Remote Sensing Satellite Constellation',
      'Adopted the Joint Statement on Strengthening and Reforming the Multilateral System',
      'Launched the BRICS Alliance for Green Tourism and Agricultural Research Platform',
    ],
    sourceUrls: [
      { title: '13th BRICS Summit New Delhi Declaration (MEA)', url: 'https://www.mea.gov.in/bilateral-documents.htm?dtl/34241/13th_BRICS_Summit__New_Delhi_Declaration' },
    ],
  },
  {
    summitNumber: 14,
    year: 2022,
    hostCountry: 'China',
    hostCity: 'Beijing (Conducted Virtually)',
    presidencyCountry: 'China',
    dates: 'June 23, 2022',
    status: 'completed',
    officialName: '14th BRICS Summit',
    theme: 'Foster High-quality BRICS Partnership, Usher in a New Era for Global Development',
    declarationName: 'Beijing Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2022-beijing/',
    summary:
      'Conducted virtually, prioritizing sustainable development, green supply chains, and initiating the structured discussion for expanding BRICS membership.',
    majorThemes: [
      'High-level Dialogue on Global Development',
      'Membership expansion principles and guiding criteria',
      'BRICS Initiative on Trade and Sustainable Development',
    ],
    keyOutcomes: [
      'Agreed to initiate discussions and formulate guiding principles for admitting new members',
      'Launched the BRICS Vaccine R&D Centre virtual platform',
      'Adopted the BRICS Digital Economy Partnership Framework',
    ],
    sourceUrls: [
      { title: 'Beijing Declaration 2022', url: 'http://brics2022.mfa.gov.cn/' },
    ],
  },
  {
    summitNumber: 15,
    year: 2023,
    hostCountry: 'South Africa',
    hostCity: 'Johannesburg (Sandton)',
    presidencyCountry: 'South Africa',
    dates: 'August 22–24, 2023',
    status: 'completed',
    officialName: '15th BRICS Summit',
    theme: 'BRICS and Africa: Partnership for Mutually Accelerated Growth, Sustainable Development and Inclusive Multilateralism',
    declarationName: 'Johannesburg II Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2023-johannesburg/',
    summary:
      'Watershed summit held in person in Johannesburg. Leaders took the historic decision to invite 6 new countries to become full members of BRICS, transforming the global balance of the grouping.',
    majorThemes: [
      'Historical decision on BRICS membership expansion',
      'Local currency payment mechanisms and correspondent banking networks',
      'Africa-BRICS partnership and critical minerals industrialization',
    ],
    keyOutcomes: [
      'Invited Argentina, Egypt, Ethiopia, Iran, Saudi Arabia, and the UAE to become full members effective January 1, 2024 (5 formally acceded; Argentina later declined)',
      'Tasked finance ministers and central bank governors to examine local currencies and payment instruments',
      'Reaffirmed commitment to open, fair, and rules-based multilateral trade',
    ],
    sourceUrls: [
      { title: 'Johannesburg II Declaration (Official PDF)', url: 'https://www.brics2023.gov.za/' },
    ],
  },
  {
    summitNumber: 16,
    year: 2024,
    hostCountry: 'Russia',
    hostCity: 'Kazan (Tatarstan)',
    presidencyCountry: 'Russia',
    dates: 'October 22–24, 2024',
    status: 'completed',
    officialName: '16th BRICS Summit',
    theme: 'Strengthening Multilateralism for Just Global Development and Security',
    declarationName: 'Kazan Declaration',
    declarationUrl: 'https://www.brics2026.gov.in/past-summits/2024-kazan/',
    summary:
      'The first leaders summit following the 2024 expansion, gathering the enlarged membership. Established the new "BRICS Partner Country" category and discussed the BRICS Cross-Border Payment Initiative.',
    majorThemes: [
      'Integration of new full members',
      'Establishment of the "Partner Country" framework',
      'Independent financial settlement networks and grain exchange proposal',
    ],
    keyOutcomes: [
      'Formalized operational guidelines for the "Partner Country" status',
      'Endorsed feasibility studies on the BRICS Clear and BRICS (Re)Insurance Company',
      'Adopted 134-paragraph Kazan Declaration emphasizing sovereign equality and multilateral reform',
    ],
    sourceUrls: [
      { title: 'Kazan Summit Declaration', url: 'http://en.brics-russia2024.ru/' },
      { title: 'MEA Press Release on 16th BRICS Summit', url: 'https://www.mea.gov.in/' },
    ],
  },
  {
    summitNumber: 17,
    year: 2025,
    hostCountry: 'Brazil',
    hostCity: 'Rio de Janeiro',
    presidencyCountry: 'Brazil',
    dates: 'July 6–7, 2025',
    status: 'completed',
    officialName: '17th BRICS Summit',
    theme: 'Strengthening Global South Cooperation for a More Inclusive and Sustainable Governance',
    declarationName: 'Rio de Janeiro Declaration',
    declarationUrl: 'https://brics.br/en',
    summary:
      'Chaired by Brazil in Rio de Janeiro, with Indonesia participating as a newly acceded full member (joined January 2025). Emphasized climate finance, ethical artificial intelligence, food security, and reform of the Bretton Woods institutions.',
    majorThemes: [
      'Global South cooperation and multilateral financial architecture reform',
      'Bioeconomy, ecological transition, and energy access',
      'Artificial intelligence governance and democratic digital technologies',
    ],
    keyOutcomes: [
      'Formally welcomed Indonesia as a full member of BRICS',
      'Consolidated operational links with verified BRICS Partner Countries',
      'Launched the BRICS Tropical Forests and Climate Finance Initiative',
      'Handed over Chairship preparations to India for 2026',
    ],
    sourceUrls: [
      { title: 'Official BRICS Brazil 2025 Portal', url: 'https://brics.br/en' },
    ],
  },
  {
    summitNumber: 18,
    year: 2026,
    hostCountry: 'India',
    hostCity: 'New Delhi',
    presidencyCountry: 'India',
    dates: 'September 12–13, 2026 (Scheduled)',
    status: 'scheduled',
    officialName: '18th BRICS Summit',
    theme: 'Building for Resilience, Innovation, Cooperation and Sustainability',
    declarationName: 'To be adopted at conclusion of summit',
    declarationUrl: 'https://www.brics2026.gov.in/',
    summary:
      'Scheduled to be hosted by India in New Delhi on September 12–13, 2026. This marks Indias fourth BRICS presidency, guided by the central acronym-resonant theme: Resilience, Innovation, Cooperation and Sustainability.',
    majorThemes: [
      'Resilience: Supply chain security, global uncertainty mitigation, disaster management, and public health',
      'Innovation: Digital Public Infrastructure (DPI), fintech, AI governance, and science partnerships',
      'Cooperation: Reformed multilateralism, trade facilitation in national currencies, and development finance',
      'Sustainability: Climate finance, renewable energy transitions, Mission LiFE, and SDG acceleration',
    ],
    keyOutcomes: [
      'Planned high-level leaders summit in New Delhi',
      'Scheduled ministerial tracks: Foreign Affairs, Finance & Central Bank Governors, Trade, Digital Tech, Energy, Environment, and Health',
      'Scheduled track-II platforms: BRICS Business Forum, Academic Forum, Youth Summit, and Think Tanks Council',
    ],
    sourceUrls: [
      { title: 'Official BRICS India 2026 Portal', url: 'https://www.brics2026.gov.in/' },
      { title: 'Ministry of External Affairs, India', url: 'https://www.mea.gov.in/' },
    ],
  },
];

// 3. BRICS ROTATING PRESIDENCIES (2009 to 2026)
export const SEED_BRICS_PRESIDENCIES: BricsPresidencySeed[] = [
  {
    year: 2009,
    presidencyCountry: 'Russia',
    summitHost: 'Yekaterinburg, Russia',
    theme: 'Emerging Markets Dialogue and Global Financial Stability',
    importantInitiatives: ['First BRIC Leaders Summit', 'Demand for IMF & World Bank quota reforms'],
    globalContext: 'Immediate aftermath of the 2008 Wall Street subprime collapse and global credit crunch.',
    status: 'completed',
    officialSource: { title: 'Kremlin Archive', url: 'http://en.kremlin.ru/' },
  },
  {
    year: 2010,
    presidencyCountry: 'Brazil',
    summitHost: 'Brasília, Brazil',
    theme: 'Cooperation for Sustainable Economic Growth and Multilateral Reform',
    importantInitiatives: ['BRIC Interbank Cooperation Mechanism', 'Invitation to South Africa'],
    globalContext: 'Eurozone sovereign debt crisis begins; emerging economies drive global growth.',
    status: 'completed',
    officialSource: { title: 'Brazil Ministry of External Relations', url: 'https://brics.br/en' },
  },
  {
    year: 2011,
    presidencyCountry: 'China',
    summitHost: 'Sanya, China',
    theme: 'Broad Vision, Shared Prosperity',
    importantInitiatives: ['South Africa officially joins, creating BRICS', 'Local currency trade credit lines'],
    globalContext: 'Arab Spring unfolds in the Middle East; global commodity prices experience sharp swings.',
    status: 'completed',
    officialSource: { title: 'China MFA Archive', url: 'http://brics2022.mfa.gov.cn/' },
  },
  {
    year: 2012,
    presidencyCountry: 'India',
    summitHost: 'New Delhi, India',
    theme: 'BRICS Partnership for Global Stability, Security and Prosperity',
    importantInitiatives: [
      'First proposal for a BRICS South-South Development Bank',
      'Master Agreement on Extending Credit Facility in Local Currency',
      'Delhi Action Plan',
    ],
    globalContext: 'Stagnant recovery in advanced economies; emerging powers call for institutional self-reliance.',
    status: 'completed',
    officialSource: { title: 'Ministry of External Affairs India', url: 'https://www.mea.gov.in/' },
  },
  {
    year: 2013,
    presidencyCountry: 'South Africa',
    summitHost: 'Durban, South Africa',
    theme: 'BRICS and Africa: Partnership for Development, Integration and Industrialisation',
    importantInitiatives: [
      'Founding of the BRICS Business Council',
      'Founding of the BRICS Think Tanks Council (BTTC)',
      'Agreement in principle to establish the NDB and CRA',
    ],
    globalContext: 'Completes the first full cycle of rotational presidencies across all original members.',
    status: 'completed',
    officialSource: { title: 'DIRCO South Africa Archive', url: 'https://www.brics2023.gov.za/' },
  },
  {
    year: 2014,
    presidencyCountry: 'Brazil',
    summitHost: 'Fortaleza, Brazil',
    theme: 'Inclusive Growth: Sustainable Solutions',
    importantInitiatives: [
      'Signing of the Agreement Establishing the New Development Bank (NDB)',
      'Signing of the Treaty Establishing the Contingent Reserve Arrangement (CRA)',
    ],
    globalContext: 'Crimea annexation and initial Western sanctions on Russia; rising demand for alternative financial safety nets.',
    status: 'completed',
    officialSource: { title: 'NDB Articles of Agreement', url: 'https://www.ndb.int/' },
  },
  {
    year: 2015,
    presidencyCountry: 'Russia',
    summitHost: 'Ufa, Russia',
    theme: 'BRICS Partnership – a Powerful Factor of Global Development',
    importantInitiatives: ['Formal operational launch of NDB and CRA', 'Strategy for BRICS Economic Partnership to 2020'],
    globalContext: 'Fall in global oil and commodity prices; parallel SCO Summit held in Ufa.',
    status: 'completed',
    officialSource: { title: 'Kremlin Archive Ufa', url: 'http://en.kremlin.ru/' },
  },
  {
    year: 2016,
    presidencyCountry: 'India',
    summitHost: 'Goa (Benaulim), India',
    theme: 'Building Responsive, Inclusive and Collective Solutions',
    importantInitiatives: [
      'BRICS-BIMSTEC Outreach Summit',
      'BRICS Agricultural Research Platform and Railway Research Network',
      'Comprehensive focus on counter-terrorism financing',
    ],
    globalContext: 'Post-Uri terrorist attack; Indias proactive diplomatic outreach to South and Southeast Asia.',
    status: 'completed',
    officialSource: { title: 'Ministry of External Affairs India', url: 'https://www.mea.gov.in/' },
  },
  {
    year: 2017,
    presidencyCountry: 'China',
    summitHost: 'Xiamen, China',
    theme: 'BRICS: Stronger Partnership for a Brighter Future',
    importantInitiatives: [
      'Introduction of "BRICS Plus" outreach dialogue',
      'BRICS Energy Research Cooperation Platform',
      'Action Plan for Innovation Cooperation',
    ],
    globalContext: 'Resolution of Doklam military standoff immediately prior to summit; rise of US protectionism.',
    status: 'completed',
    officialSource: { title: 'Xiamen Summit Portal', url: 'http://brics2022.mfa.gov.cn/' },
  },
  {
    year: 2018,
    presidencyCountry: 'South Africa',
    summitHost: 'Johannesburg, South Africa',
    theme: 'Collaboration for Inclusive Growth and Shared Prosperity in the 4th Industrial Revolution',
    importantInitiatives: [
      'Partnership on New Industrial Revolution (PartNIR)',
      'BRICS Vaccine R&D Centre initiative',
      'Working Group on Tourism',
    ],
    globalContext: 'Onset of the US-China trade war; growing technological competition.',
    status: 'completed',
    officialSource: { title: 'South Africa Presidency Archive', url: 'https://www.brics2023.gov.za/' },
  },
  {
    year: 2019,
    presidencyCountry: 'Brazil',
    summitHost: 'Brasília, Brazil',
    theme: 'Economic Growth for an Innovative Future',
    importantInitiatives: [
      'Launch of the BRICS Women Business Alliance',
      'Customs Mutual Administrative Assistance Agreement',
    ],
    globalContext: 'Brazils foreign policy realignment under Jair Bolsonaro; focus shifted to pragmatic economic cooperation.',
    status: 'completed',
    officialSource: { title: 'Brazil Itamaraty Archive', url: 'https://brics.br/en' },
  },
  {
    year: 2020,
    presidencyCountry: 'Russia',
    summitHost: 'Saint Petersburg, Russia (Virtual)',
    theme: 'BRICS Partnership for Global Stability, Shared Security and Innovative Growth',
    importantInitiatives: [
      'Adoption of the BRICS Counter-Terrorism Strategy',
      'Updated Strategy for BRICS Economic Partnership 2025',
    ],
    globalContext: 'COVID-19 pandemic lockdowns; all summit sessions conducted via secure videoconference.',
    status: 'completed',
    officialSource: { title: 'Russian Presidency Portal', url: 'http://en.brics-russia2024.ru/' },
  },
  {
    year: 2021,
    presidencyCountry: 'India',
    summitHost: 'New Delhi, India (Virtual)',
    theme: 'BRICS@15: Intra-BRICS Cooperation for Continuity, Consolidation and Consensus',
    importantInitiatives: [
      'Agreement on Remote Sensing Satellite Constellation',
      'BRICS Counter-Terrorism Action Plan',
      'Joint Statement on Reforming Multilateral System',
      'Green Tourism Alliance',
    ],
    globalContext: 'Delta variant wave of COVID-19; 15th anniversary of BRICS foreign ministers forum.',
    status: 'completed',
    officialSource: { title: 'Ministry of External Affairs India', url: 'https://www.mea.gov.in/' },
  },
  {
    year: 2022,
    presidencyCountry: 'China',
    summitHost: 'Beijing, China (Virtual)',
    theme: 'Foster High-quality BRICS Partnership, Usher in a New Era for Global Development',
    importantInitiatives: [
      'Formal launch of membership expansion review process',
      'BRICS Digital Economy Partnership Framework',
    ],
    globalContext: 'Outbreak of Russia-Ukraine conflict and extensive Western economic sanctions on Russia.',
    status: 'completed',
    officialSource: { title: 'China MFA Portal', url: 'http://brics2022.mfa.gov.cn/' },
  },
  {
    year: 2023,
    presidencyCountry: 'South Africa',
    summitHost: 'Johannesburg, South Africa',
    theme: 'Partnership for Mutually Accelerated Growth, Sustainable Development and Inclusive Multilateralism',
    importantInitiatives: [
      'Historical decision to expand BRICS membership from 5 to 11 countries',
      'Review of local currency cross-border settlements',
    ],
    globalContext: 'Over 40 countries expressed interest in joining BRICS; rising multipolarity.',
    status: 'completed',
    officialSource: { title: 'Official BRICS 2023 Portal', url: 'https://www.brics2023.gov.za/' },
  },
  {
    year: 2024,
    presidencyCountry: 'Russia',
    summitHost: 'Kazan, Russia',
    theme: 'Strengthening Multilateralism for Just Global Development and Security',
    importantInitiatives: [
      'First summit with expanded 10-member group',
      'Creation of the "Partner Country" framework',
      'BRICS Clear and cross-border settlement proposals',
    ],
    globalContext: 'Global geopolitical fragmentation; major push for financial sovereignty and de-risking.',
    status: 'completed',
    officialSource: { title: 'Official BRICS Russia 2024 Portal', url: 'http://en.brics-russia2024.ru/' },
  },
  {
    year: 2025,
    presidencyCountry: 'Brazil',
    summitHost: 'Rio de Janeiro, Brazil',
    theme: 'Strengthening Global South Cooperation for a More Inclusive and Sustainable Governance',
    importantInitiatives: [
      'Indonesia welcomed as full member (11th member)',
      'Bioeconomy and climate transition finance',
      'Global governance and AI equity',
    ],
    globalContext: 'Brazil holds simultaneous engagements with G20 and COP30; South-South multilateral push.',
    status: 'completed',
    officialSource: { title: 'Official BRICS Brazil 2025 Portal', url: 'https://brics.br/en' },
  },
  {
    year: 2026,
    presidencyCountry: 'India',
    summitHost: 'New Delhi, India (Scheduled: September 12–13, 2026)',
    theme: 'Building for Resilience, Innovation, Cooperation and Sustainability',
    importantInitiatives: [
      '4 Core Pillars: Resilience, Innovation, Cooperation, Sustainability',
      'Digital Public Infrastructure (DPI) deployment across Global South',
      'Reform of Multilateral Development Banks (MDBs)',
      'Mission LiFE and Disaster Resilient Infrastructure (CDRI alignment)',
    ],
    globalContext: 'India assumes Chairship representing an expanded, 11-member multi-regional grouping.',
    status: 'current',
    officialSource: { title: 'Official BRICS India 2026 Portal', url: 'https://www.brics2026.gov.in/' },
  },
];

// 4. STRUCTURED FACT CARDS
export const SEED_BRICS_FACTS: BricsFactSeed[] = [
  {
    key: 'brics.nature_and_status',
    label: 'Nature of Grouping',
    value: 'Intergovernmental Cooperation Forum',
    description:
      'BRICS is an informal political, economic, and diplomatic cooperation forum of major emerging economies and Global South countries. It is NOT a military alliance or supranational union.',
    category: 'governance',
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/about-us/',
    verifiedAt: '2026-09',
    displayOrder: 1,
    featured: true,
  },
  {
    key: 'brics.headquarters',
    label: 'Permanent Headquarters',
    value: 'None (No Permanent Secretariat)',
    description:
      'BRICS does NOT possess a permanent physical headquarters or permanent central secretariat. The political forum operates through an annually rotating presidency. Note: The New Development Bank (NDB) has its independent headquarters in Shanghai, China.',
    category: 'governance',
    sourceName: 'Ministry of External Affairs, India',
    sourceUrl: 'https://www.mea.gov.in/',
    verifiedAt: '2026-09',
    displayOrder: 2,
    featured: true,
  },
  {
    key: 'brics.presidency_rotation',
    label: 'Presidency Mechanism',
    value: 'Annually Rotational',
    description:
      'The presidency rotates annually among member nations. The presiding nation sets the annual calendar, coordinates ministerial tracks, hosts working groups, and organizes the annual leaders summit.',
    category: 'governance',
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/about-us/',
    verifiedAt: '2026-09',
    displayOrder: 3,
    featured: true,
  },
  {
    key: 'brics.current_members',
    label: 'Current Full Members (2026)',
    value: '11 Sovereign Nations',
    description:
      'The 11 full member nations are: Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, Saudi Arabia, United Arab Emirates, and Indonesia. In addition, 10 countries hold partner status.',
    category: 'membership',
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/about-us/',
    verifiedAt: '2026-09',
    displayOrder: 4,
    featured: true,
  },
  {
    key: 'brics.presidency_2026',
    label: '2026 Presidency',
    value: 'Republic of India',
    description:
      'India holds the BRICS Chairship for 2026. This is Indias fourth time leading the grouping, following previous successful presidencies in 2012, 2016, and 2021.',
    category: 'summit_2026',
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/brics-india-2026/',
    verifiedAt: '2026-09',
    displayOrder: 5,
    featured: true,
  },
  {
    key: 'brics.summit_2026_dates',
    label: '18th BRICS Summit Schedule',
    value: 'September 12–13, 2026 (New Delhi)',
    description:
      'The 18th annual BRICS Leaders Summit is officially scheduled to take place in New Delhi, India, on September 12–13, 2026.',
    category: 'summit_2026',
    sourceName: 'Official BRICS India 2026 Portal & MEA',
    sourceUrl: 'https://www.brics2026.gov.in/',
    verifiedAt: '2026-09',
    displayOrder: 6,
    featured: true,
  },
  {
    key: 'brics.theme_2026',
    label: 'Official 2026 Theme',
    value: 'Building for Resilience, Innovation, Cooperation and Sustainability',
    description:
      'Selected to echo the B-R-I-C-S acronym, India’s 2026 theme focuses on 4 foundational pillars: Resilience, Innovation, Cooperation, and Sustainability, driven by a human-centric philosophy.',
    category: 'summit_2026',
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/brics-india-2026/',
    verifiedAt: '2026-09',
    displayOrder: 7,
    featured: true,
  },
  {
    key: 'brics.first_summit',
    label: 'First Summit Held',
    value: 'June 16, 2009 (Yekaterinburg, Russia)',
    description:
      'The very first summit-level meeting of BRIC leaders (Brazil, Russia, India, China) was convened in Yekaterinburg, Russia, on June 16, 2009.',
    category: 'general',
    sourceName: 'Official BRICS Archive',
    sourceUrl: 'https://www.brics2026.gov.in/past-summits/2009-yekaterinburg/',
    verifiedAt: '2026-09',
    displayOrder: 8,
    featured: true,
  },
  {
    key: 'brics.south_africa_joined',
    label: 'South Africa Entry (BRIC -> BRICS)',
    value: '2010 Invitation / 2011 Sanya Summit',
    description:
      'South Africa was invited in late 2010 and attended its first summit in Sanya, China in April 2011, officially transforming the grouping and acronym from BRIC to BRICS.',
    category: 'membership',
    sourceName: 'DIRCO South Africa & MEA',
    sourceUrl: 'https://www.brics2023.gov.za/',
    verifiedAt: '2026-09',
    displayOrder: 9,
    featured: true,
  },
  {
    key: 'brics.global_share_gdp',
    label: 'Share of Global Economy (PPP)',
    value: 'Over 36% of Global GDP (PPP)',
    description:
      'The expanded 11-member BRICS accounts for over 36% of global Gross Domestic Product measured by Purchasing Power Parity (PPP), surpassing the G7 nations share in PPP terms.',
    category: 'economy',
    sourceName: 'IMF World Economic Outlook Data',
    sourceUrl: 'https://www.imf.org/',
    verifiedAt: '2026-09',
    displayOrder: 10,
    featured: true,
  },
  {
    key: 'brics.global_population',
    label: 'Global Population Representation',
    value: 'Over 45% of World Population',
    description:
      'Together, the 11 member nations represent approximately 3.7 billion citizens, comprising over 45% of the global human population.',
    category: 'economy',
    sourceName: 'UN Population Division',
    sourceUrl: 'https://population.un.org/',
    verifiedAt: '2026-09',
    displayOrder: 11,
    featured: true,
  },
  {
    key: 'brics.major_institutions',
    label: 'Key Multilateral Institutions',
    value: 'New Development Bank (NDB) & CRA',
    description:
      'The New Development Bank ($100B authorized capital, HQ in Shanghai) and the Contingent Reserve Arrangement ($100B mutual central bank liquidity framework) were both founded at the 2014 Fortaleza Summit.',
    category: 'institutions',
    sourceName: 'New Development Bank Official Site',
    sourceUrl: 'https://www.ndb.int/',
    verifiedAt: '2026-09',
    displayOrder: 12,
    featured: true,
  },
];

// 5. BRICS INSTITUTIONS AND MECHANISMS
export const SEED_BRICS_INSTITUTIONS: BricsInstitutionSeed[] = [
  {
    slug: 'new-development-bank',
    name: 'New Development Bank',
    acronym: 'NDB',
    yearEstablished: 2014,
    establishmentSummit: '6th BRICS Summit (Fortaleza, Brazil)',
    headquarters: 'Shanghai, People’s Republic of China',
    purpose:
      'Mobilizing resources for infrastructure and sustainable development projects in BRICS and other emerging market economies and developing countries, complementing existing multilateral and regional financial institutions.',
    keyFunctions: [
      'Provides loans, guarantees, equity investment, and technical assistance for infrastructure development',
      'Pioneers local currency financing to protect developing borrowers against foreign exchange volatility',
      'Operates regional centres including Africa Regional Centre (Johannesburg) and Americas Regional Office (São Paulo)',
      'Expanded membership beyond core BRICS to include Bangladesh, UAE, Egypt, and Uruguay',
    ],
    significance:
      'The first major global multilateral development bank conceived, capitalized, and led entirely by emerging economies. First president was prominent Indian banker K. V. Kamath (2015-2020).',
    capitalStructure: 'Authorized capital of $100 billion; initial subscribed capital of $50 billion equally divided among founding members.',
    isIndependentLegalEntity: true,
    officialSourceUrl: 'https://www.ndb.int/',
    sourceName: 'New Development Bank Official Portal',
    displayOrder: 1,
  },
  {
    slug: 'contingent-reserve-arrangement',
    name: 'Contingent Reserve Arrangement',
    acronym: 'CRA',
    yearEstablished: 2014,
    establishmentSummit: '6th BRICS Summit (Fortaleza, Brazil)',
    headquarters: 'Operated through central bank coordinating committees (No physical standalone secretariat)',
    purpose:
      'A mutual financial safety net established by treaty among member central banks to provide liquidity support through currency swaps in response to short-term balance-of-payments pressures or financial instability.',
    keyFunctions: [
      'Provides short-term liquidity relief to member central banks experiencing balance-of-payments distress',
      'Mitigates the contagion effects of abrupt global capital reversals or interest rate hikes in developed markets',
      'Functions via bilateral swap arrangements governed by a Standing Committee and Governing Council',
    ],
    significance:
      'A South-South financial stability framework that complements the International Monetary Fund (IMF) and strengthens monetary self-reliance across emerging markets.',
    capitalStructure:
      'Total resource pool of $100 billion (China: $41 billion; Brazil: $18 billion; Russia: $18 billion; India: $18 billion; South Africa: $5 billion).',
    isIndependentLegalEntity: false,
    officialSourceUrl: 'https://brics.br/en',
    sourceName: 'Treaty for the Establishment of a BRICS Contingent Reserve Arrangement',
    displayOrder: 2,
  },
  {
    slug: 'brics-business-council',
    name: 'BRICS Business Council',
    acronym: 'BBC',
    yearEstablished: 2013,
    establishmentSummit: '5th BRICS Summit (Durban, South Africa)',
    headquarters: 'Coordinated through national chapters in each member country',
    purpose:
      'Fostering dialogue and trade ties between the private business sectors and governments of the member nations to identify bottlenecks and unlock cross-border commercial partnerships.',
    keyFunctions: [
      'Operates sectoral working groups in Agribusiness, Aviation, Digital Economy, Energy, Financial Services, Infrastructure, and Manufacturing',
      'Organizes the annual BRICS Business Forum preceding the Leaders Summit',
      'Submits annual private-sector recommendation reports directly to BRICS Heads of State',
    ],
    significance:
      'The primary institutional Track-I.5 platform translating high-level diplomatic agreements into actionable enterprise trade, joint ventures, and direct foreign investment.',
    isIndependentLegalEntity: false,
    officialSourceUrl: 'https://bricsbusinesscouncil.co.in/',
    sourceName: 'BRICS Business Council Official Portal',
    displayOrder: 3,
  },
  {
    slug: 'brics-women-business-alliance',
    name: 'BRICS Women Business Alliance',
    acronym: 'WBA',
    yearEstablished: 2020,
    establishmentSummit: '11th BRICS Summit (Brasília, Brazil)',
    headquarters: 'Rotational national chapters',
    purpose:
      'Promoting womens economic empowerment, supporting female-led enterprises and startups, and integrating women entrepreneurs into global value chains across the member nations.',
    keyFunctions: [
      'Organizes the BRICS Women’s Entrepreneurship Forum',
      'Facilitates access to venture finance, mentoring, and cross-border trade networks for female founders',
      'Promotes digital skills training and healthcare tech initiatives spearheaded by women',
    ],
    significance:
      'Recognized at the 12th and 13th summits as a vital driver of inclusive, gender-equitable economic development across emerging markets.',
    isIndependentLegalEntity: false,
    officialSourceUrl: 'https://brics-wba.org/',
    sourceName: 'BRICS Women Business Alliance',
    displayOrder: 4,
  },
  {
    slug: 'brics-think-tanks-council',
    name: 'BRICS Think Tanks Council',
    acronym: 'BTTC',
    yearEstablished: 2013,
    establishmentSummit: '5th BRICS Summit (Durban, South Africa)',
    headquarters: 'Consortium of leading national public policy research institutions',
    purpose:
      'Uniting premier academic and geopolitical think tanks across member states to conduct collaborative policy research, debate multilateral governance reforms, and generate evidence-based policy inputs for leaders.',
    keyFunctions: [
      'Coordinates the annual BRICS Academic Forum and Think Tank Symposium',
      'Prepares analytical papers on global governance reform, trade economics, and security cooperation',
      'Maintains collaborative intellectual networks among Global South scholars',
    ],
    significance:
      'Represents Track-II intellectual diplomacy, ensuring that BRICS discussions are grounded in academic research and strategic analysis.',
    isIndependentLegalEntity: false,
    officialSourceUrl: 'https://bricsthinktankscouncil.org/',
    sourceName: 'BRICS Think Tanks Council',
    displayOrder: 5,
  },
  {
    slug: 'brics-interbank-cooperation-mechanism',
    name: 'BRICS Interbank Cooperation Mechanism',
    acronym: 'ICM',
    yearEstablished: 2010,
    establishmentSummit: '2nd BRIC Summit (Brasília, Brazil)',
    headquarters: 'Consortium of national development and export-import banks',
    purpose:
      'Developing banking and credit cooperation between member development finance institutions (e.g., EXIM Bank of India, BNDES of Brazil, VEB.RF of Russia, China Development Bank, DBSA of South Africa).',
    keyFunctions: [
      'Signs master agreements on extending local currency credit facilities for bilateral projects',
      'Supports infrastructure financing, green technology, and trade settlement cooperation',
      'Facilitates financial inter-operability without sole reliance on third-party currency clearing houses',
    ],
    significance:
      'Foundational financial mechanism established prior to the creation of the NDB, fostering direct bilateral interbank trust.',
    isIndependentLegalEntity: false,
    officialSourceUrl: 'https://www.eximbankindia.in/',
    sourceName: 'Export-Import Bank of India / BRICS ICM',
    displayOrder: 6,
  },
];

// 6. VERIFIED COMPREHENSIVE FAQS (18 Verified Questions)
export const SEED_BRICS_FAQS: BricsFaqSeed[] = [
  {
    slug: 'what-is-brics',
    question: 'What is BRICS?',
    answer:
      'BRICS is an intergovernmental cooperation forum bringing together major emerging market economies and leading nations of the Global South. Originally established in the late 2000s to champion reform in global governance and financial institutions, BRICS facilitates collaborative dialogue across political, economic, financial, technological, and people-to-people spheres.',
    category: 'General',
    displayOrder: 1,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/about-us/',
  },
  {
    slug: 'what-does-brics-stand-for',
    question: 'What does the acronym BRICS stand for?',
    answer:
      'The acronym BRICS originally stood for the first letters of the founding and early member countries: Brazil, Russia, India, China, and South Africa. Following major membership expansions in 2024 and 2025 that added Egypt, Ethiopia, Iran, Saudi Arabia, the United Arab Emirates, and Indonesia, the grouping retains the globally recognized name "BRICS" as its established institutional identity.',
    category: 'General',
    displayOrder: 2,
    sourceName: 'Ministry of External Affairs, India',
    sourceUrl: 'https://www.mea.gov.in/',
  },
  {
    slug: 'who-coined-the-term-bric',
    question: 'Who coined the term BRIC and when?',
    answer:
      'The acronym "BRIC" was coined in 2001 by British economist Jim O’Neill, then head of global economic research at Goldman Sachs, in his seminal research paper titled "Building Better Global Economic BRICs" (Global Economics Paper No. 66). O’Neill argued that the economies of Brazil, Russia, India, and China would collectively outgrow the G7 economies over the coming decades.',
    category: 'History',
    displayOrder: 3,
    sourceName: 'Goldman Sachs Economic Research (2001)',
    sourceUrl: 'https://www.goldmansachs.com/insights/pages/building-better-brics.html',
  },
  {
    slug: 'when-was-brics-formed',
    question: 'When and how was BRICS formed as a political entity?',
    answer:
      'BRIC transitioned from an economic concept into an active diplomatic grouping in September 2006, when the foreign ministers of Brazil, Russia, India, and China met on the sidelines of the United Nations General Assembly in New York. The first official summit-level meeting of Heads of State was held on June 16, 2009, in Yekaterinburg, Russia, which established the annual summit mechanism.',
    category: 'History',
    displayOrder: 4,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/past-summits/2009-yekaterinburg/',
  },
  {
    slug: 'when-did-south-africa-join',
    question: 'When did South Africa join BRICS?',
    answer:
      'South Africa was invited to join the grouping at the BRIC Foreign Ministers meeting in New York in September 2010. President Jacob Zuma attended his nations first summit at the 3rd BRICS Summit in Sanya, China, on April 14, 2011, which officially added the "S" to the acronym, turning BRIC into BRICS.',
    category: 'History',
    displayOrder: 5,
    sourceName: 'Department of International Relations and Cooperation, South Africa',
    sourceUrl: 'https://www.brics2023.gov.za/',
  },
  {
    slug: 'how-many-countries-in-brics-2026',
    question: 'How many countries are in BRICS in 2026?',
    answer:
      'As of 2026, BRICS consists of 11 full member countries: Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, Saudi Arabia, the United Arab Emirates, and Indonesia. In addition, 10 countries hold official "Partner Country" status: Belarus, Bolivia, Cuba, Kazakhstan, Malaysia, Nigeria, Thailand, Uganda, Uzbekistan, and Vietnam.',
    category: 'Membership',
    displayOrder: 6,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/about-us/',
  },
  {
    slug: 'how-did-indonesia-join',
    question: 'When did Indonesia join BRICS?',
    answer:
      'Indonesia formally joined as a full member in January 2025 during Brazil’s presidency. As Southeast Asia’s largest economy and a historic pioneer of the Non-Aligned Movement (from the 1955 Bandung Conference), Indonesia’s entry expanded BRICS into the ASEAN region.',
    category: 'Membership',
    displayOrder: 7,
    sourceName: 'Ministry of Foreign Affairs, Republic of Indonesia',
    sourceUrl: 'https://kemlu.go.id/',
  },
  {
    slug: 'which-country-holds-2026-presidency',
    question: 'Which country holds the BRICS presidency in 2026?',
    answer:
      'The Republic of India holds the BRICS Chairship for 2026. India officially assumed the chair from Brazil on January 1, 2026. This is India’s fourth time leading the grouping, having previously held the chairship in 2012 (New Delhi), 2016 (Goa), and 2021 (New Delhi / virtual).',
    category: 'Presidency',
    displayOrder: 8,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/brics-india-2026/',
  },
  {
    slug: 'where-is-2026-summit-held',
    question: 'Where and when is the 2026 BRICS Summit scheduled to take place?',
    answer:
      'The 18th annual BRICS Leaders Summit is scheduled to take place in New Delhi, India, on September 12–13, 2026, according to the official Indian presidency calendar.',
    category: 'Summit 2026',
    displayOrder: 9,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/',
  },
  {
    slug: 'what-is-the-2026-theme',
    question: 'What is the official theme of the BRICS 2026 India Chairship?',
    answer:
      'The official theme of India’s 2026 Chairship is: "Building for Resilience, Innovation, Cooperation and Sustainability". The four pillars resonate with the letters B-R-I-C-S and reflect India’s people-centric, humanity-first vision for global governance.',
    category: 'Summit 2026',
    displayOrder: 10,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/brics-india-2026/',
  },
  {
    slug: 'what-are-the-four-pillars-2026',
    question: 'What are the four pillars of India’s 2026 BRICS Chairship?',
    answer:
      'The four pillars are: 1) Resilience: Strengthening economic, supply chain, public health, and disaster resilience against global shocks; 2) Innovation: Sharing Digital Public Infrastructure (DPI), fintech, AI solutions, and green technologies; 3) Cooperation: Reforming multilateral institutions, facilitating local currency settlements, and South-South economic partnerships; 4) Sustainability: Accelerating climate finance, renewable energy transitions, and Mission LiFE (Lifestyle for Environment).',
    category: 'Summit 2026',
    displayOrder: 11,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/brics-india-2026/',
  },
  {
    slug: 'does-brics-have-permanent-headquarters',
    question: 'Does BRICS have a permanent headquarters?',
    answer:
      'No. BRICS as a political and diplomatic forum does NOT have a permanent headquarters or a central secretariat. Unlike organizations such as the United Nations (New York) or the WTO (Geneva), BRICS operates on an annual rotational presidency model. Note: The New Development Bank (NDB), which was established by BRICS, has its independent headquarters in Shanghai, China.',
    category: 'Governance',
    displayOrder: 12,
    sourceName: 'Ministry of External Affairs, India',
    sourceUrl: 'https://www.mea.gov.in/',
  },
  {
    slug: 'how-does-brics-presidency-work',
    question: 'How does the BRICS rotational presidency work?',
    answer:
      'The presidency rotates annually among member nations. The presiding nation is responsible for setting the annual agenda in consultation with members, convening ministerial meetings (Foreign Affairs, Finance, Trade, Digital, Energy, Health), coordinating working groups, and organizing the annual Leaders Summit.',
    category: 'Governance',
    displayOrder: 13,
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/about-us/',
  },
  {
    slug: 'what-is-new-development-bank',
    question: 'What is the New Development Bank (NDB)?',
    answer:
      'The New Development Bank (NDB) is a multilateral development bank established by BRICS member countries under the Fortaleza Agreement in 2014. Headquartered in Shanghai, China, the bank mobilizes capital for infrastructure and sustainable development projects in emerging markets. It has an authorized capital of $100 billion and places strong emphasis on local currency lending.',
    category: 'Institutions',
    displayOrder: 14,
    sourceName: 'New Development Bank Official Portal',
    sourceUrl: 'https://www.ndb.int/',
  },
  {
    slug: 'what-is-contingent-reserve-arrangement',
    question: 'What is the BRICS Contingent Reserve Arrangement (CRA)?',
    answer:
      'The Contingent Reserve Arrangement (CRA) is a $100 billion treaty-based framework established in 2014 by member central banks. It functions as a mutual liquidity mechanism to assist member countries facing short-term balance-of-payments pressures or currency volatility. The CRA is operated through central bank coordinating committees and does not maintain a standalone physical secretariat.',
    category: 'Institutions',
    displayOrder: 15,
    sourceName: 'Official Fortaleza Declaration & CRA Treaty',
    sourceUrl: 'https://brics.br/en',
  },
  {
    slug: 'how-are-decisions-made-in-brics',
    question: 'How are decisions made in BRICS?',
    answer:
      'All decisions in BRICS are reached strictly by consensus among all member states. There is no weighted voting or majority veto system in the political forum. Every member nation, regardless of economic size or population, possesses an equal voice.',
    category: 'Governance',
    displayOrder: 16,
    sourceName: 'Ministry of External Affairs, India',
    sourceUrl: 'https://www.mea.gov.in/',
  },
  {
    slug: 'why-is-brics-important-for-india',
    question: 'Why is BRICS important for India?',
    answer:
      'BRICS provides India with a premier global platform to champion Global South interests, promote Digital Public Infrastructure (DPI), advance balanced multipolarity, advocate for reform of the United Nations Security Council and Bretton Woods institutions, diversify international trade and energy corridors, and strengthen counter-terrorism cooperation.',
    category: 'India & BRICS',
    displayOrder: 17,
    sourceName: 'Ministry of External Affairs, India',
    sourceUrl: 'https://www.mea.gov.in/',
  },
  {
    slug: 'what-is-the-difference-between-members-and-partners',
    question: 'What is the difference between BRICS full members and partner countries?',
    answer:
      'Full members participate in all decision-making, summit declarations, and governance mechanisms by consensus. In contrast, "Partner Countries" (a category formalized at the 2024 Kazan Summit) engage in designated ministerial tracks, working groups, and joint economic initiatives without holding consensus voting rights in final summit communiques.',
    category: 'Membership',
    displayOrder: 18,
    sourceName: 'Official BRICS Russia 2024 Portal & MEA',
    sourceUrl: 'http://en.brics-russia2024.ru/',
  },
];

// 7. OFFICIAL SOURCES AND CITATIONS
export const SEED_BRICS_SOURCES: BricsSourceSeed[] = [
  {
    sourceName: 'Official BRICS India 2026 Portal',
    sourceUrl: 'https://www.brics2026.gov.in/',
    sourceType: 'official_presidency',
    description:
      'The authoritative Government of India website for India’s 2026 Chairship, providing calendar dates, theme descriptions, and summit details.',
    publishedDate: '2026-01-01',
    accessedDate: '2026-09-11',
    isPrimary: true,
    displayOrder: 1,
  },
  {
    sourceName: 'Ministry of External Affairs, Government of India',
    sourceUrl: 'https://www.mea.gov.in/',
    sourceType: 'government',
    description:
      'Official repository of multilateral statements, summit declarations, and press briefings by the Government of India.',
    publishedDate: '2026-01-15',
    accessedDate: '2026-09-11',
    isPrimary: true,
    displayOrder: 2,
  },
  {
    sourceName: 'Official BRICS Brazil 2025 Portal',
    sourceUrl: 'https://brics.br/en',
    sourceType: 'official_presidency',
    description:
      'The official portal of Brazil’s 2025 BRICS Presidency and 17th Summit in Rio de Janeiro.',
    publishedDate: '2025-07-07',
    accessedDate: '2026-09-11',
    isPrimary: true,
    displayOrder: 3,
  },
  {
    sourceName: 'New Development Bank (NDB) Official Portal',
    sourceUrl: 'https://www.ndb.int/',
    sourceType: 'multilateral_institution',
    description:
      'Official governance documents, Articles of Agreement, project portfolios, and capital structure data of the New Development Bank.',
    publishedDate: '2026-01-01',
    accessedDate: '2026-09-11',
    isPrimary: true,
    displayOrder: 4,
  },
  {
    sourceName: 'Official BRICS Russia 2024 Portal (Kazan Summit)',
    sourceUrl: 'http://en.brics-russia2024.ru/',
    sourceType: 'official_presidency',
    description:
      'Official repository for the 16th BRICS Summit in Kazan, including the Kazan Declaration and Partner Country guidelines.',
    publishedDate: '2024-10-24',
    accessedDate: '2026-09-11',
    isPrimary: true,
    displayOrder: 5,
  },
  {
    sourceName: 'Official BRICS South Africa 2023 Portal (Johannesburg Summit)',
    sourceUrl: 'https://www.brics2023.gov.za/',
    sourceType: 'official_presidency',
    description:
      'Official portal documenting the 15th BRICS Summit and the historic Johannesburg II Declaration on membership expansion.',
    publishedDate: '2023-08-24',
    accessedDate: '2026-09-11',
    isPrimary: true,
    displayOrder: 6,
  },
  {
    sourceName: 'Treaty for the Establishment of a BRICS Contingent Reserve Arrangement (Fortaleza 2014)',
    sourceUrl: 'https://www.brics2026.gov.in/past-summits/2014-fortaleza/',
    sourceType: 'treaty_declaration',
    description:
      'The founding multilateral treaty establishing the $100 billion currency reserve support mechanism signed in Fortaleza, Brazil.',
    publishedDate: '2014-07-15',
    accessedDate: '2026-09-11',
    isPrimary: true,
    displayOrder: 7,
  },
];

// 8. DID YOU KNOW? FACT CARDS (10 Factual Cards)
export const SEED_BRICS_DID_YOU_KNOW = [
  {
    id: 'dyk-1',
    title: 'Acronym Coined by an Economist',
    fact: 'The term "BRIC" was coined in 2001 by Goldman Sachs economist Jim O’Neill. It was not originally created by diplomats, but by an economic researcher forecasting global GDP shifts.',
    source: 'Goldman Sachs Economic Paper No. 66',
  },
  {
    id: 'dyk-2',
    title: 'No Permanent Secretariat',
    fact: 'Unlike the United Nations, OECD, or World Bank, BRICS has no permanent central secretariat or permanent headquarters. The presiding country coordinates the annual agenda.',
    source: 'Ministry of External Affairs, India',
  },
  {
    id: 'dyk-3',
    title: 'First NDB President Was Indian',
    fact: 'The first President of the New Development Bank was acclaimed Indian banker K. V. Kamath, who led the institution from its founding in Shanghai in 2015 through 2020.',
    source: 'New Development Bank Official Corporate Governance',
  },
  {
    id: 'dyk-4',
    title: 'Strict Consensus Decision Making',
    fact: 'Every decision in BRICS—from joint communiques to admitting new members—is reached strictly by consensus. No single member can force a resolution over another member’s objection.',
    source: 'Official BRICS India 2026 Portal',
  },
  {
    id: 'dyk-5',
    title: 'Surpassed G7 in PPP Economy',
    fact: 'The expanded 11-member BRICS accounts for over 36% of global Gross Domestic Product adjusted for Purchasing Power Parity (PPP), surpassing the G7 nations’ aggregate share.',
    source: 'International Monetary Fund (IMF) WEO Data',
  },
  {
    id: 'dyk-6',
    title: 'India’s Fourth Presidency',
    fact: 'India is chairing BRICS for the fourth time in 2026, having successfully hosted summits in New Delhi (2012), Goa (2016), and New Delhi virtually (2021).',
    source: 'Official BRICS India 2026 Portal',
  },
  {
    id: 'dyk-7',
    title: 'Shared Satellite Constellation',
    fact: 'During India’s 2021 presidency, the member nations signed a treaty to share earth-observation data from a virtual constellation of their respective national remote sensing satellites.',
    source: '13th BRICS Summit New Delhi Declaration',
  },
  {
    id: 'dyk-8',
    title: 'CRA is a Treaty, Not a Bank',
    fact: 'The Contingent Reserve Arrangement (CRA) is a $100 billion treaty network between member central banks for short-term liquidity, distinct from the physical New Development Bank.',
    source: 'Fortaleza Treaty 2014',
  },
  {
    id: 'dyk-9',
    title: 'Indonesia Entered in 2025',
    fact: 'Indonesia formally joined as a full member in January 2025 during Brazil’s presidency, bringing ASEAN representation directly into the core membership.',
    source: 'Ministry of Foreign Affairs Indonesia (Kemlu)',
  },
  {
    id: 'dyk-10',
    title: 'Partner Country Category',
    fact: 'The 2024 Kazan Summit established a formalized "Partner Country" tier for 10 nations to participate in ministerial dialogues without full consensus voting rights.',
    source: '16th BRICS Summit Kazan Declaration',
  },
];

// 9. FLAGSHIP CURATED ARTICLE: "BRICS Summit 2026 in India"
export const SEED_BRICS_ARTICLE = {
  title: 'BRICS Summit 2026 in India: History, Member Countries, Presidency, Agenda and Key Facts',
  slug: 'brics-summit-2026-india',
  excerpt:
    'The definitive, factual guide to the 18th BRICS Summit 2026 in New Delhi under India’s Chairship: 11 member countries, 4 pillars of resilience, innovation, cooperation, and sustainability, full summit history, NDB, and India’s leadership in the Global South.',
  coverImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200',
  author: 'SpotPicks Geopolitical Research Team',
  authorRole: 'Public Policy & Geopolitical Editors',
  authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  category: 'Global Affairs & India',
  tags: [
    'BRICS 2026',
    'India Presidency',
    'New Delhi Summit',
    'Global South',
    'Geopolitics',
    'New Development Bank',
    'International Relations',
    'MEA India',
  ],
  locations: ['New Delhi', 'India', 'Global'],
  seoTitle: 'BRICS Summit 2026 in India: History, Members, Presidency & Key Facts',
  seoDescription:
    'Learn about BRICS Summit 2026 in India, BRICS history, member countries, rotating presidencies, summit timeline, India\'s role, key institutions and important facts.',
  published: true,
  publishedAt: new Date('2026-01-05'),
  readingTimeMinutes: 16,
  featured: true,
  content: `
# BRICS Summit 2026 in India: History, Member Countries, Presidency, Agenda and Key Facts

> **Authoritative Notice**: This knowledge hub synthesizes officially confirmed information from the [Official BRICS India 2026 Portal](https://www.brics2026.gov.in/), the [Ministry of External Affairs of India](https://www.mea.gov.in/), and official presidency declarations from 2009 through 2025. Future dates and agenda items are explicitly marked as **scheduled**, **planned**, or **announced**.

---

## 1. Introduction

In 2026, the Republic of India assumed the Chairship of **BRICS**, presiding over the premier cooperation grouping of major emerging economies and the Global South. The **18th BRICS Leaders Summit** is officially scheduled to take place in **New Delhi, India, on September 12–13, 2026**.

This marks India’s fourth time leading the grouping, following landmark presidencies in 2012 (New Delhi), 2016 (Goa), and 2021 (New Delhi / virtual). It is also the first time India is hosting the leaders’ summit since the historic expansions of 2024 and 2025, which broadened the forum from 5 nations into a multi-continental grouping of 11 full member states representing over 3.7 billion citizens.

---

## 2. What is BRICS?

**BRICS** is an intergovernmental cooperation forum comprising major emerging economies and leading nations of the Global South. It is neither a military alliance nor a supranational legislative body. Rather, it operates as a consensus-driven platform for high-level political dialogue, macroeconomic coordination, trade and financial cooperation, and people-to-people exchanges.

### Foundational Characteristics
- **Decision-Making**: Strictly by consensus among all member states. Every member possesses an equal voice.
- **Permanent Headquarters**: **None**. BRICS has no central secretariat.
- **Presidency**: Rotates annually among member nations.
- **Core Focus**: Reforming the multilateral system (UN, IMF, World Bank, WTO), promoting sustainable development, and fostering South-South trade in local currencies.

---

## 3. Why BRICS Matters in Global Governance

The 11 members of BRICS represent a profound transformation in global economic and geopolitical weight:

1. **Demographics**: Over **45% of the world’s population** (approx. 3.7 billion people).
2. **Economic Scale**: Over **36% of global Gross Domestic Product** measured by Purchasing Power Parity (PPP), surpassing the aggregate share of the G7 economies.
3. **Natural Resources & Energy**: Command over 42% of global crude oil production and substantial global reserves of natural gas, agricultural commodities, and critical transition minerals (nickel, rare earths, platinum group metals).
4. **Voice of the Global South**: Provides developing nations with a collective platform to advocate for a more equitable international financial architecture.

---

## 4. History of BRICS

### A. Origin of the BRIC Concept (2001)
The acronym **BRIC** was coined in 2001 by British economist Jim O’Neill, then Head of Global Economics Research at Goldman Sachs, in his paper *"Building Better Global Economic BRICs"*. O’Neill observed that Brazil, Russia, India, and China were growing at rates that would shift the center of global economic gravity over the 21st century.

### B. First Ministerial Dialogue (2006)
In September 2006, the foreign ministers of Brazil, Russia, India, and China convened on the sidelines of the 61st United Nations General Assembly in New York. This diplomatic interaction laid the groundwork for regularized annual discussions.

### C. The Inaugural Summit in Yekaterinburg (2009)
The global financial crisis of 2008 accelerated the need for emerging economies to coordinate macroeconomic policy. On **June 16, 2009**, Russian President Dmitry Medvedev hosted Brazilian President Luiz Inácio Lula da Silva, Indian Prime Minister Manmohan Singh, and Chinese President Hu Jintao in **Yekaterinburg, Russia**, for the **1st BRIC Summit**.

### D. South Africa Joins: Transition to BRICS (2010–2011)
At the BRIC Foreign Ministers meeting in New York in September 2010, member states agreed to invite South Africa. South African President Jacob Zuma attended the **3rd Summit in Sanya, China, on April 14, 2011**, formally expanding the acronym from **BRIC to BRICS**.

---

## 5. Major Expansions: The Road to 11 Members

### The 2023 Johannesburg Decision
At the 15th BRICS Summit in Johannesburg (August 2023), member leaders adopted the historic **Johannesburg II Declaration**, establishing guiding principles for admitting new members. Six countries were invited; effective **January 1, 2024**, five nations formally acceded:
1. **Arab Republic of Egypt**
2. **Federal Democratic Republic of Ethiopia**
3. **Islamic Republic of Iran**
4. **Kingdom of Saudi Arabia**
5. **United Arab Emirates (UAE)**

*(Note: Argentina was invited in August 2023, but its newly elected administration formally declined accession in December 2023).*

### Indonesia Joins as the 11th Full Member (January 2025)
During Brazil’s 2025 Chairship, the **Republic of Indonesia** formally completed accession as a full member in January 2025. As Southeast Asia’s largest economy and the spiritual birthplace of the 1955 Bandung Conference, Indonesia brought vital ASEAN representation to the core table.

### Partner Country Framework (Kazan 2024 / 2025)
At the 16th Summit in Kazan (October 2024), leaders formalized a new tier of **Partner Countries** to enable broader South-South engagement without diluting consensus decision-making. Ten nations hold partner status: *Belarus, Bolivia, Cuba, Kazakhstan, Malaysia, Nigeria, Thailand, Uganda, Uzbekistan, and Vietnam*.

---

## 6. Current Member Countries at a Glance (2026)

| Country | Joined | Capital | Region | Presidencies Held |
| :--- | :--- | :--- | :--- | :--- |
| **India** | 2009 | New Delhi | South Asia | 2012, 2016, 2021, 2026 |
| **Brazil** | 2009 | Brasília | South America | 2010, 2014, 2019, 2025 |
| **Russia** | 2009 | Moscow | Eurasia | 2009, 2015, 2020, 2024 |
| **China** | 2009 | Beijing | East Asia | 2011, 2017, 2022 |
| **South Africa** | 2010/11 | Pretoria | Southern Africa | 2013, 2018, 2023 |
| **Egypt** | 2024 | Cairo | North Africa / Arab World | — |
| **Ethiopia** | 2024 | Addis Ababa | East Africa | — |
| **Iran** | 2024 | Tehran | Middle East / West Asia | — |
| **Saudi Arabia** | 2024 | Riyadh | Middle East / West Asia | — |
| **UAE** | 2024 | Abu Dhabi | Middle East / West Asia | — |
| **Indonesia** | 2025 | Jakarta / Nusantara | Southeast Asia | — |

---

## 7. How the BRICS Rotational Presidency Operates

A foundational rule of BRICS is the **absence of a permanent central secretariat**. 

### The Presidency Cycle
1. **Annual Handover**: On January 1 of each year, the chairship passes to the next designated member.
2. **Agenda Setting**: The presiding country defines the overarching annual theme and hosts all ministerial meetings, working groups, and civil society forums.
3. **The Summit**: The presidency culminates in hosting the annual Heads of State and Government Summit, where the comprehensive summit declaration is drafted and adopted by consensus.
4. **Sherpa Track**: Senior diplomats known as *Sherpas* and *Sous-Sherpas* meet regularly throughout the year to prepare consensus texts for leaders.

---

## 8. India’s Role in BRICS: A Founding Pillar

India has been an indispensable pillar of BRICS since its inception:

1. **Conception of the New Development Bank**: At the 4th Summit in New Delhi (2012), Indian Prime Minister Manmohan Singh proposed the creation of a South-South development bank. India’s proposal led directly to the 2014 Fortaleza Agreement creating the NDB.
2. **Champion of Counter-Terrorism**: India successfully advocated for the adoption of the *BRICS Counter-Terrorism Strategy* (2020) and the *BRICS Counter-Terrorism Action Plan* (2021), establishing zero tolerance for cross-border terror financing.
3. **Digital Public Infrastructure (DPI)**: India has championed the global sharing of open-source digital rails—such as Unified Payments Interface (UPI), Aadhaar, and DigiLocker—as accessible public goods for developing nations.
4. **Bridge between the Global South and Multilateral Institutions**: India consistently balances progressive Global South reform with constructive engagement in the G20, IMF, and United Nations.

### India’s Previous Presidencies
- **2012 (New Delhi)**: Theme: *"BRICS Partnership for Global Stability, Security and Prosperity"*. Commissioned feasibility of the NDB.
- **2016 (Goa)**: Theme: *"Building Responsive, Inclusive and Collective Solutions"*. Hosted the historic BRICS-BIMSTEC Outreach Summit.
- **2021 (New Delhi / Virtual)**: Theme: *"BRICS@15: Intra-BRICS Cooperation for Continuity, Consolidation and Consensus"*. Adopted the Counter-Terrorism Action Plan and Remote Sensing Satellite Constellation Treaty.

---

## 9. BRICS 2026 under India’s Chairship

### Official Theme: "Building for Resilience, Innovation, Cooperation and Sustainability"

According to the [Official BRICS India 2026 Portal](https://www.brics2026.gov.in/), India’s 2026 Chairship is guided by a human-centric approach that directly echoes the B-R-I-C-S letters:

### The 4 Core Pillars

#### Pillar 1: Resilience
- **Economic & Supply Chain Resilience**: Diversifying supply networks in critical sectors such as active pharmaceutical ingredients (APIs), fertilizers, and semiconductors.
- **Disaster Risk Reduction**: Leveraging India’s leadership in the Coalition for Disaster Resilient Infrastructure (CDRI) to assist member states in climate-proofing public infrastructure.
- **Public Health Preparedness**: Operationalizing collective pandemic response mechanisms and vaccine research partnerships.

#### Pillar 2: Innovation
- **Digital Public Infrastructure (DPI)**: Democratizing digital financial architecture, digital identity, and citizen service delivery across member nations without high proprietary licensing costs.
- **Responsible Artificial Intelligence**: Promoting inclusive AI governance that prevents technological monopolies while safeguarding ethical standards in the Global South.
- **Science, Technology & Startups**: Enhancing incubation linkages between startup ecosystems in Bengaluru, São Paulo, Shenzhen, and Cairo.

#### Pillar 3: Cooperation
- **Reformed Multilateralism**: Advocating urgent, text-based negotiations for comprehensive reform of the United Nations Security Council (UNSC) and quota recalibration at the IMF.
- **Local Currency Settlements**: Deepening bilateral trade mechanisms denominated in national currencies (e.g., INR, BRL, AED) to reduce excessive exposure to foreign exchange volatility.
- **Trade Facilitation**: Harmonizing customs documentation and expanding maritime corridors such as the International North-South Transport Corridor (INSTC).

#### Pillar 4: Sustainability
- **Climate Finance Equity**: Demanding predictable, grant-based climate finance from historical emitters under the UNFCCC principle of *Common But Differentiated Responsibilities (CBDR)*.
- **Mission LiFE (Lifestyle for Environment)**: Promoting mindful, sustainable consumption habits rooted in traditional community knowledge.
- **Renewable Energy Transitions**: Scaling solar, green hydrogen, and bioenergy partnerships across tropical and emerging economies.

---

## 10. Key BRICS Institutions and Mechanisms

### New Development Bank (NDB)
- **Established**: 2014 (Fortaleza Agreement); entered into force July 2015.
- **Headquarters**: Shanghai, People’s Republic of China.
- **Authorized Capital**: $100 billion.
- **Leadership**: First President was K. V. Kamath (India, 2015–2020); subsequent leadership has rotated among members.
- **Core Distinction**: An independent, treaty-based multilateral development bank with equal founding voting rights (20% each for Brazil, Russia, India, China, South Africa).

### Contingent Reserve Arrangement (CRA)
- **Established**: 2014 (Fortaleza Treaty).
- **Size**: $100 billion reserve commitment.
- **Nature**: A mutual liquidity swap framework between central banks.
- **Headquarters**: **None**. It is administered by a Standing Committee of member central bank governors rather than a standalone physical institution.

### Track-I.5 and Track-II Cooperation Bodies
- **BRICS Business Council**: Connects national business chambers and industrial federations.
- **BRICS Women Business Alliance**: Advances female entrepreneurs and startup founders.
- **BRICS Think Tanks Council (BTTC)**: Coordinates Track-II policy research between premier national policy institutes.
- **BRICS Academic Forum & Youth Summit**: Engages university scholars, young leaders, and researchers.

---

## 11. Frequently Asked Questions

### Does BRICS have a permanent headquarters?
**No.** BRICS does not have a permanent headquarters or a central secretariat. The political forum operates through an annually rotating presidency. The New Development Bank (NDB) has its independent headquarters in Shanghai, China.

### How many member countries are in BRICS in 2026?
There are **11 full member countries**: Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, Saudi Arabia, the United Arab Emirates, and Indonesia. In addition, 10 nations hold partner country status.

### Where is the 2026 BRICS Summit being held?
The 18th BRICS Summit is officially scheduled to take place in **New Delhi, India, on September 12–13, 2026**.

### What is the theme of India’s 2026 Chairship?
*"Building for Resilience, Innovation, Cooperation and Sustainability"*.

---

## 12. Verified Primary Sources and Official Documentation

1. **Official BRICS India 2026 Portal**: [https://www.brics2026.gov.in/](https://www.brics2026.gov.in/)
2. **Ministry of External Affairs, Government of India**: [https://www.mea.gov.in/](https://www.mea.gov.in/)
3. **Official BRICS Brazil 2025 Portal**: [https://brics.br/en](https://brics.br/en)
4. **New Development Bank Official Corporate Portal**: [https://www.ndb.int/](https://www.ndb.int/)
5. **Treaty for the Establishment of a BRICS Contingent Reserve Arrangement**: Fortaleza, Brazil, 2014.
6. **Johannesburg II Declaration (15th BRICS Summit)**: Department of International Relations and Cooperation, South Africa, August 2023.
7. **Kazan Summit Declaration (16th BRICS Summit)**: Russian Federation, October 2024.
`,
};
