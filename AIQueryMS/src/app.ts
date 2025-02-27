import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { queryRouter } from "./routes/query";
import { logger } from "./utils/logger";
import config from "./config/config";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/query", queryRouter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message:
        config.server.nodeEnv === "development" ? err.message : undefined,
    });
  }
);

app.listen(config.server.port, () => {
  logger.info(`Server is running on port ${config.server.port}`);
});
