import express from "express";

export const healthRouter = express.Router();

healthRouter.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "OK" });
});
