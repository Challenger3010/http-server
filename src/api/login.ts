import type { Request, Response } from "express";
import { findByEmail } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import { checkPasswordHash } from "../auth.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./createUser.js";

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

  if (!match) {
    throw new UnauthorizedError("incorrect email or password");
  }

  const { hashedPw, ...userPreview } = foundUser;
  respondWithJSON(res, 200, userPreview satisfies UserResponse);
}
