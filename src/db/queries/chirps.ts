import { sql } from "drizzle-orm";
import { db } from "../index.js";
import { Chirp, chirps } from "../schema.js";
import { BadRequestError } from "../../errors/BadRequestError.js";

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
