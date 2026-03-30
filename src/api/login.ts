import type { Request, Response } from "express";
import { findByEmail } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import { checkPasswordHash, getBearerToken, makeJWT } from "../auth.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./createUser.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
    expiresIn?: number;
  };

  const params: parameters = req.body;

  const foundUser: User | undefined = await findByEmail(params.email);

  if (typeof foundUser?.hashedPw != "string") {
    throw new UnauthorizedError("incorrect email or password");
  }

  const match = await checkPasswordHash(foundUser.hashedPw, params.password);

  let expiresIn: number;

  if (params.expiresIn) {
    expiresIn = params.expiresIn > 60 ? 60 : params.expiresIn;
  } else {
    expiresIn = 60;
  }

  const token = makeJWT(foundUser.id as string, expiresIn, config.api.secret);

  if (!match) {
    throw new UnauthorizedError("incorrect email or password");
  }

  respondWithJSON(res, 200, {
    id: foundUser.id,
    email: foundUser.email,
    createdAt: foundUser.createdAt,
    updatedAt: foundUser.updatedAt,
    token: token,
  });
}
