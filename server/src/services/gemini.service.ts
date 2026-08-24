import { GoogleGenAI, Type } from '@google/genai';
import { StructuredSearchCriteria, PriceTier } from './ai/ai-provider.interface';
import { SearchService, SearchParams } from './search.service';
import { QueryParserService } from './query-parser.service';
import { AnalyticsService } from './analytics.service';
import { Business } from '../models/Business';

export interface WebSourceCitation {
  title: string;
  url: string;
  snippet?: string;
}

export interface AskSpotPicksResult {
  question: string;
  answer: string;
  criteria: StructuredSearchCriteria;
  recommendedBusinesses: any[];
  totalMatches: number;
  sources: WebSourceCitation[];
  groundedWithWeb: boolean;
  fallbackUsed: boolean;
  latencyMs: number;
  disclaimer?: string;
}

interface CacheEntry {
  result: AskSpotPicksResult;
  timestamp: number;
}

/**
 * GeminiService: Central AI & Natural Language Discovery Engine for SpotPicks
 * 
 * Implements:
 * 1. Natural Language Intent & Filter Extraction (Understanding user query).
 * 2. Database-First Discovery: Matches verified businesses in MongoDB.
 * 3. Grounded AI Synthesis: Uses Google GenAI SDK (@google/genai) with Google Search grounding when needed.
 * 4. Cost Control & Caching: In-memory TTL caching for identical queries.
 * 5. Strict Anti-Hallucination Guardrails: Prevents inventing prices, addresses, or hours.
 * 6. Resilient Fallback: Gracefully degrades to deterministic database search if Gemini is unconfigured or errors.
 */
export class GeminiService {
  private static client: GoogleGenAI | null = null;
  private static queryCache: Map<string, CacheEntry> = new Map();
  private static readonly CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

  /**
   * Safe lazy initialization of Google Gen AI SDK
   */
  private static getClient(): GoogleGenAI | null {
    if (!this.client && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) {
      this.client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this.client;
  }

  /**
   * Get configured model name (defaults to 'gemini-3.7-flash')
   */
  public static getModelName(): string {
    return process.env.GEMINI_MODEL || 'gemini-3.7-flash';
  }

  /**
   * Check if Gemini API is available
   */
  public static isAvailable(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  /**
   * Clear expired items from cache to prevent memory growth
   */
  private static pruneCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.queryCache.entries()) {
      if (now - entry.timestamp > this.CACHE_TTL_MS) {
        this.queryCache.delete(key);
      }
    }
  }

  /**
   * Converts natural language user queries into structured search filters.
   */
  public static async understandQuery(
    naturalQuery: string,
    context?: { city?: string; lat?: number; lng?: number }
  ): Promise<{ criteria: StructuredSearchCriteria; fallbackUsed: boolean; latencyMs: number }> {
    const startTime = Date.now();
    const cleanPrompt = (naturalQuery || '').trim();

    if (!cleanPrompt) {
      const fallback = QueryParserService.parse('');
      return {
        criteria: {
          city: context?.city || 'Delhi',
          amenities: [],
          tags: [],
          intent: 'STANDARD',
          confidence: 1.0,
          provider: 'deterministic-fallback',
        },
        fallbackUsed: true,
        latencyMs: Date.now() - startTime,
      };
    }

    const ai = this.getClient();
    if (!ai) {
      // Fallback to deterministic regex parser
      const parsed = QueryParserService.parse(cleanPrompt);
      return {
        criteria: {
          category: parsed.category,
          locality: parsed.locality,
          city: parsed.city || context?.city || 'Delhi',
          priceMax: parsed.priceMax,
          priceMin: parsed.priceMin,
          priceRange: parsed.priceRange,
          minRating: parsed.minRating,
          openNow: parsed.openNow,
          amenities: parsed.amenities || [],
          tags: parsed.tags || [],
          intent: parsed.intent || 'STANDARD',
          cleanedQuery: parsed.cleanedQuery || cleanPrompt,
          confidence: parsed.confidence || 0.85,
          explanation: `Interpreted via standard catalog matching in ${parsed.locality || 'Delhi NCR'}`,
          provider: 'deterministic-rule-engine',
        },
        fallbackUsed: true,
        latencyMs: Date.now() - startTime,
      };
    }

    try {
      const model = this.getModelName();
      const systemInstruction = `You are SpotPicks AI, the local discovery intelligence for Delhi NCR.
Analyze user search queries and extract structured discovery filters.

CANONICAL CATEGORY SLUGS:
- food-and-cafes: Cafes, restaurants, bakeries, coffee shops, street food, momos, bars, fine dining, biryani, rooftop lounges.
- hotels-and-pgs: PGs (paying guest), student hostels, hotels, co-living, guest houses.
- repair-and-services: Laptop/phone repair, electronics repair, mechanic, home services, plumbing, pet clinics.
- shopping-and-retail: Markets, shopping malls, thrift stores, fashion boutiques, bookstores, electronics markets.
- places-and-heritage: Monuments, historical sights, museums, parks, gardens, tombs, tourist spots.
- nightlife-and-clubs: Bars, pubs, cocktail lounges, live music venues, dance clubs.
- fitness-and-wellness: Gyms, fitness centers, yoga, salons, spas.
- education-and-coaching: UPSC/IIT coaching, libraries, study rooms, institutes.

LOCALITIES IN DELHI NCR:
- Hauz Khas / HKV, Majnu Ka Tilla / MKT, Connaught Place / CP, Nehru Place, Chandni Chowk, Vasant Kunj / JNU, Greater Kailash / GK, Saket, Dwarka, Karol Bagh, GTB Nagar / North Campus, Sarojini Nagar, Aerocity, Khan Market, Noida, Gurgaon.

PRICE TIERS:
- BUDGET (<= ₹400/person), MODERATE (₹400-₹1200/person), PREMIUM (₹1200-₹2500/person), LUXURY (> ₹2500/person).

INTENTS:
- STANDARD, BEST, TOP, CHEAP, UNDER_PRICE, OPEN_NOW, FOR_COUPLES, FOR_STUDENTS, FOR_FAMILIES, FOR_FRIENDS, FOR_SOLO, HIDDEN_GEM, TRENDING, WORK_FRIENDLY.`;

      const prompt = `Convert this search query into structured discovery filters:\n"${cleanPrompt}"\nContext: City = ${context?.city || 'Delhi'}`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              locality: { type: Type.STRING },
              city: { type: Type.STRING },
              priceMax: { type: Type.NUMBER },
              priceMin: { type: Type.NUMBER },
              priceRange: { type: Type.STRING },
              minRating: { type: Type.NUMBER },
              openNow: { type: Type.BOOLEAN },
              amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              intent: { type: Type.STRING },
              cleanedQuery: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
            },
            required: ['amenities', 'tags', 'intent', 'confidence'],
          },
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);

      let priceRange: PriceTier | undefined = undefined;
      if (parsed.priceRange && ['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'].includes(parsed.priceRange.toUpperCase())) {
        priceRange = parsed.priceRange.toUpperCase() as PriceTier;
      } else if (parsed.priceMax) {
        priceRange = parsed.priceMax <= 400 ? 'BUDGET' : parsed.priceMax <= 1200 ? 'MODERATE' : 'PREMIUM';
      }

      return {
        criteria: {
          category: parsed.category && parsed.category.length > 0 ? parsed.category : undefined,
          locality: parsed.locality && parsed.locality.length > 0 ? parsed.locality : undefined,
          city: parsed.city || 'Delhi',
          priceMax: typeof parsed.priceMax === 'number' ? parsed.priceMax : undefined,
          priceMin: typeof parsed.priceMin === 'number' ? parsed.priceMin : undefined,
          priceRange,
          minRating: typeof parsed.minRating === 'number' ? parsed.minRating : undefined,
          openNow: Boolean(parsed.openNow),
          amenities: Array.isArray(parsed.amenities) ? parsed.amenities : [],
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          intent: parsed.intent || 'STANDARD',
          cleanedQuery: parsed.cleanedQuery || cleanPrompt,
          confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
          explanation: parsed.explanation || `Filters extracted for ${parsed.locality || 'Delhi NCR'}`,
          provider: model,
          rawAnalysis: text,
        },
        fallbackUsed: false,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      console.warn('[GeminiService] understandQuery failed, using rule-based fallback:', err.message);
      const parsed = QueryParserService.parse(cleanPrompt);
      return {
        criteria: {
          category: parsed.category,
          locality: parsed.locality,
          city: parsed.city || context?.city || 'Delhi',
          priceMax: parsed.priceMax,
          priceMin: parsed.priceMin,
          priceRange: parsed.priceRange,
          minRating: parsed.minRating,
          openNow: parsed.openNow,
          amenities: parsed.amenities || [],
          tags: parsed.tags || [],
          intent: parsed.intent || 'STANDARD',
          cleanedQuery: parsed.cleanedQuery || cleanPrompt,
          confidence: parsed.confidence || 0.85,
          explanation: `Fallback matched: ${parsed.category || 'general'} in ${parsed.locality || 'Delhi NCR'}`,
          provider: 'deterministic-fallback',
        },
        fallbackUsed: true,
        latencyMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Main Ask SpotPicks conversational answering pipeline with Database-First & Web Grounding
   */
  public static async askSpotPicks(
    question: string,
    context?: { city?: string; lat?: number; lng?: number }
  ): Promise<AskSpotPicksResult> {
    const startTime = Date.now();
    const cleanQuestion = (question || '').trim();

    if (!cleanQuestion) {
      return {
        question: '',
        answer: 'Please ask a question about places, cafes, stays, sights, or services in Delhi NCR.',
        criteria: { amenities: [], tags: [], intent: 'STANDARD', confidence: 1, provider: 'none' },
        recommendedBusinesses: [],
        totalMatches: 0,
        sources: [],
        groundedWithWeb: false,
        fallbackUsed: false,
        latencyMs: 0,
      };
    }

    // Check query cache
    const cacheKey = `${cleanQuestion.toLowerCase()}|${context?.city || 'delhi'}`;
    this.pruneCache();
    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return {
        ...cached.result,
        latencyMs: Date.now() - startTime,
      };
    }

    // Step 1: Understand natural language intent
    const { criteria, fallbackUsed: intentFallback } = await this.understandQuery(cleanQuestion, context);

    // Step 2: Database-First Strategy — Query real SpotPicks businesses
    const searchParams: SearchParams = {
      q: criteria.cleanedQuery || cleanQuestion,
      category: criteria.category,
      locality: criteria.locality,
      city: criteria.city || context?.city || 'Delhi',
      priceRange: criteria.priceRange,
      priceMax: criteria.priceMax,
      priceMin: criteria.priceMin,
      rating: criteria.minRating,
      openNow: criteria.openNow,
      tags: criteria.tags,
      amenities: criteria.amenities,
      limit: 8,
    };

    let searchResult = await SearchService.search(searchParams);
    let matchedBusinesses = searchResult.data || [];

    // If query was very specific and produced 0 results, loosen location/category filters to ensure helpful suggestions
    if (matchedBusinesses.length === 0) {
      const relaxedResult = await SearchService.search({
        q: criteria.category || criteria.locality || cleanQuestion,
        city: context?.city || 'Delhi',
        limit: 6,
      });
      matchedBusinesses = relaxedResult.data || [];
    }

    // Step 3: Determine if web search grounding should be triggered
    // Trigger if question asks about current/live info, events tonight, recent changes, or travel guidelines
    const lowerQ = cleanQuestion.toLowerCase();
    const requiresWebGrounding =
      lowerQ.includes('tonight') ||
      lowerQ.includes('today') ||
      lowerQ.includes('events') ||
      lowerQ.includes('current') ||
      lowerQ.includes('latest') ||
      lowerQ.includes('now') ||
      lowerQ.includes('metro') ||
      lowerQ.includes('recent') ||
      lowerQ.includes('live') ||
      lowerQ.includes('timings today');

    const ai = this.getClient();

    // Fallback path if Gemini is unavailable
    if (!ai) {
      const fallbackAnswer = this.generateDeterministicAnswer(cleanQuestion, criteria, matchedBusinesses);
      const result: AskSpotPicksResult = {
        question: cleanQuestion,
        answer: fallbackAnswer,
        criteria,
        recommendedBusinesses: matchedBusinesses,
        totalMatches: searchResult.pagination?.total || matchedBusinesses.length,
        sources: [],
        groundedWithWeb: false,
        fallbackUsed: true,
        latencyMs: Date.now() - startTime,
        disclaimer: 'Verified SpotPicks database curation.',
      };

      this.queryCache.set(cacheKey, { result, timestamp: Date.now() });
      return result;
    }

    try {
      const model = this.getModelName();
      const systemInstruction = `You are SpotPicks AI — Delhi NCR's most knowledgeable, friendly, and honest local guide.
Answer the user's discovery question in a conversational, helpful, and concise manner (2-4 paragraphs).

CRITICAL ACCURACY & SAFETY INSTRUCTIONS:
1. Prioritize and reference the real SpotPicks verified businesses provided in the context below.
2. NEVER invent fake phone numbers, opening hours, prices, ratings, or addresses.
3. If specific information is unknown or unverified, explicitly state "Information could not be verified."
4. Highlight authentic neighborhood vibes (e.g. HKV lake views, Majnu Ka Tilla Tibetan food, Nehru Place tech deals).
5. Give practical advice (budget estimate, best time to visit, signature dishes/amenities).
6. Format nicely with markdown bolding for spot names.`;

      const businessContext = matchedBusinesses.slice(0, 6).map((b: any, i) => ({
        index: i + 1,
        name: b.name,
        category: b.categoryDetails?.name || b.categoryName || b.category,
        locality: b.locality,
        address: b.address,
        rating: b.rating,
        reviewCount: b.reviewCount,
        priceRange: b.priceRange,
        priceForTwo: b.priceForTwo,
        description: b.description,
        highlights: b.highlights,
        amenities: b.amenities,
        openingHours: b.openingHours ? JSON.stringify(b.openingHours) : 'Check live listing',
        verified: b.verified,
      }));

      const prompt = `User Question: "${cleanQuestion}"

Verified SpotPicks Database Candidates in Delhi NCR:
${JSON.stringify(businessContext, null, 2)}

Provide a tailored, engaging recommendation answering the question directly while spotlighting the best matching places from the verified context.`;

      const config: any = {
        systemInstruction,
        temperature: 0.3,
      };

      if (requiresWebGrounding) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });

      const candidate = response.candidates?.[0];
      const answerText = candidate?.content?.parts?.map((p: any) => p.text).filter(Boolean).join('\n') || response.text || '';

      // Extract Grounding metadata & sources
      const sources: WebSourceCitation[] = [];
      const groundingMetadata = candidate?.groundingMetadata;

      if (groundingMetadata?.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.web?.uri && chunk.web?.title) {
            // Avoid duplicates
            if (!sources.some((s) => s.url === chunk.web.uri)) {
              sources.push({
                title: chunk.web.title,
                url: chunk.web.uri,
              });
            }
          }
        }
      }

      const result: AskSpotPicksResult = {
        question: cleanQuestion,
        answer: answerText || this.generateDeterministicAnswer(cleanQuestion, criteria, matchedBusinesses),
        criteria,
        recommendedBusinesses: matchedBusinesses,
        totalMatches: searchResult.pagination?.total || matchedBusinesses.length,
        sources,
        groundedWithWeb: sources.length > 0 || requiresWebGrounding,
        fallbackUsed: false,
        latencyMs: Date.now() - startTime,
        disclaimer: 'Curated from verified SpotPicks directory and grounded local data.',
      };

      // Track in analytics
      AnalyticsService.trackAction('global', 'search_appearance').catch(() => {});

      // Cache result
      this.queryCache.set(cacheKey, { result, timestamp: Date.now() });

      return result;
    } catch (err: any) {
      console.warn('[GeminiService] askSpotPicks synthesis failed, falling back to deterministic answer:', err.message);
      const fallbackAnswer = this.generateDeterministicAnswer(cleanQuestion, criteria, matchedBusinesses);
      const result: AskSpotPicksResult = {
        question: cleanQuestion,
        answer: fallbackAnswer,
        criteria,
        recommendedBusinesses: matchedBusinesses,
        totalMatches: searchResult.pagination?.total || matchedBusinesses.length,
        sources: [],
        groundedWithWeb: false,
        fallbackUsed: true,
        latencyMs: Date.now() - startTime,
        disclaimer: 'Verified SpotPicks database curation.',
      };

      this.queryCache.set(cacheKey, { result, timestamp: Date.now() });
      return result;
    }
  }

  /**
   * Deterministic answer generator when AI is offline or rate-limited
   */
  private static generateDeterministicAnswer(
    question: string,
    criteria: StructuredSearchCriteria,
    businesses: any[]
  ): string {
    if (businesses.length === 0) {
      return `We searched our verified directory for **"${question}"** in ${criteria.locality || criteria.city || 'Delhi NCR'}, but couldn't find an exact match at this time. Try adjusting your budget or exploring nearby popular areas like Hauz Khas, Connaught Place, or Majnu Ka Tilla.`;
    }

    const topNames = businesses.slice(0, 3).map((b) => `**${b.name}** in ${b.locality}`).join(', ');
    const localityNote = criteria.locality ? ` around **${criteria.locality}**` : ' across Delhi NCR';
    const budgetNote = criteria.priceMax ? ` within a budget of ₹${criteria.priceMax}` : '';

    return `Here are the top-rated verified spots for your search${localityNote}${budgetNote}:\n\n` +
      `We highly recommend checking out ${topNames}. Each of these locations is verified for authentic community reviews, verified opening status, and high-quality service. Explore the listings below for full menus, direction routes, and contact details!`;
  }
}
