import Link from "next/link";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  /** 있으면 링크로 이동한다. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const BASE_CLASS =
  "flex h-[56px] w-full items-center justify-center gap-space-8 rounded-md px-space-24 text-button-md";

/* 화면의 주 버튼. 화면마다 하나, 아래에 가로로 꽉 차게 둔다. */
export function PrimaryButton({ icon, children, href, onClick, disabled = false }: PrimaryButtonProps) {
  if (href) {
    return (
      <Link href={href} className={`${BASE_CLASS} bg-primary text-text-on-primary`}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${BASE_CLASS} ${
        disabled ? "bg-border-default text-text-muted" : "bg-primary text-text-on-primary"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
