import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import OrgChartDownloadButton from "@/components/OrgChartDownloadButton";
import { readDataFile } from "@/lib/data-store";

type Department = {
  id: number;
  name: string;
  leader: string;
  people: string;
  role: string;
  status: string;
  color: string;
};

type Staff = {
  id: number;
  name: string;
  position: string;
  task: string;
  phone: string;
};

type StaffPayload = {
  departments: Department[];
  staffs: Staff[];
};

function statusClass(color: string) {
  if (color === "blue") return "bg-blue-100 text-blue-700";
  if (color === "green") return "bg-green-100 text-green-700";
  if (color === "purple") return "bg-purple-100 text-purple-700";
  return "bg-orange-100 text-orange-700";
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const data = await readDataFile<StaffPayload>("staff.json");
  const totalPeople = data.departments.reduce((sum, department) => {
    const people = Number.parseInt(department.people, 10);
    return Number.isNaN(people) ? sum : sum + people;
  }, 0);

  return (
    <div className="space-y-6">
      {edit === "1" ? (
        <InlineEditOverlay
          data={data}
          description="부서 정보와 주요 담당자"
          endpoint="/api/staff"
          label="직원 및 조직현황"
          returnPath="/staff"
        />
      ) : null}

      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          직원 및 조직현황
        </h2>
        <p className="mt-2 text-slate-500">
          조직 구성, 부서별 역할, 인력현황 및 주요 담당자를 확인합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-slate-500">부서</p>
          <p className="text-3xl font-bold mt-2">{data.departments.length}개</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm text-blue-600">등록 인원</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {totalPeople}명
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <p className="text-sm text-orange-600">주요 담당자</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">
            {data.staffs.length}명
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm text-green-600">운영 상태</p>
          <p className="text-3xl font-bold text-green-700 mt-2">정상</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-800">조직도</h3>
          <OrgChartDownloadButton departments={data.departments} />
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">
            대표이사
          </div>
          <div className="w-1 h-8 bg-slate-300" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {data.departments.map((department) => (
              <div
                key={department.id}
                className="bg-slate-50 border rounded-xl p-4 text-center"
              >
                <h4 className="font-bold text-slate-800">{department.name}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  {department.leader}
                </p>
                <p className="text-sm font-medium mt-3">{department.people}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-slate-800">부서별 현황</h3>
        </div>

        <div className="divide-y">
          {data.departments.map((department) => (
            <div key={department.id} className="p-5 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(
                        department.color
                      )}`}
                    >
                      {department.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800">
                    {department.name}
                  </h4>
                  <p className="mt-2 text-sm text-slate-500 leading-6">
                    {department.role}
                  </p>
                </div>
                <div className="text-right min-w-[120px]">
                  <p className="text-xs text-slate-400">인원</p>
                  <p className="font-semibold text-slate-700 mt-1">
                    {department.people}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-bold text-slate-800">주요 담당자 현황</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left">이름</th>
                <th className="px-4 py-3 text-left">직급</th>
                <th className="px-4 py-3 text-left">담당업무</th>
                <th className="px-4 py-3 text-left">연락처</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.staffs.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {staff.name}
                  </td>
                  <td className="px-4 py-3">{staff.position}</td>
                  <td className="px-4 py-3 text-slate-500">{staff.task}</td>
                  <td className="px-4 py-3">{staff.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
