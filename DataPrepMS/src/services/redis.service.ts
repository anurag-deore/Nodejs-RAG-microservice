import Redis from "ioredis";
import config from "../config/config";
import logger from "../utils/logger";

class RedisService {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    this.publisher = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });

    this.subscriber = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });

    this.handleConnections();
  }

  private handleConnections() {
    this.publisher.on("connect", () => {
      logger.info("Redis publisher connected");
    });

    this.publisher.on("error", (error) => {
      logger.error("Redis publisher error:", error);
    });

    this.subscriber.on("connect", () => {
      logger.info("Redis subscriber connected");
    });

    this.subscriber.on("error", (error) => {
      logger.error("Redis subscriber error:", error);
    });
  }

  public async subscribe(channel: string, callback: (message: string) => void) {
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on(
        "message",
        (receivedChannel: string, message: string) => {
          if (receivedChannel === channel) {
            callback(message);
          }
        }
      );
      logger.info(`Subscribed to channel: ${channel}`);
    } catch (error) {
      logger.error("Error subscribing to channel:", error);
      throw error;
    }
  }

  public async publish(channel: string, message: string) {
    try {
      await this.publisher.publish(channel, message);
      logger.info(`Published message to channel: ${channel}`);
    } catch (error) {
      logger.error("Error publishing message:", error);
      throw error;
    }
  }

  public async disconnect() {
    try {
      await this.publisher.quit();
      await this.subscriber.quit();
      logger.info("Redis connections closed");
    } catch (error) {
      logger.error("Error disconnecting from Redis:", error);
      throw error;
    }
  }
}

export default new RedisService();
