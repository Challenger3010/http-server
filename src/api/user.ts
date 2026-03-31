import type { Request, Response } from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { User } from "../db/schema.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export type UserResponse = Omit<User, "hashedPw">;

export async function hanlderCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hpw = await hashPassword(params.password);

  const newUser = await createUser({
    email: params.email,
    hashedPw: hpw,
  } satisfies User);

  if (!newUser) {
    throw new BadRequestError("User with this email already exists");
  }
  const { hashedPw, ...userPreview } = newUser;

  respondWithJSON(res, 201, userPreview satisfies UserResponse);
}

export async function handlerUpdateUser(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.api.secret);

  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  const hashPw = await hashPassword(params.password);

  const user = await updateUser(userId, params.email, hashPw);

  if (!user) {
    throw new Error("No user updated");
  }

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
