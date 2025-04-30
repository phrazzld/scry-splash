export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Background with noise texture overlay */}
      <div className="absolute inset-0 bg-ink z-0">
        <div className="absolute inset-0 opacity-[0.02]" style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
        }}>
        </div>
      </div>
      
      {/* Grid container */}
      <div className="grid-container relative z-10 px-6 mx-auto">
        {/* Main content - spans full width on mobile, 6 columns centered on desktop */}
        <main className="col-span-12 md:col-span-6 md:col-start-4 flex flex-col items-center my-vertical-lg">
          {/* Logo area - 64pt Bold */}
          <div className="mb-8">
            <h1 className="text-display font-bold text-chalk">
              Scry<span className="opacity-70">.</span>
            </h1>
          </div>
          
          {/* Tag-line - 32pt Regular */}
          <h2 className="mb-4 text-heading font-regular text-chalk text-center max-w-prose">
            Memorize less. <span className="text-purple">Learn more.</span>
          </h2>
          
          {/* Subheadline - 14pt Regular */}
          <p className="mb-8 text-body font-regular text-chalk text-center max-w-prose opacity-80">
            Transform your notes into personalized learning experiences.
          </p>
          
          {/* Feature bullets - 18pt Medium for labels, 14pt Regular for content */}
          <div className="flex flex-col gap-3 mb-10 text-left w-full max-w-prose">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-chalk opacity-10">
                <div className="w-5 h-5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-purple)' }}></div>
              </div>
              <p className="text-body text-chalk opacity-90">
                <span className="font-medium text-subheading">AI-Powered:</span> Turn simple notes into comprehensive learning materials
              </p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-chalk opacity-10">
                <div className="w-5 h-5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-purple)' }}></div>
              </div>
              <p className="text-body text-chalk opacity-90">
                <span className="font-medium text-subheading">Effortless:</span> Create effective flashcards in seconds, not hours
              </p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-chalk opacity-10">
                <div className="w-5 h-5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-purple)' }}></div>
              </div>
              <p className="text-body text-chalk opacity-90">
                <span className="font-medium text-subheading">Adaptive:</span> Learning that evolves with your knowledge
              </p>
            </div>
          </div>
          
          {/* CTA button - 18pt Medium */}
          <button className="px-8 py-3 text-subheading font-medium text-chalk transition-all rounded-full bg-cobalt hover:opacity-90 active:scale-[0.98]">
            Join the waitlist
          </button>
        </main>
      </div>
    </div>
  );
}