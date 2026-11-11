export interface SectionNavItem {
  id: string;
  code: string;
  label: string;
}

interface SectionProgressRailProps {
  sections: SectionNavItem[];
  activeSection: string;
  scrollProgress: number;
}

export default function SectionProgressRail({
  sections,
  activeSection,
  scrollProgress,
}: SectionProgressRailProps) {
  return (
    <aside
      aria-label="Section progress"
      className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      {/* Vertical Scroll Progress Track */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-widest text-zinc-500 tabular-nums">
          {Math.round(scrollProgress * 100)}%
        </span>
        <div className="relative h-24 w-px bg-white/12">
          <div
            style={{ height: `${Math.max(8, scrollProgress * 100)}%` }}
            className="w-full bg-red-500 transition-[height] duration-150"
          />
        </div>
      </div>

      {/* Section Jump Points */}
      <nav aria-label="Section index" className="flex flex-col items-end gap-2.5">
        {sections.map((section) => {
          const isActive = section.id === activeSection;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex items-center gap-2.5 py-0.5 text-right focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
            >
              <span
                className={`font-mono text-[10px] tracking-wider uppercase transition-all duration-150 ${
                  isActive
                    ? 'translate-x-0 text-red-400 opacity-100'
                    : 'translate-x-1 text-zinc-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
              >
                {section.label}
              </span>
              <span
                aria-hidden="true"
                className={`block h-px transition-all duration-200 ${
                  isActive
                    ? 'w-6 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                    : 'w-2.5 bg-zinc-600 group-hover:w-4 group-hover:bg-zinc-300'
                }`}
              />
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
