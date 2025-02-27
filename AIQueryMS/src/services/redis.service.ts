import { createClient } from "redis";
import { logger } from "../utils/logger";
import config from "../config/config";

export class RedisService {
  private client;
  private ttl: number;

  constructor() {
    this.ttl = config.redis.ttl;
    this.client = createClient({
      url: `redis://${config.redis.host}:${config.redis.port}`,
      password: config.redis.password,
    });

    this.client.on("error", (err) => logger.error("Redis Client Error:", err));
    this.client
      .connect()
      .catch((err) => logger.error("Redis Connection Error:", err));
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error("Redis get error:", error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value, {
        EX: this.ttl,
      });
    } catch (error) {
      logger.error("Redis set error:", error);
    }
  }
}

export const redisService = new RedisService();
