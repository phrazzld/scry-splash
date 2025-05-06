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
        {/* Critical anti-FOUC styles to prevent page flash while the theme script executes */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Hide content until theme is applied */
              html:not(.light):not(.dark) body { 
                opacity: 0; 
                visibility: hidden; 
              }
            `
          }}
        />

        {/* 
          ThemeScript is placed immediately after the critical CSS to ensure it runs
          as early as possible in the page lifecycle, preventing FOUC
        */}
        <ThemeScript 
          defaultTheme="system"
          storageKey="scry-ui-theme"
          attribute="class"
        />
        
        {/* Add a preload mechanism to minimize FOUC */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Remove transitions during initial page load for instant theme application */
              .prevent-transition * { 
                transition: none !important; 
              }
              
              /* Show content once a theme class is applied */
              html.light body, 
              html.dark body { 
                opacity: 1; 
                visibility: visible; 
              }
              
              /* Smoothly fade theme changes after initial load */
              @media (prefers-reduced-motion: no-preference) {
                body:not(.prevent-transition) {
                  transition: background-color 0.3s ease, color 0.3s ease;
                }
              }
            `
          }}
        />
      </head>
      <body className={`${geistMono.variable} bg-background text-foreground prevent-transition`}>
        <ThemeProvider 
          defaultTheme="system"
          attribute="class"
          enableSystem={true}
          storageKey="scry-ui-theme" /* Ensure the same storageKey is used */
        >
          {children}
        </ThemeProvider>
        
        {/* Remove transition prevention after initial load */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // Wait for first contentful paint to remove transition prevention
            if ('requestAnimationFrame' in window) {
              window.requestAnimationFrame(function() {
                setTimeout(function() {
                  document.body.classList.remove('prevent-transition');
                }, 0);
              });
            }
          })();
        `}} />
      </body>
    </html>
  );
}
