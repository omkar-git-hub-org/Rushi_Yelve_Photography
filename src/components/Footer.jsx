// =====================================================================
// SECTION: IMPORTS
// =====================================================================
import { useEffect, useRef, useState } from "react";
import { SITE_NAME } from "../constants/theme";

// =====================================================================
// SECTION: SOCIAL ICONS (SVG)
// =====================================================================
const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

// =====================================================================
// SECTION: SUBCOMPONENT – FooterLink
// =====================================================================
const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-all duration-300 uppercase tracking-widest relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
  </a>
);

// =====================================================================
// SECTION: SUBCOMPONENT – SocialIcon
// =====================================================================
const SocialIcon = ({ icon: Icon, label }) => (
  <a
    href="#"
    aria-label={label}
    className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:scale-110 hover:rotate-6"
  >
    <Icon />
  </a>
);

// =====================================================================
// SECTION: MAIN COMPONENT – Footer
// =====================================================================
export default function Footer() {
  const year = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  // Intersection Observer – fade‑in animation when footer enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full py-12 md:py-16 bg-background/80 backdrop-blur-sm border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
            transition-all duration-1000 ease-out
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          {/* Main content: flex column on mobile, row on desktop */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Site name */}
            <div className="font-headline-md text-headline-md text-primary uppercase tracking-widest italic">
              {SITE_NAME}
            </div>

            {/* Navigation links – horizontal on all screens, centered */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <FooterLink href="#">Portfolio</FooterLink>
              <FooterLink href="#">Journal</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Privacy</FooterLink>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <SocialIcon icon={SocialIcons.Instagram} label="Instagram" />
              <SocialIcon icon={SocialIcons.Facebook} label="Facebook" />
              <SocialIcon icon={SocialIcons.Twitter} label="Twitter" />
            </div>
          </div>

          {/* Copyright – centered on all screens */}
          <div className="mt-8 text-center">
            <p className="font-label-caps text-label-caps text-on-surface-variant/50">
              © {year} {SITE_NAME}. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}