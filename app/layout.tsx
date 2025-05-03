import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { metadata as pageMetadata } from "./metadata";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeScript } from "@/components/ui/theme-script";

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
      <head>
        <ThemeScript 
          defaultTheme="system"
          storageKey="scry-ui-theme"
          attribute="class"
        />
      </head>
      <body className={`${geistMono.variable} bg-background text-foreground`}>
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
