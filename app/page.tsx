import { SplashPage } from "@/components/organisms/splash-page";

export const metadata = {
  title: 'Scry - Remember effortlessly',
  description: 'Turns your notes into spaced-repetition prompts—automatically',
  keywords: 'spaced repetition, learning, notes, memory, flashcards, knowledge management',
  openGraph: {
    title: 'Scry - Remember effortlessly',
    description: 'Turns your notes into spaced-repetition prompts—automatically',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scry - Remember effortlessly',
    description: 'Turns your notes into spaced-repetition prompts—automatically',
  },
};

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