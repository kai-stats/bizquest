import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "BizQuest — ビジネスを、もっと気軽に、もっと実践的に",
  description: "マーケティング、起業家精神、経営戦略。実践的な課題に取り組みながらビジネススキルを磨ける学習プラットフォーム。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
