import { pgTable, uuid, jsonb, varchar } from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
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
