import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "메모",
  description: "메모 앱",
  applicationName: "memo",
  /* iPhone은 manifest 대신 이 설정으로 이름·아이콘·앱 모드를 읽는다. */
  appleWebApp: { capable: true, title: "memo", statusBarStyle: "default" },
  icons: { apple: "/icons/icon-180.png" },
};

export const viewport: Viewport = {
  themeColor: "#3182f6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
