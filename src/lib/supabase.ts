import { createClient } from "@supabase/supabase-js";

/* 공개 키로 만든 연결. 접근 범위는 Supabase의 RLS 정책이 정한다. */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
