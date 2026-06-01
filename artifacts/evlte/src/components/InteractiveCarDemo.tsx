import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, animate } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import evScene from "@/assets/ev-scene.jpg";

// ─── Anchor points in 1000×667 SVG space (matching photo proportions) ───────
// These mark precise locations on the photo
const PORT   = { x: 268, y: 318 };  // EV charge port on car
const CHARGER_CENTER = { x: 738, y: 230 };  // Wall charger unit center
const CABLE_EXIT = { x: 664, y: 392 }; // Where cable exits the charger
const HANG = { x: 650, y: 462 };    // Connector hanging idle at station

type UIState = "idle" | "port_open" | "connected";

function buildPath(cx: number, cy: number): string {
  // Single cubic bezier from cable exit to connector position – always same structure
  if (Math.abs(cx - HANG.x) < 10 && Math.abs(cy - HANG.y) < 10) {
    // Short idle droop
    return `M ${CABLE_EXIT.x} ${CABLE_EXIT.y} C ${CABLE_EXIT.x + 10} ${CABLE_EXIT.y + 45} ${cx + 8} ${cy - 28} ${cx} ${cy}`;
  }
  // Extended toward car – natural ground droop
  const midX = CABLE_EXIT.x * 0.42 + cx * 0.58;
  const midY = Math.max(CABLE_EXIT.y, cy) + 135;
  return `M ${CABLE_EXIT.x} ${CABLE_EXIT.y} C ${midX + 30} ${midY} ${cx + 55} ${cy + 80} ${cx} ${cy}`;
}

export function InteractiveCarDemo() {
  const { t } = useI18n();
  const [uiState, setUiState] = useState<UIState>("idle");
  const [busy, setBusy] = useState(false);
  const [cableD, setCableD] = useState(() => buildPath(HANG.x, HANG.y));
  const [showHint, setShowHint] = useState(true);

  // MotionValues drive the connector position and the cable path in sync
  const cx = useMotionValue(HANG.x);
  const cy = useMotionValue(HANG.y);

  const phaseRef = useRef<UIState>("idle");

  useMotionValueEvent(cx, "change", (x) => setCableD(buildPath(x, cy.get())));
  useMotionValueEvent(cy, "change", (y) => setCableD(buildPath(cx.get(), y)));

  // Pulsing hint timer – hide after first interaction
  const hideHint = () => setShowHint(false);

  // ── Port tap handler ─────────────────────────────────────────────────────
  const handlePortTap = () => {
    if (busy) return;
    hideHint();

    if (uiState === "idle") {
      // Open port
      setBusy(true);
      setTimeout(() => { setUiState("port_open"); setBusy(false); }, 400);
    } else if (uiState === "port_open") {
      // Close port (only if not connected)
      setBusy(true);
      setTimeout(() => { setUiState("idle"); setBusy(false); }, 400);
    }
  };

  // ── Charger tap handler ──────────────────────────────────────────────────
  const handleChargerTap = async () => {
    if (busy) return;
    hideHint();

    if (uiState === "port_open") {
      // Plug in: connector travels from station to car port
      setBusy(true);
      phaseRef.current = "connected";
      // Lift up first, then swing toward car
      await Promise.all([
        animate(cx, HANG.x - 40, { duration: 0.5, ease: "easeIn" }),
        animate(cy, HANG.y - 80, { duration: 0.5, ease: "easeIn" }),
      ]);
      await Promise.all([
        animate(cx, PORT.x + 18, { duration: 1.2, ease: [0.4, 0, 0.2, 1] }),
        animate(cy, PORT.y + 10,  { duration: 1.2, ease: [0.4, 0, 0.2, 1] }),
      ]);
      // Snap in
      await animate(cx, PORT.x, { duration: 0.1, ease: "easeOut" });
      await animate(cy, PORT.y, { duration: 0.1, ease: "easeOut" });
      await animate(cx, PORT.x + 5, { duration: 0.07 });
      await animate(cx, PORT.x, { duration: 0.1 });
      setUiState("connected");
      setBusy(false);

    } else if (uiState === "connected") {
      // Unplug: connector travels from car port back to station
      setBusy(true);
      phaseRef.current = "port_open";
      // Pull back
      await animate(cx, PORT.x + 30, { duration: 0.2, ease: "easeOut" });
      await animate(cy, PORT.y - 8,  { duration: 0.2, ease: "easeOut" });
      // Swing back
      await Promise.all([
        animate(cx, HANG.x - 40, { duration: 1.0, ease: [0.4, 0, 0.6, 1] }),
        animate(cy, HANG.y - 80, { duration: 1.0, ease: [0.4, 0, 0.6, 1] }),
      ]);
      await Promise.all([
        animate(cx, HANG.x, { duration: 0.55, ease: "easeIn" }),
        animate(cy, HANG.y, { duration: 0.55, ease: "easeIn" }),
      ]);
      // Settle bounce
      await animate(cy, HANG.y - 14, { duration: 0.18 });
      await animate(cy, HANG.y,      { duration: 0.22 });
      await animate(cy, HANG.y - 6,  { duration: 0.14 });
      await animate(cy, HANG.y,      { duration: 0.16 });
      setUiState("port_open");
      setBusy(false);
    }
  };

  const isConnected = uiState === "connected";
  const portOpen    = uiState === "port_open" || uiState === "connected";

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl select-none">

      {/* ── Base photo ─────────────────────────────────────────── */}
      <img
        src={evScene}
        alt="EV Charging Scene"
        className="w-full block pointer-events-none"
        draggable={false}
      />

      {/* ── Interactive SVG overlay ─────────────────────────────── */}
      <svg
        viewBox="0 0 1000 667"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: "none" }}
      >
        <defs>
          <radialGradient id="portGlowRad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── CABLE ────────────────────────────────────────────── */}
        {/* Shadow */}
        <path d={cableD} fill="none" stroke="#0a0a0a" strokeWidth="15" strokeLinecap="round" opacity="0.45" />
        {/* Main sheath */}
        <path d={cableD} fill="none" stroke="#1c1c1e" strokeWidth="12" strokeLinecap="round" />
        {/* Highlight */}
        <path d={cableD} fill="none" stroke="#3a3a3a" strokeWidth="7"  strokeLinecap="round" opacity="0.55" />

        {/* Energy pulses */}
        {isConnected && (
          <>
            <motion.path
              d={cableD} fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round"
              strokeDasharray="22 32"
              animate={{ strokeDashoffset: [110, 0] }}
              transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
              opacity="0.95" filter="url(#glow2)"
            />
            <motion.path
              d={cableD} fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="10 44"
              animate={{ strokeDashoffset: [110, 0] }}
              transition={{ duration: 0.85, repeat: Infinity, ease: "linear", delay: 0.42 }}
              opacity="0.7"
            />
          </>
        )}

        {/* ── CONNECTOR ────────────────────────────────────────── */}
        <motion.g style={{ x: cx, y: cy }}>
          {/* Body */}
          <rect x="-15" y="-24" width="30" height="48" rx="9" fill="#1c1c1e" stroke="#3a3a3a" strokeWidth="1.5" />
          {/* Socket face */}
          <rect x="-12" y="-10" width="24" height="30" rx="5" fill="#111" />
          {/* Type-2 pins */}
          <circle cx="-4.5" cy="-3" r="3.2" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
          <circle cx="4.5"  cy="-3" r="3.2" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
          <circle cx="0"    cy="5.5" r="3.2" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
          <circle cx="-6.5" cy="14" r="2.8" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
          <circle cx="6.5"  cy="14" r="2.8" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
          {/* Grip ridge */}
          <rect x="-12" y="-22" width="24" height="5" rx="2.5" fill="#333" />
          {/* Status LED */}
          <motion.circle
            cx="0" cy="-18" r="3.5"
            fill={isConnected ? "#38bdf8" : portOpen ? "#facc15" : "#4b5563"}
            animate={{ opacity: isConnected ? [0.4, 1, 0.4] : 1, scale: isConnected ? [0.9, 1.1, 0.9] : 1 }}
            transition={{ duration: 0.9, repeat: Infinity }}
            style={{ transformOrigin: "0px -18px" }}
          />
          {/* Charging glow around connector */}
          {isConnected && (
            <motion.circle
              cx="0" cy="0" r="26"
              fill="url(#portGlowRad)"
              animate={{ r: [20, 34, 20], opacity: [0.3, 0.65, 0.3] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.g>

        {/* ── PORT FLAP ON CAR ─────────────────────────────────── */}
        {/* Port surround */}
        <motion.g
          style={{ cursor: !busy && (uiState === "idle" || uiState === "port_open") ? "pointer" : "default" }}
          onClick={handlePortTap}
        >
          {/* Dark port socket housing (always visible) */}
          <ellipse cx={PORT.x} cy={PORT.y} rx="22" ry="20" fill="#111" stroke="#333" strokeWidth="2" />
          <ellipse cx={PORT.x} cy={PORT.y} rx="16" ry="15" fill="#0a0a0a" />

          {/* Port cover flap – scales down from top hinge */}
          <motion.rect
            x={PORT.x - 21} y={PORT.y - 19}
            width="42" height="38" rx="10"
            fill="#b4bbc5"
            stroke="#8f9aa5"
            strokeWidth="2"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            animate={portOpen ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          {/* Flap hinge line detail */}
          {!portOpen && (
            <line x1={PORT.x - 16} y1={PORT.y - 4} x2={PORT.x + 16} y2={PORT.y - 4} stroke="#9ca3af" strokeWidth="1.5" opacity="0.6" />
          )}

          {/* Port glow ring when open */}
          {portOpen && !isConnected && (
            <motion.ellipse
              cx={PORT.x} cy={PORT.y} rx="20" ry="18"
              fill="none"
              stroke="#facc15"
              strokeWidth="2"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {/* Connection glow when plugged */}
          {isConnected && (
            <motion.ellipse
              cx={PORT.x} cy={PORT.y} rx="24" ry="22"
              fill="rgba(56,189,248,0.25)"
              stroke="#38bdf8"
              strokeWidth="2"
              animate={{ rx: [20, 28, 20], ry: [18, 26, 18], opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          {/* Invisible expanded tap zone */}
          <ellipse cx={PORT.x} cy={PORT.y} rx="60" ry="55" fill="transparent" />
        </motion.g>

        {/* ── CHARGER TAP ZONE ─────────────────────────────────── */}
        <g
          onClick={handleChargerTap}
          style={{ cursor: !busy && (uiState === "port_open" || uiState === "connected") ? "pointer" : "default" }}
        >
          {/* Charger LED glow */}
          {isConnected && (
            <motion.rect
              x={CHARGER_CENTER.x - 42} y={CHARGER_CENTER.y - 90}
              width="84" height="180" rx="16"
              fill="rgba(56,189,248,0.08)"
              stroke="rgba(56,189,248,0.25)"
              strokeWidth="2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
          {/* Invisible tap area */}
          <rect x={CHARGER_CENTER.x - 80} y={CHARGER_CENTER.y - 110} width="160" height="250" fill="transparent" />
        </g>

        {/* ── TAP HINT RINGS ───────────────────────────────────── */}

        {/* Port hint (show when idle) */}
        <AnimatePresence>
          {uiState === "idle" && !busy && (
            <motion.g key="port-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              {[0, 0.55].map((delay) => (
                <motion.circle key={delay}
                  cx={PORT.x} cy={PORT.y} r={28}
                  fill="rgba(255,255,255,0.15)"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="2"
                  initial={{ r: 26, opacity: 0.9 }}
                  animate={{ r: 58, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay }}
                />
              ))}
              {/* Label pill */}
              <rect x={PORT.x - 68} y={PORT.y - 74} width="136" height="30" rx="15" fill="rgba(0,0,0,0.65)" />
              <text x={PORT.x} y={PORT.y - 52} textAnchor="middle" fontSize="13.5" fill="white" fontWeight="700" fontFamily="system-ui, sans-serif">
                {t({ en: "👆 Tap to open port", ru: "👆 Открыть порт", uz: "👆 Portni ochish" })}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Charger hint (show when port open) */}
        <AnimatePresence>
          {uiState === "port_open" && !busy && (
            <motion.g key="charger-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              {[0, 0.6].map((delay) => (
                <motion.circle key={delay}
                  cx={CHARGER_CENTER.x} cy={CHARGER_CENTER.y} r={36}
                  fill="rgba(56,189,248,0.12)"
                  stroke="rgba(56,189,248,0.95)"
                  strokeWidth="2"
                  initial={{ r: 36, opacity: 0.95 }}
                  animate={{ r: 72, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay }}
                />
              ))}
              {/* Close port hint at port too */}
              {[0, 0.7].map((delay) => (
                <motion.circle key={`p${delay}`}
                  cx={PORT.x} cy={PORT.y} r={22}
                  fill="rgba(251,191,36,0.1)"
                  stroke="rgba(251,191,36,0.7)"
                  strokeWidth="1.5"
                  initial={{ r: 22, opacity: 0.7 }}
                  animate={{ r: 44, opacity: 0 }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut", delay }}
                />
              ))}
              {/* Label on charger */}
              <rect x={CHARGER_CENTER.x - 72} y={CHARGER_CENTER.y - 130} width="144" height="32" rx="16" fill="rgba(14,165,233,0.9)" />
              <text x={CHARGER_CENTER.x} y={CHARGER_CENTER.y - 107} textAnchor="middle" fontSize="13.5" fill="white" fontWeight="700" fontFamily="system-ui, sans-serif">
                {t({ en: "👆 Tap to plug in", ru: "👆 Нажмите для подключения", uz: "👆 Ulash uchun bosing" })}
              </text>
              {/* Label on port */}
              <rect x={PORT.x - 64} y={PORT.y - 72} width="128" height="28" rx="14" fill="rgba(0,0,0,0.6)" />
              <text x={PORT.x} y={PORT.y - 51} textAnchor="middle" fontSize="12.5" fill="#fcd34d" fontWeight="600" fontFamily="system-ui, sans-serif">
                {t({ en: "👆 Tap to close port", ru: "👆 Закрыть порт", uz: "👆 Portni yopish" })}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Unplug hint (show when connected) */}
        <AnimatePresence>
          {uiState === "connected" && !busy && (
            <motion.g key="unplug-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
              {[0, 0.6].map((delay) => (
                <motion.circle key={delay}
                  cx={CHARGER_CENTER.x} cy={CHARGER_CENTER.y} r={36}
                  fill="rgba(248,113,113,0.08)"
                  stroke="rgba(248,113,113,0.85)"
                  strokeWidth="2"
                  initial={{ r: 36, opacity: 0.85 }}
                  animate={{ r: 70, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay }}
                />
              ))}
              <rect x={CHARGER_CENTER.x - 68} y={CHARGER_CENTER.y - 130} width="136" height="32" rx="16" fill="rgba(220,38,38,0.88)" />
              <text x={CHARGER_CENTER.x} y={CHARGER_CENTER.y - 107} textAnchor="middle" fontSize="13.5" fill="white" fontWeight="700" fontFamily="system-ui, sans-serif">
                {t({ en: "👆 Tap to unplug", ru: "👆 Отключить", uz: "👆 Uzish uchun bosing" })}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ── STATUS PILL ──────────────────────────────────────── */}
        <g>
          <rect x="16" y="16" width="160" height="40" rx="20" fill="rgba(0,0,0,0.6)" />
          <motion.circle
            cx="40" cy="36" r="8"
            fill={isConnected ? "#22c55e" : uiState === "port_open" ? "#facc15" : "#64748b"}
            animate={{ scale: isConnected ? [0.9, 1.15, 0.9] : 1, opacity: isConnected ? [0.6, 1, 0.6] : 1 }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
          <text x="56" y="41" fontSize="13.5" fill="white" fontWeight="700" fontFamily="system-ui, sans-serif">
            {isConnected
              ? t({ en: "⚡ Charging", ru: "⚡ Зарядка", uz: "⚡ Zaryadlanmoqda" })
              : uiState === "port_open"
              ? t({ en: "Port Open", ru: "Порт открыт", uz: "Port ochiq" })
              : t({ en: "Ready", ru: "Готово", uz: "Tayyor" })}
          </text>
        </g>
      </svg>
    </div>
  );
}
