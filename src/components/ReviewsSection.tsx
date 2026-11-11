import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIAL_SAMPLES } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const STAR_PATH =
  'M12 2.25l2.95 6.08 6.7.98-4.85 4.72 1.15 6.68L12 17.55l-5.95 3.16 1.15-6.68-4.85-4.72 6.7-.98L12 2.25z';

function RatingStars({ rating }: { rating: number }) {
  const baseId = useId();

  return (
    <div
      className="mt-4 flex items-center justify-between gap-2"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillFraction = Math.max(0, Math.min(1, rating - (star - 1)));
          const gradId = `${baseId}-star-${star}`;
          const offsetPercent = `${Math.round(fillFraction * 100)}%`;

          return (
            <svg
              key={star}
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={offsetPercent} stopColor="#f87171" />
                  <stop offset={offsetPercent} stopColor="#27272a" stopOpacity="0.45" />
                </linearGradient>
              </defs>
              <path
                d={STAR_PATH}
                fill={fillFraction > 0 ? `url(#${gradId})` : 'rgba(39,39,42,0.45)'}
                stroke={fillFraction > 0 ? '#f87171' : '#52525b'}
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          );
        })}
      </div>

      <span className="font-mono text-xs font-semibold text-zinc-200 tabular-nums">
        {rating.toFixed(1)} <span className="text-zinc-500">/ 5.0</span>
      </span>
    </div>
  );
}

export default function ReviewsSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-reviews-reveal]', {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
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

  const scrollCarouselBy = (direction: -1 | 1) => {
    const el = carouselRef.current;
    if (!el) return;
    const step = Math.min(420, el.clientWidth * 0.78);
    el.scrollBy({
      left: direction * step,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el || !dragState.current.active) return;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = dragState.current.scrollLeft - (x - dragState.current.startX) * 1.2;
  };

  const onMouseUpOrLeave = () => {
    dragState.current.active = false;
  };

  return (
    <section id="reviews" ref={sectionRef} className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          data-reviews-reveal
          className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end"
        >
          <div>
            <p className="font-mono text-xs tracking-widest text-red-400">
              05 · REVIEWS &amp; TESTIMONIALS
            </p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Focus on craft, smooth motion, and presentation.
            </h2>
            <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-zinc-400">
              Illustrative example testimonials across video &amp; reel editing, web design,
              thumbnails, and Minecraft visuals. These cards are conceptual demo examples—not
              verified customer reviews or confirmed transactions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-end">
            <button
              type="button"
              onClick={() => scrollCarouselBy(-1)}
              aria-label="Previous review"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-zinc-900/80 text-zinc-200 transition-colors hover:border-red-500/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarouselBy(1)}
              aria-label="Next review"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-zinc-900/80 text-zinc-200 transition-colors hover:border-red-500/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Horizontal 5-Card Carousel */}
        <div
          ref={carouselRef}
          data-reviews-reveal
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
          className="filmstrip-scroll mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 select-none"
        >
          {TESTIMONIAL_SAMPLES.map((review) => (
            <article
              key={review.id}
              className="glass-liminal glass-liminal-blur glass-liminal-interactive flex w-[84vw] max-w-[380px] shrink-0 snap-start flex-col justify-between rounded-2xl p-6 sm:w-[360px]"
            >
              <div>
                {/* Initial Avatar + Creator Handle */}
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-600/15 text-sm font-bold text-red-200"
                  >
                    {review.initial}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-sm font-bold text-white">
                      {review.name}
                    </h3>
                    <p className="truncate text-xs text-zinc-400">{review.projectType}</p>
                  </div>
                </div>

                {/* Varied Star Rating */}
                <RatingStars rating={review.rating} />

                <p className="mt-4 text-sm leading-relaxed text-zinc-200">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 border-t border-white/10 pt-3 font-mono text-[11px] text-zinc-500">
                <span>{review.exampleLabel}</span>
                <span>Demo Only</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
