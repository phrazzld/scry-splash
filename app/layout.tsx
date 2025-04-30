import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

// Note: IBM Plex Sans is loaded directly via @font-face in globals.css
// We don't use Next.js font loader for IBM Plex Sans to avoid conflicts

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scry | Memorize less. Learn more.",
  description: "Transform your notes into personalized learning experiences with AI-powered flashcards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
