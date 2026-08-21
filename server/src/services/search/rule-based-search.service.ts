import { ISearchService, AISearchResponse } from './search-service.interface';
import { SearchService, SearchParams, SearchResponse, SearchSuggestions } from '../search.service';
import { QueryParserService } from '../query-parser.service';
import { StructuredSearchCriteria } from '../ai/ai-provider.interface';

/**
 * Rule-Based Search Service Implementation
 * 
 * SPOTPICKS DETERMINISTIC FOUNDATION:
 * Implements deterministic search using regular expressions, keyword mappings, and geographic indexing.
 * Acts as the baseline fast search engine and the rock-solid fallback behind AI-enhanced layers.
 */
export class RuleBasedSearchService implements ISearchService {
  /**
   * Executes deterministic filtered search
   */
  public async search(params: SearchParams): Promise<SearchResponse> {
    return SearchService.search(params);
  }

  /**
   * Parses natural language using the in-process deterministic query parser
   */
  public async searchNatural(
    naturalQuery: string,
    additionalParams: Partial<SearchParams> = {}
  ): Promise<AISearchResponse> {
    const startTime = Date.now();
    const parsed = QueryParserService.parse(naturalQuery);

    const mergedParams: SearchParams = {
      ...additionalParams,
      q: parsed.cleanedQuery || naturalQuery,
      category: additionalParams.category || parsed.category,
      locality: additionalParams.locality || parsed.locality,
      city: additionalParams.city || parsed.city || 'Delhi',
      priceRange: additionalParams.priceRange || parsed.priceRange,
      priceMax: additionalParams.priceMax || parsed.priceMax,
      priceMin: additionalParams.priceMin || parsed.priceMin,
      rating: additionalParams.rating || parsed.minRating,
      openNow: additionalParams.openNow ?? parsed.openNow,
      tags: [
        ...(Array.isArray(additionalParams.tags)
          ? additionalParams.tags
          : additionalParams.tags
          ? [additionalParams.tags]
          : []),
        ...parsed.tags,
      ],
      amenities: [
        ...(Array.isArray(additionalParams.amenities)
          ? additionalParams.amenities
          : additionalParams.amenities
          ? [additionalParams.amenities]
          : []),
        ...parsed.amenities,
      ],
    };

    const searchResult = await SearchService.search(mergedParams);

    const criteria: StructuredSearchCriteria = {
      category: parsed.category,
      locality: parsed.locality,
      city: parsed.city || 'Delhi',
      priceMax: parsed.priceMax,
      priceMin: parsed.priceMin,
      priceRange: parsed.priceRange,
      minRating: parsed.minRating,
      openNow: parsed.openNow,
      amenities: parsed.amenities,
      tags: parsed.tags,
      intent: parsed.intent,
      cleanedQuery: parsed.cleanedQuery,
      confidence: parsed.confidence,
      explanation: `Deterministic parsing resolved category: ${parsed.category || 'any'}, locality: ${parsed.locality || 'Delhi'}`,
      provider: 'rule-based-engine',
    };

    return {
      ...searchResult,
      aiCriteria: criteria,
      aiMetadata: {
        providerUsed: 'rule-based-engine',
        fallbackUsed: true,
        aiExecutionTimeMs: Date.now() - startTime,
      },
    };
  }

  /**
   * Retrieves typeahead auto-complete suggestions
   */
  public async getSuggestions(query: string): Promise<SearchSuggestions> {
    return SearchService.getSuggestions(query);
  }
}
