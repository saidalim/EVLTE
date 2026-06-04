import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const WHATSAPP_NUMBER = "998901234567";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function WhatsAppButton() {
  const { t } = useI18n();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg whitespace-nowrap pointer-events-none select-none"
          >
            {t({ en: "Chat on WhatsApp", ru: "Написать в WhatsApp", uz: "WhatsApp yozish" })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl"
        style={{ background: "#25D366" }}
      >
        {/* Pulse rings */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "#25D366" }}
          animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "#25D366" }}
          animate={{ scale: [1, 1.38], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
        />

        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 relative z-10"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.002 3C9.374 3 4 8.373 4 15c0 2.385.67 4.613 1.832 6.512L4 29l7.695-1.803A12.94 12.94 0 0 0 16.002 28C22.629 28 28 22.627 28 16S22.629 3 16.002 3Zm0 2c5.514 0 9.998 4.486 9.998 10S21.516 25 16.002 25c-1.916 0-3.7-.543-5.217-1.48l-.374-.231-4.568 1.07 1.098-4.454-.246-.39A9.95 9.95 0 0 1 6 15c0-5.514 4.484-10 10.002-10Zm-3.07 5.5c-.22 0-.576.082-.879.41-.302.328-1.155 1.13-1.155 2.754s1.182 3.196 1.347 3.418c.165.22 2.305 3.685 5.676 5.02 2.812 1.111 3.374.89 3.983.834.607-.055 1.96-.803 2.236-1.577.276-.772.276-1.433.193-1.57-.082-.137-.303-.22-.633-.385-.33-.165-1.96-.968-2.263-1.078-.302-.11-.522-.165-.742.165-.22.33-.853 1.078-1.045 1.298-.193.22-.385.247-.715.083-.33-.165-1.392-.513-2.651-1.637-.98-.875-1.64-1.953-1.833-2.283-.193-.33-.02-.508.145-.673.149-.148.33-.385.495-.578.165-.192.22-.33.33-.55.11-.22.055-.413-.028-.578-.082-.165-.728-1.8-1.023-2.455-.22-.496-.446-.51-.66-.518a8.5 8.5 0 0 0-.578-.02Z"/>
        </svg>
      </motion.a>
    </div>
  );
}
