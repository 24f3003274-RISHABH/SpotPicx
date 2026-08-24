import { ILLMProvider, StructuredSearchCriteria } from './ai-provider.interface';
import { GeminiService } from '../gemini.service';

/**
 * Gemini-Powered Natural Language Query Parser Provider
 * 
 * Utilizes Google's official `@google/genai` SDK via GeminiService.
 * Converts unstructured conversational user prompts into high-precision, structured discovery filters.
 */
export class GeminiProvider implements ILLMProvider {
  public readonly name = 'gemini-3.7-flash';

  public isAvailable(): boolean {
    return GeminiService.isAvailable();
  }

  public async parseNaturalQuery(
    naturalQuery: string,
    context?: { userCity?: string; userLat?: number; userLng?: number }
  ): Promise<StructuredSearchCriteria> {
    const result = await GeminiService.understandQuery(naturalQuery, {
      city: context?.userCity,
      lat: context?.userLat,
      lng: context?.userLng,
    });
    return result.criteria;
  }
}

