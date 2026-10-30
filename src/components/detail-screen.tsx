import type { Memo, MemoBlock } from "@/data/memos";
import { LEAVE_TIMELINE, MOTION } from "@/lib/screen-motion";
import { IconButton } from "./icon-button";
import { IconMore, IconPin, IconShare } from "./icons";
import { LABEL_STYLES } from "./label-styles";
import { PrimaryButton } from "./primary-button";
import { Reveal } from "./reveal";
import { BackButton, ScreenMotion } from "./screen-motion";

function BodyBlock({ block }: { block: MemoBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="text-title-lg text-text-primary">{block.text}</h2>;
    case "subheading":
      return <h3 className="text-title-md text-text-primary">{block.text}</h3>;
    case "paragraph":
      return (
        <p className="text-body-md text-text-secondary">
          {block.lines.map((line, i) => (
            <span key={i} className="block">
              {line.map((run, j) =>
                run.bold ? (
                  <strong key={j} className="font-bold text-text-primary">
                    {run.text}
                  </strong>
                ) : (
                  <span key={j}>{run.text}</span>
                ),
              )}
            </span>
          ))}
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-space-4 text-body-md text-text-secondary">
          {block.items.map((item) => (
            <li key={item} className="flex gap-space-8">
              <span aria-hidden="true">•</span>
              <span className="min-w-[0px] flex-1">{item}</span>
            </li>
          ))}
        </ul>
      );
  }
}

function DetailContent({ memo }: { memo: Memo }) {
  const body: MemoBlock[] = memo.body ?? [
    { type: "paragraph", lines: [[{ text: memo.preview }]] },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48">
      <Reveal {...MOTION.navBar}>
        <nav className="flex items-center justify-between">
          <BackButton />
          <div className="flex">
            <IconButton label="고정">
              <IconPin />
            </IconButton>
            <IconButton label="공유">
              <IconShare />
            </IconButton>
            <IconButton label="더보기">
              <IconMore />
            </IconButton>
          </div>
        </nav>
      </Reveal>

      <main className="flex-1">
        <Reveal {...MOTION.content}>
          <article className="flex flex-col gap-space-12 rounded-xl bg-surface-card px-space-20 py-space-24">
            <div className="flex items-center gap-space-8">
              <span
                className={`flex h-[26px] items-center rounded-full px-space-8 text-caption-sm whitespace-nowrap ${LABEL_STYLES[memo.label]}`}
              >
                {memo.category}
              </span>
              <time className="text-caption-sm whitespace-nowrap text-text-muted">
                {memo.createdAt}
              </time>
            </div>
            <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
            <hr className="h-px border-0 bg-border-default" />
            <div className="flex flex-col gap-space-12">
              {body.map((block, i) => (
                <BodyBlock key={i} block={block} />
              ))}
            </div>
          </article>
        </Reveal>
      </main>

      <div className="sticky bottom-0 bg-surface-page pb-space-34 pt-space-16">
        <Reveal {...MOTION.button}>
          <PrimaryButton>수정하기</PrimaryButton>
        </Reveal>
      </div>
    </div>
  );
}

export function DetailScreen({ memo }: { memo: Memo }) {
  return (
    <ScreenMotion leaveDuration={LEAVE_TIMELINE}>
      <DetailContent memo={memo} />
    </ScreenMotion>
  );
}
