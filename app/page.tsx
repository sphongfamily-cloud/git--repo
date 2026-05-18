"use client";

import React from "react";

export default function ExecutiveBriefingHome() {
  const kpis = [
    { title: "총예산", value: "1,248", unit: "억원", icon: "💰", change: "▼ 2.3%" },
    { title: "운영사업 수", value: "42", unit: "개", icon: "📋", change: "▲ 7.7%" },
    { title: "지원기업 수", value: "2,186", unit: "개사", icon: "👥", change: "▲ 12.4%" },
    { title: "투자/후속투자액", value: "823", unit: "억원", icon: "📈", change: "▲ 18.6%" },
    { title: "임직원 현황", value: "312", unit: "명", icon: "👤", change: "▲ 3.3%" },
    { title: "긴급 현안", value: "3", unit: "건", icon: "🔔", change: "▲ 1" },
    { title: "의사결정 필요", value: "5", unit: "건", icon: "⚖️", change: "▲ 2" },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">
            요약 대시보드
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                  {kpi.icon}
                </div>

                <span className="text-xs text-slate-500 font-medium">
                  {kpi.title}
                </span>
              </div>

              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-slate-900">
                  {kpi.value}
                </span>

                <span className="text-sm text-slate-500 mb-1">
                  {kpi.unit}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-slate-400">
                  전년 대비
                </span>

                <span className="text-xs font-semibold text-green-600">
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">
                사업 현황 요약
              </h3>

              <button className="border rounded-lg px-3 py-1 text-sm">
                전체 사업 ▾
              </button>
            </div>

            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 rounded-full border-[18px] border-green-500 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-slate-500">총</p>
                  <p className="text-4xl font-bold">42개</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                ["정상 추진", "21", "50.0%", "bg-green-500"],
                ["일부 지연", "12", "28.6%", "bg-blue-500"],
                ["지연", "6", "14.3%", "bg-yellow-500"],
                ["기타/대기", "3", "7.1%", "bg-slate-300"],
              ].map(([label, count, percent, color]) => (
                <div
                  key={label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />

                    <span className="text-sm">
                      {label}
                    </span>
                  </div>

                  <span className="text-sm text-slate-500">
                    {count} ({percent})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">
                최근 업데이트
              </h3>

              <button className="text-sm text-slate-500">
                더보기 ›
              </button>
            </div>

            <div className="space-y-4">
              {[
                "2025년 창업패키지 지원사업 공고",
                "혁신펀드 3호 결성 완료",
                "2025년 제1차 이사회 개최 결과",
                "조직개편(안) 수립 및 의견수렴",
                "지역 창업허브 운영현황",
              ].map((item) => (
                <div
                  key={item}
                  className="border-b pb-3"
                >
                  <p className="font-medium text-sm">
                    {item}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    2025.05.19
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">
                현안 TOP 5
              </h3>

              <button className="text-sm text-slate-500">
                더보기 ›
              </button>
            </div>

            <div className="space-y-4">
              {[
                "혁신펀드 4호 결성 추진",
                "본사 이전 타당성 검토",
                "추가경정예산 편성",
                "성과평가 체계 개편",
                "정보보안 관리체계 고도화",
              ].map((item, idx) => (
                <div
                  key={item}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>

                    <span className="text-sm font-medium">
                      {item}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    ~ 05.{23 + idx}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}