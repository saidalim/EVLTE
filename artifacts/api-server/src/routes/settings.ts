import { Router, type IRouter } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/settings", async (_req, res): Promise<void> => {
  const [settings] = await db.select().from(siteSettingsTable);
  if (!settings) {
    const [created] = await db.insert(siteSettingsTable).values({
      phone: "+998 90 123 45 67",
      email: "info@evlte.uz",
      instagramUrl: "https://instagram.com/evlte",
      facebookUrl: "https://facebook.com/evlte",
      telegramUrl: "https://t.me/evlte",
      youtubeUrl: "https://youtube.com/@evlte",
      addressEn: "Tashkent, Uzbekistan",
      addressRu: "Ташкент, Узбекистан",
      addressUz: "Toshkent, O'zbekiston",
    }).returning();
    res.json(created);
    return;
  }
  res.json(settings);
});

router.patch("/settings", async (req, res): Promise<void> => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [existing] = await db.select().from(siteSettingsTable);
  if (!existing) {
    const [created] = await db.insert(siteSettingsTable).values(parsed.data).returning();
    res.json(created);
    return;
  }
  const [updated] = await db.update(siteSettingsTable).set(parsed.data).where(eq(siteSettingsTable.id, existing.id)).returning();
  res.json(updated);
});

export default router;
