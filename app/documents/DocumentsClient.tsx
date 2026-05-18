"use client";

import { useMemo, useState } from "react";

export type DocumentItem = {
  id: number;
  title: string;
  category: string;
  type: string;
  size: string;
  date: string;
  owner: string;
};

type DocumentsClientProps = {
  initialDocuments: DocumentItem[];
};

export default function DocumentsClient({
  initialDocuments,
}: DocumentsClientProps) {
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return initialDocuments;
    }

    return initialDocuments.filter((doc) =>
      doc.title.toLowerCase().includes(normalizedKeyword)
    );
  }, [initialDocuments, keyword]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">자료 열람</h2>
          <p className="text-sm text-slate-500 mt-2">
            이사회, 규정, 사업, 투자, 현안 관련 자료를 조회합니다.
          </p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          자료 등록
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex gap-3">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="자료명을 검색하세요"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm"
          />

          <button className="border border-slate-300 rounded-lg px-4 py-2 text-sm">
            검색
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-5 py-3 text-left">자료명</th>
              <th className="px-5 py-3">구분</th>
              <th className="px-5 py-3">파일형식</th>
              <th className="px-5 py-3">용량</th>
              <th className="px-5 py-3">등록일</th>
              <th className="px-5 py-3">담당부서</th>
              <th className="px-5 py-3">보기</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {doc.title}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">{doc.type}</td>
                  <td className="px-5 py-4 text-center text-slate-500">
                    {doc.size}
                  </td>
                  <td className="px-5 py-4 text-center text-slate-500">
                    {doc.date}
                  </td>
                  <td className="px-5 py-4 text-center">{doc.owner}</td>
                  <td className="px-5 py-4 text-center">
                    <button className="text-blue-600 font-medium">열람</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  표시할 자료가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
