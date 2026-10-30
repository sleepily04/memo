"use client";

import { useState } from "react";
import { CATEGORIES, type Memo, type MemoCategory } from "@/data/memos";
import { Card, CardHeader } from "./card";
import { Chip } from "./chip";
import { IconPlus } from "./icons";
import { MemoItem } from "./memo-item";
import { PrimaryButton } from "./primary-button";

export function HomeScreen({ memos: allMemos }: { memos: Memo[] }) {
  const [category, setCategory] = useState<MemoCategory | null>(null);
  const memos = allMemos.filter(
    (memo) => category === null || memo.category === category,
  );
  const pinned = memos.filter((memo) => memo.pinned);
  const recent = memos.filter((memo) => !memo.pinned);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-space-16 pt-space-64">
      <main className="flex flex-1 flex-col gap-space-16">
        <header className="flex flex-col gap-space-8 px-space-8">
          <p className="text-caption-md text-text-muted">10월 30일 금요일</p>
          <h1 className="text-heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">{allMemos.length}개</span> 남겼어요
          </h1>
        </header>

        <div className="flex gap-space-8 overflow-x-auto px-space-4">
          <Chip label="전체" selected={category === null} onClick={() => setCategory(null)} />
          {CATEGORIES.map((name) => (
            <Chip
              key={name}
              label={name}
              selected={category === name}
              onClick={() => setCategory(name)}
            />
          ))}
        </div>

        {pinned.length > 0 && (
          <Card>
            <CardHeader title="고정한 메모" pin />
            {pinned.map((memo) => (
              <MemoItem key={memo.id} memo={memo} />
            ))}
          </Card>
        )}

        {recent.length > 0 && (
          <Card>
            <CardHeader title="최근 메모" action />
            {recent.map((memo) => (
              <MemoItem key={memo.id} memo={memo} />
            ))}
          </Card>
        )}
      </main>

      <div className="sticky bottom-0 bg-surface-page pb-space-34 pt-space-16">
        <PrimaryButton icon={<IconPlus />} href="/write">
          새 메모 쓰기
        </PrimaryButton>
      </div>
    </div>
  );
}
