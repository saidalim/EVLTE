import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  phone: text("phone"),
  email: text("email"),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  telegramUrl: text("telegram_url"),
  youtubeUrl: text("youtube_url"),
  addressEn: text("address_en"),
  addressRu: text("address_ru"),
  addressUz: text("address_uz"),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
