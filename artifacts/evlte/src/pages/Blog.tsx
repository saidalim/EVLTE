import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { format } from "date-fns";
import { useI18n } from "@/lib/i18n";
import { LiquidGlass } from "@/components/LiquidGlass";
import { useListBlogPosts, useGetBlogPost } from "@workspace/api-client-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function BlogList() {
  const { lang, t } = useI18n();
  const { data: posts, isLoading } = useListBlogPosts({ query: { queryKey: ["blogPosts"] } });

  return (
    <div className="pt-32 pb-24">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">
              {t({ en: "Insights & Updates", ru: "Статьи и обновления", uz: "Maqolalar va yangiliklar" })}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Blog</h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-secondary/50 animate-pulse" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => {
              const title = lang === "ru" ? post.titleRu : lang === "uz" ? post.titleUz : post.titleEn;
              const summary = lang === "ru" ? post.summaryRu : lang === "uz" ? post.summaryUz : post.summaryEn;
              return (
                <motion.div
                  key={post.id}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <LiquidGlass className="rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform h-full flex flex-col">
                      {post.imageUrl ? (
                        <div className="h-48 overflow-hidden">
                          <img src={post.imageUrl} alt={title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/30">EVLTE</span>
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <p className="text-xs text-muted-foreground mb-3">{format(new Date(post.createdAt), "MMM d, yyyy")}</p>
                        <h3 className="text-xl font-bold mb-3 leading-snug">{title}</h3>
                        <p className="text-muted-foreground text-sm flex-1 leading-relaxed">{summary}</p>
                        <span className="text-primary font-semibold text-sm mt-5 inline-block">
                          {t({ en: "Read more", ru: "Читать далее", uz: "Batafsil" })} →
                        </span>
                      </div>
                    </LiquidGlass>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 text-muted-foreground">
            {t({ en: "No blog posts yet.", ru: "Статей пока нет.", uz: "Hali maqolalar yo'q." })}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useI18n();
  const postId = parseInt(id ?? "0", 10);
  const { data: post, isLoading } = useGetBlogPost(postId, { query: { queryKey: ["blogPost", postId], enabled: !!postId } });

  if (isLoading) {
    return (
      <div className="pt-40 pb-24 max-w-3xl mx-auto px-6">
        <div className="h-8 bg-secondary/50 rounded animate-pulse mb-4 w-2/3" />
        <div className="h-4 bg-secondary/50 rounded animate-pulse mb-2" />
        <div className="h-4 bg-secondary/50 rounded animate-pulse mb-2 w-4/5" />
        <div className="h-4 bg-secondary/50 rounded animate-pulse w-3/5" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h1 className="text-3xl font-bold mb-4">{t({ en: "Post not found", ru: "Статья не найдена", uz: "Maqola topilmadi" })}</h1>
        <Link href="/blog" className="text-primary hover:underline">
          {t({ en: "Back to Blog", ru: "Назад к блогу", uz: "Blogga qaytish" })}
        </Link>
      </div>
    );
  }

  const title = lang === "ru" ? post.titleRu : lang === "uz" ? post.titleUz : post.titleEn;
  const content = lang === "ru" ? post.contentRu : lang === "uz" ? post.contentUz : post.contentEn;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-primary text-sm font-medium hover:underline inline-block mb-8">
          ← {t({ en: "Back to Blog", ru: "Назад к блогу", uz: "Blogga qaytish" })}
        </Link>
        {post.imageUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden mb-10 h-80">
            <img src={post.imageUrl} alt={title} className="w-full h-full object-cover" />
          </motion.div>
        )}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6 }}>
          <p className="text-xs text-muted-foreground mb-4">{format(new Date(post.createdAt), "MMMM d, yyyy")}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{title}</h1>
          <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
            {content.split("\n").map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Blog() {
  const { id } = useParams<{ id?: string }>();
  return id ? <BlogPostDetail /> : <BlogList />;
}
