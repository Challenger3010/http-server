import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse } from "./middleware/middlewareLogResponse.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerMetrics, handlerResetMetrics } from "./api/metrics.js";
import { handlerValidate } from "./api/validate.js";
import { errorHandler } from "./middleware/errors.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponse);

app.get("/admin/metrics", async (req, res, next) => {
  try {
    await handlerMetrics(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/admin/reset", async (req, res, next) => {
  try {
    await handlerResetMetrics(req, res);
  } catch (err) {
    next(err);
  }
});
app.post("/api/validate_chirp", async (req, res, next) => {
  try {
    await handlerValidate(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/api/healthz", async (req, res, next) => {
  try {
    await handlerReadiness(req, res);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
