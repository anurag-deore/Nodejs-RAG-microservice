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
  };
  qdrant: {
    url: string;
    collection: string;
  };
  ollama: {
    apiUrl: string;
    model: string;
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
  },
  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6334",
    collection: process.env.QDRANT_COLLECTION || "dataset_embeddings",
  },
  ollama: {
    apiUrl: process.env.OLLAMA_API_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "qwen:7b",
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};

export default config;
