export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Background gradient with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2151] to-[#4a1d7f] z-0">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-3xl px-6 py-12 text-center">
        {/* Logo area */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Scry<span className="opacity-70">.</span>
          </h1>
        </div>
        
        {/* Main headline */}
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Memorize less. <span className="text-[#b494e9]">Learn more.</span>
        </h2>
        
        {/* Subheadline */}
        <p className="mb-8 text-xl text-white/80 md:text-2xl max-w-xl">
          Transform your notes into personalized learning experiences.
        </p>
        
        {/* Feature bullets */}
        <div className="flex flex-col gap-3 mb-10 text-left">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-white/10">
              <div className="w-5 h-5 bg-[#b494e9] rounded-full animate-pulse"></div>
            </div>
            <p className="text-white/90">
              <span className="font-semibold">AI-Powered:</span> Turn simple notes into comprehensive learning materials
            </p>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-white/10">
              <div className="w-5 h-5 bg-[#b494e9] rounded-full animate-pulse"></div>
            </div>
            <p className="text-white/90">
              <span className="font-semibold">Effortless:</span> Create effective flashcards in seconds, not hours
            </p>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-white/10">
              <div className="w-5 h-5 bg-[#b494e9] rounded-full animate-pulse"></div>
            </div>
            <p className="text-white/90">
              <span className="font-semibold">Adaptive:</span> Learning that evolves with your knowledge
            </p>
          </div>
        </div>
        
        {/* CTA button */}
        <button className="px-8 py-3 text-lg font-medium text-white transition-all rounded-full bg-gradient-to-r from-[#6952b5] to-[#8a4fb7] hover:shadow-lg hover:shadow-purple-900/30 active:scale-[0.98]">
          Join the waitlist
        </button>
      </main>
    </div>
  );
}