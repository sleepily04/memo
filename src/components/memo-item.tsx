import Link from "next/link";
import type { Memo } from "@/data/memos";
import { IconNote } from "./icons";
import { LABEL_STYLES } from "./label-styles";

/* 메모 목록의 한 줄. 누르면 메모 상세로 이동한다. */
export function MemoItem({ memo }: { memo: Memo }) {
  return (
    <Link
      href={`/memo/${memo.id}`}
      className="flex h-[72px] items-center gap-space-16 px-space-20 py-space-12"
    >
      <span
        className={`flex size-[44px] shrink-0 items-center justify-center rounded-sm ${LABEL_STYLES[memo.label]}`}
      >
        <IconNote />
      </span>
      <span className="flex min-w-[0px] flex-1 flex-col gap-space-4">
        <span className="text-title-md text-text-primary">{memo.title}</span>
        <span className="truncate text-body-sm text-text-secondary">{memo.preview}</span>
      </span>
      <span className="text-caption-sm whitespace-nowrap text-text-muted">{memo.dateLabel}</span>
    </Link>
  );
}
