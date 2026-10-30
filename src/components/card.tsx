import type { ReactNode } from "react";
import { IconChevronRight, IconPin } from "./icons";

export function Card({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-surface-card py-space-8">
      {children}
    </section>
  );
}

type CardHeaderProps = {
  title: string;
  pin?: boolean;
  action?: boolean;
};

/* 카드 머리글. pin은 고정 표시, action은 오른쪽 전체 보기. */
export function CardHeader({ title, pin = false, action = false }: CardHeaderProps) {
  return (
    <div className="flex h-[40px] items-center gap-space-4 pb-space-4 pl-space-20 pr-space-16 pt-space-12">
      {pin && <IconPin small className="text-primary" />}
      <h2 className="min-w-[0px] flex-1 text-label-md text-text-primary">{title}</h2>
      {action && (
        <button
          type="button"
          className="flex items-center gap-space-4 text-caption-md whitespace-nowrap text-text-muted"
        >
          전체 보기
          <IconChevronRight />
        </button>
      )}
    </div>
  );
}
