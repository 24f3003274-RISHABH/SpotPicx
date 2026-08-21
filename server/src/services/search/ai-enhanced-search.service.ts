import { ISearchService, AISearchResponse } from './search-service.interface';
import { SearchService, SearchParams, SearchResponse, SearchSuggestions } from '../search.service';
import { AIQueryService } from '../ai/ai-query.service';
import { StructuredSearchCriteria } from '../ai/ai-provider.interface';

/**
 * AI-Enhanced Search Service Implementation
 * 
 * SPOTPICKS AI DISCOVERY PIPELINE:
 * 1. Takes free-form conversational natural language.
 * 2. Invokes AIQueryService (Gemini 3.7 Flash with provider abstraction).
 * 3. Gracefully degrades to RuleBasedEngine if LLM is unavailable or errors.
 * 4. Combines extracted structured criteria (category, locality, priceMax, amenities, tags) with database query.
 * 5. Returns ranked discovery results alongside the transparent AI filter breakdown.
 */
export class AIEnhancedSearchService implements ISearchService {
  /**
   * Standard deterministic search query
   */
  public async search(params: SearchParams): Promise<SearchResponse> {
    return SearchService.search(params);
  }

  /**
   * Conversational natural language search with full AI extraction breakdown
   * Example: "Find me a quiet cafe near JNU where I can work with WiFi under ₹500"
   */
  public async searchNatural(
    naturalQuery: string,
    additionalParams: Partial<SearchParams> = {},
    preferredProvider: string = 'gemini'
  ): Promise<AISearchResponse> {
    const aiResult = await AIQueryService.parseNaturalLanguage(
      naturalQuery,
      preferredProvider,
      {
        userCity: additionalParams.city || 'Delhi',
        userLat: additionalParams.lat,
        userLng: additionalParams.lng,
      }
    );

    const { criteria, fallbackUsed, providerUsed, executionTimeMs } = aiResult;

    // Merge AI extracted criteria with explicit user filter parameters
    const mergedParams: SearchParams = {
      ...additionalParams,
      q: additionalParams.q || criteria.cleanedQuery || naturalQuery,
      category: additionalParams.category || criteria.category,
      locality: additionalParams.locality || criteria.locality,
      city: additionalParams.city || criteria.city || 'Delhi',
      priceRange: additionalParams.priceRange || criteria.priceRange,
      priceMax: additionalParams.priceMax || criteria.priceMax,
      priceMin: additionalParams.priceMin || criteria.priceMin,
      rating: additionalParams.rating || criteria.minRating,
      openNow: additionalParams.openNow ?? criteria.openNow,
      tags: [
        ...(Array.isArray(additionalParams.tags)
          ? additionalParams.tags
          : additionalParams.tags
          ? [additionalParams.tags]
          : []),
        ...criteria.tags,
      ],
      amenities: [
        ...(Array.isArray(additionalParams.amenities)
          ? additionalParams.amenities
          : additionalParams.amenities
          ? [additionalParams.amenities]
          : []),
        ...criteria.amenities,
      ],
    };

    const searchResponse = await SearchService.search(mergedParams);

    return {
      ...searchResponse,
      aiCriteria: criteria,
      aiMetadata: {
        providerUsed,
        fallbackUsed,
        aiExecutionTimeMs: executionTimeMs,
      },
    };
  }

  /**
   * Fast auto-complete suggestions
   */
  public async getSuggestions(query: string): Promise<SearchSuggestions> {
    return SearchService.getSuggestions(query);
  }
}

// Export singleton instance
export const aiSearchService = new AIEnhancedSearchService();
