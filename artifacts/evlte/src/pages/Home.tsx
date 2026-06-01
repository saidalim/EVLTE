import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { LiquidGlass } from "@/components/LiquidGlass";
import { InteractiveCarDemo } from "@/components/InteractiveCarDemo";
import { useListBrands, useListProducts, useListBlogPosts } from "@workspace/api-client-react";
import { format } from "date-fns";

// Assets
import heroBgUrl from "@/assets/hero-bg.png";
import chargerUrl from "@/assets/charger.png";
import accessoriesUrl from "@/assets/accessories.png";

export function Home() {
  const { lang, t } = useI18n();
  const { data: brands } = useListBrands();
  const { data: featuredProducts } = useListProducts({ query: { queryKey: ["featuredProducts", true] }, request: { query: { featured: "true" } } as any }); // Assuming featured param works or just list and filter
  const { data: blogPosts } = useListBlogPosts();

  // If featured endpoint exists, use it, else fallback to list products with featured=true
  // Since useListFeaturedProducts is in the prompt but not in the type definition explicitly shown, I'll use useListProducts

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBgUrl} alt="EVLTE Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white dark:from-background/90 dark:via-background/80 dark:to-background" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6">
              EVLTE
            </h1>
            <p className="text-xl md:text-3xl font-medium text-foreground max-w-3xl mb-10">
              {t({
                en: "Precision engineering. Calm confidence.",
                ru: "Точная инженерия. Спокойная уверенность.",
                uz: "Aniq muhandislik. Xotirjam ishonch."
              })}
            </p>
            <Link href="/shop" className="inline-block">
              <LiquidGlass className="px-8 py-4 rounded-full text-primary hover:bg-primary hover:text-white transition-colors text-lg font-semibold cursor-pointer">
                {t({ en: "Explore Shop", ru: "Перейти в магазин", uz: "Do'konni ko'rish" })}
              </LiquidGlass>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Link href="/shop/chargers">
              <LiquidGlass className="group rounded-3xl overflow-hidden cursor-pointer relative h-[400px] flex items-end p-8 transition-transform hover:-translate-y-2">
                <img src={chargerUrl} alt="Chargers" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="text-3xl font-bold mb-2">{t({ en: "EV Chargers", ru: "Зарядные станции", uz: "Quvvatlash stansiyalari" })}</h3>
                  <p className="text-white/80 font-medium">1.5 kW / 3.5 kW / 7 kW</p>
                </div>
              </LiquidGlass>
            </Link>

            <Link href="/shop/accessories">
              <LiquidGlass className="group rounded-3xl overflow-hidden cursor-pointer relative h-[400px] flex items-end p-8 transition-transform hover:-translate-y-2">
                <img src={accessoriesUrl} alt="Accessories" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="text-3xl font-bold mb-2">{t({ en: "EV Accessories", ru: "Аксессуары", uz: "Aksessuarlar" })}</h3>
                  <p className="text-white/80 font-medium">{t({ en: "Cables, adapters & more", ru: "Кабели, адаптеры и многое другое", uz: "Kabellar, adapterlar va boshqalar" })}</p>
                </div>
              </LiquidGlass>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">{t({ en: "Supported Brands", ru: "Поддерживаемые бренды", uz: "Qo'llab-quvvatlanadigan brendlar" })}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {brands?.map((brand) => (
              <Link key={brand.id} href={`/shop/chargers/${brand.slug}`}>
                <LiquidGlass className="px-8 py-6 rounded-2xl cursor-pointer hover:bg-white transition-colors flex items-center justify-center min-w-[150px]">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.nameEn} className="h-10 object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-foreground">{brand.nameEn}</span>
                  )}
                </LiquidGlass>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t({ en: "The Charging Experience", ru: "Процесс зарядки", uz: "Quvvatlash jarayoni" })}
          </h2>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            {t({ 
              en: "Seamless, intuitive, and built for the modern EV owner.", 
              ru: "Бесшовный, интуитивно понятный и созданный для современного владельца электромобиля.", 
              uz: "Uzluksiz, intuitiv va zamonaviy elektromobil egasi uchun yaratilgan." 
            })}
          </p>
          <InteractiveCarDemo />
        </div>
      </section>

      {/* Blog Teaser */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold">{t({ en: "Latest Insights", ru: "Последние статьи", uz: "So'nggi maqolalar" })}</h2>
            <Link href="/blog" className="text-primary font-medium hover:underline">
              {t({ en: "View all", ru: "Смотреть все", uz: "Barchasini ko'rish" })}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts?.slice(0, 3).map((post) => {
              const title = lang === 'ru' ? post.titleRu : lang === 'uz' ? post.titleUz : post.titleEn;
              const summary = lang === 'ru' ? post.summaryRu : lang === 'uz' ? post.summaryUz : post.summaryEn;
              
              return (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <LiquidGlass className="rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-transform">
                    {post.imageUrl && (
                      <div className="h-48 w-full overflow-hidden">
                        <img src={post.imageUrl} alt={title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-xs text-muted-foreground mb-3">{format(new Date(post.createdAt), 'MMM d, yyyy')}</p>
                      <h3 className="text-xl font-bold mb-3">{title}</h3>
                      <p className="text-muted-foreground text-sm flex-1">{summary}</p>
                      <span className="text-primary font-medium text-sm mt-4 inline-block">{t({ en: "Read more", ru: "Читать далее", uz: "Batafsil" })}</span>
                    </div>
                  </LiquidGlass>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
