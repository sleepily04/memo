export type MemoLabel = "blue" | "green" | "orange" | "pink";
export type MemoCategory = "업무" | "개인" | "아이디어";

export type TextRun = { text: string; bold?: boolean };
export type MemoBlock =
  | { type: "heading" | "subheading"; text: string }
  | { type: "paragraph"; lines: TextRun[][] }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  dateLabel: string;
  createdAt: string;
  label: MemoLabel;
  category: MemoCategory;
  pinned: boolean;
  body?: MemoBlock[];
};

export const CATEGORIES: MemoCategory[] = ["업무", "개인", "아이디어"];
