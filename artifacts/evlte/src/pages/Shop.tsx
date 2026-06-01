import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { LiquidGlass } from "@/components/LiquidGlass";
import { useListBrands, useListProducts, useListFeaturedProducts } from "@workspace/api-client-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const POWER_OPTIONS = ["1.5", "3.5", "7"] as const;

function ProductCard({ product, lang, t }: { product: any; lang: string; t: (o: any) => string }) {
  const name = lang === "ru" ? product.nameRu : lang === "uz" ? product.nameUz : product.nameEn;
  const desc = lang === "ru" ? product.descriptionRu : lang === "uz" ? product.descriptionUz : product.descriptionEn;
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <LiquidGlass className="rounded-2xl overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-transform cursor-pointer">
        <div className="h-52 bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6">
              <div className="text-5xl font-bold text-primary/20 mb-2">EV</div>
              {product.powerKw && (
                <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                  {product.powerKw} kW
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-2 leading-snug">{name}</h3>
          {desc && <p className="text-muted-foreground text-sm flex-1 mb-4 leading-relaxed line-clamp-2">{desc}</p>}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
            <span className="text-xl font-bold text-primary">${product.price}</span>
            <div className="flex gap-2 flex-wrap justify-end">
              {product.powerKw && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{product.powerKw} kW</span>
              )}
              {product.inStock ? (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                  {t({ en: "In Stock", ru: "В наличии", uz: "Mavjud" })}
                </span>
              ) : (
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">
                  {t({ en: "Out of Stock", ru: "Нет в наличии", uz: "Tugadi" })}
                </span>
              )}
            </div>
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}

function ShopHome() {
  const { lang, t } = useI18n();
  const { data: brands } = useListBrands({ query: { queryKey: ["brands"] } });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <Link href="/shop/chargers">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <LiquidGlass className="rounded-3xl p-10 cursor-pointer hover:-translate-y-2 transition-transform group h-56 flex flex-col justify-between bg-gradient-to-br from-primary/10 to-primary/5">
              <div>
                <h2 className="text-3xl font-bold mb-3">{t({ en: "EV Chargers", ru: "Зарядные устройства", uz: "EV Zaryadlagichlar" })}</h2>
                <p className="text-muted-foreground">{t({ en: "1.5 kW / 3.5 kW / 7 kW — for every EV brand", ru: "1,5 / 3,5 / 7 кВт — для каждого бренда ЭВ", uz: "1,5 / 3,5 / 7 kW — har bir EV brendi uchun" })}</p>
              </div>
              <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-block">
                {t({ en: "Browse Chargers", ru: "Смотреть зарядные", uz: "Zaryadlagichlarni ko'rish" })} →
              </span>
            </LiquidGlass>
          </motion.div>
        </Link>
        <Link href="/shop/accessories">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <LiquidGlass className="rounded-3xl p-10 cursor-pointer hover:-translate-y-2 transition-transform group h-56 flex flex-col justify-between bg-gradient-to-br from-sky-50 to-white">
              <div>
                <h2 className="text-3xl font-bold mb-3">{t({ en: "EV Accessories", ru: "Аксессуары", uz: "EV Aksessuarlar" })}</h2>
                <p className="text-muted-foreground">{t({ en: "Cables, adapters and charging essentials", ru: "Кабели, адаптеры и всё необходимое для зарядки", uz: "Kabellar, adapterlar va zaryadlash uchun zaruriy buyumlar" })}</p>
              </div>
              <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-block">
                {t({ en: "Browse Accessories", ru: "Смотреть аксессуары", uz: "Aksessuarlarni ko'rish" })} →
              </span>
            </LiquidGlass>
          </motion.div>
        </Link>
      </div>

      {/* Brands */}
      <div>
        <h2 className="text-2xl font-bold mb-8">{t({ en: "Shop by Brand", ru: "По брендам", uz: "Brendlar bo'yicha" })}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands?.map((brand, i) => (
            <motion.div key={brand.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/shop/chargers/${brand.slug}`}>
                <LiquidGlass className="rounded-2xl p-6 text-center cursor-pointer hover:bg-primary/5 transition-colors h-28 flex items-center justify-center">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.nameEn} className="h-10 object-contain" />
                  ) : (
                    <span className="text-xl font-bold">{lang === "ru" ? brand.nameRu : lang === "uz" ? brand.nameUz : brand.nameEn}</span>
                  )}
                </LiquidGlass>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChargersList() {
  const { lang, t } = useI18n();
  const { data: brands } = useListBrands({ query: { queryKey: ["brands"] } });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link href="/shop" className="text-primary text-sm font-medium hover:underline inline-block mb-8">
        ← {t({ en: "Back to Shop", ru: "Назад в магазин", uz: "Do'konga qaytish" })}
      </Link>
      <h1 className="text-4xl font-bold mb-4">{t({ en: "EV Chargers", ru: "Зарядные устройства", uz: "EV Zaryadlagichlar" })}</h1>
      <p className="text-muted-foreground mb-12">{t({ en: "Select a brand to explore charging options", ru: "Выберите бренд для просмотра вариантов зарядки", uz: "Zaryadlash variantlarini ko'rish uchun brendni tanlang" })}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands?.map((brand, i) => (
          <motion.div key={brand.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <Link href={`/shop/chargers/${brand.slug}`}>
              <LiquidGlass className="rounded-2xl p-8 text-center cursor-pointer hover:-translate-y-1 transition-transform h-40 flex flex-col items-center justify-center gap-3">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.nameEn} className="h-12 object-contain" />
                ) : (
                  <span className="text-2xl font-bold">{brand.nameEn}</span>
                )}
                <span className="text-xs text-muted-foreground">{t({ en: "View Chargers", ru: "Смотреть зарядные", uz: "Zaryadlagichlarni ko'rish" })} →</span>
              </LiquidGlass>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BrandChargers() {
  const { brand: brandSlug } = useParams<{ brand: string }>();
  const { lang, t } = useI18n();
  const [selectedPower, setSelectedPower] = useState<string | null>(null);
  const { data: brands } = useListBrands({ query: { queryKey: ["brands"] } });
  const brand = brands?.find(b => b.slug === brandSlug);
  const { data: products, isLoading } = useListProducts({
    query: { queryKey: ["products", brandSlug, selectedPower] },
    request: {
      query: {
        ...(brand ? { brandId: brand.id } : {}),
        type: "charger" as const,
        ...(selectedPower ? { powerKw: selectedPower } : {}),
      }
    } as any
  });

  const brandName = brand ? (lang === "ru" ? brand.nameRu : lang === "uz" ? brand.nameUz : brand.nameEn) : brandSlug;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link href="/shop/chargers" className="text-primary text-sm font-medium hover:underline inline-block mb-8">
        ← {t({ en: "All Brands", ru: "Все бренды", uz: "Barcha brendlar" })}
      </Link>
      <h1 className="text-4xl font-bold mb-3">{brandName} {t({ en: "Chargers", ru: "Зарядные", uz: "Zaryadlagichlar" })}</h1>
      <p className="text-muted-foreground mb-8">{t({ en: "Select power level", ru: "Выберите уровень мощности", uz: "Quvvat darajasini tanlang" })}</p>

      {/* Power Filter */}
      <div className="flex gap-3 mb-12 flex-wrap">
        <button
          onClick={() => setSelectedPower(null)}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${!selectedPower ? "bg-primary text-white border-primary" : "border-border hover:border-primary text-foreground"}`}
        >
          {t({ en: "All", ru: "Все", uz: "Barchasi" })}
        </button>
        {POWER_OPTIONS.map(pw => (
          <button
            key={pw}
            onClick={() => setSelectedPower(pw)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${selectedPower === pw ? "bg-primary text-white border-primary" : "border-border hover:border-primary text-foreground"}`}
          >
            {pw} kW
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 rounded-2xl bg-secondary/50 animate-pulse" />)}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} lang={lang} t={t} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          {t({ en: "No products found for this filter.", ru: "Нет продуктов для этого фильтра.", uz: "Bu filtr uchun mahsulot topilmadi." })}
        </div>
      )}
    </div>
  );
}

function AccessoriesList() {
  const { lang, t } = useI18n();
  const { data: products, isLoading } = useListProducts({
    query: { queryKey: ["products", "accessory"] },
    request: { query: { type: "accessory" as const } } as any
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link href="/shop" className="text-primary text-sm font-medium hover:underline inline-block mb-8">
        ← {t({ en: "Back to Shop", ru: "Назад в магазин", uz: "Do'konga qaytish" })}
      </Link>
      <h1 className="text-4xl font-bold mb-4">{t({ en: "EV Accessories", ru: "Аксессуары для ЭВ", uz: "EV Aksessuarlar" })}</h1>
      <p className="text-muted-foreground mb-12">{t({ en: "Cables, adapters and charging essentials", ru: "Кабели, адаптеры и всё необходимое", uz: "Kabellar, adapterlar va zaruriy buyumlar" })}</p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-72 rounded-2xl bg-secondary/50 animate-pulse" />)}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} lang={lang} t={t} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          {t({ en: "No accessories found.", ru: "Аксессуары не найдены.", uz: "Aksessuarlar topilmadi." })}
        </div>
      )}
    </div>
  );
}

export function Shop() {
  const [location] = useLocation();
  const { t } = useI18n();

  const isChargers = location.startsWith("/shop/chargers");
  const isBrandChargers = location.match(/^\/shop\/chargers\/[^/]+$/);
  const isAccessories = location === "/shop/accessories";

  return (
    <div className="pt-28">
      <div className="border-b border-border/40 bg-white/80 backdrop-blur-sm sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-primary transition-colors">{t({ en: "Shop", ru: "Магазин", uz: "Do'kon" })}</Link>
          {isChargers && <><span>/</span><Link href="/shop/chargers" className="hover:text-primary transition-colors">{t({ en: "EV Chargers", ru: "Зарядные", uz: "Zaryadlagichlar" })}</Link></>}
          {isAccessories && <><span>/</span><span>{t({ en: "Accessories", ru: "Аксессуары", uz: "Aksessuarlar" })}</span></>}
        </div>
      </div>

      {isBrandChargers ? <BrandChargers /> :
       isChargers ? <ChargersList /> :
       isAccessories ? <AccessoriesList /> :
       <ShopHome />}
    </div>
  );
}
