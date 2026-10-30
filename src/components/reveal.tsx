"use client";

import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { BlurFade } from "./magicui/blur-fade";
import { useLeaving } from "./screen-motion";

type Timing = {
  /** 시작 전 대기 시간(초). */
  delay?: number;
  /** 움직이는 시간(초). */
  duration: number;
};

type RevealProps = {
  /** 아래에서 올라오는 거리(px). */
  y?: number;
  /** 흐림 정도. 클수록 멀리서 다가오는 느낌이 난다. */
  blur?: string;
  enter: Timing;
  leave: Timing;
  className?: string;
  children: ReactNode;
};

/* 깊이 들어가기(depth-in): 흐릿하고 낮은 곳에서 초점이 맞으며 다가온다(ease-out). 나갈 때는 초점이 풀리며 물러난다(ease-in). 모션 줄이기 설정이면 바로 보여 준다. */
export function Reveal({ y = 0, blur = "6px", enter, leave, className, children }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const leaving = useLeaving();
  if (reduceMotion) return <div className={className}>{children}</div>;

  const { delay = 0, duration } = leaving ? leave : enter;
  return (
    <BlurFade
      direction="up"
      offset={y}
      blur={blur}
      delay={delay}
      duration={duration}
      leaving={leaving}
      className={className}
    >
      {children}
    </BlurFade>
  );
}
