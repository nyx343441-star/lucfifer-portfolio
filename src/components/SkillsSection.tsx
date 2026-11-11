import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Box, Boxes, Film, Globe, Image as ImageIcon } from 'lucide-react';
import { SKILL_GROUPS, SkillCategoryId } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<SkillCategoryId, typeof Globe> = {
  'web-design': Globe,
  'video-editing': Film,
  'minecraft-modding': Boxes,
  'thumbnail-design': ImageIcon,
  'blender-editing': Box,
};

export default function SkillsSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<SkillCategoryId>('web-design');
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });
  const [cardTilt, setCardTilt] = useState<{ id: string | null; rx: number; ry: number }>({
    id: null,
    rx: 0,
    ry: 0,
  });

  const activeSkill = SKILL_GROUPS.find((g) => g.id === activeId) ?? SKILL_GROUPS[0];

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-skills-reveal]', {
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

  const handlePanelMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  };

  const handleCapabilityMove = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ id, rx: -ny * 8, ry: nx * 8 });
  };

  return (
    <section id="skills" ref={sectionRef} className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          data-skills-reveal
          className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-xs tracking-widest text-red-400">
              04 · SKILLS &amp; WORKFLOWS
            </p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Interactive capability suite across five creative crafts.
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-zinc-300 lg:col-span-5">
            Select a discipline to explore core production capabilities, visual direction, and
            primary tooling across web, video, Minecraft, thumbnails, and Blender.
          </p>
        </div>

        <div data-skills-reveal className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 5-Discipline Selector Column */}
          <div className="flex flex-col gap-2.5 lg:col-span-4">
            {SKILL_GROUPS.map((group) => {
              const Icon = ICONS[group.id];
              const isSelected = group.id === activeId;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveId(group.id)}
                  aria-pressed={isSelected}
                  className={`glass-liminal glass-liminal-blur group flex min-h-[70px] w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
                    isSelected
                      ? 'border-red-500/55 bg-red-500/10 shadow-[0_14px_38px_-14px_rgba(220,38,38,0.28)]'
                      : 'hover:border-white/20 hover:bg-zinc-900/75'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-red-400/55 bg-red-600/20 text-red-300'
                        : 'border-white/10 bg-zinc-900/90 text-zinc-300 group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold text-white">{group.title}</p>
                    <p className="mt-0.5 truncate text-xs text-zinc-400">{group.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Interactive Inspection Stage */}
          <div
            onPointerMove={handlePanelMove}
            onPointerLeave={() => setSpotlight((s) => ({ ...s, active: false }))}
            className="glass-liminal glass-liminal-blur relative overflow-hidden rounded-2xl p-6 sm:p-8 lg:col-span-8"
          >
            <div
              aria-hidden="true"
              style={{
                opacity: spotlight.active ? 1 : 0,
                background: `radial-gradient(420px circle at ${spotlight.x}% ${spotlight.y}%, rgba(220, 38, 38, 0.14), transparent 70%)`,
              }}
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      {activeSkill.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
                      {activeSkill.coreFocus}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {activeSkill.capabilities.map((cap, idx) => {
                    const isTilted = cardTilt.id === cap.name;
                    return (
                      <div
                        key={cap.name}
                        onPointerMove={(e) => handleCapabilityMove(cap.name, e)}
                        onPointerLeave={() => setCardTilt({ id: null, rx: 0, ry: 0 })}
                        style={{
                          transform: isTilted
                            ? `perspective(700px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg) translateY(-2px)`
                            : 'perspective(700px) rotateX(0deg) rotateY(0deg)',
                          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        className="rounded-xl border border-white/10 bg-[#070910]/90 p-4 transition-colors hover:border-red-500/40"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-red-400 tabular-nums">
                            0{idx + 1}
                          </span>
                          <span className="h-px w-5 bg-red-500/40" aria-hidden="true" />
                        </div>
                        <p className="font-display mt-2.5 text-sm font-bold text-white">
                          {cap.name}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-300">{cap.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-5 text-xs">
                <span className="font-mono text-zinc-400">Primary Toolset:</span>
                {activeSkill.tools.map((tool, i) => (
                  <span key={tool} className="inline-flex items-center gap-3 text-zinc-200">
                    <span className="font-medium">{tool}</span>
                    {i < activeSkill.tools.length - 1 && (
                      <span aria-hidden="true" className="text-red-500/60">
                        ·
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
