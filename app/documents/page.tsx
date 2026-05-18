import { connection } from "next/server";
import InlineEditOverlay from "@/components/InlineEditOverlay";
import { readDataFile } from "@/lib/data-store";
import DocumentsClient, { type DocumentItem } from "./DocumentsClient";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await connection();

  const { edit } = await searchParams;
  const documents = await readDataFile<DocumentItem[]>("documents.json");

  return (
    <>
      {edit === "1" ? (
        <InlineEditOverlay
          data={documents}
          description="문서 목록"
          endpoint="/api/documents"
          label="자료 열람"
          returnPath="/documents"
        />
      ) : null}
      <DocumentsClient initialDocuments={documents} />
    </>
  );
}
