import { SITE_CONFIG } from '../config/siteConfig';
import { DeviceCategory } from '../utils/deviceCategory';

interface FooterProps {
  deviceCategory: DeviceCategory | null;
  onResetConsent: () => void;
}

export default function Footer({ deviceCategory, onResetConsent }: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050507]/92 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-base font-bold tracking-wide text-white">
            {SITE_CONFIG.brandName}{' '}
            <span className="font-sans text-xs font-normal text-zinc-400">
              · by {SITE_CONFIG.creatorName}
            </span>
          </p>
          <p className="mt-1 text-xs text-zinc-400">{SITE_CONFIG.domain}</p>

          {/* Local browser-only device label displayed strictly after explicit visitor consent */}
          {deviceCategory && (
            <p className="mt-2 font-mono text-[11px] text-zinc-400">
              Your device: {deviceCategory}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-400">
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-5">
            <a href="#home" className="transition-colors hover:text-white">
              Home
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#portfolio" className="transition-colors hover:text-white">
              Portfolio
            </a>
            <a href="#skills" className="transition-colors hover:text-white">
              Skills
            </a>
            <a href="#reviews" className="transition-colors hover:text-white">
              Reviews
            </a>
            <a href="#expect" className="transition-colors hover:text-white">
              What to Expect
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </nav>

          <button
            type="button"
            onClick={onResetConsent}
            className="text-left text-zinc-400 underline decoration-white/20 underline-offset-4 transition-colors hover:text-red-300"
          >
            Privacy Preferences
          </button>
        </div>
      </div>
    </footer>
  );
}
