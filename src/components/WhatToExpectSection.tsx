import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXPECTATIONS = [
  {
    step: '01',
    title: 'Clear Direction & Brief',
    description:
      'Every project begins by aligning on mood, visual references, pacing, and platform goals directly via Instagram.',
  },
  {
    step: '02',
    title: 'Atmospheric Art Direction',
    description:
      'Cohesive dark contrast, disciplined typography, and lighting choices tailored to stand out without visual noise.',
  },
  {
    step: '03',
    title: 'Smooth Motion & Polish',
    description:
      'Attention to frame timing, clean transitions, responsive breakpoints, and tactile detail across desktop and mobile.',
  },
  {
    step: '04',
    title: 'Structured Delivery',
    description:
      'Preview checkpoints during production so final web builds, edits, thumbnails, or packs match expectations cleanly.',
  },
];

export default function WhatToExpectSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-expect-reveal]', {
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

  return (
    <section id="expect" ref={sectionRef} className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          data-expect-reveal
          className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-xs tracking-widest text-red-400">
              06 · WHAT TO EXPECT
            </p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              How every commission moves from idea to final frame.
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-zinc-300 lg:col-span-5">
            A straightforward, focused creative workflow built around direct communication and
            careful visual execution.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXPECTATIONS.map((item) => (
            <article
              key={item.step}
              data-expect-reveal
              className="glass-liminal glass-liminal-blur glass-liminal-interactive rounded-2xl p-6"
            >
              <span className="font-mono text-xs font-semibold text-red-400 tabular-nums">
                {item.step}.
              </span>
              <h3 className="font-display mt-4 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
