import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse } from "./middleware/middlewareLogResponse.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerMetrics, handlerResetMetrics } from "./api/metrics.js";
import { errorHandler } from "./middleware/errors.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { hanlderCreateUser } from "./api/createUser.js";
import {
  handlerGetAllChirps,
  handlerGetSingleChirp,
  hanlderCreateChirp,
} from "./api/createChirp.js";

import { handlerLogin } from "./api/login.js";
import { handlerRefresh, handlerRevoke } from "./api/tokens.js";

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

app.post("/api/users", async (req, res, next) => {
  try {
    await hanlderCreateUser(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    await handlerLogin(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/api/chirps", async (req, res, next) => {
  try {
    await hanlderCreateChirp(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/api/refresh", async (req, res, next) => {
  try {
    await handlerRefresh(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/api/revoke", async (req, res, next) => {
  try {
    await handlerRevoke(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/api/chirps", async (req, res, next) => {
  try {
    await handlerGetAllChirps(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/api/chirps/:chirpId", async (req, res, next) => {
  try {
    await handlerGetSingleChirp(req, res);
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
