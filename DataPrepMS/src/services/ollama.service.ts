import axios from "axios";
import config from "../config/config";
import logger from "../utils/logger";

interface OllamaEmbeddingResponse {
  model: string;
  embeddings: number[][];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
}

class OllamaService {
  private readonly apiUrl: string;
  private readonly model: string;

  constructor() {
    this.apiUrl = config.ollama.apiUrl;
    this.model = config.ollama.model;
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post<OllamaEmbeddingResponse>(
        `${this.apiUrl}/api/embed`,
        {
          model: this.model,
          input: text,
        }
      );

      if (!response.data.embeddings?.[0]) {
        throw new Error("No embedding returned from API");
      }

      logger.info("Generated embedding successfully");
      return response.data.embeddings[0];
    } catch (error) {
      logger.error("Error generating embedding:", error);
      throw error;
    }
  }

  public async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const embeddings = await Promise.all(
        texts.map((text) => this.generateEmbedding(text))
      );
      logger.info(`Generated ${embeddings.length} embeddings successfully`);
      return embeddings;
    } catch (error) {
      logger.error("Error generating batch embeddings:", error);
      throw error;
    }
  }
}

export default new OllamaService();
