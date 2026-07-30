// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useEffect, useRef, useState } from "react";
import Container from "./Container";

// =====================================================================
// SECTION: CONSTANTS
// =====================================================================
const STUDIO_PHONE = "+919322749473";
const WHATSAPP_MESSAGE = "Hi, I'm interested in booking a session. Can you share more information?";

// =====================================================================
// SECTION: SUBCOMPONENT – Glass Button
// =====================================================================
const GlassButton = ({ children, onClick, variant = "primary", className = "" }) => {
  const baseClasses = `
    group relative w-full sm:w-auto px-8 sm:px-10 md:px-12 
    py-4 sm:py-4 md:py-5 
    font-label-caps text-sm md:text-base font-bold 
    uppercase tracking-[0.2em] 
    rounded-full 
    transition-all duration-500 
    hover:scale-105 
    active:scale-95 
    overflow-hidden
    backdrop-blur-sm
    cursor-pointer
    ${className}
  `;

  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        className={`
          ${baseClasses}
          bg-primary/20 text-primary 
          border border-primary/40 
          hover:bg-primary/30 
          hover:shadow-lg hover:shadow-primary/20 
          hover:border-primary
        `}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <span className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 -z-10" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        bg-white/5 text-on-surface 
        border border-white/20 
        hover:bg-white/15 
        hover:border-primary/50 
        hover:text-primary 
        hover:shadow-lg hover:shadow-white/10
      `}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500 -z-10" />
    </button>
  );
};

// =====================================================================
// SECTION: SUBCOMPONENT – CTA Card
// =====================================================================
const CTACard = ({ onBookSession, onContactStudio }) => {
  return (
    <div className="relative z-10 text-center max-w-3xl mx-auto p-6 sm:p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
      <h2 className="font-display-lg-mobile text-display-lg-mobile md:text-display-lg text-on-surface uppercase italic leading-none mb-stack-lg">
        Let's Create <br className="block sm:hidden" /> Magic
      </h2>

      <p className="font-body-lg text-base sm:text-lg md:text-xl text-on-surface-variant max-w-md mx-auto mb-stack-lg leading-relaxed">
        Now booking for 2026 &amp; 2027 countrywide. Limited seasonal slots available for bespoke
        commissions.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
        <GlassButton variant="primary" onClick={onBookSession}>
          Book a Session
        </GlassButton>
        <GlassButton variant="secondary" onClick={onContactStudio}>
          Contact Studio
        </GlassButton>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant/50 mt-6 text-xs tracking-wider">
        ✦ Response within 24 hours ✦
      </p>
    </div>
  );
};

// =====================================================================
// SECTION: MAIN COMPONENT – ContactCTA
// =====================================================================
export default function ContactCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for animation
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

  // ---------- Button Handlers ----------
  const handleBookSession = () => {
    const url = `https://wa.me/${STUDIO_PHONE.replace("+", "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, "_blank");
  };

  const handleContactStudio = () => {
    window.location.href = `tel:${STUDIO_PHONE}`;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16 bg-background">
      <section ref={sectionRef} className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl" id="contact">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <Container>
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <CTACard
              onBookSession={handleBookSession}
              onContactStudio={handleContactStudio}
            />
          </div>
        </Container>
      </section>

      <style>{`
        @keyframes fade-in-up-slow {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up-slow {
          animation: fade-in-up-slow 0.9s ease-out forwards;
          opacity: 0;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}