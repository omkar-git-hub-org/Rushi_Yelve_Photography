// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useEffect, useRef, useState } from "react";
import Container from "./Container";

// =====================================================================
// SECTION: CONSTANTS
// =====================================================================
const STUDIO_PHONE = "+917741019816";
const WHATSAPP_MESSAGE = "Hi, I'm interested in booking a session. Can you share more information?";

// =====================================================================
// SECTION: SUBCOMPONENT – Glass Button
// =====================================================================
const GlassButton = ({ children, onClick, variant = "primary", className = "" }) => {
  const baseClasses = `
    group relative w-full sm:w-auto 
    px-6 sm:px-8 md:px-10 
    py-2.5 sm:py-3 md:py-3.5 
    font-label-caps text-xs sm:text-sm font-bold 
    uppercase tracking-[0.2em] 
    rounded-full 
    transition-all duration-500 
    hover:scale-105 
    active:scale-95 
    overflow-hidden
    backdrop-blur-md
    cursor-pointer
    ${className}
  `;

  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        className={`
          ${baseClasses}
          bg-primary/25 text-primary 
          border border-primary/50 
          hover:bg-primary/35 
          hover:shadow-xl hover:shadow-primary/20 
          hover:border-primary
        `}
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <span className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-500 -z-10" />
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
        hover:shadow-xl hover:shadow-white/10
      `}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500 -z-10" />
    </button>
  );
};

// =====================================================================
// SECTION: SUBCOMPONENT – CTA Card (CHAPTA & LOW HEIGHT)
// =====================================================================
const CTACard = ({ onBookSession, onContactStudio }) => {
  return (
    <div className="relative z-10 text-center max-w-4xl mx-auto p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-transparent backdrop-blur-md border border-white/15 shadow-xl transition-all duration-700 hover:shadow-primary/10 hover:border-white/25">
      <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
        {/* Heading */}
        <h2 className="font-display-lg-mobile text-2xl sm:text-3xl md:text-4xl text-on-surface uppercase italic leading-none tracking-wide">
          Let's Create <br className="block sm:hidden" /> Magic
        </h2>

        {/* Subtitle */}
        <p className="font-body-lg text-xs sm:text-sm md:text-base text-on-surface-variant max-w-lg mx-auto leading-relaxed px-2">
          Now booking for 2026 &amp; 2027 countrywide. Limited seasonal slots available for bespoke
          commissions.
        </p>

        {/* Buttons Group */}
        <div className="pt-1 w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <GlassButton variant="primary" onClick={onBookSession}>
            Connect on WhatsApp
          </GlassButton>
          <GlassButton variant="secondary" onClick={onContactStudio}>
            Call Studio
          </GlassButton>
        </div>

        {/* Response Footer Text */}
        <p className="font-body-sm text-on-surface-variant/60 pt-1 text-[10px] sm:text-xs tracking-widest uppercase">
          ✦ Response within few hours ✦
        </p>
      </div>
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
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-10 bg-background">
      <section ref={sectionRef} className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl" id="contact">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] h-[24rem] bg-primary/5 rounded-full blur-3xl" />
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