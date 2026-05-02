import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "garden" | "highlight";
  glow?: "green" | "pink" | "purple" | "none";
  hover?: boolean;
}

/**
 * Styled card container with glass morphism and glow variants.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", glow = "none", hover = false, children, ...props }, ref) => {
    const base = "rounded-2xl transition-all duration-300";

    const variants = {
      default: "bg-aura-card border border-aura-border",
      glass: "glass",
      garden: "bg-gradient-to-br from-garden-500/10 to-bloom-pink/10 border border-garden-400/20",
      highlight: "bg-gradient-to-br from-aura-card to-aura-muted border border-aura-border",
    };

    const glows = {
      none: "",
      green: "shadow-glow-green",
      pink: "shadow-glow-pink",
      purple: "shadow-glow-purple",
    };

    const hoverClass = hover ? "hover:-translate-y-1 hover:shadow-lg cursor-pointer" : "";

    return (
      <div
        ref={ref}
        className={cn(base, variants[variant], glows[glow], hoverClass, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-semibold text-gray-400 uppercase tracking-wider", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
