"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "./button";
import { useUser } from "@/context/UserContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginLocal, registerLocal } = useUser();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }
    
    // Basic local simulation loading
    try {
      if (isRegister) {
        await registerLocal(email, password);
      } else {
        await loginLocal(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
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
            className="relative w-full max-w-md glass shadow-glow-green rounded-3xl border border-garden-400/30 overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-garden-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-bloom-lavender/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-aura-card/50 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-8 pb-6">
              <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                {isRegister ? <UserPlus className="text-garden-400" size={24} /> : <LogIn className="text-garden-400" size={24} />}
                {isRegister ? "Регистрация" : "Вход"}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {isRegister 
                  ? "Создайте аккаунт и сохраняйте свой прогресс локально." 
                  : "Войдите, чтобы продолжить тренировки."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 pb-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="player@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-aura-border focus:border-garden-400 focus:ring-1 focus:ring-garden-400 focus:outline-none text-white text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pb-2">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Пароль</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-aura-border focus:border-garden-400 focus:ring-1 focus:ring-garden-400 focus:outline-none text-white text-sm transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-bloom-pink text-xs px-1 font-medium bg-bloom-pink/10 border border-bloom-pink/20 py-2 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="pt-2">
                  <Button variant="garden" size="lg" className="w-full relative shadow-glow-green" type="submit">
                    {isRegister ? "Зарегистрироваться" : "Войти"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="bg-aura-muted/30 border-t border-aura-border p-4 text-center">
              <button 
                onClick={() => { setIsRegister(!isRegister); setError(""); }}
                className="text-sm text-gray-400 hover:text-garden-400 transition-colors inline-block"
                type="button"
              >
                {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
