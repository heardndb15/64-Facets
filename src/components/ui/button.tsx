import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "garden";
  size?: "sm" | "md" | "lg";
}

/**
 * Reusable Button component with themed variants.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-aura-bg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary:
        "bg-gradient-to-r from-garden-400 to-garden-500 text-gray-900 hover:from-garden-300 hover:to-garden-400 focus:ring-garden-400 shadow-glow-green hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      secondary:
        "bg-aura-card border border-aura-border text-white hover:bg-aura-muted focus:ring-aura-border hover:border-garden-400/30 hover:-translate-y-0.5 active:translate-y-0",
      ghost:
        "text-gray-400 hover:text-white hover:bg-aura-muted focus:ring-aura-border rounded-lg",
      danger:
        "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:ring-red-500",
      garden:
        "bg-gradient-to-r from-bloom-pink via-bloom-lavender to-bloom-mint text-gray-900 hover:opacity-90 focus:ring-bloom-pink shadow-glow-pink hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
