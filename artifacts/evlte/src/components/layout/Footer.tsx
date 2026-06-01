import React from "react";
import { Link } from "wouter";
import { FaInstagram, FaFacebook, FaTelegram, FaYoutube } from "react-icons/fa";
import { useI18n } from "@/lib/i18n";
import { useGetSiteSettings } from "@workspace/api-client-react";

export function Footer() {
  const { t } = useI18n();
  const { data: settings } = useGetSiteSettings({ query: { queryKey: ["siteSettings"] } });

  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary mb-4 block">EVLTE</Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              {t({
                en: "The trusted home for EV charging solutions in Uzbekistan. Clean, modern, and reassuringly technical.",
                ru: "Надежный партнер по решениям для зарядки электромобилей в Узбекистане. Чисто, современно, технично.",
                uz: "O'zbekistonda elektromobillarni quvvatlash yechimlari bo'yicha ishonchli hamkor. Toza, zamonaviy va texnik mukammal."
              })}
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href={settings?.instagramUrl || "#"} className="hover:text-primary transition-colors"><FaInstagram size={20} /></a>
              <a href={settings?.facebookUrl || "#"} className="hover:text-primary transition-colors"><FaFacebook size={20} /></a>
              <a href={settings?.telegramUrl || "#"} className="hover:text-primary transition-colors"><FaTelegram size={20} /></a>
              <a href={settings?.youtubeUrl || "#"} className="hover:text-primary transition-colors"><FaYoutube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t({ en: "Links", ru: "Ссылки", uz: "Havolalar" })}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">{t({ en: "Home", ru: "Главная", uz: "Bosh sahifa" })}</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">{t({ en: "About Us", ru: "О нас", uz: "Biz haqimizda" })}</Link></li>
              <li><Link href="/shop" className="hover:text-primary transition-colors">{t({ en: "Shop", ru: "Магазин", uz: "Do'kon" })}</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">{t({ en: "Blog", ru: "Блог", uz: "Blog" })}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t({ en: "Contact", ru: "Контакты", uz: "Aloqa" })}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {settings?.phone && <li>{settings.phone}</li>}
              {settings?.email && <li>{settings.email}</li>}
              {settings?.addressEn && <li>{t({ en: settings.addressEn, ru: settings.addressRu || settings.addressEn, uz: settings.addressUz || settings.addressEn })}</li>}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} EVLTE. {t({ en: "All rights reserved.", ru: "Все права защищены.", uz: "Barcha huquqlar himoyalangan." })}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/admin" className="hover:text-primary">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
