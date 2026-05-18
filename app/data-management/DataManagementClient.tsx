"use client";

import { useMemo, useState } from "react";

export type Resource = {
  label: string;
  endpoint: string;
  description: string;
};

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

type ApiResponse = {
  success: boolean;
  data?: unknown;
  error?: string;
};

type DataManagementClientProps = {
  resources: Resource[];
  initialEndpoint: string;
  initialDataByEndpoint: Record<string, unknown>;
  compact?: boolean;
};

const password = "5910";

function requestJson(
  url: string,
  options: { method?: string; body?: unknown } = {}
): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(options.method ?? "GET", url);
    request.setRequestHeader("Accept", "application/json");

    if (options.body !== undefined) {
      request.setRequestHeader("Content-Type", "application/json");
    }

    request.onload = () => {
      try {
        const payload = JSON.parse(request.responseText) as ApiResponse;

        if (request.status < 200 || request.status >= 300) {
          reject(new Error(payload.error ?? "요청을 처리하지 못했습니다."));
          return;
        }

        resolve(payload);
      } catch {
        reject(new Error("응답 형식이 올바르지 않습니다."));
      }
    };
    request.onerror = () => reject(new Error("서버에 연결하지 못했습니다."));
    request.send(
      options.body === undefined ? undefined : JSON.stringify(options.body)
    );
  });
}

const fieldLabels: Record<string, string> = {
  budget: "예산",
  category: "구분",
  color: "표시 색상",
  date: "일자",
  department: "담당부서",
  description: "설명",
  detail: "주요 내용",
  due: "기한",
  founded: "설립",
  history: "주요 연혁",
  id: "번호",
  items: "세부 항목",
  leader: "책임자",
  level: "중요도",
  location: "소재지",
  manager: "담당자",
  name: "명칭",
  owner: "담당부서",
  period: "기간",
  people: "인원",
  phone: "연락처",
  position: "직급",
  profile: "기관 기본정보",
  programs: "프로그램",
  projects: "사업 목록",
  regulations: "규정 목록",
  result: "성과",
  revised: "개정일",
  roadmap: "로드맵",
  role: "역할",
  schedules: "주요 일정",
  size: "규모",
  staff: "직원",
  staffs: "주요 담당자",
  status: "상태",
  task: "담당업무",
  target: "목표",
  text: "내용",
  title: "제목",
  type: "유형",
  unit: "단위",
  value: "값",
  vision: "비전 및 역할",
};

function isObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toJsonValue(value: unknown): JsonValue {
  return value as JsonValue;
}

function getLabel(key: string) {
  return fieldLabels[key] ?? key;
}

function updateValueAtPath(
  value: JsonValue,
  path: (string | number)[],
  nextValue: JsonValue
): JsonValue {
  if (path.length === 0) {
    return nextValue;
  }

  const [head, ...rest] = path;

  if (Array.isArray(value) && typeof head === "number") {
    return value.map((item, index) =>
      index === head ? updateValueAtPath(item, rest, nextValue) : item
    );
  }

  if (isObject(value) && typeof head === "string") {
    return {
      ...value,
      [head]: updateValueAtPath(value[head], rest, nextValue),
    };
  }

  return value;
}

function createBlankValue(sample: JsonValue): JsonValue {
  if (Array.isArray(sample)) {
    return [];
  }

  if (isObject(sample)) {
    return Object.fromEntries(
      Object.entries(sample).map(([key, value]) => [
        key,
        key === "id" && typeof value === "number" ? 0 : createBlankValue(value),
      ])
    );
  }

  if (typeof sample === "number") {
    return 0;
  }

  if (typeof sample === "boolean") {
    return false;
  }

  return "";
}

function createNewArrayItem(items: JsonArray) {
  const sample = items[0] ?? { id: 0, name: "" };
  const blank = createBlankValue(sample);

  if (isObject(blank) && typeof blank.id === "number") {
    const nextId =
      items.reduce<number>((max, item) => {
        if (isObject(item) && typeof item.id === "number") {
          return Math.max(max, item.id);
        }

        return max;
      }, 0) + 1;

    return { ...blank, id: nextId };
  }

  return blank;
}

function primitiveToText(value: JsonPrimitive) {
  if (value === null) {
    return "";
  }

  return String(value);
}

function textToPrimitive(text: string, previousValue: JsonPrimitive) {
  if (typeof previousValue === "number") {
    const numericValue = Number(text);
    return Number.isNaN(numericValue) ? previousValue : numericValue;
  }

  if (typeof previousValue === "boolean") {
    return text === "true";
  }

  return text;
}

function ViewValue({ label, value }: { label?: string; value: JsonValue }) {
  if (Array.isArray(value)) {
    const objectRows = value.filter(isObject);
    const primitiveRows = value.filter((item) => !isObject(item));

    return (
      <div className="space-y-3">
        {label ? <h4 className="font-bold text-slate-800">{label}</h4> : null}

        {objectRows.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {Object.keys(objectRows[0]).map((key) => (
                    <th key={key} className="px-3 py-2 text-left font-medium">
                      {getLabel(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {objectRows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    {Object.entries(row).map(([key, cell]) => (
                      <td key={key} className="px-3 py-2 align-top text-slate-700">
                        {Array.isArray(cell)
                          ? `${cell.length}개 항목`
                          : isObject(cell)
                          ? "상세 정보"
                          : primitiveToText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {primitiveRows.length > 0 ? (
          <ul className="space-y-2">
            {primitiveRows.map((item, index) => (
              <li key={index} className="rounded-lg border bg-white px-3 py-2 text-sm">
                {primitiveToText(item as JsonPrimitive)}
              </li>
            ))}
          </ul>
        ) : null}

        {value.length === 0 ? (
          <div className="rounded-lg border bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            등록된 데이터가 없습니다.
          </div>
        ) : null}
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className="space-y-4">
        {label ? <h4 className="font-bold text-slate-800">{label}</h4> : null}
        {Object.entries(value).map(([key, childValue]) => {
          if (Array.isArray(childValue) || isObject(childValue)) {
            return (
              <div key={key} className="rounded-xl border bg-white p-4">
                <ViewValue label={getLabel(key)} value={childValue} />
              </div>
            );
          }

          return (
            <div
              key={key}
              className="grid grid-cols-1 gap-1 rounded-lg border bg-white px-4 py-3 md:grid-cols-[160px_1fr]"
            >
              <dt className="text-sm font-medium text-slate-500">{getLabel(key)}</dt>
              <dd className="text-sm text-slate-800">{primitiveToText(childValue)}</dd>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white px-4 py-3 text-sm text-slate-800">
      {primitiveToText(value)}
    </div>
  );
}

function EditValue({
  label,
  value,
  path,
  onChange,
}: {
  label?: string;
  value: JsonValue;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
}) {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {label ? <h4 className="font-bold text-slate-800">{label}</h4> : <span />}
          <button
            type="button"
            onClick={() => onChange(path, [...value, createNewArrayItem(value)])}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
          >
            항목 추가
          </button>
        </div>

        {value.map((item, index) => (
          <div key={index} className="rounded-xl border bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {label ? `${label} ${index + 1}` : `항목 ${index + 1}`}
              </p>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    path,
                    value.filter((_, itemIndex) => itemIndex !== index)
                  )
                }
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
            <EditValue
              value={item}
              path={[...path, index]}
              onChange={onChange}
            />
          </div>
        ))}

        {value.length === 0 ? (
          <div className="rounded-lg border bg-white px-4 py-6 text-center text-sm text-slate-500">
            항목을 추가해 주세요.
          </div>
        ) : null}
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className="space-y-4">
        {label ? <h4 className="font-bold text-slate-800">{label}</h4> : null}
        {Object.entries(value).map(([key, childValue]) => (
          <div key={key}>
            {Array.isArray(childValue) || isObject(childValue) ? (
              <div className="rounded-xl border bg-white p-4">
                <EditValue
                  label={getLabel(key)}
                  value={childValue}
                  path={[...path, key]}
                  onChange={onChange}
                />
              </div>
            ) : (
              <label className="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr] md:items-start">
                <span className="pt-2 text-sm font-medium text-slate-600">
                  {getLabel(key)}
                </span>
                {String(childValue).length > 42 ? (
                  <textarea
                    value={primitiveToText(childValue)}
                    onChange={(event) =>
                      onChange(
                        [...path, key],
                        textToPrimitive(event.target.value, childValue)
                      )
                    }
                    className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <input
                    value={primitiveToText(childValue)}
                    onChange={(event) =>
                      onChange(
                        [...path, key],
                        textToPrimitive(event.target.value, childValue)
                      )
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                )}
              </label>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <input
      value={primitiveToText(value)}
      onChange={(event) =>
        onChange(path, textToPrimitive(event.target.value, value))
      }
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

export default function DataManagementClient({
  resources,
  initialEndpoint,
  initialDataByEndpoint,
  compact = false,
}: DataManagementClientProps) {
  const firstEndpoint = initialEndpoint;
  const [dataByEndpoint, setDataByEndpoint] = useState(
    initialDataByEndpoint as Record<string, JsonValue>
  );
  const [selectedEndpoint, setSelectedEndpoint] = useState(firstEndpoint);
  const [editData, setEditData] = useState<JsonValue>(
    toJsonValue(initialDataByEndpoint[firstEndpoint])
  );
  const [mode, setMode] = useState<"view" | "password" | "edit">("view");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const selectedResource = useMemo(
    () =>
      resources.find((resource) => resource.endpoint === selectedEndpoint) ??
      resources[0],
    [resources, selectedEndpoint]
  );
  const selectedData = dataByEndpoint[selectedEndpoint];

  function selectResource(endpoint: string) {
    setSelectedEndpoint(endpoint);
    setEditData(dataByEndpoint[endpoint]);
    setMode("view");
    setPasswordInput("");
    setMessage("");
  }

  function requestEditMode() {
    setPasswordInput("");
    setMessage("");
    setMode("password");
  }

  function confirmPassword() {
    if (passwordInput === password) {
      setEditData(selectedData);
      setMode("edit");
      setMessage("");
      return;
    }

    setMessageType("error");
    setMessage("비밀번호가 올바르지 않습니다.");
  }

  function updateEditData(path: (string | number)[], value: JsonValue) {
    setEditData((current) => updateValueAtPath(current, path, value));
  }

  async function loadResource(endpoint = selectedEndpoint) {
    try {
      setIsLoading(true);
      setMessage("");

      const payload = await requestJson(endpoint);

      if (!payload.success) {
        throw new Error(payload.error ?? "데이터를 불러오지 못했습니다.");
      }

      const nextData = toJsonValue(payload.data);

      setDataByEndpoint((current) => ({
        ...current,
        [endpoint]: nextData,
      }));
      setEditData(nextData);
      setMode("view");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "데이터를 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function saveResource() {
    try {
      setIsSaving(true);
      setMessage("");

      const payload = await requestJson(selectedResource.endpoint, {
        method: "PUT",
        body: editData,
      });

      if (!payload.success) {
        throw new Error(payload.error ?? "데이터를 저장하지 못했습니다.");
      }

      const savedData = toJsonValue(payload.data);

      setDataByEndpoint((current) => ({
        ...current,
        [selectedResource.endpoint]: savedData,
      }));
      setEditData(savedData);
      setMode("view");
      setPasswordInput("");
      setMessageType("success");
      setMessage("저장되었습니다. 연결된 화면을 새로고침하면 변경사항이 반영됩니다.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "데이터를 저장하는 중 오류가 발생했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {!compact ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">데이터 관리</h2>
            <p className="mt-2 text-slate-500">
              화면에 표시되는 데이터를 확인하고, 승인된 사용자만 수정합니다.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => loadResource()}
              disabled={isLoading || isSaving}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-slate-50 disabled:opacity-50"
            >
              다시 불러오기
            </button>
            {mode === "edit" ? (
              <>
                <button
                  onClick={() => {
                    setEditData(selectedData);
                    setMode("view");
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm rounded-lg border hover:bg-slate-50 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={saveResource}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? "저장 중" : "저장"}
                </button>
              </>
            ) : (
              <button
                onClick={requestEditMode}
                disabled={isLoading}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                수정
              </button>
            )}
          </div>
        </div>
      ) : null}

      <div
        className={
          compact ? "grid grid-cols-1 gap-6" : "grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6"
        }
      >
        {!compact ? (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-slate-800">관리 대상</h3>
          </div>

          <div className="divide-y">
            {resources.map((resource) => {
              const active = resource.endpoint === selectedEndpoint;

              return (
                <button
                  key={resource.endpoint}
                  onClick={() => selectResource(resource.endpoint)}
                  className={`w-full text-left p-4 hover:bg-slate-50 ${
                    active ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      active ? "text-blue-700" : "text-slate-800"
                    }`}
                  >
                    {resource.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {resource.description}
                  </p>
                </button>
              );
            })}
          </div>
          </div>
        ) : null}

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">
                {selectedResource.label}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {mode === "edit" ? "수정 화면" : "보기 화면"}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                mode === "edit"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {mode === "edit" ? "수정 중" : "보기 전용"}
            </span>
          </div>

          {compact ? (
            <div className="flex justify-end gap-2 border-b px-4 py-3">
              <button
                onClick={() => loadResource()}
                disabled={isLoading || isSaving}
                className="px-3 py-2 text-sm rounded-lg border hover:bg-slate-50 disabled:opacity-50"
              >
                다시 불러오기
              </button>
              {mode === "edit" ? (
                <>
                  <button
                    onClick={() => {
                      setEditData(selectedData);
                      setMode("view");
                    }}
                    disabled={isSaving}
                    className="px-3 py-2 text-sm rounded-lg border hover:bg-slate-50 disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveResource}
                    disabled={isSaving}
                    className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? "저장 중" : "저장"}
                  </button>
                </>
              ) : (
                <button
                  onClick={requestEditMode}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  수정 시작
                </button>
              )}
            </div>
          ) : null}

          {message ? (
            <div
              className={`mx-4 mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          ) : null}

          <div className="p-4">
            {isLoading ? (
              <div className="min-h-[520px] rounded-lg border bg-slate-50 flex items-center justify-center text-slate-500">
                데이터를 불러오는 중입니다.
              </div>
            ) : mode === "password" ? (
              <div className="mx-auto flex min-h-[520px] max-w-sm flex-col justify-center">
                <div className="rounded-xl border bg-slate-50 p-6">
                  <h4 className="text-lg font-bold text-slate-800">
                    수정 권한 확인
                  </h4>
                  <p className="mt-2 text-sm text-slate-500">
                    수정 화면에 들어가려면 비밀번호를 입력하세요.
                  </p>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(event) => setPasswordInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        confirmPassword();
                      }
                    }}
                    className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="비밀번호"
                  />
                  <button
                    onClick={confirmPassword}
                    className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    수정 화면 열기
                  </button>
                </div>
              </div>
            ) : mode === "edit" ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  값을 수정한 뒤 오른쪽 위의 저장 버튼을 누르세요.
                </div>
                <EditValue value={editData} path={[]} onChange={updateEditData} />
              </div>
            ) : (
              <ViewValue value={selectedData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
