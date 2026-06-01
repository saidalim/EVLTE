import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LiquidGlass } from "@/components/LiquidGlass";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const values = [
  {
    icon: "⚡",
    en: { title: "Reliability", desc: "Every charger we sell is tested to meet the highest standards of performance and safety." },
    ru: { title: "Надёжность", desc: "Каждое проданное нами зарядное устройство проверяется на соответствие высочайшим стандартам." },
    uz: { title: "Ishonchlilik", desc: "Biz sotadigan har bir zaryadlagich eng yuqori ishlash va xavfsizlik standartlariga javob beradi." },
  },
  {
    icon: "🌿",
    en: { title: "Sustainability", desc: "We believe in a cleaner future for Uzbekistan through zero-emission transportation." },
    ru: { title: "Устойчивость", desc: "Мы верим в более чистое будущее Узбекистана через транспорт с нулевым выбросом." },
    uz: { title: "Barqarorlik", desc: "Biz nol chiqindi transporti orqali O'zbekiston uchun toza kelajakka ishonamiz." },
  },
  {
    icon: "🤝",
    en: { title: "Customer First", desc: "Our team provides expert guidance for every step of your EV charging journey." },
    ru: { title: "Клиент прежде всего", desc: "Наша команда обеспечивает экспертное руководство на каждом этапе вашего пути к EV." },
    uz: { title: "Mijoz birinchi", desc: "Jamoamiz EV zaryadlash yo'lingizning har bir bosqichida mutaxassis ko'mak ko'rsatadi." },
  },
  {
    icon: "🔬",
    en: { title: "Innovation", desc: "We partner with the world's leading EV brands to bring the latest charging technology to Uzbekistan." },
    ru: { title: "Инновации", desc: "Мы сотрудничаем с ведущими мировыми брендами EV, чтобы внедрить новейшие технологии зарядки." },
    uz: { title: "Innovatsiya", desc: "Biz O'zbekistonga eng yangi zaryadlash texnologiyalarini olib kelish uchun jahonning yetakchi EV brendlari bilan hamkorlik qilamiz." },
  },
];

export function About() {
  const { lang, t } = useI18n();

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}>
            <p className="text-primary font-semibold tracking-widest uppercase text-sm mb-4">
              {t({ en: "About Us", ru: "О нас", uz: "Biz haqimizda" })}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              {t({ en: "Powering Uzbekistan's EV Future", ru: "Питаем будущее электромобилей Узбекистана", uz: "O'zbekistonning EV kelajagini quvvatlash" })}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t({
                en: "EVLTE was founded with a single mission: to make electric vehicle charging accessible, reliable, and easy for every driver in Uzbekistan.",
                ru: "EVLTE была основана с единственной миссией: сделать зарядку электромобилей доступной, надёжной и простой для каждого водителя в Узбекистане.",
                uz: "EVLTE bitta missiya bilan tashkil etilgan: O'zbekistondagi har bir haydovchi uchun elektromobil zaryadlashni qulay, ishonchli va oson qilish."
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="text-4xl font-bold mb-6">
              {t({ en: "Our Story", ru: "Наша история", uz: "Bizning tariximiz" })}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t({
                en: "As electric vehicles began arriving in Uzbekistan, we saw a gap: drivers needed reliable charging solutions that matched the quality of their vehicles. We set out to bridge that gap.",
                ru: "Когда электромобили начали появляться в Узбекистане, мы увидели пробел: водителям нужны надёжные решения для зарядки, соответствующие качеству их автомобилей.",
                uz: "Elektromobillar O'zbekistonga kela boshlaganda, biz bo'shliq ko'rdik: haydovchilar o'zlarining avtomobillari sifatiga mos ishonchli zaryadlash yechimlariga muhtoj edi."
              })}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t({
                en: "Today, EVLTE is the trusted name for EV charging equipment in Uzbekistan, offering chargers for BYD, Leapmotor, Li Xiang, Voyah, and more — from 1.5 kW to 7 kW.",
                ru: "Сегодня EVLTE — это надёжное имя для оборудования зарядки электромобилей в Узбекистане, предлагающее зарядные устройства для BYD, Leapmotor, Li Xiang, Voyah и других — от 1,5 до 7 кВт.",
                uz: "Bugun EVLTE O'zbekistonda EV zaryadlash uskunalari uchun ishonchli nom bo'lib, BYD, Leapmotor, Li Xiang, Voyah va boshqalar uchun 1,5 dan 7 kW gacha zaryadlagichlar taklif etadi."
              })}
            </p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <LiquidGlass className="rounded-3xl p-12 text-center">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-5xl font-bold text-primary mb-2">500+</div>
                  <div className="text-muted-foreground text-sm">{t({ en: "Chargers Installed", ru: "Установлено зарядных", uz: "O'rnatilgan zaryadlagichlar" })}</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-2">5</div>
                  <div className="text-muted-foreground text-sm">{t({ en: "EV Brands Supported", ru: "Поддерживаемых брендов", uz: "Qo'llab-quvvatlanadigan brendlar" })}</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-2">3</div>
                  <div className="text-muted-foreground text-sm">{t({ en: "Power Levels", ru: "Уровня мощности", uz: "Quvvat darajalari" })}</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-primary mb-2">2024</div>
                  <div className="text-muted-foreground text-sm">{t({ en: "Founded", ru: "Основана", uz: "Tashkil etilgan" })}</div>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            {t({ en: "Our Values", ru: "Наши ценности", uz: "Bizning qadriyatlarimiz" })}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const content = lang === "ru" ? v.ru : lang === "uz" ? v.uz : v.en;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <LiquidGlass className="rounded-2xl p-8 h-full">
                    <div className="text-4xl mb-4">{v.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{content.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{content.desc}</p>
                  </LiquidGlass>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
