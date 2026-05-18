import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const dataDirectory = path.join(process.cwd(), "data");

export async function readDataFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(dataDirectory, fileName);
  const contents = await readFile(filePath, "utf-8");

  return JSON.parse(contents) as T;
}

export async function writeDataFile<T>(
  fileName: string,
  data: T
): Promise<T> {
  await mkdir(dataDirectory, { recursive: true });

  const filePath = path.join(dataDirectory, fileName);
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");

  return data;
}

export function jsonSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}
