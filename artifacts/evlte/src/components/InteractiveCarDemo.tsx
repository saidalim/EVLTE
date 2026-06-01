import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import carSideUrl from "@/assets/car-side.png";

type State = "initial" | "port_open" | "charging";

export function InteractiveCarDemo() {
  const { t } = useI18n();
  const [state, setState] = useState<State>("initial");

  const handlePortClick = () => {
    if (state === "initial") setState("port_open");
    if (state === "port_open") setState("initial"); // Allow closing if unplugged
  };

  const handleChargerClick = () => {
    if (state === "port_open") setState("charging");
    if (state === "charging") setState("port_open");
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] bg-secondary/30 rounded-3xl overflow-hidden flex items-center justify-center border border-border p-8 shadow-inner">
      <div className="relative w-full max-w-2xl aspect-[2/1] flex items-center">
        
        {/* Car Image */}
        <motion.img 
          src={carSideUrl} 
          alt="EV Car" 
          className="absolute right-0 w-3/4 object-contain z-10"
        />

        {/* Port Area on Car (Positioned relative to car image approx) */}
        <div className="absolute right-[20%] top-[45%] z-20">
          <motion.div 
            className="w-12 h-12 relative flex items-center justify-center cursor-pointer"
            onClick={handlePortClick}
          >
            {/* Port Flap */}
            <motion.div 
              className="absolute inset-0 bg-white border border-border rounded-md shadow-sm origin-left"
              animate={{ rotateY: state === "initial" ? 0 : -100 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
            
            {/* Port Socket (Behind Flap) */}
            <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-4 h-4 rounded-full bg-gray-600 grid grid-cols-2 gap-1 p-0.5">
                <div className="bg-gray-400 rounded-full w-1 h-1"/>
                <div className="bg-gray-400 rounded-full w-1 h-1"/>
                <div className="bg-gray-400 rounded-full w-1 h-1"/>
                <div className="bg-gray-400 rounded-full w-1 h-1"/>
              </div>
            </div>

            {/* Tap Indicator for Port */}
            <AnimatePresence>
              {state === "initial" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                >
                  <div className="bg-primary text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap mb-1 shadow-md">
                    {t({ en: "Tap", ru: "Нажмите", uz: "Bosing" })}
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-8 h-8 rounded-full border-2 border-primary absolute top-6"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Charger Unit & Cable */}
        <div className="absolute left-[10%] bottom-[10%] flex flex-col items-center z-30">
          <div className="w-16 h-48 bg-white border border-border rounded-xl shadow-lg flex flex-col items-center pt-4 relative overflow-hidden">
            {/* Screen */}
            <div className="w-10 h-16 bg-gray-900 rounded border border-gray-700 mb-2 flex items-center justify-center">
               <motion.div 
                 className="text-primary text-xs font-mono"
                 animate={{ opacity: state === "charging" ? [0.5, 1, 0.5] : 0.2 }}
                 transition={{ repeat: Infinity, duration: 2 }}
               >
                 {state === "charging" ? "7.0kW" : "RDY"}
               </motion.div>
            </div>
            {/* Base detail */}
            <div className="w-12 h-1 bg-gray-200 mt-auto mb-4 rounded-full"/>
            <div className="absolute bottom-0 w-full h-8 bg-blue-50/50 border-t border-border"/>
          </div>

          {/* Cable & Plug wrapper - moving part */}
          <motion.div 
            className="absolute top-8 left-16 cursor-pointer"
            animate={{ 
              x: state === "charging" ? 220 : 0, 
              y: state === "charging" ? -40 : 0,
              rotate: state === "charging" ? 0 : 20
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            onClick={handleChargerClick}
          >
            {/* Plug Head */}
            <div className="w-16 h-8 bg-gray-800 rounded-r-full rounded-l-md relative z-10 flex items-center justify-end px-2 border-b-2 border-gray-900 shadow-md">
              <div className="w-4 h-4 bg-gray-700 rounded-full border border-gray-600"/>
              {/* Cable visual connecting back to unit */}
              <svg className="absolute right-full top-1/2 -translate-y-1/2 w-64 h-32 overflow-visible -z-10" style={{ pointerEvents: 'none' }}>
                 <motion.path 
                   d={`M 0 0 C -50 50, -100 ${state === "charging" ? 100 : 50}, -200 ${state === "charging" ? 50 : 20}`}
                   fill="none" 
                   stroke="#1e293b" 
                   strokeWidth="8"
                   strokeLinecap="round"
                 />
                 {/* Energy flow effect */}
                 {state === "charging" && (
                   <motion.path 
                     d={`M 0 0 C -50 50, -100 100, -200 50`}
                     fill="none" 
                     stroke="#3B9EFF" 
                     strokeWidth="4"
                     strokeDasharray="10 20"
                     animate={{ strokeDashoffset: [30, 0] }}
                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                   />
                 )}
              </svg>
            </div>

            {/* Tap Indicator for Charger */}
            <AnimatePresence>
              {state === "port_open" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                >
                  <div className="bg-primary text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap mb-1 shadow-md">
                    {t({ en: "Tap", ru: "Нажмите", uz: "Bosing" })}
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-8 h-8 rounded-full border-2 border-primary absolute top-6"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Ambient Glow when charging */}
        <AnimatePresence>
          {state === "charging" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute right-[20%] top-[45%] w-32 h-32 bg-primary/30 blur-3xl rounded-full pointer-events-none"
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
