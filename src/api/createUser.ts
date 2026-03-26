import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { User } from "../db/schema.js";
import { BadRequestError } from "../errors/BadRequestError.js";

export async function hanlderCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;

  const newUser: User = await createUser({ email: params.email });

  if (!newUser) {
    throw new BadRequestError("User with this email already exists");
  }

  respondWithJSON(res, 201, newUser);
}
