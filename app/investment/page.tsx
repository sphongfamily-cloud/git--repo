import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import { readDataFile } from "@/lib/data-store";

type InvestmentMetric = {
  id: number;
  title: string;
  value: string;
  unit: string;
  description: string;
  color: string;
};

type Program = {
  id: number;
  name: string;
  type: string;
  result: string;
  manager: string;
  status: string;
  color: string;
};

type Fund = {
  id: number;
  name: string;
  size: string;
  type: string;
  detail: string;
};

type InvestmentPayload = {
  investments: InvestmentMetric[];
  programs: Program[];
  funds: Fund[];
};

function cardClass(color: string) {
  if (color === "blue") return "bg-blue-50 border-blue-200";
  if (color === "green") return "bg-green-50 border-green-200";
  if (color === "purple") return "bg-purple-50 border-purple-200";
  return "bg-orange-50 border-orange-200";
}

function textClass(color: string) {
  if (color === "blue") return "text-blue-600";
  if (color === "green") return "text-green-600";
  if (color === "purple") return "text-purple-600";
  return "text-orange-600";
}

function badgeClass(color: string) {
  if (color === "green") return "bg-green-100 text-green-700";
  if (color === "blue") return "bg-blue-100 text-blue-700";
  if (color === "purple") return "bg-purple-100 text-purple-700";
  return "bg-slate-100 text-slate-600";
}

export default async function InvestmentPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const data = await readDataFile<InvestmentPayload>("investment.json");

  return (
    <div className="space-y-6">
      {edit === "1" ? (
        <InlineEditOverlay
          data={data}
          description="투자 지표, 프로그램, 펀드 현황"
          endpoint="/api/investment"
          label="창업지원·투자현황"
          returnPath="/investment"
        />
      ) : null}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          창업지원·투자현황
        </h2>
        <p className="mt-2 text-slate-500">
          기업 발굴, 액셀러레이팅, 직접투자, 후속투자, TIPS 연계 현황을 확인합니다.
        </p>
      </div>

      <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.investments.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-5 shadow-sm ${cardClass(item.color)}`}
              >
                <p className={`text-sm font-medium ${textClass(item.color)}`}>
                  {item.title}
                </p>
                <div className="flex items-end gap-1 mt-2">
                  <p className="text-3xl font-bold text-slate-800">
                    {item.value}
                  </p>
                  <p className="text-sm text-slate-500 mb-1">{item.unit}</p>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-800">
                창업지원 프로그램 현황
              </h3>
              <button className="px-3 py-2 text-sm border rounded-lg hover:bg-slate-50">
                전체 보기
              </button>
            </div>

            <div className="divide-y">
              {data.programs.map((program) => (
                <div key={program.id} className="p-5 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass(
                            program.color
                          )}`}
                        >
                          {program.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          담당부서 {program.manager}
                        </span>
                      </div>

                      <h4 className="text-lg font-semibold text-slate-800">
                        {program.name}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500">
                        {program.result}
                      </p>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {program.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold text-slate-800">펀드 운용 현황</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">펀드명</th>
                    <th className="px-4 py-3 text-left">조합규모</th>
                    <th className="px-4 py-3 text-left">운영방식</th>
                    <th className="px-4 py-3 text-left">주요 내용</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.funds.map((fund) => (
                    <tr key={fund.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {fund.name}
                      </td>
                      <td className="px-4 py-3">{fund.size}</td>
                      <td className="px-4 py-3">{fund.type}</td>
                      <td className="px-4 py-3 text-slate-500">{fund.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </>
    </div>
  );
}
