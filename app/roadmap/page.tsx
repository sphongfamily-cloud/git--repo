import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import { readDataFile } from "@/lib/data-store";

type RoadmapStep = {
  id: number;
  period: string;
  title: string;
  items: string[];
  color: string;
};

type Schedule = {
  id: number;
  period: string;
  task: string;
  owner: string;
};

type RoadmapPayload = {
  roadmap: RoadmapStep[];
  schedules: Schedule[];
};

function headerClass(color: string) {
  if (color === "blue") return "bg-blue-600";
  if (color === "green") return "bg-green-600";
  return "bg-orange-600";
}

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const data = await readDataFile<RoadmapPayload>("roadmap.json");
  const totalTasks = data.roadmap.reduce(
    (sum, step) => sum + step.items.length,
    0
  );

  return (
    <div className="space-y-6">
      {edit === "1" ? (
        <InlineEditOverlay
          data={data}
          description="로드맵 단계와 주요 일정"
          endpoint="/api/roadmap"
          label="100일 로드맵"
          returnPath="/roadmap"
        />
      ) : null}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">100일 로드맵</h2>
        <p className="mt-2 text-slate-500">
          신임 대표이사의 취임 초기 업무 파악, 조직 안정화, 경영계획 수립 일정을 관리합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-slate-500">전체 과제</p>
          <p className="text-3xl font-bold mt-2">{totalTasks}개</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm text-blue-600">단계</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {data.roadmap.length}개
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <p className="text-sm text-orange-600">주요 일정</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">
            {data.schedules.length}개
          </p>
        </div>
      </div>

      <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {data.roadmap.map((step) => (
              <div key={step.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className={`p-5 ${headerClass(step.color)} text-white`}>
                  <p className="text-sm opacity-90">{step.period}</p>
                  <h3 className="text-xl font-bold mt-2">{step.title}</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {step.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-5 w-full px-3 py-2 text-sm rounded-lg border hover:bg-slate-50">
                    세부 일정 보기
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              주요 일정 관리
            </h3>
            <div className="space-y-4">
              {data.schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="grid grid-cols-1 md:grid-cols-[120px_1fr_180px] gap-3 items-center border rounded-xl p-4 hover:bg-slate-50"
                >
                  <div className="font-bold text-blue-600">{schedule.period}</div>
                  <div className="text-slate-700">{schedule.task}</div>
                  <div className="text-sm text-slate-500 md:text-right">
                    {schedule.owner}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </>
    </div>
  );
}
