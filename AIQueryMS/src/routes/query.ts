import express from "express";
import { logger } from "../utils/logger";
import { embeddingService } from "../services/embedding.service";
import { qdrantService } from "../services/qdrant.service";
import { redisService } from "../services/redis.service";
import { ollamaService } from "../services/ollama.service";

export const queryRouter = express.Router();

queryRouter.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { query, filename } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query parameter" });
    }

    // Check cache first
    const cachedResponse = await redisService.get(query);
    if (cachedResponse) {
      logger.info("Returning cached response for query:", query);
      return res.json({ response: cachedResponse });
    }

    // Generate embedding for the query
    const embedding = await embeddingService.generateEmbedding(query);

    // Search similar documents in Qdrant
    const searchResults = await qdrantService.searchSimilar(
      embedding,
      filename
    );

    // Filter and rank results
    const rankedResults = await qdrantService.filterAndRankResults(
      searchResults
    );
    // Extract text content for context
    const context = rankedResults.map((result) => result.payload.text);

    // Generate response using Ollama
    const response = await ollamaService.generateResponse(context, query);

    // Cache the response
    await redisService.set(query, response);

    res.json({ response });
  } catch (error) {
    logger.error("Error processing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
