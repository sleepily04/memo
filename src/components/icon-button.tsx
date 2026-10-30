import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type IconButtonProps = {
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
};

const CLASS_NAME =
  "flex size-[40px] items-center justify-center rounded-sm text-text-primary";

/* 40×40 누르는 영역 가운데에 아이콘을 둔다. href가 있으면 링크로 이동한다. */
export function IconButton({ label, href, onClick, children }: IconButtonProps) {
  if (href) {
    return (
      <Link href={href} aria-label={label} onClick={onClick} className={CLASS_NAME}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={CLASS_NAME}>
      {children}
    </button>
  );
}
