import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTelegram, FaYoutube } from "react-icons/fa";
import { useI18n } from "@/lib/i18n";
import { LiquidGlass } from "@/components/LiquidGlass";
import { useGetSiteSettings, useSubmitContact } from "@workspace/api-client-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export function Contact() {
  const { t } = useI18n();
  const { data: settings } = useGetSiteSettings({ query: { queryKey: ["siteSettings"] } });
  const submitContact = useSubmitContact();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate({ data: form }, {
      onSuccess: () => {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      },
    });
  };

  return (
    <div className="pt-32 pb-24">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">
              {t({ en: "Get in Touch", ru: "Свяжитесь с нами", uz: "Biz bilan bog'laning" })}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              {t({ en: "Contact Us", ru: "Контакты", uz: "Aloqa" })}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t({
                en: "Have questions about EV charging? We're here to help.",
                ru: "Есть вопросы о зарядке электромобилей? Мы здесь, чтобы помочь.",
                uz: "EV zaryadlash haqida savollaringiz bormi? Biz yordam berishga tayyormiz."
              })}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold mb-8">
              {t({ en: "Contact Information", ru: "Контактная информация", uz: "Aloqa ma'lumotlari" })}
            </h2>
            <div className="space-y-6">
              {settings?.phone && (
                <LiquidGlass className="rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    P
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t({ en: "Phone", ru: "Телефон", uz: "Telefon" })}</div>
                    <a href={`tel:${settings.phone}`} className="text-lg font-semibold hover:text-primary transition-colors">{settings.phone}</a>
                  </div>
                </LiquidGlass>
              )}
              {settings?.email && (
                <LiquidGlass className="rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    @
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t({ en: "Email", ru: "Email", uz: "Elektron pochta" })}</div>
                    <a href={`mailto:${settings.email}`} className="text-lg font-semibold hover:text-primary transition-colors">{settings.email}</a>
                  </div>
                </LiquidGlass>
              )}
              {settings?.addressEn && (
                <LiquidGlass className="rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                    A
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t({ en: "Address", ru: "Адрес", uz: "Manzil" })}</div>
                    <div className="text-lg font-semibold">
                      {t({ en: settings.addressEn ?? "", ru: settings.addressRu ?? "", uz: settings.addressUz ?? "" })}
                    </div>
                  </div>
                </LiquidGlass>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-4">{t({ en: "Follow Us", ru: "Следите за нами", uz: "Bizni kuzating" })}</h3>
              <div className="flex gap-4">
                {settings?.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
                    <LiquidGlass className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      <FaInstagram />
                    </LiquidGlass>
                  </a>
                )}
                {settings?.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noreferrer">
                    <LiquidGlass className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      <FaFacebook />
                    </LiquidGlass>
                  </a>
                )}
                {settings?.telegramUrl && (
                  <a href={settings.telegramUrl} target="_blank" rel="noreferrer">
                    <LiquidGlass className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      <FaTelegram />
                    </LiquidGlass>
                  </a>
                )}
                {settings?.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noreferrer">
                    <LiquidGlass className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      <FaYoutube />
                    </LiquidGlass>
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <LiquidGlass className="rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                {t({ en: "Send a Message", ru: "Отправить сообщение", uz: "Xabar yuborish" })}
              </h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-5xl mb-4 text-primary font-bold">✓</div>
                  <h3 className="text-xl font-bold mb-2">{t({ en: "Message Sent!", ru: "Сообщение отправлено!", uz: "Xabar yuborildi!" })}</h3>
                  <p className="text-muted-foreground">
                    {t({ en: "We'll get back to you shortly.", ru: "Мы свяжемся с вами в ближайшее время.", uz: "Tez orada siz bilan bog'lanamiz." })}
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-primary font-medium hover:underline">
                    {t({ en: "Send another", ru: "Отправить ещё", uz: "Yana yuborish" })}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t({ en: "Full Name", ru: "Полное имя", uz: "To'liq ism" })} *</label>
                    <input
                      type="text" required
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      placeholder={t({ en: "Your name", ru: "Ваше имя", uz: "Ismingiz" })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t({ en: "Email", ru: "Email", uz: "Email" })} *</label>
                    <input
                      type="email" required
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      placeholder={t({ en: "your@email.com", ru: "ваш@email.com", uz: "sizning@email.com" })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t({ en: "Phone", ru: "Телефон", uz: "Telefon" })}</label>
                    <input
                      type="tel"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      placeholder="+998 90 000 00 00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t({ en: "Message", ru: "Сообщение", uz: "Xabar" })} *</label>
                    <textarea
                      required rows={5}
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                      placeholder={t({ en: "Tell us about your EV charging needs...", ru: "Расскажите нам о ваших потребностях в зарядке ЭВ...", uz: "EV zaryadlash ehtiyojlaringiz haqida bizga ayting..." })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="w-full py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {submitContact.isPending
                      ? t({ en: "Sending...", ru: "Отправка...", uz: "Yuborilmoqda..." })
                      : t({ en: "Send Message", ru: "Отправить", uz: "Yuborish" })}
                  </button>
                </form>
              )}
            </LiquidGlass>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
