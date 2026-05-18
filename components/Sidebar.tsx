"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { label: "요약 대시보드", href: "/" },
  { label: "기관현황", href: "/organization" },
  { label: "직원 및 조직현황", href: "/staff" },
  { label: "주요 사업현황", href: "/projects" },
  { label: "창업지원·투자현황", href: "/investment" },
  { label: "제규정 및 운영지침", href: "/regulations" },
  { label: "현안 및 의사결정", href: "/issues" },
  { label: "100일 로드맵", href: "/roadmap" },
  { label: "자료 열람", href: "/documents" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col flex-shrink-0">
      <div className="h-32 flex flex-col items-center justify-center gap-3 px-4 bg-slate-900 border-b border-slate-700">
        <div className="w-full rounded-lg bg-white px-3 py-2 shadow-sm">
          <Image
            src="/cbcci-logo.jpg"
            alt="충북창조경제혁신센터 로고"
            width={205}
            height={36}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
        <p className="w-full text-center text-xs font-semibold text-slate-300 tracking-wide">
          대표이사 업무보고
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {menus.map((menu) => {
          const active =
            pathname === menu.href ||
            (menu.href !== "/" && pathname.startsWith(menu.href));

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                active
                  ? "bg-blue-600 text-white font-medium"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              <span className="w-5 text-center">{active ? "▦" : "•"}</span>
              <span>{menu.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <p className="text-xs text-slate-400">데이터 기준일</p>
        <p className="text-sm font-medium">2025.05.19 (월)</p>
      </div>
    </aside>
  );
}
