import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

// IBM Plex Sans is loaded via @font-face in globals.css
// We'll create a CSS variable for it to be consistent with Next.js font handling
const ibmPlexSans = {
  variable: "--font-ibm-plex-sans"
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body
        className={`${ibmPlexSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
