import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "secondary";
}

export const Badge = ({ className = "", variant = "default", ...props }: BadgeProps) => {
  const variants = {
    default: "bg-chessio-primary/10 text-chessio-primary dark:bg-chessio-primary-dark/20 dark:text-chessio-primary-dark",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    secondary: "bg-slate-700 text-slate-200 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};
