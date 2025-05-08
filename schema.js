import { pgTable, uuid, jsonb, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  firstName: varchar("name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  passwordHash: varchar("password_hash", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  mapObject: jsonb("mapobject").notNull(),
  fastighetsagare: varchar("fastighetsagare", { length: 256 }),
  beteckning: varchar("beteckning", { length: 256 }),
  area: varchar("area", { length: 256 }),
  byggar: varchar("byggar", { length: 256 }),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  property_id: uuid("property_id").references(() => properties.id),
  adress: varchar("adress", { length: 256 }),
  mapObject: jsonb("mapobject").notNull(),
});
