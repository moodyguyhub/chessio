import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
    
    const variants = {
      primary: "bg-chessio-primary text-white hover:bg-indigo-700 dark:bg-chessio-primary-dark dark:hover:bg-indigo-600 focus:ring-chessio-primary",
      secondary: "bg-transparent border border-chessio-border text-chessio-text hover:bg-slate-100 dark:border-chessio-border-dark dark:text-chessio-text-dark dark:hover:bg-slate-800",
      ghost: "bg-transparent text-chessio-text hover:bg-slate-100 dark:text-chessio-text-dark dark:hover:bg-slate-800",
      destructive: "bg-chessio-danger text-white hover:bg-red-700 focus:ring-red-500",
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
