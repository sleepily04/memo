import type { MemoLabel } from "@/data/memos";

export const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

export const LABEL_NAMES: Record<MemoLabel, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
};

/* 메모 색 라벨 → 토큰 클래스. Tailwind가 찾을 수 있게 전체 클래스 이름으로 적는다. */
export const LABEL_STYLES: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

export const LABEL_DOT: Record<MemoLabel, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};
