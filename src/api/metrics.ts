import { Request, Response } from "express";
import { config } from "../config.js";
import { deleteUser } from "../db/queries/users.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";

export async function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

export async function handlerResetMetrics(req: Request, res: Response) {
  if (config.api.platform != "dev") {
    throw new ForbiddenError("You are not allowed");
  }
  config.api.fileserverHits = 0;
  res.write("Hits reset to 0\n");
  await deleteUser();
  res.write("Users deleted");
  res.end();
}
