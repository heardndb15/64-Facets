"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check, Sparkles, X, Star, Shield, Zap } from "lucide-react";
import { Button } from "./button";

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl glass shadow-glow-green rounded-3xl border border-garden-400/30 overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-garden-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-bloom-lavender/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header Area */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-aura-card/50 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left Column (Info) */}
              <div className="p-8 md:w-5/12 border-b md:border-b-0 md:border-r border-aura-border bg-aura-card/30">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-garden-400/30 text-xs text-garden-400 mb-6 font-medium">
                  <Crown size={14} /> Aura Premium
                </div>
                
                <h2 className="text-3xl font-display font-bold text-white leading-tight mb-4">
                  Unlock the <br />
                  <span className="gradient-text-garden">Grandmaster</span> Mind.
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Elevate your cognitive training with deep AI analysis, exclusive biomes, and limitless insights.
                </p>

                <div className="mb-6">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold text-white">$9.99</span>
                    <span className="text-gray-500 mb-1">/ mo</span>
                  </div>
                  <p className="text-xs text-gray-500 line-through">Usually $14.99</p>
                </div>

                <Button variant="garden" size="lg" className="w-full relative group overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles size={16} /> Upgrade Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-garden-400 to-bloom-pink opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
                <p className="text-[10px] text-gray-500 text-center mt-3">Cancel anytime. Secure payment via Stripe.</p>
              </div>

              {/* Right Column (Features) */}
              <div className="p-8 md:w-7/12">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
                  What&#39;s included
                </h3>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Zap className="text-bloom-sun" size={20} />, 
                      title: "Unlimited Deep Analysis", 
                      desc: "Stockfish 16 + Gemini review every single blunder."
                    },
                    {
                      icon: <Star className="text-garden-400" size={20} />, 
                      title: "Exclusive Pro Biomes", 
                      desc: "Sakura, Cyberpunk and Zen Garden piece sets and boards."
                    },
                    {
                      icon: <Shield className="text-bloom-lavender" size={20} />, 
                      title: "Cognitive AI Coach", 
                      desc: "Custom personas (Aggressive, Zen Master) for post-match debriefs."
                    }
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-aura-card/50 border border-aura-border flex items-center justify-center shrink-0">
                        {feat.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm mb-1">{feat.title}</h4>
                        <p className="text-xs text-gray-400">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Micro animation to show off */}
                <div className="mt-8 p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-garden-400/20 flex items-center justify-center animate-pulse">
                     <Crown className="text-garden-400" size={14} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white">Join 1,200+ Grandmasters</h5>
                    <div className="flex -space-x-2 mt-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border border-aura-bg bg-aura-muted flex items-center justify-center text-[8px]">
                          ♟
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
