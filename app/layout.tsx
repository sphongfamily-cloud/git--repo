import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "충북창조경제혁신센터 업무보고 포털",
  description: "충북창조경제혁신센터 내부 업무보고 포털",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-700">
          <Sidebar />

          <main className="flex-1 flex flex-col overflow-hidden">
            <Header />

            <section className="flex-1 overflow-auto p-6">{children}</section>
          </main>
        </div>
      </body>
    </html>
  );
}
