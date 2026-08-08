// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import Container from "./Container";
import CoverCard from "./CoverCard";

// =====================================================================
// SECTION: CUSTOM HOOK – Responsive breakpoint
// =====================================================================
const useBreakpoint = () => {
  const [bp, setBp] = useState("mobile");

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1024) setBp("desktop");    // lg
      else if (w >= 768) setBp("tablet"); // md
      else setBp("mobile");
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return bp;
};

const GRID_CONFIG = {
  mobile: { count: 3, gridClass: "grid-cols-1" },
  tablet: { count: 4, gridClass: "grid-cols-2" },
  desktop: { count: 9, gridClass: "grid-cols-3" },
};

// =====================================================================
// SECTION: SUBCOMPONENT – Loading Skeleton
// =====================================================================
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-3 lg:gap-4 animate-pulse">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className="bg-surface-container-low rounded-2xl aspect-[4/3]"
      />
    ))}
  </div>
);

// =====================================================================
// SECTION: SUBCOMPONENT – Error State
// =====================================================================
const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <p className="font-body-lg text-body-lg text-error text-center">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-6 py-2 border border-primary/40 rounded-full text-label-caps text-primary hover:bg-primary hover:text-background transition-all"
    >
      Retry
    </button>
  </div>
);

// =====================================================================
// SECTION: SUBCOMPONENT – Empty State
// =====================================================================
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <p className="font-body-lg text-body-lg text-on-surface-variant text-center">
      No events found.
    </p>
  </div>
);

// =====================================================================
// SECTION: SUBCOMPONENT – See All Button
// =====================================================================
const SeeAllButton = ({ onClick }) => (
  <div className="flex justify-center mt-8 md:mt-10">
    <button
      onClick={onClick}
      className="px-8 py-3 border border-primary rounded-full text-label-caps font-label-caps text-primary hover:bg-primary hover:text-background transition-all duration-500 uppercase tracking-widest backdrop-blur-sm bg-primary/5 hover:shadow-lg hover:shadow-primary/20 transform hover:scale-105 active:scale-95"
    >
      See All
    </button>
  </div>
);

// =====================================================================
// SECTION: SUBCOMPONENT – Section Title
// =====================================================================
const SectionTitle = ({ title }) => (
  <div className="mb-6 md:mb-8 flex flex-col items-start">
    <p className="font-label-caps text-xs sm:text-sm tracking-[0.3em] text-primary/80 uppercase mb-2">
      Our Work
    </p>
    <h2 className="font-display font-bold text-headline-lg-mobile md:text-headline-lg text-on-surface uppercase italic leading-tight">
      {title}
    </h2>
    <span className="mt-3 h-[2px] w-16 bg-primary/60 rounded-full" />
  </div>
);

// =====================================================================
// SECTION: SUBCOMPONENT – Portfolio Grid
// =====================================================================
const PortfolioGrid = ({ events, onCardClick, breakpoint }) => {
  const { count, gridClass } = GRID_CONFIG[breakpoint];
  const preview = events.slice(0, Math.min(count, events.length));

  return (
    <div className={`grid ${gridClass} gap-3 md:gap-3 lg:gap-4`}>
      {preview.map((event) => (
        <div
          key={event.eventId}
          className="aspect-[4/3] overflow-hidden rounded-2xl"
        >
          <CoverCard event={event} onClick={() => onCardClick(event.type)} />
        </div>
      ))}
    </div>
  );
};

// =====================================================================
// SECTION: MAIN COMPONENT – Portfolio
// =====================================================================
export default function Portfolio() {
  const navigate = useNavigate();
  const { events, loading, error } = useEvents();
  const breakpoint = useBreakpoint();

  // 🔍 FILTER & SORT: Hero, Photographer, aur Website items ko Portfolio me se hata diya gaya hai
  const sortedEvents = events
    .filter((e) => {
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
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const goToGallery = (type) =>
    navigate(type ? `/portfolio?type=${encodeURIComponent(type)}` : "/portfolio");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-8 md:pb-12 bg-background">
      <section className="relative w-full">
        <Container>
          <SectionTitle title="Portfolio" />

          {loading && <LoadingSkeleton />}

          {error && <ErrorState message="Couldn't load events right now." />}

          {!loading && !error && (
            <>
              {sortedEvents.length === 0 && <EmptyState />}

              {sortedEvents.length > 0 && (
                <>
                  <PortfolioGrid
                    events={sortedEvents}
                    onCardClick={goToGallery}
                    breakpoint={breakpoint}
                  />
                  <SeeAllButton onClick={() => goToGallery()} />
                </>
              )}
            </>
          )}
        </Container>
      </section>
    </div>
  );
}