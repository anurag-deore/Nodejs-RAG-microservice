import { QdrantClient } from "@qdrant/js-client-rest";
import config from "../config/config";
import logger from "../utils/logger";

interface VectorMetadata extends Record<string, unknown> {
  filename: string;
  rowIndex: number;
  text: string;
  timestamp: number;
}

class QdrantService {
  private client: QdrantClient;
  private readonly collectionName: string;
  private enableLogging: boolean;

  constructor() {
    this.client = new QdrantClient({ url: config.qdrant.url });
    this.collectionName = config.qdrant.collection;
    this.enableLogging = false; // Set to false to disable logging
  }

  private log(level: "info" | "error", message: string, error?: unknown) {
    if (!this.enableLogging) return;
    if (level === "info") {
      logger.info(message);
    } else {
      logger.error(message, error);
    }
  }

  public async initializeCollection(vectorSize: number = 768) {
    try {
      const collections = await this.client.getCollections();
      const collectionExists = collections.collections.some(
        (collection) => collection.name === this.collectionName
      );

      if (!collectionExists) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: vectorSize,
            distance: "Cosine",
          },
        });
        this.log(
          "info",
          `Collection ${this.collectionName} created successfully`
        );
      }
    } catch (error) {
      this.log("error", "Error initializing Qdrant collection:", error);
      throw error;
    }
  }

  public async upsertVectors(vectors: number[][], metadata: VectorMetadata[]) {
    try {
      const points = vectors.map((vector, index) => ({
        id: Date.now() + index,
        vector,
        payload: metadata[index],
      }));

      await this.client.upsert(this.collectionName, {
        points,
      });

      this.log("info", `Upserted ${vectors.length} vectors to Qdrant`);
    } catch (error) {
      this.log("error", "Error upserting vectors to Qdrant:", error);
      throw error;
    }
  }

  public async searchSimilar(vector: number[], limit: number = 10) {
    try {
      const results = await this.client.search(this.collectionName, {
        vector,
        limit,
      });
      return results;
    } catch (error) {
      this.log("error", "Error searching vectors in Qdrant:", error);
      throw error;
    }
  }

  // Method to enable/disable logging
  public setLogging(enable: boolean) {
    this.enableLogging = enable;
  }
}

export default new QdrantService();
