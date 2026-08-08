// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "../components/Container";
import CoverCard from "../components/CoverCard";
import EventLightbox from "../components/EventLightbox";
import { useEvents } from "../hooks/useEvents";

// =====================================================================
// SECTION: SUBCOMPONENT – Skeleton Loader
// =====================================================================
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-surface-container-high rounded-2xl aspect-[4/3] w-full shimmer" />
    <div className="mt-2 h-4 bg-surface-container-high rounded w-3/4 shimmer" />
    <div className="mt-1 h-3 bg-surface-container-high rounded w-1/2 shimmer" />
  </div>
);

// =====================================================================
// SECTION: SUBCOMPONENT – Filter Buttons
// =====================================================================
const FilterButtons = ({ types, activeType, onTypeClick }) => {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-stack-lg scroll-smooth">
      {types.map((type, index) => (
        <button
          key={type}
          onClick={() => onTypeClick(type)}
          className={`
            px-5 py-2 rounded-full text-label-caps font-label-caps uppercase tracking-widest whitespace-nowrap 
            border transition-all duration-500 transform hover:scale-105
            ${
              activeType === type
                ? "bg-primary text-background border-primary shadow-lg shadow-primary/20"
                : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5"
            }
          `}
          style={{
            animation: `slideInFilter 0.4s ease-out ${index * 0.05}s both`,
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );
};

// =====================================================================
// SECTION: SUBCOMPONENT – Gallery Grid
// =====================================================================
const GalleryGrid = ({ events, onCardClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {events.map((event, index) => (
        <div
          key={event.eventId}
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: `${0.1 + index * 0.04}s` }}
        >
          <CoverCard event={event} onClick={() => onCardClick(event)} />
        </div>
      ))}
    </div>
  );
};

// =====================================================================
// SECTION: SUBCOMPONENT – Scroll to Top Button
// =====================================================================
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 p-3 bg-primary/20 backdrop-blur-sm border border-primary/40 rounded-full text-primary hover:bg-primary/30 transition-all duration-300 hover:scale-110 shadow-lg shadow-primary/10"
      aria-label="Scroll to top"
    >
      <span className="material-symbols-outlined text-2xl">arrow_upward</span>
    </button>
  );
};

// =====================================================================
// SECTION: MAIN COMPONENT – Gallery
// =====================================================================
export default function Gallery() {
  const { events, loading, error } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeType, setActiveType] = useState(searchParams.get("type") || "ALL");
  const [activeEvent, setActiveEvent] = useState(null);

  // 🔍 FILTER BASE EVENTS: Hero Banner, Photographer aur Website Assets ko exclude kiya gaya hai
  const cleanEvents = useMemo(() => {
    return events.filter((e) => {
      const type = (e.type || "").toLowerCase();
      const id = (e.eventId || "").toLowerCase();

      return (
        type !== "hero" &&
        type !== "photographer" &&
        type !== "website" &&
        !id.startsWith("hero-") &&
        !id.startsWith("photographer-") &&
        id !== "hero_banner" &&
        id !== "website-assets"
      );
    });
  }, [events]);

  // Filter category buttons sirf valid events ke type se hi banenge
  const types = useMemo(() => {
    const unique = Array.from(
      new Set(cleanEvents.map((e) => e.type).filter(Boolean))
    );
    return ["ALL", ...unique];
  }, [cleanEvents]);

  useEffect(() => {
    const urlType = searchParams.get("type");
    if (urlType) setActiveType(urlType);
  }, [searchParams]);

  const filteredEvents = useMemo(() => {
    if (activeType === "ALL") return cleanEvents;
    return cleanEvents.filter((e) => e.type === activeType);
  }, [cleanEvents, activeType]);

  const handleTypeClick = (type) => {
    setActiveType(type);
    if (type === "ALL") setSearchParams({});
    else setSearchParams({ type });
  };

  return (
    <div className="antialiased overflow-x-hidden min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 lg:pt-36 pb-8 md:pb-8 bg-background">
        <section className="relative w-full">
          <Container>
            {/* ===== Filter Buttons ===== */}
            <FilterButtons
              types={types}
              activeType={activeType}
              onTypeClick={handleTypeClick}
            />

            {/* ===== Loading ===== */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* ===== Error ===== */}
            {error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-6xl text-error/60 mb-4">
                  error_outline
                </span>
                <p className="font-body-lg text-body-lg text-error">
                  Couldn't load events. Please try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 border border-primary/40 rounded-full text-primary hover:bg-primary/10 transition-all hover:scale-105"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ===== No Events ===== */}
            {!loading && !error && filteredEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">
                  photo_library
                </span>
                <p className="font-body-lg text-body-lg text-on-surface-variant/70">
                  No events found for this category yet.
                </p>
              </div>
            )}

            {/* ===== Gallery Grid ===== */}
            {!loading && !error && filteredEvents.length > 0 && (
              <GalleryGrid events={filteredEvents} onCardClick={setActiveEvent} />
            )}
          </Container>
        </section>
      </div>

      <Footer />

      {activeEvent && (
        <EventLightbox event={activeEvent} onClose={() => setActiveEvent(null)} />
      )}

      <ScrollToTop />

      <style>{`
        .shimmer {
          background: linear-gradient(90deg, 
            rgba(255,255,255,0.04) 25%, 
            rgba(255,255,255,0.1) 50%, 
            rgba(255,255,255,0.04) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
        @keyframes slideInFilter {
          0% { opacity: 0; transform: translateX(-16px) scale(0.95); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}