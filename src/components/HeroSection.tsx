import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface HeroSectionProps {
  scenePaused: boolean;
  onToggleScene: () => void;
  reducedMotion: boolean;
}

export default function HeroSection({
  scenePaused,
  onToggleScene,
  reducedMotion,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (reducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-reveal]', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.11,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handlePortraitMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * 9, ry: nx * 9 });
  };

  const resetPortraitTilt = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative z-10 flex min-h-screen flex-col justify-between pt-24 pb-10 sm:pt-28 sm:pb-12"
    >
      <div className="mx-auto my-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Brand Opening & Cinematic Typography */}
          <div className="lg:col-span-7">
            <div
              data-hero-reveal
              className="mb-5 flex flex-wrap items-center gap-3 text-xs tracking-widest text-zinc-300"
            >
              <span className="font-mono text-red-400">CREATOR · {SITE_CONFIG.creatorName.toUpperCase()}</span>
              <span aria-hidden="true" className="text-zinc-600">
                /
              </span>
              <span className="font-mono text-zinc-400">{SITE_CONFIG.domain}</span>
            </div>

            <h1
              data-hero-reveal
              className="font-display text-5xl leading-[0.98] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              {SITE_CONFIG.brandName}
            </h1>

            <p
              data-hero-reveal
              className="font-mono mt-4 text-xs leading-relaxed tracking-wider text-red-400/95 sm:text-sm"
            >
              {SITE_CONFIG.roleLine}
            </p>

            <p
              data-hero-reveal
              className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg"
            >
              Architectural web interfaces, atmospheric video edits, custom Minecraft systems, and
              high-contrast visual thumbnails crafted by {SITE_CONFIG.creatorName} inside a dark,
              cinematic digital world.
            </p>

            {/* Primary & Secondary Actions */}
            <div data-hero-reveal className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#portfolio"
                className="inline-flex min-h-[46px] shrink-0 items-center gap-2.5 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-[0_0_32px_rgba(220,38,38,0.34)] transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <span>Explore Portfolio</span>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="glass-liminal glass-liminal-interactive inline-flex min-h-[46px] shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold whitespace-nowrap text-zinc-100 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <span>Contact Me</span>
                <ArrowUpRight className="h-4 w-4 text-red-400" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onToggleScene}
                aria-pressed={scenePaused}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2.5 text-xs font-medium whitespace-nowrap text-zinc-300 transition-colors hover:border-red-500/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                {scenePaused ? (
                  <>
                    <Play className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                    <span>Resume 3D Motion</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                    <span>Pause 3D Motion</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Preserved Uploaded Profile Photo in Interactive Frame */}
          <div data-hero-reveal className="flex justify-center lg:col-span-5 lg:justify-end">
            <div
              onPointerMove={handlePortraitMove}
              onPointerLeave={resetPortraitTilt}
              style={{
                transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="glass-liminal glass-liminal-blur relative w-full max-w-[360px] rounded-2xl p-4"
            >
              {/* Subtle red & steel edge sheen */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-red-500/25 via-transparent to-slate-700/25 opacity-80"
              />

              <div className="relative overflow-hidden rounded-xl border border-white/12 bg-[#07080d]">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  {!imgError ? (
                    <img
                      src={SITE_CONFIG.profileImage}
                      alt="Portrait of Aditya, creator behind LUCFIFER"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-950 p-6 text-center">
                      <span className="font-display text-xl font-bold tracking-wider text-white">
                        {SITE_CONFIG.brandName}
                      </span>
                      <span className="mt-2 text-xs text-zinc-400">
                        Portrait asset unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Measured scrim for crisp caption contrast */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050507]/95 via-[#050507]/60 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                  <div>
                    <p className="font-display text-base font-bold tracking-wide text-white">
                      {SITE_CONFIG.creatorName}
                    </p>
                    <p className="text-xs text-zinc-300">
                      {SITE_CONFIG.brandName} Studio
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-red-400">
                    01 / OPENING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-8">
        <a
          href="#about"
          className="group inline-flex items-center gap-3 text-xs font-medium tracking-wider text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
        >
          <span className="relative flex h-6 w-px overflow-hidden bg-white/15">
            <span className="h-3 w-full bg-red-500 transition-transform duration-300 group-hover:translate-y-3" />
          </span>
          <span className="font-mono uppercase">Scroll to descend</span>
        </a>

        <span className="font-mono hidden text-[11px] text-zinc-500 sm:inline">
          LIMINAL CORRIDOR · 3D VIEWPORT
        </span>
      </div>
    </section>
  );
}
