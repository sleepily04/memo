"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { IconButton } from "./icon-button";
import { IconChevronLeft } from "./icons";

const LeavingContext = createContext(false);
const GoHomeContext = createContext<() => void>(() => {});

export function useLeaving() {
  return useContext(LeavingContext);
}

/* 나가는 모션을 먼저 재생하고, 끝난 뒤 home으로 이동한다. */
export function useGoHome() {
  return useContext(GoHomeContext);
}

type ScreenMotionProps = {
  /** 나가는 모션이 끝날 때까지 걸리는 시간(초). 이 시간이 지나면 home으로 이동한다. */
  leaveDuration: number;
  children: ReactNode;
};

export function ScreenMotion({ leaveDuration, children }: ScreenMotionProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const started = useRef(false);

  const goHome = useCallback(() => {
    if (started.current) return;
    started.current = true;
    if (reduceMotion) {
      router.push("/");
      return;
    }
    setLeaving(true);
    window.setTimeout(() => router.push("/"), leaveDuration * 1000);
  }, [leaveDuration, reduceMotion, router]);

  return (
    <GoHomeContext.Provider value={goHome}>
      <LeavingContext.Provider value={leaving}>{children}</LeavingContext.Provider>
    </GoHomeContext.Provider>
  );
}

export function BackButton() {
  const goHome = useGoHome();
  return (
    <IconButton
      label="뒤로가기"
      href="/"
      onClick={(event) => {
        event.preventDefault();
        goHome();
      }}
    >
      <IconChevronLeft />
    </IconButton>
  );
}
