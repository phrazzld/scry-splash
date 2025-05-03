"use client"

import { SplashPage } from "@/components/organisms/splash-page";
import { ThemeSwitch } from "@/components/ui/theme-switch";

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
      {/* Theme switch component for testing - can be removed in production */}
      <ThemeSwitch />
    </main>
  );
}