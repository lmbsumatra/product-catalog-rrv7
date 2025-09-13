import { mysqlTable, serial, varchar, text, decimal, int, timestamp } from "drizzle-orm/mysql-core";

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 255 }),
  category: varchar("category", { length: 100 }),
  ownerId: int("ownerId"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
