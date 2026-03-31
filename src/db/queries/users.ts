import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { RefreshToken, tokens, User, users } from "../schema.js";

export async function createUser(user: User) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function deleteUser() {
  const result = await db.delete(users);
  return result;
}

export async function findByEmail(email: string) {
  try {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result;
  } catch (e) {
    return undefined;
  }
}

export async function getUserFromRefreshToken(token: string) {
  const [result] = await db
    .select()
    .from(tokens)
    .innerJoin(users, eq(tokens.userId, users.id))
    .where(eq(tokens.token, token));

  return result;
}
