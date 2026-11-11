import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Boxes, Film, Globe, Image as ImageIcon } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

gsap.registerPlugin(ScrollTrigger);

const DISCIPLINES = [
  {
    index: '01',
    title: 'Web Design',
    icon: Globe,
    description:
      'Designing dark editorial websites, custom interactive interfaces, and WebGL environments built with clean typography and responsive architecture.',
    focusLine: 'Interactive UI · Spatial WebGL · Design Systems',
  },
  {
    index: '02',
    title: 'Video Editing',
    icon: Film,
    description:
      'Shaping cinematic sequences, trailers, and visual effects cuts driven by deliberate pacing, sound layering, and moody color contrast.',
    focusLine: 'Narrative Cuts · Compositing · Color Grading',
  },
  {
    index: '03',
    title: 'Minecraft Modding',
    icon: Boxes,
    description:
      'Developing custom Minecraft Java mods, atmospheric resource packs, and gameplay systems engineered for cohesive world-building.',
    focusLine: 'Custom Mods · Resource Packs · World Mechanics',
  },
  {
    index: '04',
    title: 'Thumbnail Design',
    icon: ImageIcon,
    description:
      'Staging 3D character compositions, dramatic rim lighting, and bold visual silhouettes designed to command immediate attention.',
    focusLine: '3D Staging · Lighting & Depth · Focal Framing',
  },
];

export default function AboutSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-about-header]', {
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

      gsap.from('[data-about-card]', {
        y: 34,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '[data-about-grid]',
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="about" ref={sectionRef} className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          data-about-header
          className="grid grid-cols-1 gap-8 border-b border-white/10 pb-12 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-xs tracking-widest text-red-400">
              02 · ABOUT {SITE_CONFIG.creatorName.toUpperCase()} &amp; {SITE_CONFIG.brandName}
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Four creative disciplines unified under one dark visual direction.
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-zinc-300 sm:text-base lg:col-span-5">
            Behind {SITE_CONFIG.brandName} is {SITE_CONFIG.creatorName}—combining web design,
            cinematic video editing, Minecraft modding, and thumbnail design to build atmospheric
            digital experiences from concept to final render.
          </p>
        </div>

        {/* Four Craft Glass Panels */}
        <div
          data-about-grid
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {DISCIPLINES.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.index}
                data-about-card
                className="glass-liminal glass-liminal-blur glass-liminal-interactive group relative flex flex-col justify-between rounded-2xl p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-red-400 tabular-nums">
                      {item.index}.
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/80 text-zinc-200 transition-colors duration-200 group-hover:border-red-500/45 group-hover:bg-red-500/12 group-hover:text-red-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="font-display mt-6 text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {item.description}
                  </p>
                </div>

                <p className="mt-7 border-t border-white/10 pt-4 text-xs font-medium text-zinc-400">
                  {item.focusLine}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
