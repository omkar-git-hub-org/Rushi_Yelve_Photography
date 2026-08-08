// ============================================================
// ELARA STUDIO — Design Tokens
// ============================================================

export const SITE_NAME = "VISTARA STORIES";
export const SITE_TAGLINE = "Capturing Eternity";
export const ESTABLISHED_YEAR = "MMXIV";

export const API_URL = "https://7g8fmbuxjc.execute-api.ap-south-1.amazonaws.com/events";

export const COLORS = {
  primaryFixed: "#ffe088",
  secondaryContainer: "#474746",
  onSecondaryFixedVariant: "#474746",
  surface: "#121414",
  onPrimary: "#3c2f00",
  tertiaryFixed: "#e5e2e1",
  background: "#121414",
  tertiaryContainer: "#b5b2b2",
  inverseOnSurface: "#2f3131",
  surfaceBright: "#38393a",
  onTertiary: "#313030",
  onPrimaryFixed: "#241a00",
  primaryFixedDim: "#e9c349",
  tertiary: "#d0cecd",
  onError: "#690005",
  surfaceContainerLow: "#1a1c1c",
  onPrimaryFixedVariant: "#574500",
  secondaryFixed: "#e5e2e1",
  surfaceContainerHigh: "#282a2b",
  error: "#ffb4ab",
  inversePrimary: "#735c00",
  onSecondary: "#313030",
  tertiaryFixedDim: "#c9c6c5",
  surfaceDim: "#121414",
  onSurface: "#e2e2e2",
  onSurfaceVariant: "#d0c5af",
  outlineVariant: "#4d4635",
  surfaceTint: "#e9c349",
  surfaceContainerHighest: "#333535",
  onErrorContainer: "#ffdad6",
  onTertiaryFixedVariant: "#474646",
  outline: "#99907c",
  surfaceContainerLowest: "#0c0f0f",
  errorContainer: "#93000a",
  onTertiaryFixed: "#1c1b1b",
  onPrimaryContainer: "#554300",
  inverseSurface: "#e2e2e2",
  onTertiaryContainer: "#464545",
  onSecondaryContainer: "#b7b5b4",
  secondaryFixedDim: "#c8c6c5",
  surfaceVariant: "#333535",
  primaryContainer: "#d4af37",
  surfaceContainer: "#1e2020",
  onSecondaryFixed: "#1c1b1b",
  secondary: "#c8c6c5",
  primary: "#f2ca50",
  onBackground: "#e2e2e2",
};

export const RADIUS = {
  DEFAULT: "0.25rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
};

export const SPACING = {
  sectionGap: "clamp(64px, 10vw, 160px)",
  stackMd: "16px",
  marginDesktop: "clamp(24px, 6vw, 80px)",
  gutter: "clamp(16px, 3vw, 32px)",
  marginMobile: "clamp(16px, 5vw, 24px)",
  stackSm: "8px",
  stackLg: "clamp(20px, 3vw, 32px)",
};

export const FONT_FAMILY = {
  displayLgMobile: ["Playfair Display"],
  bodyLg: ["Hanken Grotesk"],
  headlineMd: ["Playfair Display"],
  bodyMd: ["Hanken Grotesk"],
  displayLg: ["Playfair Display"],
  labelCaps: ["Hanken Grotesk"],
  headlineLg: ["Playfair Display"],
};

export const FONT_SIZE = {
  displayLgMobile: ["clamp(2.25rem, 8vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em", fontWeight: "400" }],
  bodyLg: ["clamp(1rem, 0.6vw + 0.85rem, 1.125rem)", { lineHeight: "1.7", fontWeight: "400" }],
  headlineMd: ["clamp(1.375rem, 1.2vw + 1rem, 2rem)", { lineHeight: "1.3", fontWeight: "400" }],
  bodyMd: ["clamp(0.9rem, 0.4vw + 0.8rem, 1rem)", { lineHeight: "1.7", fontWeight: "400" }],
  displayLg: ["clamp(2.75rem, 5vw + 1rem, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "400" }],
  labelCaps: ["12px", { lineHeight: "16px", letterSpacing: "0.15em", fontWeight: "600" }],
  headlineLg: ["clamp(1.75rem, 2.2vw + 1rem, 3rem)", { lineHeight: "1.15", fontWeight: "400" }],
};

// No hardcoded image URLs
export const IMAGES = {
  hero: { src: "", alt: "" },
  elaraPortrait: { src: "", alt: "" },
};

// ============================================================
// DYNAMIC EXTRACTION HELPERS (PURE API PARSER - ZERO HARDCODE)
// ============================================================

const getEventsList = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.events)) return raw.events;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
};

/**
 * Hero Banner: Extracts latest 'heroUrl' directly from API response
 */
export const getHeroImage = (apiData = []) => {
  const events = getEventsList(apiData);
  if (!events.length) return "";

  const heroItem = events
    .filter(
      (item) =>
        item?.type === "Hero" ||
        item?.folderType === "hero-banner"
    )
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0];

  if (!heroItem) return "";

  return (
    heroItem.heroUrl ||
    (Array.isArray(heroItem.photos) ? heroItem.photos[0] : "") ||
    heroItem.coverPhoto ||
    ""
  );
};

/**
 * Photographer Profile: Extracts latest 'photos[0]' or 'coverPhoto' directly from API response
 */
export const getPhotographerImage = (apiData = []) => {
  const events = getEventsList(apiData);
  if (!events.length) return "";

  const photographerItem = events
    .filter(
      (item) =>
        item?.type === "Photographer" ||
        item?.folderType === "photographer-profile"
    )
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))[0];

  if (!photographerItem) return "";

  return (
    (Array.isArray(photographerItem.photos) && photographerItem.photos[0]) ||
    photographerItem.coverPhoto ||
    photographerItem.heroUrl ||
    ""
  );
};

/**
 * Optional: Direct API Fetcher function
 */
export const fetchLiveImages = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return {
      heroUrl: getHeroImage(data),
      photographerUrl: getPhotographerImage(data),
    };
  } catch (error) {
    return { heroUrl: "", photographerUrl: "" };
  }
};