import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import { readDataFile } from "@/lib/data-store";

type Issue = {
  id: number;
  level: string;
  title: string;
  description: string;
  due: string;
  department: string;
  status: string;
  color: string;
};

type IssuesPayload = {
  issues: Issue[];
};

function levelClass(color: string) {
  if (color === "red") return "bg-red-100 text-red-600";
  if (color === "orange") return "bg-orange-100 text-orange-600";
  if (color === "yellow") return "bg-yellow-100 text-yellow-700";
  return "bg-slate-100 text-slate-600";
}

export default async function IssuesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const data = await readDataFile<IssuesPayload>("issues.json");
  const summary = {
    urgent: data.issues.filter((issue) => issue.color === "red").length,
    decision: data.issues.filter((issue) =>
      ["red", "orange"].includes(issue.color)
    ).length,
    board: data.issues.filter((issue) => issue.status.includes("이사회")).length,
    total: data.issues.length,
  };

  return (
    <div className="space-y-6">
      {edit === "1" ? (
        <InlineEditOverlay
          data={data}
          description="현안 목록, 기한, 상태"
          endpoint="/api/issues"
          label="현안 및 의사결정"
          returnPath="/issues"
        />
      ) : null}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          현안 및 의사결정 필요사항
        </h2>
        <p className="mt-2 text-slate-500">
          대표 검토, 보고, 승인이 필요한 주요 현안을 관리합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm text-red-600 font-medium">긴급 현안</p>
          <p className="text-3xl font-bold text-red-700 mt-2">
            {summary.urgent}건
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <p className="text-sm text-orange-600 font-medium">의사결정 필요</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">
            {summary.decision}건
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm text-blue-600 font-medium">이사회 보고 예정</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {summary.board}건
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-600 font-medium">전체 현안</p>
          <p className="text-3xl font-bold text-slate-700 mt-2">
            {summary.total}건
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">주요 현안 리스트</h3>
          <button className="px-3 py-2 text-sm border rounded-lg hover:bg-slate-50">
            전체 보기
          </button>
        </div>

        <div className="divide-y">
          {data.issues.length > 0 ? (
            data.issues.map((issue) => (
              <div key={issue.id} className="p-5 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${levelClass(
                          issue.color
                        )}`}
                      >
                        {issue.level}
                      </span>
                      <span className="text-xs text-slate-400">
                        {issue.department}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-slate-800">
                      {issue.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-500 leading-6">
                      {issue.description}
                    </p>
                  </div>

                  <div className="text-right min-w-[140px]">
                    <p className="text-xs text-slate-400">기한</p>
                    <p className="font-semibold text-slate-700 mt-1">
                      {issue.due}
                    </p>
                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {issue.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              등록된 현안 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
