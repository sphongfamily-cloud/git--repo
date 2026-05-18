import { connection } from "next/server";
import { readDataFile } from "@/lib/data-store";
import DataManagementClient, { type Resource } from "./DataManagementClient";

const resources: Resource[] = [
  {
    label: "기관현황",
    endpoint: "/api/organization",
    description: "기관 기본정보와 주요 연혁",
  },
  {
    label: "직원 및 조직현황",
    endpoint: "/api/staff",
    description: "부서 정보와 주요 담당자",
  },
  {
    label: "주요 사업현황",
    endpoint: "/api/projects",
    description: "사업 목록, 담당부서, 예산, 추진상태",
  },
  {
    label: "창업지원·투자현황",
    endpoint: "/api/investment",
    description: "투자 지표, 프로그램, 펀드 현황",
  },
  {
    label: "제규정 및 운영지침",
    endpoint: "/api/regulations",
    description: "규정 목록, 개정일, 담당부서",
  },
  {
    label: "현안 및 의사결정",
    endpoint: "/api/issues",
    description: "현안 목록, 기한, 상태",
  },
  {
    label: "100일 로드맵",
    endpoint: "/api/roadmap",
    description: "로드맵 단계와 주요 일정",
  },
  {
    label: "자료 열람",
    endpoint: "/api/documents",
    description: "문서 목록",
  },
];

const filesByEndpoint: Record<string, string> = {
  "/api/organization": "organization.json",
  "/api/staff": "staff.json",
  "/api/projects": "projects.json",
  "/api/investment": "investment.json",
  "/api/regulations": "regulations.json",
  "/api/issues": "issues.json",
  "/api/roadmap": "roadmap.json",
  "/api/documents": "documents.json",
};

export default async function DataManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ resource?: string }>;
}) {
  await connection();

  const { resource } = await searchParams;
  const requestedEndpoint = resource ? decodeURIComponent(resource) : undefined;
  const initialEndpoint =
    requestedEndpoint && filesByEndpoint[requestedEndpoint]
      ? requestedEndpoint
      : resources[0].endpoint;

  const initialDataByEndpoint = Object.fromEntries(
    await Promise.all(
      resources.map(async (item) => [
        item.endpoint,
        await readDataFile(filesByEndpoint[item.endpoint]),
      ])
    )
  );

  return (
    <DataManagementClient
      resources={resources}
      initialEndpoint={initialEndpoint}
      initialDataByEndpoint={initialDataByEndpoint}
    />
  );
}
