import Link from "next/link";
import DataManagementClient from "@/app/data-management/DataManagementClient";

type InlineEditOverlayProps = {
  data: unknown;
  description: string;
  endpoint: string;
  label: string;
  returnPath: string;
};

export default function InlineEditOverlay({
  data,
  description,
  endpoint,
  label,
  returnPath,
}: InlineEditOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/55 p-4">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-xl bg-slate-50 shadow-2xl">
        <div className="flex items-center justify-between border-b bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{label} 수정</h2>
            <p className="mt-1 text-sm text-slate-500">
              현재 화면 위에서 데이터를 수정합니다.
            </p>
          </div>
          <Link
            href={returnPath}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
          >
            닫기
          </Link>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <DataManagementClient
            compact
            resources={[{ label, endpoint, description }]}
            initialEndpoint={endpoint}
            initialDataByEndpoint={{ [endpoint]: data }}
          />
        </div>
      </div>
    </div>
  );
}
