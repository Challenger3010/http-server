import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { User } from "../db/schema.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { hashPassword, checkPasswordHash } from "../auth.js";

export type UserResponse = Omit<User, "hashedPw">;

export async function hanlderCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  if (!params.email || params.password) {
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
