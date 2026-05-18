import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return <div className={className}>{children}</div>;
}

export function CardContent({ className = "", children }: CardProps) {
  return <div className={className}>{children}</div>;
}
