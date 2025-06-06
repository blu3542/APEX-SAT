// src/components/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  ...rest
}) => {
  const base = "px-4 py-2 rounded font-medium transition";
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed",
    secondary:
      "bg-emerald-500 hover:bg-emerald-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...rest}>
      {children}
    </button>
  );
};
