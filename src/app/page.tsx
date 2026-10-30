import { Suspense } from "react";
import { HomeScreen } from "@/components/home-screen";
import { getMemos } from "@/lib/memos";

async function HomeData() {
  const memos = await getMemos();
  return <HomeScreen memos={memos} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <HomeData />
    </Suspense>
  );
}
