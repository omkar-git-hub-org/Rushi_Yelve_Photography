import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// ============================================================
// 1. CONFIGURATION
// ============================================================
const SITE_NAME = "Vistara Stories";

const NAV_LINKS = [
  { id: "portfolio", label: "Portfolio", to: "/portfolio", type: "route", showOn: { tablet: true, desktop: true } },
  { id: "services",  label: "Services",  to: "services",  type: "anchor", showOn: { tablet: true, desktop: true } },
  { id: "about",     label: "About",     to: "about",     type: "anchor", showOn: { tablet: false, desktop: true } },
  { id: "contact",   label: "Contact",   to: "contact",   type: "anchor", showOn: { tablet: false, desktop: true } },
];

const CTA = {
  label: "Get In Touch",
};

// ============================================================
// 2. ICONS (SVG)
// ============================================================
const HamburgerIcon = ({ isOpen }) =>
  isOpen ? (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

// ============================================================
// 3. CUSTOM HOOK – scroll detection
// ============================================================
const useScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
};

// ============================================================
// 4. MAIN COMPONENT
// ============================================================
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollY = useScroll();
  const navRef = useRef(null);

  // Close on outside click / Escape
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEscape = (e) => e.key === "Escape" && setIsMenuOpen(false);
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ---------- Dynamic links: "Portfolio" → "Home" when on /portfolio ----------
  const dynamicLinks = useMemo(() => {
    return NAV_LINKS.map(link => {
      if (link.id === "portfolio" && location.pathname === "/portfolio") {
        return {
          ...link,
          label: "Home",
          to: "/",
        };
      }
      return link;
    });
  }, [location.pathname]);

  // ---------- Navigation handlers ----------
  const handleNavClick = (link) => {
    setIsMenuOpen(false);
    if (link.type === "route") {
      navigate(link.to);
      return;
    }
    // Anchor
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(link.to)?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      document.getElementById(link.to)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 🔥 FIXED: "Get In Touch" handler – 500ms delay + fallback
  const handleContactClick = () => {
    setIsMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("contact");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          navigate("/contact"); // fallback
        }
      }, 500); // increased for mobile reliability
    } else {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/contact");
      }
    }
  };

  const isActive = (link) => {
    if (link.type === "route") return location.pathname === link.to;
    return false;
  };

  const bgOpacity = Math.min(scrollY / 200, 0.85);

  const tabletLinks = dynamicLinks.filter((l) => l.showOn.tablet);
  const desktopLinks = dynamicLinks.filter((l) => l.showOn.desktop);

  return (
    <>
      {/* ---------- NAVBAR CONTAINER ---------- */}
      <div className="fixed top-0 left-0 w-full flex justify-center pt-4 px-4 z-50">
        <nav
          ref={navRef}
          className="w-full max-w-7xl rounded-2xl shadow-2xl flex items-center justify-between px-6 h-16 transition-all duration-500"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${0.15 + 0.1 * bgOpacity})`,
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: `0 8px 32px rgba(0,0,0,${0.2 + 0.1 * bgOpacity}), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {/* ---------- LOGO ---------- */}
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            {SITE_NAME}
          </Link>

          {/* ---------- RIGHT SIDE: LINKS + CTA + HAMBURGER ---------- */}
          <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {tabletLinks.map((link) => (
                <NavItem
                  key={link.id}
                  link={link}
                  isActive={isActive(link)}
                  onClick={() => handleNavClick(link)}
                  className="hidden md:flex"
                />
              ))}
              {desktopLinks
                .filter((l) => !l.showOn.tablet)
                .map((link) => (
                  <NavItem
                    key={link.id}
                    link={link}
                    isActive={isActive(link)}
                    onClick={() => handleNavClick(link)}
                    className="hidden lg:flex"
                  />
                ))}
            </div>

            <CTAButton
              label={CTA.label}
              onClick={handleContactClick}
              className="hidden md:inline-block"
            />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <HamburgerIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </nav>
      </div>

      {/* ---------- DROPDOWN (mobile + tablet) ---------- */}
      <DropdownMenu
        isOpen={isMenuOpen}
        links={dynamicLinks}
        cta={CTA}
        activeCheck={isActive}
        onLinkClick={handleNavClick}
        onCTAClick={handleContactClick}
        bgOpacity={bgOpacity}
      />

      {/* ---------- OVERLAY ---------- */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ---------- GLOBAL STYLES ---------- */}
      <style>{`
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-slide-in {
          animation: fadeSlideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .nav-item-underline::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: white;
          transition: width 0.3s ease;
        }
        .nav-item-underline:hover::after {
          width: 100%;
        }
        .nav-item-underline.active::after {
          width: 100%;
        }
      `}</style>
    </>
  );
}

// ============================================================
// 5. SUB‑COMPONENTS
// ============================================================
const NavItem = ({ link, isActive, onClick, className }) => (
  <button
    onClick={onClick}
    className={`${className} relative text-sm uppercase tracking-widest font-medium transition-all duration-300 group font-sans ${
      isActive ? "text-white" : "text-white/70 hover:text-white"
    }`}
  >
    {link.label}
    <span className="absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 w-0 group-hover:w-full" />
    <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/10 transition-colors duration-300 -z-10" />
    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-white/5 -z-20" />
  </button>
);

const CTAButton = ({ label, onClick, className }) => (
  <button
    onClick={onClick}
    className={`${className} px-4 py-1.5 text-white rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105 hover:shadow-lg hover:shadow-white/20 relative overflow-hidden group`}
    style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
    }}
  >
    <span className="relative z-10">{label}</span>
    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </button>
);

const DropdownMenu = ({ isOpen, links, cta, activeCheck, onLinkClick, onCTAClick, bgOpacity }) => {
  return (
    <div
      className={`lg:hidden fixed top-20 left-0 w-full px-4 z-40 transition-all duration-500 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-8"
      }`}
    >
      <div
        className="rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.6 + 0.1 * bgOpacity})`,
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex flex-col px-6 py-8 gap-4">
          {links.map((link, index) => {
            const active = activeCheck(link);
            return (
              <button
                key={link.id}
                onClick={() => onLinkClick(link)}
                className={`text-left text-xl font-medium uppercase tracking-widest transition-all duration-300 py-3 px-4 rounded-xl font-sans ${
                  active
                    ? "text-white bg-white/10 border-l-4 border-white"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
                style={{
                  animation: isOpen
                    ? `fadeSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.06}s forwards`
                    : "none",
                  opacity: 0,
                }}
              >
                {link.label}
              </button>
            );
          })}
          <CTAButton
            label={cta.label}
            onClick={onCTAClick}
            className="mt-4 px-6 py-3 text-center w-full"
          />
        </div>
      </div>
    </div>
  );
};