import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import { readDataFile } from "@/lib/data-store";

type Project = {
  id: number;
  name: string;
  department: string;
  budget: string;
  target: string;
  status: string;
  color: string;
};

type ProjectsPayload = {
  projects: Project[];
};

function statusClass(color: string) {
  if (color === "green") return "bg-green-100 text-green-700";
  if (color === "orange") return "bg-orange-100 text-orange-700";
  if (color === "yellow") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const data = await readDataFile<ProjectsPayload>("projects.json");
  const summary = {
    total: data.projects.length,
    normal: data.projects.filter((project) => project.color === "green").length,
    checkNeeded: data.projects.filter((project) =>
      ["orange", "yellow"].includes(project.color)
    ).length,
    delayed: data.projects.filter((project) => project.color === "red").length,
  };

  return (
    <div className="space-y-6">
      {edit === "1" ? (
        <InlineEditOverlay
          data={data}
          description="사업 목록, 담당부서, 예산, 추진상태"
          endpoint="/api/projects"
          label="주요 사업현황"
          returnPath="/projects"
        />
      ) : null}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">주요 사업현황</h2>
        <p className="mt-2 text-slate-500">
          센터 주요 사업의 예산, 담당부서, 추진상태, 성과목표를 확인합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-slate-500">전체 사업</p>
          <p className="text-3xl font-bold mt-2">{summary.total}개</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm text-green-600">정상 추진</p>
          <p className="text-3xl font-bold text-green-700 mt-2">
            {summary.normal}개
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="text-sm text-yellow-700">점검 필요</p>
          <p className="text-3xl font-bold text-yellow-700 mt-2">
            {summary.checkNeeded}개
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm text-red-600">지연</p>
          <p className="text-3xl font-bold text-red-700 mt-2">
            {summary.delayed}개
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">사업별 추진현황</h3>
          <button className="px-3 py-2 text-sm border rounded-lg hover:bg-slate-50">
            목록 다운로드
          </button>
        </div>

        <div className="divide-y">
          {data.projects.length > 0 ? (
            data.projects.map((project) => (
              <div key={project.id} className="p-5 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(
                          project.color
                        )}`}
                      >
                        {project.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {project.department}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-slate-800">
                      {project.name}
                    </h4>
                    <p className="mt-2 text-sm text-slate-500 leading-6">
                      {project.target}
                    </p>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <p className="text-xs text-slate-400">예산</p>
                    <p className="font-semibold text-slate-700 mt-1">
                      {project.budget}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    상세 보기
                  </button>
                  <button className="px-3 py-2 text-sm rounded-lg border hover:bg-slate-50">
                    실적 보기
                  </button>
                  <button className="px-3 py-2 text-sm rounded-lg border hover:bg-slate-50">
                    관련 자료
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              등록된 사업 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
