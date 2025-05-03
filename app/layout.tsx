import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { metadata as pageMetadata } from "./metadata";
import { ThemeProvider } from "@/components/ui/theme-provider";

// Note: IBM Plex Sans is loaded directly via @font-face in globals.css
// We don't use Next.js font loader for IBM Plex Sans to avoid conflicts

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = pageMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable}`}>
        <ThemeProvider 
          defaultTheme="system"
          attribute="class"
          enableSystem={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
