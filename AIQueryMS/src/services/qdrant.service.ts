import axios from "axios";
import { logger } from "../utils/logger";
import config from "../config/config";

interface SearchResult {
  id: string;
  score: number;
  payload: {
    text: string;
    [key: string]: any;
  };
}

export class QdrantService {
  private readonly baseUrl: string;
  private readonly collection: string;
  private readonly topK: number;

  constructor() {
    this.baseUrl = config.qdrant.url;
    this.collection = config.qdrant.collection;
    this.topK = config.embedding.topK;
  }

  async searchSimilar(
    embedding: number[],
    filename: string
  ): Promise<SearchResult[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/collections/${this.collection}/points/search`,
        {
          vector: embedding,
          limit: this.topK,
          filter: {
            must: [
              {
                key: "filename",
                match: {
                  value: filename,
                },
              },
            ],
          },
          with_payload: true,
        }
      );

      const results = response.data.result.map((hit: any) => ({
        id: hit.id,
        score: hit.score,
        payload: hit.payload,
      }));

      return results;
    } catch (error) {
      logger.error("Qdrant search error:", error);
      throw new Error("Failed to search in Qdrant");
    }
  }

  async filterAndRankResults(results: SearchResult[]): Promise<SearchResult[]> {
    // Remove duplicates based on text content
    const uniqueResults = results.filter(
      (result, index, self) =>
        index === self.findIndex((r) => r.payload.text === result.payload.text)
    );
    // Filter out results with low similarity scores (below 0.7)
    // const filteredResults = uniqueResults.filter(
    //   (result) => result.score >= 0.7
    // );
    // console.log("Filtered results:", filteredResults);
    // Sort by score in descending order
    return uniqueResults.sort((a, b) => b.score - a.score).slice(0, 5);
  }
}

export const qdrantService = new QdrantService();
