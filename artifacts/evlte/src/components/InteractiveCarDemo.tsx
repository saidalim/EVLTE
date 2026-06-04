import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

// Three real scene photos — each represents one interaction state
import imgIdle      from "@/assets/ev-idle.jpg";       // port closed, cable at station
import imgPortOpen  from "@/assets/ev-port-open.jpg";  // port open, cable at station
import imgPlugged   from "@/assets/ev-plugged.jpg";    // connected & charging

// ─── Tap-zone anchors in 1000 × 667 SVG space ───────────────────────────────
// Calibrated against the real photo content
const PORT    = { x: 278, y: 318 };   // charge port on car (left rear quarter)
const CHARGER = { x: 722, y: 218 };   // wall charger unit centre

type UIState = "idle" | "port_open" | "connected";

// Which photo to show for each state
const PHOTO: Record<UIState, string> = {
  idle:      imgIdle,
  port_open: imgPortOpen,
  connected: imgPlugged,
};

// Hint ring component — two staggered expanding rings
function HintRings({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <>
      {[0, 0.55].map((delay, i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy}
          fill={`${color}22`}
          stroke={color}
          strokeWidth="2.5"
          initial={{ r: 28, opacity: 0.95 }}
          animate={{ r: 64, opacity: 0 }}
          transition={{ duration: 1.55, repeat: Infinity, ease: "easeOut", delay }}
        />
      ))}
    </>
  );
}

// Floating label pill above an anchor point
function Label({ cx, cy, text, bg }: { cx: number; cy: number; text: string; bg: string }) {
  const w = 156, h = 32, r = 16;
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.25 }}>
      <rect x={cx - w / 2} y={cy - 78} width={w} height={h} rx={r} fill={bg} />
      <text
        x={cx} y={cy - 56}
        textAnchor="middle"
        fontSize="13.5"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="white"
      >
        {text}
      </text>
    </motion.g>
  );
}

export function InteractiveCarDemo() {
  const { t } = useI18n();
  const [state, setState] = useState<UIState>("idle");
  const [busy, setBusy]   = useState(false);
  const [flash, setFlash] = useState(false);

  const transition = (next: UIState, delayMs = 0) => {
    setBusy(true);
    setTimeout(() => {
      setState(next);
      setBusy(false);
    }, delayMs);
  };

  const handlePortTap = () => {
    if (busy) return;
    if (state === "idle")      transition("port_open", 120);
    else if (state === "port_open") transition("idle",  120);
    // port taps ignored while connected
  };

  const handleChargerTap = () => {
    if (busy) return;
    if (state === "port_open") {
      // plug in — brief flash on connect
      transition("connected", 150);
      setTimeout(() => { setFlash(true);  }, 160);
      setTimeout(() => { setFlash(false); }, 600);
    } else if (state === "connected") {
      transition("port_open", 150);
    }
  };

  const portTappable    = !busy && (state === "idle" || state === "port_open");
  const chargerTappable = !busy && (state === "port_open" || state === "connected");

  return (
    <div
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl select-none"
      style={{ aspectRatio: "3 / 2" }}
    >
      {/* ── Crossfading photos ─────────────────────────────────── */}
      {(["idle", "port_open", "connected"] as UIState[]).map((s) => (
        <motion.img
          key={s}
          src={PHOTO[s]}
          alt={s}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
          animate={{ opacity: state === s ? 1 : 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{ zIndex: state === s ? 1 : 0 }}
        />
      ))}

      {/* ── Connect flash ─────────────────────────────────────── */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10, background: "rgba(56,189,248,0.28)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* ── SVG interactive overlay ────────────────────────────── */}
      <svg
        viewBox="0 0 1000 667"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 20, touchAction: "none" }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ════════════════════════════════════════════════════════
            PORT TAP ZONE + HINTS
        ════════════════════════════════════════════════════════ */}
        <g
          onClick={handlePortTap}
          style={{ cursor: portTappable ? "pointer" : "default" }}
        >
          {/* Invisible generous hit area */}
          <ellipse cx={PORT.x} cy={PORT.y} rx="72" ry="66" fill="transparent" />

          {/* Hint rings — IDLE: tap to open */}
          <AnimatePresence>
            {state === "idle" && !busy && (
              <motion.g key="idle-port-rings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HintRings cx={PORT.x} cy={PORT.y} color="rgba(255,255,255,0.95)" />
                <Label
                  cx={PORT.x} cy={PORT.y}
                  text={t({ en: "👆 Tap to open port", ru: "👆 Открыть порт", uz: "👆 Portni ochish" })}
                  bg="rgba(0,0,0,0.68)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Hint rings — PORT_OPEN: tap to close */}
          <AnimatePresence>
            {state === "port_open" && !busy && (
              <motion.g key="open-port-rings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HintRings cx={PORT.x} cy={PORT.y} color="rgba(250,204,21,0.95)" />
                <Label
                  cx={PORT.x} cy={PORT.y}
                  text={t({ en: "👆 Tap to close port", ru: "👆 Закрыть порт", uz: "👆 Portni yopish" })}
                  bg="rgba(161,122,0,0.82)"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </g>

        {/* ════════════════════════════════════════════════════════
            CHARGER TAP ZONE + HINTS
        ════════════════════════════════════════════════════════ */}
        <g
          onClick={handleChargerTap}
          style={{ cursor: chargerTappable ? "pointer" : "default" }}
        >
          {/* Invisible hit area covers the charger box */}
          <rect x={CHARGER.x - 90} y={CHARGER.y - 110} width="180" height="260" rx="16" fill="transparent" />

          {/* Hint rings — PORT_OPEN: tap to plug in */}
          <AnimatePresence>
            {state === "port_open" && !busy && (
              <motion.g key="plug-rings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HintRings cx={CHARGER.x} cy={CHARGER.y} color="rgba(56,189,248,0.95)" />
                <Label
                  cx={CHARGER.x} cy={CHARGER.y}
                  text={t({ en: "👆 Tap to plug in", ru: "👆 Подключить", uz: "👆 Ulash" })}
                  bg="rgba(14,165,233,0.9)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Hint rings — CONNECTED: tap to unplug */}
          <AnimatePresence>
            {state === "connected" && !busy && (
              <motion.g key="unplug-rings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HintRings cx={CHARGER.x} cy={CHARGER.y} color="rgba(248,113,113,0.95)" />
                <Label
                  cx={CHARGER.x} cy={CHARGER.y}
                  text={t({ en: "👆 Tap to unplug", ru: "👆 Отключить", uz: "👆 Uzish" })}
                  bg="rgba(220,38,38,0.88)"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Charger glow when actively charging */}
          {state === "connected" && (
            <motion.rect
              x={CHARGER.x - 56} y={CHARGER.y - 96}
              width="112" height="196" rx="16"
              fill="rgba(56,189,248,0.07)"
              stroke="rgba(56,189,248,0.35)"
              strokeWidth="2"
              filter="url(#glow)"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </g>

        {/* ════════════════════════════════════════════════════════
            ENERGY PULSES ON CABLE (connected state)
        ════════════════════════════════════════════════════════ */}
        {state === "connected" && (
          <>
            {/* Cable path from charger to car port */}
            <motion.path
              d={`M ${CHARGER.x - 30} ${CHARGER.y + 110} C 540 560 390 530 ${PORT.x + 10} ${PORT.y + 8}`}
              fill="none"
              stroke="rgba(56,189,248,0.9)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="22 34"
              filter="url(#glow)"
              initial={{ strokeDashoffset: 120 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d={`M ${CHARGER.x - 30} ${CHARGER.y + 110} C 540 560 390 530 ${PORT.x + 10} ${PORT.y + 8}`}
              fill="none"
              stroke="rgba(186,230,253,0.7)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10 46"
              initial={{ strokeDashoffset: 120 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear", delay: 0.45 }}
            />
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            STATUS BADGE — top left
        ════════════════════════════════════════════════════════ */}
        <g>
          <rect x="16" y="16" width="168" height="42" rx="21" fill="rgba(0,0,0,0.58)" />
          <motion.circle
            cx="42" cy="37" r="9"
            fill={
              state === "connected"  ? "#22c55e" :
              state === "port_open"  ? "#facc15" : "#64748b"
            }
            animate={{
              scale:   state === "connected" ? [0.88, 1.14, 0.88] : 1,
              opacity: state === "connected" ? [0.55, 1,    0.55] : 1,
            }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
          <text
            x="60" y="43"
            fontSize="14"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
            fill="white"
          >
            {state === "connected"
              ? t({ en: "⚡ Charging", ru: "⚡ Зарядка",     uz: "⚡ Zaryadlanmoqda" })
              : state === "port_open"
              ? t({ en: "Port Open",   ru: "Порт открыт",    uz: "Port ochiq" })
              : t({ en: "Ready",       ru: "Готово",          uz: "Tayyor" })}
          </text>
        </g>
      </svg>
    </div>
  );
}
