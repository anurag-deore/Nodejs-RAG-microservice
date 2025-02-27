import express from "express";
import path from "path";
import config from "./config/config";
import logger from "./utils/logger";
import redisService from "./services/redis.service";
import qdrantService from "./services/qdrant.service";
import ollamaService from "./services/ollama.service";
import csvService from "./services/csv.service";

const app = express();

async function processFile(filePath: string) {
  try {
    // Process CSV file
    const { texts, rows } = await csvService.processCSVFile(filePath);

    // Generate embeddings
    const embeddings = await ollamaService.generateBatchEmbeddings(texts);

    // Prepare metadata
    const metadata = rows.map((row, index) => ({
      filename: path.basename(filePath),
      rowIndex: index,
      text: texts[index],
      timestamp: Date.now(),
    }));
    // Store in Qdrant
    await qdrantService.upsertVectors(embeddings, metadata);

    console.log("Upserted vectors to Qdrant.\nNotifying completion...");
    // Notify completion
    await redisService.publish(
      "dataset_ready",
      JSON.stringify({
        filename: path.basename(filePath),
        rows: rows.length,
        timestamp: Date.now(),
      })
    );

    logger.info(`Successfully processed file: ${filePath}`);
  } catch (error) {
    logger.error("Error processing file:", error);
    throw error;
  }
}

async function initialize() {
  try {
    // Initialize Qdrant collection
    await qdrantService.initializeCollection();

    // Subscribe to file_uploaded channel
    await redisService.subscribe("file_uploaded", async (message) => {
      try {
        const { path } = JSON.parse(message) as {
          filename: string;
          path: string;
          timestamp: string;
        };
        logger.info(`Received file upload notification for: ${path}`);
        await processFile(path);
      } catch (error) {
        logger.error("Error processing message:", error);
      }
    });

    console.log("Data processing service initialized successfully");
    logger.info("Data processing service initialized successfully");
  } catch (error) {
    logger.error("Error initializing service:", error);
    process.exit(1);
  }
}

// Start the application
initialize();

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

const server = app.listen(config.server.port, () => {
  logger.info(`Server is running on port ${config.server.port}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Starting graceful shutdown...");

  server.close(() => {
    logger.info("HTTP server closed");
  });

  try {
    await redisService.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
});
