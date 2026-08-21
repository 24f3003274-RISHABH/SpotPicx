import { SearchParams, SearchResponse, SearchSuggestions } from '../search.service';
import { StructuredSearchCriteria } from '../ai/ai-provider.interface';

/**
 * Natural Language Search Response
 * Enriches standard search results with the AI-parsed criteria breakdown
 */
export interface AISearchResponse extends SearchResponse {
  aiCriteria: StructuredSearchCriteria;
  aiMetadata: {
    providerUsed: string;
    fallbackUsed: boolean;
    aiExecutionTimeMs: number;
  };
}

/**
 * Core Search Service Contract
 * All search engine implementations (Rule-Based, AI-Enhanced, Hybrid) satisfy this interface.
 */
export interface ISearchService {
  /**
   * Deterministic parameter-driven search
   */
  search(params: SearchParams): Promise<SearchResponse>;

  /**
   * Natural language AI-enhanced search with structured breakdown
   */
  searchNatural(
    naturalQuery: string,
    additionalParams?: Partial<SearchParams>,
    preferredProvider?: string
  ): Promise<AISearchResponse>;

  /**
   * Typeahead auto-complete suggestions
   */
  getSuggestions(query: string): Promise<SearchSuggestions>;
}
