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

type DocumentRouteContext = {
  params: Promise<{ id: string }>;
};

async function getDocument(id: number) {
  const documents = await readDataFile<DocumentItem[]>(fileName);
  const document = documents.find((item) => item.id === id);

  return { documents, document };
}

export async function GET(_request: Request, { params }: DocumentRouteContext) {
  const { id } = await params;
  const documentId = Number(id);

  if (!Number.isInteger(documentId)) {
    return jsonError("문서 ID가 올바르지 않습니다.", 400);
  }

  const { document } = await getDocument(documentId);

  if (!document) {
    return jsonError("문서를 찾을 수 없습니다.", 404);
  }

  return jsonSuccess(document);
}

export async function PATCH(request: Request, { params }: DocumentRouteContext) {
  const { id } = await params;
  const documentId = Number(id);

  if (!Number.isInteger(documentId)) {
    return jsonError("문서 ID가 올바르지 않습니다.", 400);
  }

  const { documents, document } = await getDocument(documentId);

  if (!document) {
    return jsonError("문서를 찾을 수 없습니다.", 404);
  }

  const patch = (await request.json()) as Partial<Omit<DocumentItem, "id">>;
  const updated = { ...document, ...patch, id: document.id };

  await writeDataFile(
    fileName,
    documents.map((item) => (item.id === documentId ? updated : item))
  );

  return jsonSuccess(updated);
}

export async function DELETE(_request: Request, { params }: DocumentRouteContext) {
  const { id } = await params;
  const documentId = Number(id);

  if (!Number.isInteger(documentId)) {
    return jsonError("문서 ID가 올바르지 않습니다.", 400);
  }

  const { documents, document } = await getDocument(documentId);

  if (!document) {
    return jsonError("문서를 찾을 수 없습니다.", 404);
  }

  await writeDataFile(
    fileName,
    documents.filter((item) => item.id !== documentId)
  );

  return jsonSuccess(document);
}
