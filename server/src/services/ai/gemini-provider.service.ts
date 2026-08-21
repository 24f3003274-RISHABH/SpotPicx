import { GoogleGenAI, Type } from '@google/genai';
import { ILLMProvider, StructuredSearchCriteria, PriceTier } from './ai-provider.interface';

/**
 * Gemini-Powered Natural Language Query Parser
 * 
 * Utilizes Google's latest Gemini 3.7 Flash model via the official `@google/genai` SDK.
 * Converts unstructured, conversational user prompts into high-precision, structured discovery filters.
 * 
 * Features:
 * - Lazy client initialization (avoids server crash if API key is not present at startup)
 * - Strict JSON response schema validation
 * - Domain-specific system instructions tuned for Delhi-NCR geography, landmarks, and slang
 */
export class GeminiProvider implements ILLMProvider {
  public readonly name = 'gemini-3.7-flash';
  private client: GoogleGenAI | null = null;

  /**
   * Safe lazy initialization of Google Gen AI SDK
   */
  private getClient(): GoogleGenAI | null {
    if (!this.client && process.env.GEMINI_API_KEY) {
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
   * Validates if Gemini API is configured and accessible
   */
  public isAvailable(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  /**
   * System prompt instructing Gemini how to map natural queries to SpotPicks category slugs and locality names
   */
  private getSystemInstruction(): string {
    return `You are SpotPicks AI, an intelligent local discovery engine for Delhi-NCR and major Indian hubs.
Your task is to analyze natural language user search queries and extract structured discovery filters.

AVAILABLE SPOTPICKS CATEGORIES (use exact canonical slug if matched):
- food-and-cafes: Restaurants, cafes, coffee shops, street food, bakeries, bars, dining, momos, pizza, etc.
- hotels-and-pgs: PGs (paying guest), student hostels, hotels, co-living spaces, rooms, stays.
- repair-and-services: Laptop/phone repair, electronics repair, mechanic, home services, plumbing, pet clinics.
- shopping-and-retail: Markets, shopping malls, thrift stores, fashion boutiques, bookstores, jewelry.
- places-and-heritage: Monuments, historical sights, heritage spots, museums, parks, gardens, tombs.
- nightlife-and-clubs: Bars, pubs, cocktail lounges, live music venues, dance clubs.
- fitness-and-wellness: Gyms, fitness centers, yoga, salons, spas, wellness retreats.
- education-and-coaching: UPSC/IIT coaching, libraries, study rooms, institutes, tuition.

KNOWN DELHI-NCR LOCALITIES:
- Hauz Khas / HKV
- Majnu Ka Tilla / MKT
- Connaught Place / CP / Rajiv Chowk
- Nehru Place
- Chandni Chowk / Old Delhi
- Vasant Kunj / JNU
- Greater Kailash / GK 1 / GK 2
- Saket / Select Citywalk
- Dwarka
- Karol Bagh
- GTB Nagar / Hudson Lane / North Campus / DU
- Sarojini Nagar
- Aerocity
- Khan Market

PRICE TIERS:
- BUDGET: <= ₹400 per person or affordable/cheap/pocket friendly
- MODERATE: ₹400 - ₹1200 per person
- PREMIUM: ₹1200 - ₹2500 per person
- LUXURY: > ₹2500 per person or fine dining/luxury

INTENTS:
- STANDARD, BEST, TOP, CHEAP, UNDER_PRICE, OPEN_NOW, FOR_COUPLES, FOR_STUDENTS, FOR_FAMILIES, FOR_FRIENDS, FOR_SOLO, HIDDEN_GEM, TRENDING

Extract clean, specific tags and amenities (e.g., "Free High-Speed WiFi", "Quiet Environment", "Outdoor Seating", "AC", "Pet Friendly", "Valet Parking").
`;
  }

  /**
   * Parses the natural query with Gemini
   */
  public async parseNaturalQuery(
    naturalQuery: string,
    context?: { userCity?: string; userLat?: number; userLng?: number }
  ): Promise<StructuredSearchCriteria> {
    const ai = this.getClient();
    if (!ai) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = `Convert this search query into structured discovery filters:\n"${naturalQuery}"\nContext: City = ${context?.userCity || 'Delhi'}`;

    try {
      const response = await ai.models.generateContent({
        model: this.name,
        contents: prompt,
        config: {
          systemInstruction: this.getSystemInstruction(),
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'The canonical category slug from the allowed list, or empty if none',
              },
              locality: {
                type: Type.STRING,
                description: 'The canonical Delhi locality name, e.g. "Vasant Kunj", "Hauz Khas", "Connaught Place"',
              },
              city: {
                type: Type.STRING,
                description: 'The city name, default "Delhi"',
              },
              priceMax: {
                type: Type.NUMBER,
                description: 'Max price in INR if specified, e.g. 500',
              },
              priceMin: {
                type: Type.NUMBER,
                description: 'Min price in INR if specified',
              },
              priceRange: {
                type: Type.STRING,
                description: 'BUDGET, MODERATE, PREMIUM, or LUXURY',
              },
              minRating: {
                type: Type.NUMBER,
                description: 'Minimum star rating between 1.0 and 5.0 if quality intent detected',
              },
              openNow: {
                type: Type.BOOLEAN,
                description: 'True if user asked for open now, late night, or 24/7',
              },
              amenities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of specific amenities (e.g. "Free High-Speed WiFi", "Quiet Environment", "Outdoor Seating")',
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of relevant search tags (e.g. "quiet", "work friendly", "momos", "rooftop")',
              },
              intent: {
                type: Type.STRING,
                description: 'One of STANDARD, BEST, CHEAP, UNDER_PRICE, FOR_COUPLES, FOR_STUDENTS, FOR_SOLO, HIDDEN_GEM, TRENDING',
              },
              cleanedQuery: {
                type: Type.STRING,
                description: 'Core keywords stripped of prepositional fluff and filler words',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence score from 0.0 to 1.0',
              },
              explanation: {
                type: Type.STRING,
                description: 'One concise sentence explaining what was extracted',
              },
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
        cleanedQuery: parsed.cleanedQuery || naturalQuery,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
        explanation: parsed.explanation || `Interpreted as ${parsed.category || 'general'} in ${parsed.locality || 'Delhi'}`,
        provider: this.name,
        rawAnalysis: text,
      };
    } catch (err: any) {
      throw new Error(`Gemini query extraction failed: ${err.message}`);
    }
  }
}
