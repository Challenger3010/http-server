import * as argon2 from "argon2";
import { Request } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import * as crypto from "node:crypto";
import { UnauthorizedError } from "./errors/UnauthorizedError.js";

export type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPasswordHash(
  hash: string,
  password: string,
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: iat,
    exp: iat + expiresIn,
  };

  const token = jwt.sign(payload, secret);
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decoded = jwt.verify(tokenString, secret) as payload;
    if (!decoded.sub || decoded.sub === "") {
      throw new UnauthorizedError("No subject in token");
    }
    return decoded.sub;
  } catch (e) {
    if (e instanceof Error && e.message === "No subject in token") {
      throw e;
    }
    throw new UnauthorizedError("Error with JWT expired or invalid");
  }
}

export function getBearerToken(req: Request): string {
  let token = req.get("Authorization");
  if (!token) {
    throw new Error("No token");
  }
  token = token.slice(7);

  return token;
}

export function makeRefreshToken() {
  const hexString = crypto.randomBytes(32).toString("hex");

  return hexString;
}
