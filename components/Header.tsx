"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const editableResources: Record<string, string> = {
  "/organization": "/api/organization",
  "/staff": "/api/staff",
  "/projects": "/api/projects",
  "/investment": "/api/investment",
  "/regulations": "/api/regulations",
  "/issues": "/api/issues",
  "/roadmap": "/api/roadmap",
  "/documents": "/api/documents",
};

export default function Header() {
  const pathname = usePathname();
  const resource = editableResources[pathname];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <button className="text-slate-500 text-xl">☰</button>

      <div className="flex items-center gap-4">
        {resource ? (
          <Link
            href={`${pathname}?edit=1`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            수정
          </Link>
        ) : null}

        <button className="border border-slate-300 rounded-md px-3 py-1.5 text-sm hover:bg-slate-50">
          기준일: 2025.05.19 (월)
        </button>

        <div className="relative text-xl">
          🔔
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        <div className="flex items-center gap-2 pl-3 border-l">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            👤
          </div>
          <span className="text-sm font-medium">대표이사</span>
          <span className="text-xs">▾</span>
        </div>
      </div>
    </header>
  );
}
