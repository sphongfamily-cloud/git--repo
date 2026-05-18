"use client";

type Department = {
  id: number;
  name: string;
  leader: string;
  people: string;
};

type OrgChartDownloadButtonProps = {
  departments: Department[];
};

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildOrgChartSvg(departments: Department[]) {
  const width = Math.max(960, departments.length * 220 + 80);
  const height = 420;
  const centerX = width / 2;
  const topY = 42;
  const branchY = 168;
  const boxY = 210;
  const boxWidth = 180;
  const boxHeight = 96;
  const gap = 32;
  const totalWidth = departments.length * boxWidth + (departments.length - 1) * gap;
  const startX = (width - totalWidth) / 2;
  const firstCenterX = startX + boxWidth / 2;
  const lastCenterX =
    startX + (departments.length - 1) * (boxWidth + gap) + boxWidth / 2;

  const departmentBoxes = departments
    .map((department, index) => {
      const x = startX + index * (boxWidth + gap);
      const boxCenterX = x + boxWidth / 2;

      return `
        <line x1="${boxCenterX}" y1="${branchY}" x2="${boxCenterX}" y2="${boxY}" stroke="#94a3b8" stroke-width="2" />
        <rect x="${x}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="${boxCenterX}" y="${boxY + 32}" text-anchor="middle" font-size="16" font-weight="700" fill="#1e293b">${escapeXml(department.name)}</text>
        <text x="${boxCenterX}" y="${boxY + 58}" text-anchor="middle" font-size="13" fill="#64748b">${escapeXml(department.leader)}</text>
        <text x="${boxCenterX}" y="${boxY + 80}" text-anchor="middle" font-size="13" font-weight="600" fill="#334155">${escapeXml(department.people)}</text>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#ffffff" />
  <text x="${centerX}" y="30" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">충북창조경제혁신센터 조직도</text>
  <rect x="${centerX - 110}" y="${topY}" width="220" height="68" rx="14" fill="#0f172a" />
  <text x="${centerX}" y="${topY + 42}" text-anchor="middle" font-size="20" font-weight="800" fill="#ffffff">대표이사</text>
  <line x1="${centerX}" y1="${topY + 68}" x2="${centerX}" y2="${branchY}" stroke="#94a3b8" stroke-width="2" />
  <line x1="${firstCenterX}" y1="${branchY}" x2="${lastCenterX}" y2="${branchY}" stroke="#94a3b8" stroke-width="2" />
  ${departmentBoxes}
  <text x="${centerX}" y="${height - 38}" text-anchor="middle" font-size="12" fill="#64748b">다운로드 기준: ${new Date().toLocaleDateString("ko-KR")}</text>
</svg>`;
}

export default function OrgChartDownloadButton({
  departments,
}: OrgChartDownloadButtonProps) {
  function downloadOrgChart() {
    const svg = buildOrgChartSvg(departments);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "충북창조경제혁신센터_조직도.svg";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={downloadOrgChart}
      className="px-3 py-2 text-sm border rounded-lg hover:bg-slate-50"
    >
      조직도 다운로드
    </button>
  );
}
