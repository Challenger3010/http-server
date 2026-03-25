import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export async function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  config.api.fileserverHits += 1;
  next();
}
