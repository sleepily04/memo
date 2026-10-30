import type { Memo, MemoBlock, MemoCategory, MemoLabel } from "@/data/memos";
import { supabase } from "./supabase";

type MemoRow = {
  id: string;
  title: string;
  preview: string;
  body: MemoBlock[] | null;
  category: MemoCategory;
  label: MemoLabel;
  pinned: boolean;
  created_at: string;
};

const TIME_ZONE = "Asia/Seoul";

/* 한국 시간 기준 날짜 조각. 서버와 브라우저가 같은 결과를 내도록 시간대를 고정한다. */
function parts(date: Date) {
  const map: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)) {
    map[part.type] = part.value;
  }
  return {
    day: new Date(Date.UTC(+map.year, +map.month - 1, +map.day)),
    month: +map.month,
    date: +map.day,
    hours: +map.hour,
    minutes: map.minute,
  };
}

function toMemo(row: MemoRow): Memo {
  const saved = parts(new Date(row.created_at));
  const now = parts(new Date());
  const gap = Math.round((now.day.getTime() - saved.day.getTime()) / 86_400_000);
  const day = `${saved.month}월 ${saved.date}일`;

  return {
    id: row.id,
    title: row.title,
    preview: row.preview,
    category: row.category,
    label: row.label,
    pinned: row.pinned,
    body: row.body ?? undefined,
    dateLabel: gap === 0 ? "오늘" : gap === 1 ? "어제" : day,
    createdAt: `${day} ${saved.hours < 12 ? "오전" : "오후"} ${saved.hours % 12 || 12}:${saved.minutes}`,
  };
}

/* 모든 메모(최신 순). */
export async function getMemos(): Promise<Memo[]> {
  const { data, error } = await supabase
    .from("memos")
    .select("*")
    .order("created_at", { ascending: false })
    .overrideTypes<MemoRow[]>();
  if (error) throw new Error(error.message);
  return data.map(toMemo);
}

/* 메모 하나. 없으면 null. */
export async function getMemo(id: string): Promise<Memo | null> {
  const { data, error } = await supabase
    .from("memos")
    .select("*")
    .eq("id", id)
    .maybeSingle<MemoRow>();
  if (error) throw new Error(error.message);
  return data ? toMemo(data) : null;
}
