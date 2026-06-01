import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, animate } from "framer-motion";
import { useI18n } from "@/lib/i18n";

type Phase =
  | "idle"
  | "extending"
  | "approaching"
  | "plugging"
  | "plugged"
  | "charging"
  | "unplugging"
  | "retracting";

// Key anchor points in the 900×480 SVG coordinate space
const STATION_PORT = { x: 692, y: 308 };   // cable exits station here
const HANG_POS     = { x: 688, y: 466 };   // connector hangs here when idle
const CAR_PORT     = { x: 494, y: 252 };   // charge port on the car

function buildCablePath(cx: number, cy: number, phase: Phase): string {
  const { x: sx, y: sy } = STATION_PORT;

  if (phase === "idle" || phase === "retracting") {
    // Natural droop – connector hangs below station
    return `M ${sx} ${sy} C ${sx + 6} ${sy + 80} ${cx + 8} ${cy - 60} ${cx} ${cy}`;
  }
  // Extended toward the car: cable droops in the middle
  const droop = 130;
  const midX = (sx + cx) / 2 + 30;
  const midY = Math.max(sy, cy) + droop;
  return `M ${sx} ${sy} C ${midX} ${midY} ${cx + 50} ${cy + 90} ${cx} ${cy}`;
}

export function InteractiveCarDemo() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("idle");
  const [cableD, setCableD] = useState<string>(
    buildCablePath(HANG_POS.x, HANG_POS.y, "idle")
  );
  const [battery, setBattery] = useState(18);
  const [portOpen, setPortOpen] = useState(false);
  const [showSnap, setShowSnap] = useState(false);

  const cx = useMotionValue(HANG_POS.x);
  const cy = useMotionValue(HANG_POS.y);

  // Keep cable path in sync with connector position
  const phaseRef = useRef<Phase>("idle");
  useMotionValueEvent(cx, "change", (x) =>
    setCableD(buildCablePath(x, cy.get(), phaseRef.current))
  );
  useMotionValueEvent(cy, "change", (y) =>
    setCableD(buildCablePath(cx.get(), y, phaseRef.current))
  );

  const setPhaseSync = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  // The full animation loop
  useEffect(() => {
    let cancelled = false;
    const seq = async () => {
      while (!cancelled) {
        // ── IDLE: rest 2 s ─────────────────────────────────────────
        setPhaseSync("idle");
        setBattery(18);
        setPortOpen(false);
        cx.set(HANG_POS.x); cy.set(HANG_POS.y);
        await sleep(2000);
        if (cancelled) break;

        // ── EXTENDING: swing up and start moving toward car ─────────
        setPhaseSync("extending");
        setPortOpen(true);
        await Promise.all([
          animate(cx, HANG_POS.x - 60, { duration: 1.0, ease: "easeIn" }),
          animate(cy, HANG_POS.y - 120, { duration: 1.0, ease: "easeIn" }),
        ]);
        if (cancelled) break;

        // ── APPROACHING: travel to car port ────────────────────────
        setPhaseSync("approaching");
        await Promise.all([
          animate(cx, CAR_PORT.x + 18, { duration: 1.6, ease: [0.4, 0, 0.2, 1] }),
          animate(cy, CAR_PORT.y + 8,  { duration: 1.6, ease: [0.4, 0, 0.2, 1] }),
        ]);
        if (cancelled) break;

        // ── PLUGGING: snap into port ────────────────────────────────
        setPhaseSync("plugging");
        setShowSnap(true);
        // Snap motion: slight recoil then lock
        await animate(cx, CAR_PORT.x, { duration: 0.12, ease: "easeOut" });
        await animate(cy, CAR_PORT.y, { duration: 0.12, ease: "easeOut" });
        await animate(cx, CAR_PORT.x + 4, { duration: 0.08 });
        await animate(cx, CAR_PORT.x, { duration: 0.12 });
        await sleep(200);
        setShowSnap(false);
        if (cancelled) break;

        // ── CHARGING: fill battery ──────────────────────────────────
        setPhaseSync("charging");
        const start = Date.now();
        const chargeDur = 5200;
        while (Date.now() - start < chargeDur && !cancelled) {
          const pct = Math.min(100, 18 + 82 * ((Date.now() - start) / chargeDur));
          setBattery(Math.round(pct));
          await sleep(60);
        }
        setBattery(100);
        await sleep(600);
        if (cancelled) break;

        // ── UNPLUGGING: pull back ───────────────────────────────────
        setPhaseSync("unplugging");
        setPortOpen(false);
        // Slight outward jerk before retract
        await Promise.all([
          animate(cx, CAR_PORT.x + 28, { duration: 0.18, ease: "easeOut" }),
          animate(cy, CAR_PORT.y - 6,  { duration: 0.18, ease: "easeOut" }),
        ]);
        await sleep(200);
        if (cancelled) break;

        // ── RETRACTING: connector returns to station ────────────────
        setPhaseSync("retracting");
        await Promise.all([
          animate(cx, HANG_POS.x, { duration: 2.0, ease: [0.4, 0, 0.6, 1] }),
          animate(cy, HANG_POS.y, { duration: 2.0, ease: [0.4, 0, 0.6, 1] }),
        ]);
        if (cancelled) break;

        // settle bounce
        await animate(cy, HANG_POS.y - 12, { duration: 0.2 });
        await animate(cy, HANG_POS.y,      { duration: 0.25 });
        await animate(cy, HANG_POS.y - 5,  { duration: 0.15 });
        await animate(cy, HANG_POS.y,      { duration: 0.18 });
        await sleep(500);
      }
    };
    seq();
    return () => { cancelled = true; };
  }, []);

  const isCharging  = phase === "charging";
  const isPlugged   = phase === "plugging" || phase === "charging" || phase === "unplugging";
  const stationLed  = isCharging ? "#22d3ee" : portOpen ? "#facc15" : "#4ade80";


  return (
    <div className="relative w-full max-w-4xl mx-auto select-none">
      {/* Status label */}
      <div className="flex justify-center mb-4">
        <div
          className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-500"
          style={{
            background: isCharging
              ? "linear-gradient(90deg,#0ea5e9,#38bdf8)"
              : "rgba(241,245,249,0.8)",
            color: isCharging ? "#fff" : "#64748b",
            boxShadow: isCharging ? "0 0 20px rgba(56,189,248,0.4)" : "none",
          }}
        >
          {isCharging
            ? t({ en: `Charging… ${battery}%`, ru: `Зарядка… ${battery}%`, uz: `Zaryadlanmoqda… ${battery}%` })
            : phase === "plugging" || phase === "plugged"
            ? t({ en: "Connected", ru: "Подключено", uz: "Ulangan" })
            : phase === "unplugging"
            ? t({ en: "Disconnecting", ru: "Отключение", uz: "Uzilmoqda" })
            : phase === "retracting"
            ? t({ en: "Cable retracting", ru: "Кабель убирается", uz: "Kabel qaytmoqda" })
            : t({ en: "Ready to charge", ru: "Готово к зарядке", uz: "Zaryadlashga tayyor" })}
        </div>
      </div>

      {/* Main SVG scene */}
      <svg
        viewBox="0 0 900 480"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full rounded-3xl"
        style={{ filter: "drop-shadow(0 8px 40px rgba(14,165,233,0.12))" }}
      >
        <defs>
          {/* Background gradient */}
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="60%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          {/* Wall gradient */}
          <linearGradient id="wall" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          {/* Car body gradient */}
          <linearGradient id="carGrad" x1="0%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#d4d4d4" />
            <stop offset="40%" stopColor="#e8e8e8" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          {/* Window gradient */}
          <linearGradient id="winGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.6" />
          </linearGradient>
          {/* Wheel gradient */}
          <radialGradient id="wheelGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#111827" />
          </radialGradient>
          {/* Station gradient */}
          <linearGradient id="stGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          {/* Charging glow */}
          <radialGradient id="portGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
          {/* Cable gradient */}
          <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="carClip">
            <rect x="0" y="0" width="560" height="480" />
          </clipPath>
        </defs>

        {/* ── BACKGROUND ─────────────────────────────────────────── */}
        <rect width="900" height="480" fill="url(#bg)" />

        {/* Wall on the right */}
        <rect x="600" y="0" width="300" height="480" fill="url(#wall)" />

        {/* Wall tiles */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={i} x1="600" y1={i*70} x2="900" y2={i*70} stroke="#c8d4e0" strokeWidth="1" />
        ))}
        {[600,660,720,780,840,900].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="480" stroke="#c8d4e0" strokeWidth="1" />
        ))}

        {/* Floor */}
        <rect x="0" y="390" width="600" height="90" fill="#b0bec5" opacity="0.35" rx="0" />
        <line x1="0" y1="390" x2="600" y2="390" stroke="#94a3b8" strokeWidth="2" />

        {/* Floor shadow under car */}
        <ellipse cx="290" cy="392" rx="220" ry="14" fill="#475569" opacity="0.18" />

        {/* ── CAR ────────────────────────────────────────────────── */}
        <g clipPath="url(#carClip)">
          {/* Rear underbody / bumper bottom */}
          <rect x="424" y="354" width="102" height="38" rx="8" fill="#9ca3af" />

          {/* Car body main shape (SUV, faces LEFT, rear on right side) */}
          <path
            d="
              M 68 354
              L 68 318
              C 68 295 82 280 100 274
              L 135 210
              C 148 178 172 155 210 146
              L 378 136
              C 416 134 444 148 462 175
              L 476 220
              L 490 268
              L 524 354
              Z
            "
            fill="url(#carGrad)"
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* Front bumper / hood lower */}
          <path d="M 68 318 C 55 318 44 330 42 354 L 68 354 Z" fill="#b8bec7" />

          {/* Body side detail line */}
          <path
            d="M 90 298 C 150 290 350 280 470 275"
            fill="none" stroke="#c8cdd6" strokeWidth="2" opacity="0.6"
          />

          {/* Roof rack detail */}
          <rect x="210" y="132" width="200" height="6" rx="3" fill="#d1d5db" />
          <rect x="220" y="130" width="8" height="10" rx="2" fill="#9ca3af" />
          <rect x="390" y="130" width="8" height="10" rx="2" fill="#9ca3af" />

          {/* Rear window (right side) */}
          <path
            d="M 456 178 L 475 230 L 440 232 L 428 180 Z"
            fill="url(#winGrad)"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />

          {/* Main window / greenhouse */}
          <path
            d="M 208 150 L 418 142 L 428 180 L 210 188 Z"
            fill="url(#winGrad)"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />

          {/* Front window (left) */}
          <path
            d="M 135 215 L 192 195 L 210 188 L 208 150 L 148 182 Z"
            fill="url(#winGrad)"
            stroke="#93c5fd"
            strokeWidth="1.5"
          />

          {/* B-pillar */}
          <rect x="416" y="141" width="14" height="50" fill="#94a3b8" />

          {/* Front pillar */}
          <path d="M 136 214 L 150 155 L 160 153 L 148 215 Z" fill="#94a3b8" />

          {/* Taillight (right side / rear) */}
          <rect x="512" y="270" width="14" height="62" rx="4" fill="#f87171" opacity="0.8" />
          <rect x="514" y="272" width="10" height="28" rx="3" fill="#fca5a5" />
          <rect x="514" y="304" width="10" height="26" rx="3" fill="#ef4444" opacity="0.9" />

          {/* Tailllight chrome trim */}
          <rect x="510" y="268" width="18" height="66" rx="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />

          {/* Headlight (left side, front) */}
          <path d="M 42 300 C 50 290 65 285 75 290 L 75 320 C 65 325 50 325 42 318 Z"
            fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />

          {/* Front grille area */}
          <path d="M 42 318 L 42 354 L 68 354 L 68 320 Z" fill="#6b7280" opacity="0.6" />

          {/* Mirror (left / front) */}
          <ellipse cx="76" cy="278" rx="14" ry="8" fill="#b0b8c4" />
          <rect x="62" y="276" width="4" height="12" fill="#9ca3af" />

          {/* Mirror (rear / right) */}
          <ellipse cx="498" cy="232" rx="14" ry="8" fill="#b0b8c4" />
          <rect x="512" y="230" width="4" height="12" fill="#9ca3af" />

          {/* Door handles */}
          <rect x="270" y="254" width="32" height="8" rx="4" fill="#a8b2bc" stroke="#94a3b8" strokeWidth="1" />
          <rect x="390" y="250" width="28" height="8" rx="4" fill="#a8b2bc" stroke="#94a3b8" strokeWidth="1" />

          {/* Door seam lines */}
          <line x1="248" y1="195" x2="248" y2="354" stroke="#9ca3af" strokeWidth="2" opacity="0.4" />
          <line x1="380" y1="191" x2="376" y2="354" stroke="#9ca3af" strokeWidth="2" opacity="0.4" />

          {/* CHARGE PORT AREA ─────────────────────── */}
          {/* Port housing on rear of car */}
          <rect x="483" y="240" width="32" height="28" rx="5" fill="#6b7280" />
          <rect x="485" y="242" width="28" height="24" rx="4" fill="#374151" />

          {/* Port flap - opens when portOpen */}
          <motion.rect
            x={485} y={242} width={28} height={24} rx={4}
            fill="#9ca3af"
            stroke="#6b7280"
            strokeWidth="1"
            style={{ transformOrigin: "485px 254px" }}
            animate={{ scaleX: portOpen ? 0 : 1, opacity: portOpen ? 0 : 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />

          {/* Port socket (visible when open) */}
          <circle cx="499" cy="254" r="9" fill="#1f2937" />
          <circle cx="499" cy="254" r="6" fill="#111827" />
          {/* Type 2 pin arrangement */}
          <circle cx="496" cy="251" r="1.5" fill="#6b7280" />
          <circle cx="502" cy="251" r="1.5" fill="#6b7280" />
          <circle cx="499" cy="256" r="1.5" fill="#6b7280" />
          <circle cx="494" cy="256" r="1.5" fill="#6b7280" />
          <circle cx="504" cy="256" r="1.5" fill="#6b7280" />

          {/* Port glow when plugged */}
          {isPlugged && (
            <motion.circle
              cx={499} cy={254} r={22}
              fill="url(#portGlow)"
              initial={{ opacity: 0, r: 10 }}
              animate={{ opacity: isCharging ? [0.6, 1, 0.6] : 0.8, r: isCharging ? [20, 28, 20] : 22 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              filter="url(#softGlow)"
            />
          )}

          {/* Snap flash when plugging */}
          {showSnap && (
            <motion.circle
              cx={499} cy={254} r={16}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              initial={{ r: 8, opacity: 1 }}
              animate={{ r: 30, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Wheel arch front */}
          <path
            d="M 88 354 C 88 308 136 278 186 278 C 236 278 284 308 284 354 Z"
            fill="#374151"
            stroke="#1f2937"
            strokeWidth="2"
          />
          {/* Front wheel */}
          <circle cx="186" cy="368" r="52" fill="url(#wheelGrad)" />
          <circle cx="186" cy="368" r="38" fill="#1f2937" stroke="#374151" strokeWidth="2" />
          <circle cx="186" cy="368" r="18" fill="#4b5563" />
          <circle cx="186" cy="368" r="10" fill="#374151" />
          {/* Spokes */}
          {[0,60,120,180,240,300].map(a => (
            <line key={a}
              x1={186 + 14*Math.cos(a*Math.PI/180)} y1={368 + 14*Math.sin(a*Math.PI/180)}
              x2={186 + 36*Math.cos(a*Math.PI/180)} y2={368 + 36*Math.sin(a*Math.PI/180)}
              stroke="#6b7280" strokeWidth="4" strokeLinecap="round"
            />
          ))}
          <circle cx="186" cy="368" r="7" fill="#9ca3af" />

          {/* Wheel arch rear */}
          <path
            d="M 342 354 C 342 308 390 278 440 278 C 490 278 538 308 538 354 Z"
            fill="#374151"
            stroke="#1f2937"
            strokeWidth="2"
          />
          {/* Rear wheel */}
          <circle cx="440" cy="368" r="52" fill="url(#wheelGrad)" />
          <circle cx="440" cy="368" r="38" fill="#1f2937" stroke="#374151" strokeWidth="2" />
          <circle cx="440" cy="368" r="18" fill="#4b5563" />
          <circle cx="440" cy="368" r="10" fill="#374151" />
          {[0,60,120,180,240,300].map(a => (
            <line key={a}
              x1={440 + 14*Math.cos(a*Math.PI/180)} y1={368 + 14*Math.sin(a*Math.PI/180)}
              x2={440 + 36*Math.cos(a*Math.PI/180)} y2={368 + 36*Math.sin(a*Math.PI/180)}
              stroke="#6b7280" strokeWidth="4" strokeLinecap="round"
            />
          ))}
          <circle cx="440" cy="368" r="7" fill="#9ca3af" />

          {/* Rocker panel */}
          <rect x="90" y="350" width="434" height="12" rx="3" fill="#9ca3af" opacity="0.7" />
        </g>

        {/* ── WALL CHARGER STATION ────────────────────────────────── */}
        {/* Mount bracket */}
        <rect x="648" y="148" width="12" height="220" rx="4" fill="#94a3b8" />

        {/* Main station body */}
        <rect x="660" y="148" width="112" height="190" rx="14" fill="url(#stGrad)" stroke="#cbd5e1" strokeWidth="2" />

        {/* Branding stripe */}
        <rect x="660" y="148" width="112" height="30" rx="14" fill="#0ea5e9" />
        <rect x="660" y="162" width="112" height="16" fill="#0ea5e9" />
        <text x="716" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" letterSpacing="2">EVLTE</text>

        {/* Display screen */}
        <rect x="674" y="190" width="86" height="58" rx="6" fill="#0f172a" />
        <rect x="676" y="192" width="82" height="54" rx="5" fill="#0f1f3d" />

        {/* Screen readout */}
        <text x="717" y="210" textAnchor="middle" fontSize="8" fill="#38bdf8" opacity="0.6">kW OUTPUT</text>
        <motion.text
          x={717} y={228} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#38bdf8"
          animate={{ opacity: isCharging ? [0.7, 1, 0.7] : 0.4 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isCharging ? "7.0" : "---"}
        </motion.text>
        <text x="717" y="240" textAnchor="middle" fontSize="7" fill="#38bdf8" opacity="0.5">kW</text>

        {/* Status bar on screen */}
        <rect x="682" y="244" width="70" height="4" rx="2" fill="#1e3a5f" />
        <rect x="682" y="244" width={Math.max(2, 70 * battery / 100)} height="4" rx="2" fill="#0ea5e9" />

        {/* Button row */}
        <circle cx="686" cy="268" r="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="704" cy="268" r="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="722" cy="268" r="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

        {/* Status LED */}
        <motion.circle
          cx={748} cy={268} r={7}
          fill={stationLed}
          animate={{
            opacity: isCharging ? [0.6, 1, 0.6] : 1,
            filter: isCharging ? ["drop-shadow(0 0 4px #38bdf8)", "drop-shadow(0 0 10px #38bdf8)", "drop-shadow(0 0 4px #38bdf8)"] : "none"
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* Cable anchor ring on station */}
        <circle cx={STATION_PORT.x} cy={STATION_PORT.y} r="10" fill="#374151" stroke="#1f2937" strokeWidth="2" />
        <circle cx={STATION_PORT.x} cy={STATION_PORT.y} r="5"  fill="#1f2937" />

        {/* Station bottom detail */}
        <rect x="670" y="320" width="92" height="18" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="676" y="326" width="20" height="6" rx="2" fill="#94a3b8" />
        <rect x="704" y="326" width="20" height="6" rx="2" fill="#94a3b8" />
        <rect x="732" y="326" width="20" height="6" rx="2" fill="#94a3b8" />

        {/* ── CABLE ──────────────────────────────────────────────── */}
        {/* Cable shadow */}
        <motion.path
          d={cableD}
          fill="none"
          stroke="#374151"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.2"
          style={{ transform: "translate(3px, 4px)" }}
        />

        {/* Main cable */}
        <motion.path
          d={cableD}
          fill="none"
          stroke="#1f2937"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Cable sheath highlight */}
        <motion.path
          d={cableD}
          fill="none"
          stroke="#374151"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Energy pulse (charging only) */}
        {isCharging && (
          <motion.path
            d={cableD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="18 28"
            animate={{ strokeDashoffset: [80, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            opacity="0.85"
            filter="url(#glow)"
          />
        )}

        {/* Secondary pulse */}
        {isCharging && (
          <motion.path
            d={cableD}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 38"
            animate={{ strokeDashoffset: [80, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear", delay: 0.45 }}
            opacity="0.6"
          />
        )}

        {/* ── CONNECTOR ──────────────────────────────────────────── */}
        <motion.g style={{ x: cx, y: cy }} >
          {/* Connector body */}
          <rect x="-14" y="-22" width="28" height="44" rx="8" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />

          {/* Connector face (front) */}
          <rect x="-11" y="-8" width="22" height="26" rx="5" fill="#111827" />

          {/* Type 2 pin layout */}
          {/* Top row */}
          <circle cx="-5" cy="-2" r="3" fill="#374151" stroke="#4b5563" strokeWidth="1" />
          <circle cx="5"  cy="-2" r="3" fill="#374151" stroke="#4b5563" strokeWidth="1" />
          {/* Middle */}
          <circle cx="0"  cy="6"  r="3" fill="#374151" stroke="#4b5563" strokeWidth="1" />
          {/* Bottom row */}
          <circle cx="-7" cy="14" r="2.5" fill="#374151" stroke="#4b5563" strokeWidth="1" />
          <circle cx="7"  cy="14" r="2.5" fill="#374151" stroke="#4b5563" strokeWidth="1" />

          {/* Handle grip lines */}
          <rect x="-11" y="-20" width="22" height="4" rx="2" fill="#374151" />
          <rect x="-8"  y="-18" width="3"  height="2" rx="1" fill="#4b5563" />
          <rect x="-2"  y="-18" width="3"  height="2" rx="1" fill="#4b5563" />
          <rect x="4"   y="-18" width="3"  height="2" rx="1" fill="#4b5563" />

          {/* Release button */}
          <rect x="-5" y="20" width="10" height="5" rx="2.5" fill="#374151" />

          {/* LED on connector */}
          <motion.circle
            cx={0} cy={-14} r={3}
            fill={isCharging ? "#38bdf8" : isPlugged ? "#4ade80" : "#6b7280"}
            animate={{ opacity: isCharging ? [0.5, 1, 0.5] : 1 }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* Connector glow when charging */}
          {isCharging && (
            <motion.circle
              cx={0} cy={0} r={24}
              fill="url(#portGlow)"
              animate={{ opacity: [0.3, 0.6, 0.3], r: [20, 30, 20] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}
        </motion.g>

        {/* ── BATTERY HUD ────────────────────────────────────────── */}
        <g transform="translate(30, 30)">
          <rect width="120" height="42" rx="10" fill="white" opacity="0.85" />
          <rect width="120" height="42" rx="10" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          <text x="10" y="16" fontSize="9" fill="#64748b" fontWeight="600">BATTERY</text>
          <rect x="10" y="22" width="86" height="10" rx="5" fill="#e2e8f0" />
          <rect
            x={10} y={22}
            width={Math.max(2, 86 * battery / 100)} height={10} rx={5}
            fill={battery > 80 ? "#22c55e" : battery > 40 ? "#0ea5e9" : "#f59e0b"}
          />
          {/* Battery terminal nub */}
          <rect x="96" y="25" width="6" height="4" rx="1" fill="#cbd5e1" />
          <text x="108" y="33" fontSize="10" fill="#0f172a" fontWeight="700">{battery}%</text>
        </g>
      </svg>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}
