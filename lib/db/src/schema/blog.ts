import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titleRu: text("title_ru").notNull(),
  titleUz: text("title_uz").notNull(),
  contentEn: text("content_en").notNull(),
  contentRu: text("content_ru").notNull(),
  contentUz: text("content_uz").notNull(),
  summaryEn: text("summary_en"),
  summaryRu: text("summary_ru"),
  summaryUz: text("summary_uz"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({ id: true, createdAt: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;
