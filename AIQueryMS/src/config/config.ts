import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

interface Config {
  server: {
    port: number;
    nodeEnv: string;
  };
  redis: {
    host: string;
    port: number;
    password: string | undefined;
    ttl: number;
  };
  ollama: {
    apiUrl: string;
    model: string;
  };
  qdrant: {
    url: string;
    collection: string;
  };
  embedding: {
    model: string;
    dimension: number;
    topK: number;
  };
  logging: {
    level: string;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD,
    ttl: parseInt(process.env.REDIS_TTL || "3600", 10),
  },
  ollama: {
    apiUrl: process.env.OLLAMA_API || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "qwen:7b",
  },
  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collection: process.env.QDRANT_COLLECTION || "dataset_embeddings",
  },
  embedding: {
    model: process.env.EMBEDDING_MODEL || "nomic-embed-text",
    dimension: parseInt(process.env.EMBEDDING_DIMENSION || "768", 10),
    topK: parseInt(process.env.TOP_K || "5", 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};

export default config;
