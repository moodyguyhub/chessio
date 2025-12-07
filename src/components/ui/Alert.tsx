import * as React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles = "relative w-full rounded-lg border p-4";
    const variantStyles = variant === "destructive"
      ? "border-red-500/50 bg-red-500/10 text-red-400"
      : "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";

    return (
      <div
        ref={ref}
        role="alert"
        className={`${baseStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";
