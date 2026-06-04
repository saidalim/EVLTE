import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
