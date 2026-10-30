"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/* 화면에 들어올 때 0에서 value까지 올라가는 숫자. 모션 줄이기 설정이면 바로 value를 보여 준다. */
export function CountUp({ value, duration = 0.16 }: { value: number; duration?: number }) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setShown(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, duration, reduceMotion]);

  return <span className="tabular-nums">{reduceMotion ? value : shown}</span>;
}
