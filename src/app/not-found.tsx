"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sword } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center"
      style={{ background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(74,222,128,0.06) 0%, transparent 60%), #0f1117" }}
    >
      <div className="space-y-2">
        <p className="text-8xl font-display font-bold gradient-text-garden">404</p>
        <h1 className="text-2xl font-semibold text-white">Page not found</h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          This square is empty. Return to the board and play on.
        </p>
      </div>
      <div className="text-6xl animate-float select-none">♟️</div>
      <Link href="/">
        <Button variant="primary">
          <Sword size={16} />
          Back to Aura Chess
        </Button>
      </Link>
    </main>
  );
}
