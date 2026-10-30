import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DetailScreen } from "@/components/detail-screen";
import { getMemo } from "@/lib/memos";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function MemoDetail({ params }: Pick<PageProps<"/memo/[id]">, "params">) {
  const { id } = await params;
  const memo = UUID.test(id) ? await getMemo(id) : null;
  if (!memo) notFound();
  return <DetailScreen memo={memo} />;
}

/* 메모는 Supabase에서 읽어 오므로, 읽는 동안 빈 자리를 먼저 보여준다. */
export default function MemoDetailPage({ params }: PageProps<"/memo/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <MemoDetail params={params} />
    </Suspense>
  );
}
