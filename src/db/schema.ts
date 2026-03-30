import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export type User = typeof users.$inferInsert;
export type Chirp = typeof chirps.$inferInsert;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPw: varchar("hashed_password", { length: 256 })
    .notNull()
    .default("unset"),
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
});
