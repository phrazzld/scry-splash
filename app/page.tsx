"use client"

import { SplashPage } from "@/components/organisms/splash-page";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { ThemeDebug } from "@/components/ui/theme-debug";

// Toggle these flags to show/hide theme development tools
// Set both to false before deploying to production
const SHOW_THEME_SWITCH = true;
const SHOW_THEME_DEBUG = false;

export default function Home() {
  // Potential analytics event handling could be added here
  const handleCtaClick = () => {
    // Example: track signup click events
    // analytics.track('signup_initiated')
  };

  return (
    <main>
      <SplashPage 
        onCtaClick={handleCtaClick}
      />
      {/* Theme testing tools - disabled in production */}
      {SHOW_THEME_SWITCH && <ThemeSwitch />}
      {SHOW_THEME_DEBUG && <ThemeDebug />}
    </main>
  );
}