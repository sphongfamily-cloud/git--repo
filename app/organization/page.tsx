import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import { readDataFile } from "@/lib/data-store";

type OrganizationPayload = {
  profile: {
    name: string;
    founded: string;
    location: string;
    vision: string;
  };
  history: {
    id: number;
    date: string;
    text: string;
  }[];
};

export default async function OrganizationPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const data = await readDataFile<OrganizationPayload>("organization.json");

  return (
    <div className="space-y-6">
      {edit === "1" ? (
        <InlineEditOverlay
          data={data}
          description="기관 기본정보와 주요 연혁"
          endpoint="/api/organization"
          label="기관현황"
          returnPath="/organization"
        />
      ) : null}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">기관 현황</h2>
        <p className="mt-2 text-slate-500">
          센터 기본현황, 설립목적, 비전, 주요 연혁을 확인합니다.
        </p>
      </div>

      <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500">기관명</p>
              <p className="text-xl font-bold mt-2">{data.profile.name}</p>
            </div>
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500">설립</p>
              <p className="text-xl font-bold mt-2">{data.profile.founded}</p>
            </div>
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <p className="text-sm text-slate-500">소재지</p>
              <p className="text-xl font-bold mt-2">{data.profile.location}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-3">
              비전 및 역할
            </h3>
            <p className="text-slate-600 leading-7">{data.profile.vision}</p>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">주요 연혁</h3>

            <div className="space-y-4">
              {data.history.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 text-sm font-bold text-blue-600">
                    {item.date}
                  </div>
                  <div className="flex-1 border-l pl-4 pb-4">
                    <p className="text-slate-700">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </>
    </div>
  );
}
