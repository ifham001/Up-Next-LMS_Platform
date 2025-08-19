import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded font-medium transition-all duration-150 active:scale-95 focus:outline-none";
  const variantStyles = {
    primary:
      "bg-[var(--color-brand)] text-[#F9FAFB] hover:opacity-90",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-[var(--color-border)] border-1",
  };

  return (
    <button
      className={`${baseStyles} cursor-pointer ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
