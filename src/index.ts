import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse } from "./middleware/middlewareLogResponse.js";
import { middlewareMetricsInc } from "./middleware/metricsInc.js";
import { handlerMetrics, handlerResetMetrics } from "./api/metrics.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponse);

app.get("/admin/metrics", handlerMetrics);
app.get("/admin/reset", handlerResetMetrics);
app.get("/api/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
