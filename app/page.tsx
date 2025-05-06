"use client"

import { SplashPage } from "@/components/organisms/splash-page";

// Theme development tools have been completely removed

export default function Home() {
  // Potential analytics event handling could be added here
  const handleCtaClick = (): void => {
    // Example: track signup click events
    // analytics.track('signup_initiated')
  };

  return (
    <main>
      <SplashPage 
        onCtaClick={handleCtaClick}
      />
      {/* Theme testing tools have been removed */}
    </main>
  );
}