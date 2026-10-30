/* Figma Mobile/Detail 타임라인에서 가져온 진입 모션 (초). 상세 화면과 작성 화면이 같은 모션을 쓴다. */
export const TIMELINE = 0.5;

const ENTER = {
  navBar: { duration: 0.25 },
  content: { delay: 0.05, duration: 0.4 },
  button: { delay: 0.15, duration: 0.35 },
};

/* 나가는 모션은 진입 모션을 시간 순서만 거꾸로 돌린 것이고, 진입보다 LEAVE_SPEED배 빠르다. */
const LEAVE_SPEED = 2;
export const LEAVE_TIMELINE = TIMELINE / LEAVE_SPEED;

function reverse({ delay = 0, duration }: { delay?: number; duration: number }) {
  return {
    delay: (TIMELINE - delay - duration) / LEAVE_SPEED,
    duration: duration / LEAVE_SPEED,
  };
}

export const MOTION = {
  navBar: { blur: "4px", enter: ENTER.navBar, leave: reverse(ENTER.navBar) },
  content: { y: 24, blur: "8px", enter: ENTER.content, leave: reverse(ENTER.content) },
  button: { y: 16, blur: "6px", enter: ENTER.button, leave: reverse(ENTER.button) },
};
