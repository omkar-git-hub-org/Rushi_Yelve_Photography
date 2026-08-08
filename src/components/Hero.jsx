// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SITE_TAGLINE, ESTABLISHED_YEAR, API_URL, getHeroImage } from "../constants/theme";

// =====================================================================
// SECTION: CUSTOM HOOK – Parallax Scroll
// =====================================================================
const useParallax = (speed = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY * speed);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  return offsetY;
};

// =====================================================================
// SECTION: SUBCOMPONENT – Hero Background
// =====================================================================
const HeroBackground = ({ imageSrc, altText }) => {
  const offsetY = useParallax(0.2);

  const srcUrl = typeof imageSrc === "string" ? imageSrc : (imageSrc?.src || imageSrc?.desktop || "");

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Mobile image */}
      <img
        className="w-full h-full object-cover object-center md:hidden"
        src={imageSrc?.mobile || srcUrl}
        alt={altText}
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      />
      {/* Tablet image */}
      <img
        className="w-full h-full object-cover object-center hidden md:block lg:hidden"
        src={imageSrc?.tablet || srcUrl}
        alt={altText}
        style={{ transform: `translateY(${offsetY * 0.3}px)` }}
      />
      {/* Desktop image */}
      <img
        className="w-full h-full object-cover object-center hidden lg:block"
        src={imageSrc?.desktop || srcUrl}
        alt={altText}
        style={{ transform: `translateY(${offsetY * 0.1}px)` }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent opacity-40 lg:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-transparent opacity-30" />
    </div>
  );
};

// =====================================================================
// SECTION: SUBCOMPONENT – Hero Content
// =====================================================================
const HeroContent = ({ tagline, establishedYear, onExploreClick }) => {
  const words = tagline ? tagline.split(" ") : [];

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center lg:items-start justify-center h-full py-6 sm:py-12 md:py-16">
      <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <p className="font-label-caps text-xs sm:text-sm tracking-[0.3em] text-primary/80 uppercase mb-2 sm:mb-4">
          ESTABLISHED {establishedYear}
        </p>
        <h1 className="font-display font-bold text-on-surface leading-tight lg:leading-[1.1] uppercase italic max-w-3xl 
                       text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
          {words.map((word, i) => (
            <span key={i} className="inline-block">
              {word}
              {i === 1 && <br className="block sm:hidden" />}
              {i === 1 && <span className="hidden sm:inline"> </span>}
              {i === 2 && <br className="hidden sm:block lg:hidden" />}
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>
        <p className="font-body text-base sm:text-lg md:text-xl text-on-surface-variant/80 max-w-md lg:max-w-lg mx-auto lg:mx-0 mt-4 sm:mt-6 leading-relaxed">
          Professional Photography by Elara Studio. Fine art storytelling for the meticulous soul.
        </p>
        <div className="mt-6 sm:mt-8 lg:mt-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <HeroButton onClick={onExploreClick} />
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// SECTION: SUBCOMPONENT – Hero Button
// =====================================================================
const HeroButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="group relative px-8 sm:px-10 py-3 sm:py-4 border-2 border-primary/60 hover:border-primary 
               text-label-caps text-sm sm:text-base font-label-caps text-primary 
               hover:bg-primary hover:text-background transition-all duration-500 uppercase tracking-widest 
               rounded-full backdrop-blur-sm bg-primary/5 hover:shadow-lg hover:shadow-primary/20 
               transform hover:scale-105 active:scale-95 overflow-hidden"
  >
    <span className="relative z-10">Explore Work</span>
    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 
                     bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </button>
);

// =====================================================================
// SECTION: SUBCOMPONENT – Scroll Indicator
// =====================================================================
const ScrollIndicator = () => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block animate-bounce">
    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
      <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-scroll-down" />
    </div>
  </div>
);

// =====================================================================
// SECTION: MAIN COMPONENT – Hero (DYNAMIC API FETCH ADDED)
// =====================================================================
export default function Hero() {
  const navigate = useNavigate();
  const [heroImgUrl, setHeroImgUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const tagline = SITE_TAGLINE;
  const established = ESTABLISHED_YEAR;

  // Dynamic Fetch API call on Mount
  useEffect(() => {
    let isMounted = true;
    const fetchHeroBanner = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Dynamic Extraction using theme/tokens helper
        const url = getHeroImage(data);
        if (isMounted && url) {
          setHeroImgUrl(url);
        }
      } catch (error) {
        console.error("Hero Image Fetching Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeroBanner();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExploreClick = () => {
    navigate("/portfolio");
  };

  const imageObj = {
    src: heroImgUrl,
    desktop: heroImgUrl,
    tablet: heroImgUrl,
    mobile: heroImgUrl,
    alt: "Hero Banner",
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-24 md:pt-24 pb-8 md:pb-8">
      <section
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl
                   min-h-[76vh] sm:min-h-[65vh] md:min-h-[85vh] lg:min-h-[80vh]
                   flex items-center justify-center bg-gray-900"
      >
        {loading ? (
          <HeroSkeleton />
        ) : (
          <>
            {heroImgUrl && <HeroBackground imageSrc={imageObj} altText={imageObj.alt} />}
            <HeroContent
              tagline={tagline}
              establishedYear={established}
              onExploreClick={handleExploreClick}
            />
            <ScrollIndicator />
          </>
        )}

        <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
          }
          @keyframes scroll-down {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(12px); }
          }
          .animate-scroll-down {
            animation: scroll-down 1.5s ease-in-out infinite;
          }
          .text-on-surface { color: #ffffff; }
          .text-on-surface-variant { color: rgba(255,255,255,0.8); }
          .text-primary { color: #ffffff; }
          .bg-background { background-color: #000000; }
          .border-primary { border-color: rgba(255,255,255,0.6); }
          .hover\\:border-primary:hover { border-color: #ffffff; }
          .hover\\:bg-primary:hover { background-color: #ffffff; }
          .hover\\:text-background:hover { color: #000000; }
          .shadow-primary\\/20 { --tw-shadow-color: rgba(255,255,255,0.2); }
        `}</style>
      </section>
    </div>
  );
}

// =====================================================================
// SECTION: ADDITIONAL UTILITIES
// =====================================================================
export const HeroSkeleton = () => (
  <div className="w-full min-h-[70vh] lg:min-h-[80vh] bg-gray-900 animate-pulse flex items-center justify-center rounded-2xl sm:rounded-3xl">
    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

export const withHeroLazy = (Component) => {
  return function LazyHero(props) {
    return <Component {...props} />;
  };
};

export const HERO_CONFIG = {
  breakpoints: { mobile: 640, tablet: 768, desktop: 1024 },
  heights: { mobile: "70vh", tablet: "65vh", desktop: "80vh" },
  fontSizes: {
    tagline: { mobile: "2.25rem", tablet: "3rem", desktop: "3.75rem" },
  },
};