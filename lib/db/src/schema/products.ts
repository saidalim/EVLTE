import { pgTable, text, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameRu: text("name_ru").notNull(),
  nameUz: text("name_uz").notNull(),
  descriptionEn: text("description_en"),
  descriptionRu: text("description_ru"),
  descriptionUz: text("description_uz"),
  type: text("type").notNull(),
  powerKw: text("power_kw"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  brandId: integer("brand_id"),
  categoryId: integer("category_id"),
  featured: boolean("featured").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(true),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
