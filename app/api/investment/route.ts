import { jsonError, jsonSuccess, readDataFile, writeDataFile } from "@/lib/data-store";

const fileName = "investment.json";

export async function GET() {
  try {
    return jsonSuccess(await readDataFile(fileName));
  } catch {
    return jsonError("투자 데이터를 불러오지 못했습니다.");
  }
}

export async function PUT(request: Request) {
  try {
    return jsonSuccess(await writeDataFile(fileName, await request.json()));
  } catch {
    return jsonError("투자 데이터를 저장하지 못했습니다.", 400);
  }
}
