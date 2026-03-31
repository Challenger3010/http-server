import { Request, Response } from "express";
import { getRefreshToken, revokeToken } from "../db/queries/token.js";
import { RefreshToken } from "../db/schema.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { respondWithJSON } from "./json.js";
import { makeJWT } from "../auth.js";
import { getUserFromRefreshToken } from "../db/queries/users.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
  let token = req.get("Authorization");
  if (!token) {
    throw new Error("No token");
  }
  token = token.slice(7);

  let dbToken: RefreshToken = await getRefreshToken(token);

  if (!dbToken || dbToken.revokedAt) {
    throw new UnauthorizedError("Not authorized no Refresh-Token");
  }
  if (dbToken.expiresIn! < new Date()) {
    throw new UnauthorizedError(
      "Not authorized Refresh-Token expired please login again",
    );
  }

  const user_token = await getUserFromRefreshToken(dbToken.token);

  const newAccessToken = makeJWT(user_token.users.id, 3600, config.api.secret);

  respondWithJSON(res, 200, {
    token: newAccessToken,
  });
}

export async function handlerRevoke(req: Request, res: Response) {
  let token = req.get("Authorization");
  if (!token) {
    throw new Error("No token");
  }
  token = token.slice(7);

  console.log("HIER SOLLTE DER REFRESH TOKEN SEIN: ", token);

  await revokeToken(token);

  res.status(204).send();
}
