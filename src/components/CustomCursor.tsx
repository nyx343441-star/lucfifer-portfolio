import { useEffect, useRef, useState } from 'react';

interface RippleItem {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor({ reducedMotion }: { reducedMotion: boolean }) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setEnabled(false);
      document.documentElement.classList.remove('has-custom-cursor');
      return;
    }

    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updatePointerCapability = () => {
      const fine = mediaQuery.matches;
      setEnabled(fine);
      if (fine) {
        document.documentElement.classList.add('has-custom-cursor');
      } else {
        document.documentElement.classList.remove('has-custom-cursor');
      }
    };

    updatePointerCapability();
    mediaQuery.addEventListener('change', updatePointerCapability);
    return () => {
      mediaQuery.removeEventListener('change', updatePointerCapability);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        ringX = mouseX;
        ringY = mouseY;
        visible = true;
      }

      if (dotRef.current) {
        dotRef.current.style.opacity = '1';
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement | null;
      const interactive = Boolean(
        target?.closest('a, button, input, textarea, select, [role="button"], [data-cursor="interactive"]')
      );
      setHoveringInteractive(interactive);
    };

    const onLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const onClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id));
      }, 720);
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current && visible) {
        ringRef.current.style.opacity = '1';
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
          hoveringInteractive ? 1.55 : 1
        })`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onClick);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onClick);
    };
  }, [enabled, hoveringInteractive]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{ left: r.x, top: r.y }}
          className="animate-liminal-ripple fixed h-12 w-12 rounded-full border border-red-400/65"
        />
      ))}

      <div
        ref={ringRef}
        style={{ opacity: 0 }}
        className={`fixed top-0 left-0 h-9 w-9 rounded-full border transition-[border-color,background-color] duration-150 ${
          hoveringInteractive
            ? 'border-red-400/85 bg-red-500/12 shadow-[0_0_22px_rgba(239,68,68,0.28)]'
            : 'border-zinc-300/40 bg-transparent'
        }`}
      />

      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(239,68,68,0.9)]"
      />
    </div>
  );
}
