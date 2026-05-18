export async function GET() {
  return Response.json({
    baseDate: "2026.05.16",
    kpis: [
      { label: "총예산", value: "139.7", unit: "억원", note: "2024년 기준" },
      { label: "운영사업 수", value: "28", unit: "개", note: "진행 24개 / 완료 4개" },
      { label: "지원기업 수", value: "1,580", unit: "개사", note: "누적 기준" },
      { label: "투자·후속투자", value: "1,358", unit: "억원", note: "누적 기준" },
      { label: "임직원 현황", value: "37", unit: "명", note: "정원 42명 / 현원 37명" },
      { label: "긴급 현안", value: "3", unit: "건", note: "즉시 보고 필요" },
      { label: "의사결정 필요", value: "5", unit: "건", note: "대표 승인·검토 필요" },
    ],
    issues: [
      { level: "긴급", title: "투자 건 심의 및 승인 필요", rule: "투자심의·이사회 보고 여부 확인", due: "D-3" },
      { level: "중요", title: "2026년 사업계획·예산 변경 검토", rule: "중기부·충북도 협의 필요", due: "D-7" },
      { level: "주의", title: "조직개편 및 업무분장 조정", rule: "직제규정·사무위임전결 검토", due: "D-14" },
      { level: "보고", title: "대외협력 및 언론 대응 현황", rule: "사전보고 및 메시지 관리", due: "상시" },
    ],
    regulations: [
      { name: "정관", date: "2023.12.26", status: "이사회·중기부 승인 필요" },
      { name: "인사규정", date: "2024.01.15", status: "내부 규정 검토 필요" },
      { name: "회계규정", date: "2024.01.15", status: "예산집행 근거" },
      { name: "복무규정", date: "2024.01.15", status: "근태·출장 기준" },
      { name: "사무위임전결지침", date: "2024.01.15", status: "결재권한 확인" },
    ],
  });
}
