import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'portfolio', label: 'Portfolio', href: '#portfolio' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'reviews', label: 'Reviews', href: '#reviews' },
  { id: 'expect', label: 'What to Expect', href: '#expect' },
];

export default function Navbar({ activeSection }: { activeSection: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'glass-liminal-blur border-b border-white/10 bg-[#050507]/85'
          : 'border-b border-transparent bg-gradient-to-b from-[#050507]/80 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark */}
        <a
          href="#home"
          className="font-display inline-flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight whitespace-nowrap text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-red-500"
          >
            <path
              d="M12 2L20 9.5L12 22L4 9.5L12 2Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <path
              d="M12 2V22M4 9.5H20"
              stroke="#F4F4F5"
              strokeWidth="1.1"
              strokeOpacity="0.45"
            />
          </svg>
          <span>{SITE_CONFIG.brandName}</span>
        </a>

        {/* Zone 2: Single-line navigation links */}
        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((item) => {
            const active = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`group relative shrink-0 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400 ${
                  active ? 'text-white' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute right-0 bottom-0 left-0 h-px origin-left bg-red-500 transition-transform duration-200 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href="#contact"
            className={`hidden shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:inline-flex ${
              activeSection === 'contact'
                ? 'border-red-500 bg-red-600 text-white'
                : 'border-red-500/45 bg-red-600/15 text-red-200 hover:border-red-400/75 hover:bg-red-600/25 hover:text-white'
            }`}
          >
            Contact
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-zinc-900/70 text-zinc-200 transition-colors hover:border-red-400/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="glass-liminal-blur border-b border-white/10 bg-[#07080d]/95 px-4 pt-2 pb-5 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => {
              const active = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-red-500/12 text-red-200'
                      : 'text-zinc-200 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="h-px w-4 bg-red-500" aria-hidden="true" />}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={handleLinkClick}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg border border-red-500/45 bg-red-600/20 px-4 text-sm font-semibold text-red-100"
            >
              Contact
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
