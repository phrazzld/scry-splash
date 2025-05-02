"use client"

import { SplashPage } from "@/components/organisms/splash-page";


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
    </main>
  );
}