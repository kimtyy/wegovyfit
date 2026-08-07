import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "위고비핏 (WegovyFit.ai) - GLP-1 비만 다이어트 AI 근손실·부작용 케어",
  description: "위고비, 마운자로, 삭센다 복용자를 위한 1:1 AI 근손실 방지 & 맞춤 영양 케어 솔루션. Google DeepMind 생명과학 데이터 기반.",
  keywords: ["위고비", "마운자로", "삭센다", "GLP-1", "위고비부작용", "위고비근손실", "위고비다이어트", "WegovyFit"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
