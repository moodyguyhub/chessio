import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none rounded-lg tracking-tight";
    
    const variants = {
      primary: "bg-chessio-primary text-slate-950 hover:bg-chessio-primary-dark hover:scale-[1.02] focus:ring-chessio-primary/50 font-bold shadow-md hover:shadow-lg",
      secondary: "bg-chessio-surface-dark border-2 border-chessio-border-dark text-white hover:bg-chessio-card-dark hover:border-white/20 font-medium",
      ghost: "bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 font-medium",
      outline: "border-2 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
