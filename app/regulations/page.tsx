import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import { readDataFile } from "@/lib/data-store";

type Regulation = {
  id: number;
  name: string;
  category: string;
  revised: string;
  status: string;
  manager: string;
  color: string;
};

type RegulationsPayload = {
  regulations: Regulation[];
};

function categoryClass(color: string) {
  if (color === "red") return "bg-red-100 text-red-700";
  if (color === "blue") return "bg-blue-100 text-blue-700";
  if (color === "green") return "bg-green-100 text-green-700";
  if (color === "orange") return "bg-orange-100 text-orange-700";
  return "bg-yellow-100 text-yellow-700";
}

export default async function RegulationsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const data = await readDataFile<RegulationsPayload>("regulations.json");
  const summary = {
    total: data.regulations.length,
    operating: data.regulations.filter((item) => item.category.includes("운영"))
      .length,
    hr: data.regulations.filter((item) =>
      ["인사", "복무"].some((keyword) => item.category.includes(keyword))
    ).length,
    finance: data.regulations.filter((item) =>
      ["예산", "회계", "계약"].some((keyword) => item.category.includes(keyword))
    ).length,
  };

  return (
    <div className="space-y-6">
      {edit === "1" ? (
        <InlineEditOverlay
          data={data}
          description="규정 목록, 개정일, 담당부서"
          endpoint="/api/regulations"
          label="제규정 및 운영지침"
          returnPath="/regulations"
        />
      ) : null}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          정관 및 운영지침
        </h2>
        <p className="mt-2 text-slate-500">
          센터 운영에 필요한 정관, 규정, 지침 및 승인체계를 확인합니다.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h3 className="font-bold text-red-700 mb-2">대표 필수 확인사항</h3>
        <ul className="text-sm text-red-600 leading-7">
          <li>정관 및 주요 규정 개정은 이사회 의결이 필요합니다.</li>
          <li>예산, 인사, 계약, 투자 관련 규정은 사전 검토가 중요합니다.</li>
          <li>대외 승인 또는 보고가 필요한 규정은 담당부서 확인이 필요합니다.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-slate-500">전체 규정</p>
          <p className="text-3xl font-bold mt-2">{summary.total}건</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm text-blue-600">운영규정</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {summary.operating}건
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm text-green-600">인사·복무</p>
          <p className="text-3xl font-bold text-green-700 mt-2">
            {summary.hr}건
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <p className="text-sm text-orange-600">예산·회계</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">
            {summary.finance}건
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">주요 규정 현황</h3>
          <button className="px-3 py-2 text-sm border rounded-lg hover:bg-slate-50">
            전체 규정 다운로드
          </button>
        </div>

        <div className="divide-y">
          {data.regulations.length > 0 ? (
            data.regulations.map((regulation) => (
              <div key={regulation.id} className="p-5 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${categoryClass(
                          regulation.color
                        )}`}
                      >
                        {regulation.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        담당부서 {regulation.manager}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      {regulation.name}
                    </h4>
                    <p className="mt-2 text-sm text-slate-500">
                      최근 개정일 {regulation.revised}
                    </p>
                  </div>

                  <div className="text-right min-w-[180px]">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {regulation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              등록된 규정 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
