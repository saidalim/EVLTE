import React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function LiquidGlass({ children, className, ...props }: LiquidGlassProps) {
  return (
    <div
      className={cn(
        "bg-white/15 dark:bg-primary/5 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/30 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
