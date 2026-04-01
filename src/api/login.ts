import type { Request, Response } from "express";
import { findByEmail } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/token.js";

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  const foundUser: User | undefined = await findByEmail(params.email);

  if (typeof foundUser?.hashedPw != "string") {
    throw new UnauthorizedError("incorrect email or password");
  }

  const match = await checkPasswordHash(foundUser.hashedPw, params.password);

  const accessToken = makeJWT(foundUser.id as string, 3600, config.api.secret);
  const refreshToken = makeRefreshToken();

  try {
    await createRefreshToken(refreshToken, foundUser.id as string);
  } catch (e) {
    throw new Error("Error creating refresh token");
  }

  if (!match) {
    throw new UnauthorizedError("incorrect email or password");
  }

  respondWithJSON(res, 200, {
    id: foundUser.id,
    email: foundUser.email,
    createdAt: foundUser.createdAt,
    updatedAt: foundUser.updatedAt,
    isChirpyRed: foundUser.isChirpyRed,
    token: accessToken,
    refreshToken: refreshToken,
  });
}
