import { CATEGORIES, type MemoBlock, type MemoCategory, type MemoLabel } from "@/data/memos";
import { LABELS } from "@/components/label-styles";
import { supabase } from "./supabase";

const DRAFT_KEY = "memo-app:draft";

export type Draft = {
  title: string;
  category: MemoCategory;
  label: MemoLabel;
  blocks: MemoBlock[];
};

/* 임시 저장본은 이 브라우저에만 둔다. 저장소 접근은 시크릿 모드·용량 초과 등으로 실패할 수 있어 모두 감싼다. */
function readItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* 임시 저장은 못 해도 글쓰기에는 영향이 없다. */
  }
}

function isBlock(value: unknown): value is MemoBlock {
  if (typeof value !== "object" || value === null) return false;
  const block = value as Record<string, unknown>;
  switch (block.type) {
    case "heading":
    case "subheading":
      return typeof block.text === "string";
    case "list":
      return Array.isArray(block.items) && block.items.every((item) => typeof item === "string");
    case "paragraph":
      return (
        Array.isArray(block.lines) &&
        block.lines.every(
          (line) =>
            Array.isArray(line) &&
            line.every((run) => typeof run?.text === "string"),
        )
      );
    default:
      return false;
  }
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isCategory(value: unknown): value is MemoCategory {
  return CATEGORIES.includes(value as MemoCategory);
}

function isLabel(value: unknown): value is MemoLabel {
  return LABELS.includes(value as MemoLabel);
}

function makePreview(blocks: MemoBlock[]) {
  for (const block of blocks) {
    if (block.type === "paragraph") {
      const text = block.lines[0]?.map((run) => run.text).join("") ?? "";
      if (text.trim()) return text.trim();
    }
    if (block.type === "list" && block.items[0]) return block.items[0];
  }
  const first = blocks[0];
  return first && (first.type === "heading" || first.type === "subheading") ? first.text : "";
}

type NewMemo = Pick<Draft, "title" | "category" | "label" | "blocks">;

/* 새 메모를 Supabase에 저장한다. 저장하지 못하면 false. */
export async function saveMemo({ title, category, label, blocks }: NewMemo) {
  try {
    const { error } = await supabase.from("memos").insert({
      title: title.trim(),
      preview: makePreview(blocks),
      category,
      label,
      body: blocks,
    });
    return !error;
  } catch {
    return false;
  }
}

export function readDraft(): Draft | null {
  const data = parseJson(readItem(DRAFT_KEY)) as Partial<Draft> | null;
  if (!data || typeof data.title !== "string" || !isCategory(data.category) || !isLabel(data.label)) {
    return null;
  }
  const blocks = Array.isArray(data.blocks) ? data.blocks.filter(isBlock) : [];
  return { title: data.title, category: data.category, label: data.label, blocks };
}

export function saveDraft(draft: Draft) {
  writeItem(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  writeItem(DRAFT_KEY, null);
}
