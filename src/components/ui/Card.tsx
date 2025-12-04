import React from "react";

export const Card = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-xl border border-chessio-border bg-chessio-card text-chessio-text shadow-sm dark:border-chessio-border-dark dark:bg-chessio-card-dark dark:text-chessio-text-dark ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
