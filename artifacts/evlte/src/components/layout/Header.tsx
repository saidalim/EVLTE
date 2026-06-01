import React from "react";
import { Link, useLocation } from "wouter";
import { FaInstagram, FaFacebook, FaTelegram, FaYoutube } from "react-icons/fa";
import { LiquidGlass } from "@/components/LiquidGlass";
import { useI18n } from "@/lib/i18n";
import { useGetSiteSettings } from "@workspace/api-client-react";

export function Header() {
  const [location] = useLocation();
  const { lang, setLang, t } = useI18n();
  const { data: settings } = useGetSiteSettings({ query: { queryKey: ["siteSettings"] } });

  const navLinks = [
    { href: "/", label: { en: "Home", ru: "Главная", uz: "Bosh sahifa" } },
    { href: "/about", label: { en: "About Us", ru: "О нас", uz: "Biz haqimizda" } },
    { href: "/shop", label: { en: "Shop", ru: "Магазин", uz: "Do'kon" } },
    { href: "/blog", label: { en: "Blog", ru: "Блог", uz: "Blog" } },
    { href: "/contact", label: { en: "Contact Us", ru: "Контакты", uz: "Aloqa" } },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
      <div className="bg-primary text-white text-xs font-medium py-2 px-6 flex justify-between items-center pointer-events-auto shadow-sm">
        <div className="flex gap-4 items-center">
          {settings?.phone && <span>{settings.phone}</span>}
          {settings?.email && <span className="hidden sm:inline">{settings.email}</span>}
        </div>
        <div className="flex gap-3 items-center">
          <a href={settings?.instagramUrl || "#"} target="_blank" rel="noreferrer" className="hover:text-white/80 transition-colors"><FaInstagram /></a>
          <a href={settings?.facebookUrl || "#"} target="_blank" rel="noreferrer" className="hover:text-white/80 transition-colors"><FaFacebook /></a>
          <a href={settings?.telegramUrl || "#"} target="_blank" rel="noreferrer" className="hover:text-white/80 transition-colors"><FaTelegram /></a>
          <a href={settings?.youtubeUrl || "#"} target="_blank" rel="noreferrer" className="hover:text-white/80 transition-colors"><FaYoutube /></a>
        </div>
      </div>

      <div className="px-4 py-3 pointer-events-auto">
        <LiquidGlass className="rounded-2xl max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-primary">EVLTE</span>
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground/80"}`}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 bg-secondary/50 rounded-full p-1 border border-border/50">
            {(["en", "ru", "uz"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs px-3 py-1.5 rounded-full uppercase font-medium transition-all ${lang === l ? "bg-white text-primary shadow-sm" : "text-foreground/60 hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </LiquidGlass>
      </div>
    </header>
  );
}
