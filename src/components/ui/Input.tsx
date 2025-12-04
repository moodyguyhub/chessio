import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-chessio-text dark:text-chessio-text-dark"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`flex h-10 w-full rounded-lg border border-chessio-border bg-transparent px-3 py-2 text-sm text-chessio-text placeholder:text-chessio-muted focus:outline-none focus:ring-2 focus:ring-chessio-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-chessio-border-dark dark:text-chessio-text-dark dark:placeholder:text-chessio-muted-dark dark:focus:ring-chessio-primary-dark ${
            error ? "border-chessio-danger focus:ring-chessio-danger" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-chessio-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
