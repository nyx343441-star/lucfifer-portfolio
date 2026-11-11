import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Cpu, Layers, Sparkles } from 'lucide-react';
import {
  PORTFOLIO_PROJECTS,
  PROJECT_CATEGORIES,
  ProjectCategoryId,
  ProjectItem,
} from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Familiar default Java JAR archive icon for the Renders mod card.
 */
function DefaultJavaJarIcon() {
  return (
    <div className="relative flex h-52 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#0b0e17] to-[#06080f] p-6">
      <svg
        viewBox="0 0 96 112"
        className="h-24 w-24 drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-105"
        aria-label="Default Java JAR file icon"
      >
        {/* Document body */}
        <path
          d="M14 8 H62 L82 28 V100 C82 103.3 79.3 106 76 106 H14 C10.7 106 8 103.3 8 100 V14 C8 10.7 10.7 8 14 8 Z"
          fill="#171b26"
          stroke="#475569"
          strokeWidth="2.5"
        />
        {/* Folded corner */}
        <path d="M62 8 V28 H82 Z" fill="#273043" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />

        {/* Classic Java steam & cup silhouette */}
        <path
          d="M42 40 C39 36 45 33 43 28 M50 39 C47 35 53 32 51 27"
          stroke="#ef4444"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M34 45 H57 V56 C57 62 52 66 45.5 66 C39 66 34 62 34 56 Z"
          fill="#1e293b"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <path
          d="M57 48 H61.5 C64 48 65.5 49.5 65.5 52 C65.5 54.5 64 56 61.5 56 H57"
          stroke="#e2e8f0"
          strokeWidth="2"
          fill="none"
        />
        <ellipse cx="45.5" cy="70" rx="15" ry="2.6" fill="#64748b" fillOpacity="0.55" />

        {/* .JAR label strip */}
        <rect x="20" y="80" width="52" height="16" rx="3.5" fill="#dc2626" />
        <text
          x="46"
          y="91.5"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="10"
          fontWeight="700"
          fontFamily="monospace"
          letterSpacing="1.2"
        >
          .JAR
        </text>
      </svg>
      <p className="font-mono mt-3 text-[11px] text-zinc-400">Renders-mod.jar · Display Only</p>
    </div>
  );
}

function DisplayOnlyMediaFrame({
  project,
  widePoster = false,
}: {
  project: ProjectItem;
  widePoster?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  // Special case: Renders Java JAR icon
  if (project.mcKind === 'jar-mod') {
    return <DefaultJavaJarIcon />;
  }

  // Blender Editing: static display-only frame preserving original aspect ratio, colours, and details
  if (project.category === 'blender-editing' && project.imageSrc && !imgFailed) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-[#05060a] p-3 sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(220,38,38,0.08),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(15,23,42,0.22),transparent_65%)]"
        />
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#040508] shadow-[0_24px_48px_-18px_rgba(0,0,0,0.85)]">
          <img
            src={project.imageSrc}
            alt={project.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setImgFailed(true)}
            className="block h-auto max-h-[540px] w-auto max-w-full select-none object-contain transition-transform duration-500 group-hover:scale-[1.015]"
          />
        </div>
      </div>
    );
  }

  // Real image or generated cinematic cover
  if (project.imageSrc && !imgFailed) {
    const isContainFit =
      project.category === 'thumbnail-design' ||
      project.category === 'web-design' ||
      project.category === 'video-editing' ||
      project.mcKind === 'texture-pack' ||
      project.mcKind === 'shaders';
    const is16By9 =
      project.category === 'thumbnail-design' ||
      project.category === 'video-editing' ||
      widePoster;
    const isSquare = project.mcKind === 'shaders';
    const hideBottomScrim =
      project.category === 'web-design' ||
      project.category === 'video-editing' ||
      project.mcKind === 'shaders';
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-white/12 bg-[#05060a] ${
          isSquare ? 'aspect-square' : is16By9 ? 'aspect-[16/9]' : 'aspect-[16/10]'
        }`}
      >
        <img
          src={project.imageSrc}
          alt={project.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onError={() => setImgFailed(true)}
          className={`h-full w-full select-none transition-transform duration-500 group-hover:scale-[1.02] ${
            isContainFit ? 'object-contain' : 'object-cover'
          }`}
        />
        {!hideBottomScrim && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050507]/90 via-[#050507]/40 to-transparent px-3.5 pt-8 pb-3">
            <p className="font-mono text-[11px] text-zinc-200">{project.mediaNote}</p>
          </div>
        )}
      </div>
    );
  }

  // Clean replaceable visual slot for awaiting screenshots (3 Website slots, Icy90k Special Texture Pack, Shaders)
  return (
    <div className="relative flex aspect-[16/10] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#070910] p-5 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(220,38,38,0.12),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(30,58,138,0.16),transparent_60%)]"
      />

      {project.category === 'web-design' && (
        <svg
          viewBox="0 0 400 220"
          className="h-full w-full opacity-80"
          aria-hidden="true"
        >
          <rect
            x="28"
            y="24"
            width="344"
            height="172"
            rx="10"
            fill="#0b0e17"
            stroke="#ef4444"
            strokeOpacity="0.34"
          />
          <line x1="28" y1="52" x2="372" y2="52" stroke="#ffffff" strokeOpacity="0.12" />
          <circle cx="46" cy="38" r="4" fill="#ef4444" fillOpacity="0.7" />
          <circle cx="60" cy="38" r="4" fill="#71717a" fillOpacity="0.5" />
          <rect x="48" y="70" width="142" height="18" rx="4" fill="#ef4444" fillOpacity="0.26" />
          <rect x="48" y="98" width="110" height="8" rx="3" fill="#a1a1aa" fillOpacity="0.24" />
          <rect x="48" y="114" width="128" height="8" rx="3" fill="#a1a1aa" fillOpacity="0.16" />
          <rect
            x="216"
            y="70"
            width="136"
            height="106"
            rx="8"
            fill="#0f1422"
            stroke="#ffffff"
            strokeOpacity="0.14"
          />
          <circle cx="284" cy="123" r="28" fill="none" stroke="#ef4444" strokeOpacity="0.45" strokeWidth="1.5" />
        </svg>
      )}

      {project.mcKind === 'texture-pack' && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/12 bg-zinc-900/90 text-red-400">
            <Layers className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="font-display mt-3 text-sm font-bold text-white">
            Icy90k Special Texture Pack
          </p>
          <p className="font-mono mt-1 text-[11px] text-zinc-400">
            Replaceable Texture Pack Image Slot
          </p>
        </div>
      )}

      {project.mcKind === 'shaders' && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/12 bg-zinc-900/90 text-red-400">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="font-display mt-3 text-sm font-bold text-white">Shader Showcase</p>
          <p className="font-mono mt-1 text-[11px] text-zinc-400">
            Replaceable Shader Image Slot
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050507]/95 via-[#050507]/60 to-transparent px-3.5 pt-8 pb-3">
        <p className="font-mono text-[11px] text-zinc-300">{project.mediaNote}</p>
      </div>
    </div>
  );
}

export default function ProjectShowcase({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const [activeCategory, setActiveCategory] = useState<ProjectCategoryId>('web-design');
  const [scrollRatio, setScrollRatio] = useState(0);

  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const filteredProjects = useMemo(
    () => PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const activeCategoryMeta = useMemo(
    () => PROJECT_CATEGORIES.find((c) => c.id === activeCategory) ?? PROJECT_CATEGORIES[0],
    [activeCategory]
  );

  const isSingleFeaturedLayout =
    activeCategory === 'blender-editing' || activeCategory === 'thumbnail-design';

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-work-header]', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    setScrollRatio(0);
  }, [activeCategory, reducedMotion]);

  const updateScrollRatio = () => {
    const el = stripRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollRatio(max > 0 ? el.scrollLeft / max : 0);
  };

  const scrollStripBy = (direction: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    const step = Math.min(440, el.clientWidth * 0.8);
    el.scrollBy({
      left: direction * step,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const onMouseDownStrip = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const onMouseMoveStrip = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    if (!el || !dragState.current.active) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.2;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const onMouseUpOrLeaveStrip = () => {
    dragState.current.active = false;
  };

  return (
    <section id="portfolio" ref={sectionRef} className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header & Category Tabs */}
        <div
          data-work-header
          className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-xs tracking-widest text-red-400">
                03 · PORTFOLIO SHOWCASE
              </p>
              <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
                Display-only works across design, cinema, 3D, and modding.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-zinc-300">
                {activeCategoryMeta.subtitle} All previews below are visual display cards only.
              </p>
            </div>

            {!isSingleFeaturedLayout && (
              <div className="flex items-center gap-2 self-start lg:self-end">
                <button
                  type="button"
                  onClick={() => scrollStripBy(-1)}
                  aria-label="Previous portfolio cards"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-zinc-900/80 text-zinc-200 transition-colors hover:border-red-500/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollStripBy(1)}
                  aria-label="Next portfolio cards"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-zinc-900/80 text-zinc-200 transition-colors hover:border-red-500/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* 5 Category Switcher */}
          <div
            role="tablist"
            aria-label="Portfolio categories"
            className="glass-liminal inline-flex flex-wrap items-center gap-1.5 self-start rounded-xl p-1.5"
          >
            {PROJECT_CATEGORIES.map((category) => {
              const active = category.id === activeCategory;
              return (
                <button
                  key={category.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category.id)}
                  className={`min-h-[40px] shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                    active
                      ? 'bg-red-600 text-white shadow-[0_0_22px_rgba(220,38,38,0.35)]'
                      : 'text-zinc-300 hover:bg-white/6 hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Display-Only Showcase Container */}
        <div className="mt-8">
          <div className="glass-liminal relative rounded-2xl p-4 sm:p-6">
            {/* Subtle film strip perforations top */}
            <div
              aria-hidden="true"
              className="mb-4 flex justify-between gap-3 overflow-hidden px-1 opacity-28"
            >
              {Array.from({ length: 24 }).map((_, idx) => (
                <span key={idx} className="h-1.5 w-4 shrink-0 rounded-xs bg-zinc-400/50" />
              ))}
            </div>

            {isSingleFeaturedLayout ? (
              /* Single Static Poster / Single Thumbnail Showcase */
              <div className="mx-auto max-w-4xl">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group rounded-xl border border-white/10 bg-[#090b12]/94 p-5 sm:p-6"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                      <span className="font-mono text-red-400 tabular-nums">
                        {project.frameCode}
                      </span>
                      <span>{project.formatLabel}</span>
                    </div>

                    <DisplayOnlyMediaFrame project={project} widePoster />

                    <div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-end">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white">
                          {project.title}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
                          {project.summary}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-xs text-zinc-400">
                        Display Only · Non-Interactive
                      </p>
                    </div>

                    <p className="mt-4 text-xs text-zinc-400">
                      {project.deliverables.join(' · ')}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              /* Multi-Card Horizontal Display Strip (Web Design, Video Editing, Minecraft Modding) */
              <div
                ref={stripRef}
                onScroll={updateScrollRatio}
                onMouseDown={onMouseDownStrip}
                onMouseMove={onMouseMoveStrip}
                onMouseUp={onMouseUpOrLeaveStrip}
                onMouseLeave={onMouseUpOrLeaveStrip}
                className="filmstrip-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 select-none"
              >
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="group relative flex w-[85vw] max-w-[400px] shrink-0 snap-start flex-col justify-between rounded-xl border border-white/10 bg-[#090b12]/94 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-red-500/45 hover:shadow-[0_20px_44px_-16px_rgba(220,38,38,0.22)] sm:w-[376px]"
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-zinc-400">
                        <span className="font-mono text-red-400 tabular-nums">
                          {project.frameCode}
                        </span>
                        <span className="truncate">{project.formatLabel}</span>
                      </div>

                      <DisplayOnlyMediaFrame project={project} />

                      <h3 className="font-display mt-4 text-lg font-bold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                        {project.summary}
                      </p>

                      {/* Optional Feature List (Minecraft Modding cards) */}
                      {project.features && project.features.length > 0 && (
                        <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-xs text-zinc-300">
                          {project.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <span
                                aria-hidden="true"
                                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400"
                              />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Optional Estimated System Requirements (Renders & Shaders) */}
                      {project.requirements && project.requirements.length > 0 && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-[#05060b]/90 p-3.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                            <Cpu className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                            <span>{project.requirementsTitle}</span>
                          </div>
                          {project.requirementsNote && (
                            <p className="mt-1 text-[11px] text-amber-200/80">
                              {project.requirementsNote}
                            </p>
                          )}
                          <dl className="mt-2.5 space-y-1.5 text-[11px]">
                            {project.requirements.map((req) => (
                              <div key={req.label} className="flex justify-between gap-3">
                                <dt className="font-mono text-zinc-400">{req.label}</dt>
                                <dd className="text-right text-zinc-200">{req.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/10 pt-3.5 text-xs">
                      <span className="truncate text-zinc-400">
                        {project.deliverables.join(' · ')}
                      </span>
                      <span className="font-mono shrink-0 text-[11px] text-zinc-400">
                        Display Only
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Subtle film strip perforations bottom */}
            <div
              aria-hidden="true"
              className="mt-3 flex justify-between gap-3 overflow-hidden px-1 opacity-28"
            >
              {Array.from({ length: 24 }).map((_, idx) => (
                <span key={idx} className="h-1.5 w-4 shrink-0 rounded-xs bg-zinc-400/50" />
              ))}
            </div>

            {!isSingleFeaturedLayout && (
              <div className="mt-4 flex items-center gap-3">
                <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                  {activeCategoryMeta.label}
                </span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    style={{
                      width: `${Math.max(25, scrollRatio * 100)}%`,
                      transform: `translateX(${scrollRatio * 40}%)`,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-transform duration-150"
                  />
                </div>
                <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                  {filteredProjects.length} SAMPLES
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
