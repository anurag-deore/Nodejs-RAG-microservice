import axios from "axios";
import { logger } from "../utils/logger";
import config from "../config/config";

interface EmbeddingResponse {
  model: string;
  embeddings: number[][];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
}

export class EmbeddingService {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    this.baseUrl = config.ollama.apiUrl;
    this.model = config.embedding.model;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post<EmbeddingResponse>(
        `${this.baseUrl}/api/embed`,
        {
          model: this.model,
          input: text,
        }
      );

      // The response contains an array of embeddings, we take the first one
      if (!response.data.embeddings?.[0]) {
        throw new Error("No embedding returned from the service");
      }

      return response.data.embeddings[0];
    } catch (error) {
      logger.error("Error generating embedding:", error);
      throw new Error("Failed to generate embedding");
    }
  }
}

export const embeddingService = new EmbeddingService();
