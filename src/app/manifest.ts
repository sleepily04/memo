import type { MetadataRoute } from "next";

/* 홈 화면에 추가하면 주소창 없이 앱처럼 열린다. 색은 디자인 토큰 color/primary, surface/page(Light)와 같다. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "memo",
    short_name: "memo",
    description: "메모 앱",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f2f4f6",
    theme_color: "#3182f6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
