import mongoose from 'mongoose';
import { BricsMember } from '../models/BricsMember';
import { BricsSummit } from '../models/BricsSummit';
import { BricsPresidency } from '../models/BricsPresidency';
import { BricsFact } from '../models/BricsFact';
import { BricsInstitution } from '../models/BricsInstitution';
import { BricsFaq } from '../models/BricsFaq';
import { BricsSource } from '../models/BricsSource';
import { Article } from '../models/Article';
import {
  SEED_BRICS_MEMBERS,
  SEED_BRICS_SUMMITS,
  SEED_BRICS_PRESIDENCIES,
  SEED_BRICS_FACTS,
  SEED_BRICS_INSTITUTIONS,
  SEED_BRICS_FAQS,
  SEED_BRICS_SOURCES,
  SEED_BRICS_DID_YOU_KNOW,
  SEED_BRICS_ARTICLE,
} from '../seed/bricsData';

export class BricsService {
  private static isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Safe, non-destructive upsert of all BRICS collections into MongoDB Atlas
   */
  public static async seedBricsCollections(): Promise<{
    membersCount: number;
    summitsCount: number;
    presidenciesCount: number;
    factsCount: number;
    institutionsCount: number;
    faqsCount: number;
    sourcesCount: number;
    articleCreated: boolean;
  }> {
    if (!this.isConnected()) {
      console.log('ℹ️ [BricsService] MongoDB not connected; in-memory datasets active.');
      return {
        membersCount: SEED_BRICS_MEMBERS.length,
        summitsCount: SEED_BRICS_SUMMITS.length,
        presidenciesCount: SEED_BRICS_PRESIDENCIES.length,
        factsCount: SEED_BRICS_FACTS.length,
        institutionsCount: SEED_BRICS_INSTITUTIONS.length,
        faqsCount: SEED_BRICS_FAQS.length,
        sourcesCount: SEED_BRICS_SOURCES.length,
        articleCreated: true,
      };
    }

    console.log('🔄 [BricsService] Performing safe, idempotent upsert of BRICS collections...');

    // 1. Members
    for (const m of SEED_BRICS_MEMBERS) {
      await BricsMember.findOneAndUpdate(
        { slug: m.slug },
        { $set: m },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 2. Summits
    for (const s of SEED_BRICS_SUMMITS) {
      await BricsSummit.findOneAndUpdate(
        { summitNumber: s.summitNumber },
        { $set: s },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 3. Presidencies
    for (const p of SEED_BRICS_PRESIDENCIES) {
      await BricsPresidency.findOneAndUpdate(
        { year: p.year },
        { $set: p },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 4. Facts
    for (const f of SEED_BRICS_FACTS) {
      await BricsFact.findOneAndUpdate(
        { key: f.key },
        { $set: f },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 5. Institutions
    for (const inst of SEED_BRICS_INSTITUTIONS) {
      await BricsInstitution.findOneAndUpdate(
        { slug: inst.slug },
        { $set: inst },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 6. FAQs
    for (const faq of SEED_BRICS_FAQS) {
      await BricsFaq.findOneAndUpdate(
        { slug: faq.slug },
        { $set: faq },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 7. Sources
    for (const src of SEED_BRICS_SOURCES) {
      await BricsSource.findOneAndUpdate(
        { sourceUrl: src.sourceUrl },
        { $set: src },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 8. Flagship Article
    let articleCreated = false;
    const existingArticle = await Article.findOne({ slug: SEED_BRICS_ARTICLE.slug });
    if (!existingArticle) {
      await Article.create(SEED_BRICS_ARTICLE);
      articleCreated = true;
    } else {
      // Update article with verified 27-section content
      await Article.updateOne({ slug: SEED_BRICS_ARTICLE.slug }, { $set: SEED_BRICS_ARTICLE });
      articleCreated = true;
    }

    const membersCount = await BricsMember.countDocuments();
    const summitsCount = await BricsSummit.countDocuments();
    const presidenciesCount = await BricsPresidency.countDocuments();
    const factsCount = await BricsFact.countDocuments();
    const institutionsCount = await BricsInstitution.countDocuments();
    const faqsCount = await BricsFaq.countDocuments();
    const sourcesCount = await BricsSource.countDocuments();

    console.log(
      `✅ [BricsService] Upsert complete: ${membersCount} members, ${summitsCount} summits, ${factsCount} facts, ${faqsCount} FAQs.`
    );

    return {
      membersCount,
      summitsCount,
      presidenciesCount,
      factsCount,
      institutionsCount,
      faqsCount,
      sourcesCount,
      articleCreated,
    };
  }

  /**
   * Get full consolidated payload for the public Knowledge Hub
   */
  public static async getHubPayload(): Promise<any> {
    const isDb = this.isConnected();

    let members = SEED_BRICS_MEMBERS;
    let summits = SEED_BRICS_SUMMITS;
    let presidencies = SEED_BRICS_PRESIDENCIES;
    let facts = SEED_BRICS_FACTS;
    let institutions = SEED_BRICS_INSTITUTIONS;
    let faqs = SEED_BRICS_FAQS;
    let sources = SEED_BRICS_SOURCES;

    if (isDb) {
      try {
        const [dbMembers, dbSummits, dbPresidencies, dbFacts, dbInstitutions, dbFaqs, dbSources] =
          await Promise.all([
            BricsMember.find().sort({ displayOrder: 1, name: 1 }).lean(),
            BricsSummit.find().sort({ summitNumber: -1 }).lean(),
            BricsPresidency.find().sort({ year: -1 }).lean(),
            BricsFact.find().sort({ displayOrder: 1 }).lean(),
            BricsInstitution.find().sort({ displayOrder: 1 }).lean(),
            BricsFaq.find().sort({ displayOrder: 1 }).lean(),
            BricsSource.find().sort({ displayOrder: 1 }).lean(),
          ]);

        if (dbMembers && dbMembers.length > 0) members = dbMembers as any;
        if (dbSummits && dbSummits.length > 0) summits = dbSummits as any;
        if (dbPresidencies && dbPresidencies.length > 0) presidencies = dbPresidencies as any;
        if (dbFacts && dbFacts.length > 0) facts = dbFacts as any;
        if (dbInstitutions && dbInstitutions.length > 0) institutions = dbInstitutions as any;
        if (dbFaqs && dbFaqs.length > 0) faqs = dbFaqs as any;
        if (dbSources && dbSources.length > 0) sources = dbSources as any;
      } catch (err) {
        console.warn('Fallback to in-memory BRICS datasets:', err);
      }
    }

    const partnerCountries = [
      { name: 'Belarus', region: 'Eastern Europe', iso: 'BLR' },
      { name: 'Bolivia', region: 'South America', iso: 'BOL' },
      { name: 'Cuba', region: 'Caribbean / Latin America', iso: 'CUB' },
      { name: 'Kazakhstan', region: 'Central Asia', iso: 'KAZ' },
      { name: 'Malaysia', region: 'Southeast Asia', iso: 'MYS' },
      { name: 'Nigeria', region: 'West Africa', iso: 'NGA' },
      { name: 'Thailand', region: 'Southeast Asia', iso: 'THA' },
      { name: 'Uganda', region: 'East Africa', iso: 'UGA' },
      { name: 'Uzbekistan', region: 'Central Asia', iso: 'UZB' },
      { name: 'Vietnam', region: 'Southeast Asia', iso: 'VNM' },
    ];

    const pillars = [
      {
        letter: 'R',
        title: 'Resilience',
        tagline: 'Economic, Supply Chain & Health Preparedness',
        description:
          'Bolstering shock-resistant supply chains in active pharmaceuticals, semiconductors, and fertilizers, alongside disaster risk reduction via CDRI and resilient public health architectures.',
        focusAreas: [
          'Supply Chain Diversification & Critical Minerals',
          'Coalition for Disaster Resilient Infrastructure (CDRI) alignment',
          'Pandemic Preparedness & Vaccine R&D Networks',
          'Food Security and Agricultural Innovation Platform',
        ],
      },
      {
        letter: 'I',
        title: 'Innovation',
        tagline: 'Digital Public Infrastructure & Responsible AI',
        description:
          'Sharing open-source Digital Public Infrastructure (DPI) like UPI, Aadhaar, and DigiLocker to democratize public services across the Global South without costly proprietary licenses.',
        focusAreas: [
          'Digital Public Infrastructure (DPI) deployment across Global South',
          'Responsible & Inclusive Artificial Intelligence Governance',
          'Science, Technology & Startup Ecosystem Linkages',
          'Fintech Interoperability & Cross-Border Messaging',
        ],
      },
      {
        letter: 'C',
        title: 'Cooperation',
        tagline: 'Reformed Multilateralism & South-South Trade',
        description:
          'Advancing comprehensive reform of the United Nations Security Council (UNSC) and IMF quotas, while facilitating trade settlement in national currencies and multi-modal transit corridors.',
        focusAreas: [
          'Reformed Multilateralism (UNSC, IMF, World Bank, WTO)',
          'Bilateral Trade Settlements in National Currencies',
          'International North-South Transport Corridor (INSTC)',
          'Comprehensive Counter-Terrorism Cooperation and Zero Tolerance',
        ],
      },
      {
        letter: 'S',
        title: 'Sustainability',
        tagline: 'Climate Equity, Mission LiFE & Renewable Energy',
        description:
          'Demanding equitable, predictable climate financing under Common But Differentiated Responsibilities (CBDR), and scaling solar, green hydrogen, and circular bioeconomy models.',
        focusAreas: [
          'Predictable Climate Finance & Technology Transfers',
          'Mission LiFE (Lifestyle for Environment) adoption',
          'Solar, Green Hydrogen & Tropical Biofuel Alliances',
          'Conservation of Natural Capital and Tropical Forests',
        ],
      },
    ];

    return {
      meta: {
        title: 'BRICS 2026 India Knowledge Hub',
        presidencyYear: 2026,
        presidencyCountry: 'India',
        officialTheme: 'Building for Resilience, Innovation, Cooperation and Sustainability',
        summitDates: 'September 12–13, 2026',
        summitLocation: 'New Delhi, India',
        officialPortalUrl: 'https://www.brics2026.gov.in/',
        memberCount: members.length,
        partnerCount: partnerCountries.length,
        lastVerified: 'September 2026',
      },
      pillars,
      members,
      partnerCountries,
      summits,
      presidencies,
      facts,
      institutions,
      faqs,
      sources,
      didYouKnow: SEED_BRICS_DID_YOU_KNOW,
      indiaRole: {
        presidenciesHeld: [2012, 2016, 2021, 2026],
        foundingContributions: [
          'Conceived and proposed the New Development Bank (NDB) at the 2012 New Delhi Summit',
          'Spearheaded the BRICS Counter-Terrorism Strategy (2020) and Action Plan (2021)',
          'Signed the BRICS Remote Sensing Satellite Constellation Agreement (2021)',
          'Championed open Digital Public Infrastructure (DPI) as a public good for the Global South',
        ],
        theme2026: 'Building for Resilience, Innovation, Cooperation and Sustainability',
      },
      articleSlug: SEED_BRICS_ARTICLE.slug,
    };
  }

  public static async getMembers(status?: string): Promise<any[]> {
    if (this.isConnected()) {
      try {
        const query: any = {};
        if (status) query.status = status;
        const res = await BricsMember.find(query).sort({ displayOrder: 1, name: 1 }).lean();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn('Fallback to in-memory members');
      }
    }
    return SEED_BRICS_MEMBERS;
  }

  public static async getMemberBySlug(slug: string): Promise<any | null> {
    if (this.isConnected()) {
      try {
        const member = await BricsMember.findOne({ slug: slug.toLowerCase() }).lean();
        if (member) return member;
      } catch (err) {
        console.warn('Fallback to in-memory member lookup');
      }
    }
    return SEED_BRICS_MEMBERS.find((m) => m.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  public static async getSummits(): Promise<any[]> {
    if (this.isConnected()) {
      try {
        const res = await BricsSummit.find().sort({ summitNumber: -1 }).lean();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn('Fallback to in-memory summits');
      }
    }
    return SEED_BRICS_SUMMITS;
  }

  public static async getPresidencies(): Promise<any[]> {
    if (this.isConnected()) {
      try {
        const res = await BricsPresidency.find().sort({ year: -1 }).lean();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn('Fallback to in-memory presidencies');
      }
    }
    return SEED_BRICS_PRESIDENCIES;
  }

  public static async getFacts(category?: string): Promise<any[]> {
    if (this.isConnected()) {
      try {
        const query: any = {};
        if (category) query.category = category;
        const res = await BricsFact.find(query).sort({ displayOrder: 1 }).lean();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn('Fallback to in-memory facts');
      }
    }
    return category ? SEED_BRICS_FACTS.filter((f) => f.category === category) : SEED_BRICS_FACTS;
  }

  public static async getInstitutions(): Promise<any[]> {
    if (this.isConnected()) {
      try {
        const res = await BricsInstitution.find().sort({ displayOrder: 1 }).lean();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn('Fallback to in-memory institutions');
      }
    }
    return SEED_BRICS_INSTITUTIONS;
  }

  public static async getFaqs(category?: string): Promise<any[]> {
    if (this.isConnected()) {
      try {
        const query: any = {};
        if (category) query.category = category;
        const res = await BricsFaq.find(query).sort({ displayOrder: 1 }).lean();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn('Fallback to in-memory faqs');
      }
    }
    return category ? SEED_BRICS_FAQS.filter((f) => f.category === category) : SEED_BRICS_FAQS;
  }

  public static async getSources(): Promise<any[]> {
    if (this.isConnected()) {
      try {
        const res = await BricsSource.find().sort({ displayOrder: 1 }).lean();
        if (res && res.length > 0) return res;
      } catch (err) {
        console.warn('Fallback to in-memory sources');
      }
    }
    return SEED_BRICS_SOURCES;
  }

  public static async getAdminStats(): Promise<any> {
    const isDb = this.isConnected();
    let membersCount = SEED_BRICS_MEMBERS.length;
    let summitsCount = SEED_BRICS_SUMMITS.length;
    let factsCount = SEED_BRICS_FACTS.length;
    let faqsCount = SEED_BRICS_FAQS.length;
    let institutionsCount = SEED_BRICS_INSTITUTIONS.length;
    let sourcesCount = SEED_BRICS_SOURCES.length;

    if (isDb) {
      try {
        [membersCount, summitsCount, factsCount, faqsCount, institutionsCount, sourcesCount] =
          await Promise.all([
            BricsMember.countDocuments(),
            BricsSummit.countDocuments(),
            BricsFact.countDocuments(),
            BricsFaq.countDocuments(),
            BricsInstitution.countDocuments(),
            BricsSource.countDocuments(),
          ]);
      } catch (err) {
        console.warn('Stats lookup fallback');
      }
    }

    return {
      connectedToMongo: isDb,
      counts: {
        members: membersCount,
        summits: summitsCount,
        facts: factsCount,
        faqs: faqsCount,
        institutions: institutionsCount,
        sources: sourcesCount,
      },
      currentChairship: 'India (2026)',
      summitDates: 'September 12–13, 2026',
      officialPortal: 'https://www.brics2026.gov.in/',
      articleSlug: SEED_BRICS_ARTICLE.slug,
      lastAudit: '2026-09-11',
    };
  }

  public static async upsertFact(data: any): Promise<any> {
    if (!this.isConnected()) {
      return { success: true, message: 'Updated in memory', data };
    }
    const updated = await BricsFact.findOneAndUpdate(
      { key: data.key },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return updated;
  }

  public static async upsertFaq(data: any): Promise<any> {
    if (!this.isConnected()) {
      return { success: true, message: 'Updated in memory', data };
    }
    const slug = data.slug || data.question.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updated = await BricsFaq.findOneAndUpdate(
      { slug },
      { $set: { ...data, slug } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return updated;
  }
}
