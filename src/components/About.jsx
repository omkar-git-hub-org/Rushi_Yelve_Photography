// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useEffect, useRef, useState } from "react";
import { API_URL, getPhotographerImage } from "../constants/theme";

// =====================================================================
// SECTION: MAIN COMPONENT – About
// =====================================================================
export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  // Dynamic Fetch API call for Photographer Image
  useEffect(() => {
    let isMounted = true;
    const fetchPhotographerPortrait = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Extract image using theme helper
        const url = getPhotographerImage(data);
        if (isMounted && url) {
          setPortraitUrl(url);
        }
      } catch (error) {
        console.error("Error fetching photographer image:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPhotographerPortrait();
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll Trigger with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full bg-background overflow-hidden px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <section
        ref={sectionRef}
        id="about"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-14 lg:gap-20"
      >
        {/* ========================================================= */}
        {/* LEFT COLUMN: TEXT CONTENT (Slides in from Left)           */}
        {/* ========================================================= */}
        <div
          className={`order-2 md:order-1 flex flex-col justify-center ${
            isVisible ? "animate-slide-left" : "opacity-0"
          }`}
        >
          <p className="font-label-caps text-xs sm:text-sm tracking-[0.3em] text-primary uppercase mb-3 font-semibold">
            THE VISIONARY
          </p>

          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface uppercase italic mb-6 leading-tight">
            Meet Rushi
          </h2>

          <p className="font-body-lg text-base sm:text-lg text-on-surface-variant/90 leading-relaxed mb-6">
            We’re available for photography services across the country. To give each project the time and attention it deserves, we accept a limited number of custom bookings each season. Get in touch with us to discuss your photography needs.
          </p>

          <blockquote className="font-body-md text-sm sm:text-base text-on-surface-variant/80 italic border-l-2 border-primary/50 pl-4 py-1 mb-8 bg-white/5 rounded-r-lg">
            "Photography is the only language that can be understood anywhere in the world."
          </blockquote>

          {/* <div>
            <button className="group relative inline-flex items-center gap-3 px-8 py-3.5 border border-primary/40 hover:border-primary text-xs sm:text-sm font-label-caps text-primary uppercase tracking-[0.2em] rounded-full backdrop-blur-sm bg-primary/5 hover:bg-primary hover:text-background transition-all duration-500 hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden">
              <span className="relative z-10">Read More</span>
              <span className="material-symbols-outlined text-sm relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div> */}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: PORTRAIT IMAGE (Slides in from Right)       */}
        {/* ========================================================= */}
        <div
          className={`order-1 md:order-2 flex justify-center items-center ${
            isVisible ? "animate-slide-right" : "opacity-0"
          }`}
        >
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] border border-white/15 p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm shadow-2xl group">
            {/* Image Container with Subtle Zoom Effect */}
            <div className="w-full h-full overflow-hidden rounded-xl bg-white/5 flex items-center justify-center">
              {loading ? (
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                portraitUrl && (
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    alt="Elara Portrait"
                    src={portraitUrl}
                  />
                )
              )}
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-background/90 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-xl shadow-2xl flex items-center gap-4 group-hover:border-primary/50 transition-colors duration-500">
              <p className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-none">
                10+
              </p>
              <p className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant tracking-widest font-medium uppercase leading-snug">
                YEARS OF
                <br />
                EXPERIENCE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION: CUSTOM ANIMATIONS & STYLES                      */}
      {/* ========================================================= */}
      <style>{`
        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(-150px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(150px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        .animate-slide-left {
          animation: slideLeft 1.3s cubic-bezier(0.25, 1, 0.35, 1) forwards;
        }
        .animate-slide-right {
          animation: slideRight 1.3s cubic-bezier(0.25, 1, 0.35, 1) forwards;
        }

        @media (max-width: 640px) {
          @keyframes slideLeft {
            0% { opacity: 0; transform: translateY(60px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideRight {
            0% { opacity: 0; transform: translateY(60px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
    </div>
  );
}