import { jsonError, jsonSuccess, readDataFile, writeDataFile } from "@/lib/data-store";

type DocumentItem = {
  id: number;
  title: string;
  category: string;
  type: string;
  size: string;
  date: string;
  owner: string;
};

const fileName = "documents.json";

export async function GET() {
  try {
    const documents = await readDataFile<DocumentItem[]>(fileName);
    return jsonSuccess(documents);
  } catch {
    return jsonError("문서 목록을 불러오지 못했습니다.");
  }
}

export async function POST(request: Request) {
  try {
    const documents = await readDataFile<DocumentItem[]>(fileName);
    const body = (await request.json()) as Omit<DocumentItem, "id">;
    const nextId = documents.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const created = { ...body, id: nextId };

    await writeDataFile(fileName, [...documents, created]);

    return jsonSuccess(created, { status: 201 });
  } catch {
    return jsonError("문서를 등록하지 못했습니다.", 400);
  }
}

export async function PUT(request: Request) {
  try {
    const documents = (await request.json()) as DocumentItem[];

    if (!Array.isArray(documents)) {
      return jsonError("문서 데이터는 배열이어야 합니다.", 400);
    }

    return jsonSuccess(await writeDataFile(fileName, documents));
  } catch {
    return jsonError("문서 목록을 저장하지 못했습니다.", 400);
  }
}
