"use client";

import { useRouter } from "next/navigation";
import { useEffect,useRef, useState, useSyncExternalStore } from "react";
import { CATEGORIES, type MemoLabel } from "@/data/memos";
import { fillEditor, parseEditor } from "@/lib/editor-content";
import { clearDraft, readDraft, saveDraft, saveMemo } from "@/lib/memo-store";
import { LEAVE_TIMELINE, MOTION } from "@/lib/screen-motion";
import { Chip } from "./chip";
import { LABEL_DOT, LABEL_NAMES, LABELS } from "./label-styles";
import { PrimaryButton } from "./primary-button";
import { Reveal } from "./reveal";
import { BackButton, ScreenMotion, useGoHome } from "./screen-motion";

type FormatState = { bold: boolean; heading: boolean; subheading: boolean; list: boolean };

const NO_FORMAT: FormatState = { bold: false, heading: false, subheading: false, list: false };

/* 커서가 있는 글자의 서식을 읽는다. */
function readFormat(): FormatState {
  const block = document.queryCommandValue("formatBlock").toLowerCase();
  return {
    bold: document.queryCommandState("bold"),
    heading: block === "h1" || block === "h2",
    subheading: /^h[3-6]$/.test(block),
    list: document.queryCommandState("insertUnorderedList"),
  };
}

function FormatButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      /* 눌러도 편집 영역의 커서와 선택이 풀리지 않게 한다. */
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`flex h-[36px] items-center justify-center rounded-sm px-space-12 text-label-md whitespace-nowrap ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}

function LabelDot({
  label,
  selected,
  onSelect,
}: {
  label: MemoLabel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${LABEL_NAMES[label]} 색`}
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex size-[32px] items-center justify-center rounded-full border-2 ${
        selected ? "border-primary" : "border-transparent"
      }`}
    >
      <span className={`size-[22px] rounded-full ${LABEL_DOT[label]}`} />
    </button>
  );
}

function WriteNav({ autoSaved }: { autoSaved: boolean }) {
  return (
    <nav className="flex items-center justify-between">
      <BackButton />
      {autoSaved && <p className="text-caption-sm whitespace-nowrap text-text-muted">자동 저장됨</p>}
    </nav>
  );
}

function WriteForm() {
  const goHome = useGoHome();
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [draft] = useState(readDraft);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState(draft?.category ?? CATEGORIES[0]);
  const [label, setLabel] = useState<MemoLabel>(draft?.label ?? LABELS[0]);
  const [empty, setEmpty] = useState(!draft || draft.blocks.length === 0);
  const [revision, setRevision] = useState(0);
  const [format, setFormat] = useState(NO_FORMAT);
  /* 저장에 실패한 순간의 내용. 그 뒤 무엇이든 고치면 달라져서 안내 문구가 사라진다. */
  const [failedAt, setFailedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editKey = JSON.stringify([title, category, label, revision]);
  const failed = failedAt === editKey;

  useEffect(() => {
    if (draft && editorRef.current) fillEditor(editorRef.current, draft.blocks);
    document.execCommand("defaultParagraphSeparator", false, "p");
  }, [draft]);

  useEffect(() => {
    const update = () => {
      const anchor = document.getSelection()?.anchorNode ?? null;
      if (anchor && editorRef.current?.contains(anchor)) setFormat(readFormat());
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  /* 입력할 때마다 임시 저장한다. 아무것도 없으면 지운다. */
  useEffect(() => {
    if (!editorRef.current) return;
    if (!title.trim() && empty) {
      clearDraft();
      return;
    }
    saveDraft({ title, category, label, blocks: parseEditor(editorRef.current) });
  }, [title, category, label, empty, revision]);

  const runFormat = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setRevision((count) => count + 1);
    setFormat(readFormat());
  };

  const toggleBlock = (tag: "h2" | "h3", active: boolean) =>
    runFormat("formatBlock", active ? "<p>" : `<${tag}>`);

  const canSave = title.trim().length > 0;

  const save = async () => {
    if (!canSave || !editorRef.current || saving) return;
    setSaving(true);
    const saved = await saveMemo({ title, category, label, blocks: parseEditor(editorRef.current) });
    setSaving(false);
    if (!saved) {
      setFailedAt(editKey);
      return;
    }
    clearDraft();
    /* 홈이 예전 목록을 재사용하지 않게, 저장한 직후 화면 캐시를 비운다. */
    router.refresh();
    goHome();
  };

  return (
    <>
      <Reveal {...MOTION.navBar}>
        <WriteNav autoSaved={title.trim().length > 0 || !empty} />
      </Reveal>
      <main className="flex-1">
        <Reveal className="flex flex-col gap-space-12" {...MOTION.content}>
          <label className="flex flex-col gap-space-4 rounded-lg bg-surface-card px-space-20 py-space-16 outline-2 outline-transparent focus-within:outline-primary">
            <span className="text-caption-sm text-text-muted">제목</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>

          <div className="flex flex-col gap-space-12 px-space-8 py-space-4">
            <div className="flex items-center gap-space-8">
              <span className="text-caption-sm whitespace-nowrap text-text-muted">분류</span>
              {CATEGORIES.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  selected={category === name}
                  onClick={() => setCategory(name)}
                />
              ))}
            </div>
            <div className="flex items-center gap-space-8">
              <span className="text-caption-sm whitespace-nowrap text-text-muted">색</span>
              {LABELS.map((name) => (
                <LabelDot
                  key={name}
                  label={name}
                  selected={label === name}
                  onSelect={() => setLabel(name)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-lg bg-surface-card outline-2 outline-transparent focus-within:outline-primary">
            <div className="flex h-[52px] items-center gap-space-4 px-space-12">
              <FormatButton label="B" active={format.bold} onClick={() => runFormat("bold")} />
              <FormatButton
                label="제목"
                active={format.heading}
                onClick={() => toggleBlock("h2", format.heading)}
              />
              <FormatButton
                label="소제목"
                active={format.subheading}
                onClick={() => toggleBlock("h3", format.subheading)}
              />
              <FormatButton
                label="목록"
                active={format.list}
                onClick={() => runFormat("insertUnorderedList")}
              />
            </div>
            <hr className="h-px border-0 bg-border-default" />
            <div className="relative min-h-[200px] flex-1 px-space-20 py-space-16">
              {empty && (
                <p className="pointer-events-none absolute text-body-md text-text-muted">
                  내용을 입력하세요
                </p>
              )}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label="본문"
                onInput={(event) => {
                  setEmpty(!(event.currentTarget.textContent ?? "").trim());
                  setRevision((count) => count + 1);
                }}
                className="flex min-h-[168px] flex-col gap-space-8 text-body-md text-text-secondary outline-none [&_b]:font-bold [&_b]:text-text-primary [&_h2]:text-title-lg [&_h2]:text-text-primary [&_h3]:text-title-md [&_h3]:text-text-primary [&_li]:pl-space-4 [&_ul]:list-disc [&_ul]:pl-space-20"
              />
            </div>
          </div>
        </Reveal>
      </main>

      <div className="sticky bottom-0 bg-surface-page pb-space-34 pt-space-16">
        <Reveal {...MOTION.button}>
          {failed && (
            <p role="alert" className="pb-space-8 text-center text-caption-sm text-text-muted">
              저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.
            </p>
          )}
          <PrimaryButton onClick={save} disabled={!canSave || saving}>
            저장하기
          </PrimaryButton>
        </Reveal>
      </div>
    </>
  );
}

const subscribeNothing = () => () => {};

export function WriteScreen() {
  /* 임시 저장본은 브라우저에만 있어서, 화면이 브라우저에 붙은 뒤에 그린다. */
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);

  return (
    <ScreenMotion leaveDuration={LEAVE_TIMELINE}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col gap-space-16 px-space-16 pt-space-48">
        {mounted && <WriteForm />}
      </div>
    </ScreenMotion>
  );
}
