import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";
import { BadRequestError } from "../../errors/BadRequestError.js";
import { NotFoundError } from "../../errors/NotFoundError.js";

export async function createChirp(chirp: Chirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getChirps() {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(sql`${chirps.createdAt} ASC`);

  if (!result) {
    throw new BadRequestError("No Chirps available");
  }

  return result;
}

export async function getChirp(chirpId: string) {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));

  if (!result) {
    throw new NotFoundError("No Chirp found");
  }

  return result;
}

export async function deleteChirp(chirpId: string) {
  const rows = await db.delete(chirps).where(eq(chirps.id, chirpId));

  if (rows.length < 0) {
    throw new NotFoundError("No Chirp found");
  }

  return rows.length > 0;
}

export async function getChirpsbyUser(userId: string) {
  const results = await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, userId));

  return results;
}
