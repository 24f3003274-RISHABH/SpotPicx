/**
 * AI Provider Interfaces and Type Contracts
 * 
 * SPOTPICKS AI SEARCH ARCHITECTURE:
 * This interface defines the provider-agnostic contract for converting natural language queries
 * into structured local discovery filter criteria. By decoupling the parser from specific
 * LLM implementations, SpotPicks can easily switch between or combine Gemini, OpenAI,
 * Claude, Local LLMs (Ollama / vLLM), or Rule-Based Deterministic fallback engines.
 */

export type PriceTier = 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';

/**
 * Structured search criteria extracted from natural language input
 * E.g., "Find me a quiet cafe near JNU where I can work with WiFi under ₹500."
 * Translates to:
 * {
 *   category: "food-and-cafes",
 *   locality: "Vasant Kunj",
 *   city: "Delhi",
 *   priceMax: 500,
 *   priceRange: "BUDGET",
 *   amenities: ["Free High-Speed WiFi", "Quiet Environment"],
 *   tags: ["quiet", "work friendly"],
 *   intent: "FOR_SOLO",
 *   confidence: 0.95
 * }
 */
export interface StructuredSearchCriteria {
  category?: string;
  subcategory?: string;
  locality?: string;
  city?: string;
  priceMax?: number;
  priceMin?: number;
  priceRange?: PriceTier;
  minRating?: number;
  openNow?: boolean;
  amenities: string[];
  tags: string[];
  intent: string;
  cleanedQuery?: string;
  confidence: number;
  explanation?: string;
  provider: string;
  rawAnalysis?: string;
}

/**
 * Provider abstraction interface for Large Language Models
 */
export interface ILLMProvider {
  /**
   * Unique identifier name for the provider (e.g., 'gemini-3.7-flash', 'rule-based', 'openai')
   */
  readonly name: string;

  /**
   * Checks whether this provider is currently available and ready to receive queries
   * (e.g., validates API key presence or service connectivity)
   */
  isAvailable(): boolean;

  /**
   * Parses natural language user input and extracts structured search criteria
   * @param naturalQuery - Raw user string like "cheap momos near DU campus"
   * @param context - Optional request context (user location, current city, etc.)
   */
  parseNaturalQuery(
    naturalQuery: string,
    context?: { userCity?: string; userLat?: number; userLng?: number }
  ): Promise<StructuredSearchCriteria>;
}
