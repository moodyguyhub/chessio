/**
 * Chessio Brand v1.1 - Reusable UI Components
 * Based on Tailwind tokens (neutral/amber palette - Ink & Ivory)
 */

import React from "react";
import Link from "next/link";

/* ========================================
   CARD COMPONENTS
   ======================================== */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BrandCard = ({ className = "", children, ...props }: CardProps) => (
  <div
    className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-6 shadow-md ${className}`}
    {...props}
  >
    {children}
  </div>
);

/* ========================================
   BUTTON COMPONENTS
   ======================================== */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const BrandButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "rounded-full bg-amber-300 text-neutral-950 shadow-md hover:bg-amber-200 hover:shadow-lg",
      secondary: "rounded-full border border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-900/60",
      ghost: "text-neutral-300 hover:text-neutral-50 hover:bg-neutral-900/40",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
BrandButton.displayName = "BrandButton";

/* ========================================
   LINK BUTTON (for Next.js Links)
   ======================================== */

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const BrandLinkButton = ({ 
  className = "", 
  children, 
  href, 
  variant = "primary", 
  size = "md",
  ...props 
}: LinkButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition";
  
  const variants = {
    primary: "rounded-full bg-amber-300 text-neutral-950 shadow-md hover:bg-amber-200 hover:shadow-lg",
    secondary: "rounded-full border border-neutral-700 bg-transparent text-neutral-200 hover:bg-neutral-900/60",
    ghost: "text-neutral-300 hover:text-neutral-50 hover:bg-neutral-900/40",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

/* ========================================
   TAG / PILL COMPONENT
   ======================================== */

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BrandTag = ({ className = "", children, ...props }: TagProps) => (
  <div
    className={`inline-flex items-center rounded-full bg-neutral-900/80 border border-neutral-700 px-3 py-1 text-xs text-neutral-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

/* ========================================
   SECTION CONTAINER
   ======================================== */

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const BrandSection = ({ className = "", children, ...props }: SectionProps) => (
  <section
    className={`bg-neutral-900/30 backdrop-blur-sm border-y border-white/5 ${className}`}
    {...props}
  >
    {children}
  </section>
);
