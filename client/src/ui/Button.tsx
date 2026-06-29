import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-full " +
    "transition-colors duration-150 active:translate-y-[0.5px] cursor-pointer " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const variantStyles = {
    primary:
      "bg-brand text-text-inverted hover:bg-brand-light",
    secondary:
      "bg-surface text-text-primary border border-border-strong hover:bg-surface-muted",
    outline:
      "bg-transparent text-text-primary border border-border-strong hover:bg-surface-muted",
    ghost:
      "bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary",
    danger:
      "bg-error text-white hover:opacity-90",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
