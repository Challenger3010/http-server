import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { tokens } from "../schema.js";

export async function createRefreshToken(token: string, userId: string) {
  const [result] = await db
    .insert(tokens)
    .values({ token: token, userId: userId })
    .returning();

  return result;
}

export async function getRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(tokens)
    .where(eq(tokens.token, token));

  return result;
}

export async function revokeToken(token: string) {
  const rows = await db
    .update(tokens)
    .set({ revokedAt: new Date() })
    .where(eq(tokens.token, token))
    .returning();

  if (rows.length === 0) {
    throw new Error("Couldn't revoke token");
  }
}
