import { ILLMProvider, StructuredSearchCriteria } from './ai-provider.interface';
import { QueryParserService } from '../query-parser.service';

/**
 * Rule-Based Deterministic Query Parser Provider
 * 
 * SPOTPICKS FALLBACK LAYER:
 * This provider requires zero external API keys and has sub-millisecond execution time.
 * It uses comprehensive keyword catalogs, regular expressions, and geographic synonyms to
 * extract structured categories, localities, price points, and intent tags.
 * 
 * Used automatically whenever external LLMs are unreachable, unconfigured, or rate-limited.
 */
export class RuleBasedProvider implements ILLMProvider {
  public readonly name = 'rule-based-engine';

  public isAvailable(): boolean {
    // Deterministic rule engine is always available in-process
    return true;
  }

  public async parseNaturalQuery(
    naturalQuery: string,
    context?: { userCity?: string; userLat?: number; userLng?: number }
  ): Promise<StructuredSearchCriteria> {
    const parsed = QueryParserService.parse(naturalQuery);

    return {
      category: parsed.category,
      locality: parsed.locality,
      city: parsed.city || context?.userCity || 'Delhi',
      priceMax: parsed.priceMax,
      priceMin: parsed.priceMin,
      priceRange: parsed.priceRange,
      minRating: parsed.minRating,
      openNow: parsed.openNow,
      amenities: parsed.amenities || [],
      tags: parsed.tags || [],
      intent: parsed.intent || 'STANDARD',
      cleanedQuery: parsed.cleanedQuery || naturalQuery,
      confidence: parsed.confidence || 0.85,
      explanation: `Deterministic parsing extracted: ${parsed.category || 'general'} in ${parsed.locality || 'Delhi'}`,
      provider: this.name,
    };
  }
}
