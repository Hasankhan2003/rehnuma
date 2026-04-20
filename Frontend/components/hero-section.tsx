"use client"

interface HeroSectionProps {
  onScrollToInput: () => void
}

export function HeroSection({ onScrollToInput }: HeroSectionProps) {
  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* Floating Shapes */}
      <div className="absolute w-full h-full overflow-hidden z-[1]">
        <div
          className="absolute opacity-10 animate-float rounded-full"
          style={{
            top: "20%",
            left: "10%",
            width: "80px",
            height: "80px",
            background: "var(--rehnuma-primary)",
            animationDelay: "0s",
          }}
        />
        <div
          className="absolute opacity-10 animate-float"
          style={{
            top: "60%",
            right: "15%",
            width: "60px",
            height: "60px",
            background: "var(--rehnuma-secondary)",
            borderRadius: "30%",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute opacity-10 animate-float"
          style={{
            bottom: "30%",
            left: "20%",
            width: "40px",
            height: "40px",
            background: "var(--rehnuma-accent)",
            borderRadius: "20%",
            animationDelay: "4s",
          }}
        />
        <div
          className="absolute opacity-10 animate-float rounded-full"
          style={{
            top: "40%",
            right: "30%",
            width: "50px",
            height: "50px",
            background: "var(--rehnuma-primary-light)",
            animationDelay: "1s",
          }}
        />
      </div>

      <div className="container max-w-[1200px] mx-auto px-6 relative z-[2]">
        <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">
          <h2
            className="text-[4rem] md:text-[4rem] text-[2.5rem] font-bold mb-8 leading-[1.1] bg-gradient-to-r from-[var(--rehnuma-primary)] to-[var(--rehnuma-primary-light)] bg-clip-text"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "clamp(2rem, 8vw, 4rem)",
            }}
          >
            Mathematical Concepts
            <br />
            Made Visual
          </h2>
          <p
            className="text-[1.4rem] text-[var(--text-secondary)] mb-12 leading-relaxed font-normal max-w-[700px] mx-auto"
            style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)" }}
          >
            Transform complex Statistical concepts into beautiful, interactive animations.
            <br />
            Learn faster, understand deeper.
          </p>
          {/* CTA Button */}
          <button
            className="inline-flex items-center justify-center gap-2 py-5 px-10 text-[1.2rem] font-semibold text-white rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={onScrollToInput}
          >
            <i className="fas fa-sparkles"></i>
            Start Creating
          </button>

          <div
            className="mt-16 text-[var(--text-muted)] cursor-pointer animate-bounce-scroll"
            onClick={onScrollToInput}
          >
            <div className="text-center">
              <div className="text-[0.85rem] mb-2 font-medium">Scroll to explore</div>
              <i className="fas fa-chevron-down text-[1.2rem]"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
