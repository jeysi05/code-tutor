import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Tutor",
  description: "A goal-first coding tutor for learners who hate boring tutorials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}