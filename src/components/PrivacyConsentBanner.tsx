import { ShieldCheck, X } from 'lucide-react';

export type ConsentChoice = 'accepted' | 'declined' | null;

interface PrivacyConsentBannerProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function PrivacyConsentBanner({
  visible,
  onAccept,
  onDecline,
}: PrivacyConsentBannerProps) {
  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Privacy and device information notice"
      className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-xl sm:right-6 sm:bottom-6 sm:left-auto"
    >
      <div className="glass-liminal glass-liminal-blur rounded-2xl border border-white/12 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/35 bg-red-500/12 text-red-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <h2 className="font-display text-sm font-bold text-white">
              Privacy &amp; Local Preferences
            </h2>
          </div>

          <button
            type="button"
            onClick={onDecline}
            aria-label="Decline and dismiss privacy notice"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/6 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-zinc-300">
          This site uses local browser storage (<code className="font-mono text-zinc-200">localStorage</code>)
          strictly to remember your consent choice. If you accept, it locally detects only your general
          device category (such as Windows PC, Mac, Android Phone, or iPhone) to display a friendly
          compatibility label. No analytics, tracking scripts, IP addresses, or device data ever leave
          your browser.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onDecline}
            className="min-h-[40px] rounded-xl border border-white/12 bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="min-h-[40px] rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(220,38,38,0.28)] transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
