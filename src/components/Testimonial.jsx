// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useEffect, useRef, useState } from "react";
import Container from "./Container";

// =====================================================================
// SECTION: SUBCOMPONENT – Animated Quote (word‑by‑word)
// =====================================================================
const AnimatedQuote = ({ text }) => {
  const words = text.split(" ");

  return (
    <blockquote className="font-headline-md text-xl sm:text-3xl md:text-4xl text-on-surface italic leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8">
      {words.map((word, index) => {
        // Alternate direction: even -> left, odd -> right
        const direction = index % 2 === 0 ? "-50px" : "50px";
        const delay = Math.min(index * 0.08, 1);
        return (
          <span
            key={index}
            className="inline-block opacity-0"
            style={{
              // Set custom property for starting position
              "--tx": direction,
              animation: `slideInWord 0.5s ease-out ${delay}s forwards`,
            }}
          >
            {word}&nbsp;
          </span>
        );
      })}
    </blockquote>
  );
};

// =====================================================================
// SECTION: SUBCOMPONENT – Testimonial Card
// =====================================================================
const TestimonialCard = ({ quote, author }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 sm:p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
      {/* Quote icon */}
      <span
        className="material-symbols-outlined text-primary text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 transition-transform duration-700 hover:scale-110"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        format_quote
      </span>

      <AnimatedQuote text={quote} />

      {/* Author – slides in from left */}
      <cite
        className="font-label-caps text-xs sm:text-sm md:text-base text-primary uppercase tracking-widest opacity-0"
        style={{
          "--tx": "-30px",
          animation: `slideInWord 0.8s ease-out 1.2s forwards`,
        }}
      >
        — {author}
      </cite>
    </div>
  );
};

// =====================================================================
// SECTION: MAIN COMPONENT – Testimonial
// =====================================================================
export default function Testimonial() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 bg-background">
      <section
        ref={sectionRef}
        className="relative w-full"
        id="testimonial"
      >
        <Container>
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <TestimonialCard
              quote="Rushi has an uncanny ability to find beauty in the most unexpected places. Her work for our wedding didn't just document the day; it transformed it into a masterpiece of memory."
              author="Shruti &amp; Ajay"
            />
          </div>
        </Container>
      </section>

      {/* ===== KEYFRAME ANIMATIONS ===== */}
      <style>{`
        @keyframes slideInWord {
          0% {
            opacity: 0;
            transform: translateX(var(--tx, -30px));
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Material Icons – clean */
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}