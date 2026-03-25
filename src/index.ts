import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse } from "./middleware/middlewareLogResponse.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerMetrics, handlerResetMetrics } from "./api/metrics.js";
import { handlerValidate } from "./api/validate.js";
import { errorHandler } from "./middleware/errors.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationsConfig);

const app = express();

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

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
