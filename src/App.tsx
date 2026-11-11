import { lazy, Suspense, useEffect, useState } from 'react';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import PrivacyConsentBanner, { ConsentChoice } from './components/PrivacyConsentBanner';
import ProjectShowcase from './components/ProjectShowcase';
import ReviewsSection from './components/ReviewsSection';
import SectionProgressRail, { SectionNavItem } from './components/SectionProgressRail';
import SkillsSection from './components/SkillsSection';
import WhatToExpectSection from './components/WhatToExpectSection';
import { detectGeneralDeviceCategory, DeviceCategory } from './utils/deviceCategory';

const LiminalCorridorScene = lazy(() => import('./three/LiminalCorridorScene'));

const CONSENT_STORAGE_KEY = 'lucfifer_privacy_consent';

const SECTIONS: SectionNavItem[] = [
  { id: 'home', code: '01', label: 'Home' },
  { id: 'about', code: '02', label: 'About' },
  { id: 'portfolio', code: '03', label: 'Portfolio' },
  { id: 'skills', code: '04', label: 'Skills' },
  { id: 'reviews', code: '05', label: 'Reviews' },
  { id: 'expect', code: '06', label: 'What to Expect' },
  { id: 'contact', code: '07', label: 'Contact' },
];

function SceneFallbackBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(148,163,184,0.1),transparent_55%),radial-gradient(ellipse_at_50%_80%,rgba(153,27,27,0.12),transparent_60%),linear-gradient(180deg,#050507_0%,#0a0e18_55%,#040406_100%)]"
    />
  );
}

export default function App() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scenePaused, setScenePaused] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [deviceCategory, setDeviceCategory] = useState<DeviceCategory | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved === 'accepted') {
        setConsent('accepted');
        setDeviceCategory(detectGeneralDeviceCategory());
        setBannerVisible(false);
      } else if (saved === 'declined') {
        setConsent('declined');
        setDeviceCategory(null);
        setBannerVisible(false);
      } else {
        setConsent(null);
        setDeviceCategory(null);
        setBannerVisible(true);
      }
    } catch {
      setBannerVisible(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-38% 0px -48% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const handleAcceptConsent = () => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    } catch {
      // ignore storage restrictions
    }
    setConsent('accepted');
    setDeviceCategory(detectGeneralDeviceCategory());
    setBannerVisible(false);
  };

  const handleDeclineConsent = () => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');
    } catch {
      // ignore storage restrictions
    }
    setConsent('declined');
    setDeviceCategory(null);
    setBannerVisible(false);
  };

  const handleResetConsent = () => {
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setConsent(null);
    setDeviceCategory(null);
    setBannerVisible(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-zinc-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-red-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Suspense fallback={<SceneFallbackBackdrop />}>
        <LiminalCorridorScene paused={scenePaused} reducedMotion={reducedMotion} />
      </Suspense>

      <CustomCursor reducedMotion={reducedMotion} />
      <Navbar activeSection={activeSection} />
      <SectionProgressRail
        sections={SECTIONS}
        activeSection={activeSection}
        scrollProgress={scrollProgress}
      />

      <main id="main-content" className="relative z-10">
        <HeroSection
          scenePaused={scenePaused || reducedMotion}
          onToggleScene={() => setScenePaused((prev) => !prev)}
          reducedMotion={reducedMotion}
        />
        <AboutSection reducedMotion={reducedMotion} />
        <ProjectShowcase reducedMotion={reducedMotion} />
        <SkillsSection reducedMotion={reducedMotion} />
        <ReviewsSection reducedMotion={reducedMotion} />
        <WhatToExpectSection reducedMotion={reducedMotion} />
        <ContactSection reducedMotion={reducedMotion} />
      </main>

      <Footer
        deviceCategory={consent === 'accepted' ? deviceCategory : null}
        onResetConsent={handleResetConsent}
      />

      <PrivacyConsentBanner
        visible={bannerVisible}
        onAccept={handleAcceptConsent}
        onDecline={handleDeclineConsent}
      />
    </div>
  );
}
