import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { User, users } from "../schema.js";

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
