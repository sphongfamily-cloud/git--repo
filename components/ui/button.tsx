import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "ghost";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
};

export function Button({ variant, className = "", ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition";
  const variantClass = variant ? variantStyles[variant] : "bg-slate-900 text-white hover:bg-slate-800";

  return <button type="button" className={`${baseStyles} ${variantClass} ${className}`} {...props} />;
}
