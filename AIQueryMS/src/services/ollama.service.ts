import axios from "axios";
import { logger } from "../utils/logger";
import config from "../config/config";

export class OllamaService {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    this.baseUrl = config.ollama.apiUrl;
    this.model = config.ollama.model;
  }

  async generateResponse(context: string[], query: string): Promise<string> {
    try {
      const systemPrompt = `You are a helpful AI assistant designed to analyze user reviews and provide structured, natural-sounding responses. 

When answering, follow these guidelines:
- Avoid generic openings like "Based on the provided information..."
- Provide **direct and concise answers** without unnecessary disclaimers.
- Strictly follow CommonMark format.
- Use bullet points or numbered lists for multiple points.
- Summarize the response in **one clear sentence first**, then expand with details.`;

      const prompt = this.formatPrompt(context, query);
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        system: systemPrompt,
        stream: false,
      });

      return response.data.response;
    } catch (error) {
      logger.error("Ollama API error:", error);
      throw new Error("Failed to generate response from LLM");
    }
  }

  private formatPrompt(context: string[], query: string): string {
    const contextText = context
      .map((text, index) => `${index + 1}. ${text}`)
      .join("\n");
    return `Based on the reviews below, answer the question: ${query}\n\nReviews:\n${contextText}`;
  }
}

export const ollamaService = new OllamaService();
