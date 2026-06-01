import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  CreateBlogPostBody,
  UpdateBlogPostBody,
  UpdateBlogPostParams,
  GetBlogPostParams,
  DeleteBlogPostParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (_req, res): Promise<void> => {
  const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt));
  res.json(posts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
});

router.post("/blog", async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db.insert(blogPostsTable).values(parsed.data).returning();
  res.status(201).json({ ...post, createdAt: post.createdAt.toISOString() });
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, params.data.id));
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json({ ...post, createdAt: post.createdAt.toISOString() });
});

router.patch("/blog/:id", async (req, res): Promise<void> => {
  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db.update(blogPostsTable).set(parsed.data).where(eq(blogPostsTable.id, params.data.id)).returning();
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json({ ...post, createdAt: post.createdAt.toISOString() });
});

router.delete("/blog/:id", async (req, res): Promise<void> => {
  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db.delete(blogPostsTable).where(eq(blogPostsTable.id, params.data.id)).returning();
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
