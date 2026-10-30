import type { MemoBlock, TextRun } from "@/data/memos";

function isBold(element: HTMLElement) {
  const weight = element.style.fontWeight;
  return (
    element.tagName === "B" ||
    element.tagName === "STRONG" ||
    weight === "bold" ||
    Number(weight) >= 600
  );
}

function readLines(node: Node, bold: boolean, lines: TextRun[][]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? "").replace(/ /g, " ");
    if (text) lines[lines.length - 1].push({ text, bold });
    return;
  }
  if (!(node instanceof HTMLElement)) return;
  if (node.tagName === "BR") {
    lines.push([]);
    return;
  }
  const nextBold = bold || isBold(node);
  node.childNodes.forEach((child) => readLines(child, nextBold, lines));
}

/* 같은 서식이 이어지는 글자를 하나로 합치고, 빈 줄은 뺀다. */
function toParagraph(nodes: Node[]): MemoBlock | null {
  const lines: TextRun[][] = [[]];
  nodes.forEach((node) => readLines(node, false, lines));
  const cleaned = lines
    .map((line) =>
      line.reduce<TextRun[]>((runs, run) => {
        const last = runs[runs.length - 1];
        if (last && Boolean(last.bold) === Boolean(run.bold)) last.text += run.text;
        else runs.push({ text: run.text, ...(run.bold ? { bold: true } : {}) });
        return runs;
      }, []),
    )
    .filter((line) => line.some((run) => run.text.trim()));
  return cleaned.length > 0 ? { type: "paragraph", lines: cleaned } : null;
}

/* 편집 영역의 화면 구조를 메모 데이터(제목·소제목·글·목록)로 바꾼다.
   브라우저가 줄을 p·div로 감싸고 그 안에 목록을 넣기도 해서, 블록 요소는 깊이와 상관없이 따로 읽는다. */
export function parseEditor(root: HTMLElement): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  let loose: Node[] = [];

  const flushLoose = () => {
    const paragraph = toParagraph(loose);
    if (paragraph) blocks.push(paragraph);
    loose = [];
  };

  const walk = (nodes: NodeListOf<ChildNode>) => {
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        loose.push(node);
        return;
      }
      const text = (node.textContent ?? "").replace(/ /g, " ").trim();
      if (node.tagName === "H1" || node.tagName === "H2") {
        flushLoose();
        if (text) blocks.push({ type: "heading", text });
      } else if (/^H[3-6]$/.test(node.tagName)) {
        flushLoose();
        if (text) blocks.push({ type: "subheading", text });
      } else if (node.tagName === "UL" || node.tagName === "OL") {
        flushLoose();
        const items = [...node.querySelectorAll("li")]
          .map((li) => (li.textContent ?? "").replace(/ /g, " ").trim())
          .filter(Boolean);
        if (items.length > 0) blocks.push({ type: "list", items });
      } else if (node.tagName === "P" || node.tagName === "DIV") {
        flushLoose();
        walk(node.childNodes);
        flushLoose();
      } else {
        loose.push(node);
      }
    });
  };

  walk(root.childNodes);
  flushLoose();
  return blocks;
}

/* 저장해 둔 메모 데이터를 편집 영역에 다시 채운다. 글자는 textContent로만 넣어 HTML로 해석되지 않는다. */
export function fillEditor(root: HTMLElement, blocks: MemoBlock[]) {
  root.replaceChildren(
    ...blocks.map((block) => {
      if (block.type === "paragraph") {
        const paragraph = document.createElement("p");
        block.lines.forEach((line, index) => {
          if (index > 0) paragraph.append(document.createElement("br"));
          line.forEach((run) => {
            if (run.bold) {
              const strong = document.createElement("b");
              strong.textContent = run.text;
              paragraph.append(strong);
            } else {
              paragraph.append(run.text);
            }
          });
        });
        return paragraph;
      }
      if (block.type === "list") {
        const list = document.createElement("ul");
        block.items.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          list.append(li);
        });
        return list;
      }
      const heading = document.createElement(block.type === "heading" ? "h2" : "h3");
      heading.textContent = block.text;
      return heading;
    }),
  );
}
