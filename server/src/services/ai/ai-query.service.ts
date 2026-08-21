import { ILLMProvider, StructuredSearchCriteria } from './ai-provider.interface';
import { GeminiProvider } from './gemini-provider.service';
import { RuleBasedProvider } from './rule-based-provider.service';

/**
 * AI Query Orchestration Service
 * 
 * SPOTPICKS MULTI-PROVIDER & FALLBACK ARCHITECTURE:
 * 1. Coordinates LLM providers (Gemini, future OpenAI / Local LLMs).
 * 2. Enforces deterministic fallback when LLMs fail or have network issues.
 * 3. Ensures high resilience so the end user ALWAYS receives accurate search results.
 */
export class AIQueryService {
  private static providers: Map<string, ILLMProvider> = new Map();
  private static fallbackProvider: ILLMProvider = new RuleBasedProvider();

  // Initialize standard providers
  static {
    const gemini = new GeminiProvider();
    const ruleBased = new RuleBasedProvider();

    this.providers.set('gemini', gemini);
    this.providers.set('gemini-3.7-flash', gemini);
    this.providers.set('rule-based', ruleBased);
  }

  /**
   * Register a custom or secondary LLM provider (e.g., Local LLM, OpenAI, Ollama)
   */
  public static registerProvider(name: string, provider: ILLMProvider): void {
    this.providers.set(name.toLowerCase(), provider);
  }

  /**
   * Get list of currently registered providers and their availability status
   */
  public static getRegisteredProviders(): Array<{ name: string; isAvailable: boolean }> {
    return Array.from(this.providers.entries()).map(([key, provider]) => ({
      name: provider.name,
      isAvailable: provider.isAvailable(),
    }));
  }

  /**
   * Parses natural language query into structured discovery filters with automatic fallback
   * 
   * @param naturalQuery - E.g. "Find me a quiet cafe near JNU where I can work with WiFi under ₹500"
   * @param preferredProviderName - Optional specific provider name (defaults to 'gemini')
   * @param context - Optional contextual data (city, GPS coords)
   */
  public static async parseNaturalLanguage(
    naturalQuery: string,
    preferredProviderName: string = 'gemini',
    context?: { userCity?: string; userLat?: number; userLng?: number }
  ): Promise<{
    criteria: StructuredSearchCriteria;
    fallbackUsed: boolean;
    providerUsed: string;
    executionTimeMs: number;
  }> {
    const startTime = Date.now();
    const cleanPrompt = (naturalQuery || '').trim();

    if (!cleanPrompt) {
      const fallbackCriteria = await this.fallbackProvider.parseNaturalQuery('', context);
      return {
        criteria: fallbackCriteria,
        fallbackUsed: false,
        providerUsed: this.fallbackProvider.name,
        executionTimeMs: Date.now() - startTime,
      };
    }

    const primaryProvider = this.providers.get(preferredProviderName.toLowerCase()) || this.providers.get('gemini');

    // Attempt Primary AI Provider if available
    if (primaryProvider && primaryProvider.isAvailable()) {
      try {
        const criteria = await primaryProvider.parseNaturalQuery(cleanPrompt, context);
        return {
          criteria,
          fallbackUsed: false,
          providerUsed: primaryProvider.name,
          executionTimeMs: Date.now() - startTime,
        };
      } catch (err: any) {
        console.warn(`[AIQueryService] Primary provider '${primaryProvider.name}' failed. Engaging Rule-Based fallback. Error:`, err.message);
      }
    }

    // Fallback: Deterministic Rule-Based Engine
    const fallbackCriteria = await this.fallbackProvider.parseNaturalQuery(cleanPrompt, context);
    return {
      criteria: fallbackCriteria,
      fallbackUsed: true,
      providerUsed: this.fallbackProvider.name,
      executionTimeMs: Date.now() - startTime,
    };
  }
}
