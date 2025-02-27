import winston from "winston";
import config from "../config/config";

// Create a null transport that does nothing
const nullTransport = new winston.transports.Console({
  silent: true,
});

const logger = winston.createLogger({
  level: config.logging.level,
  silent: true, // This will globally disable all logging
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
      });
    })
  ),
  transports: [nullTransport], // Use null transport instead of actual transports
});

export default logger;
