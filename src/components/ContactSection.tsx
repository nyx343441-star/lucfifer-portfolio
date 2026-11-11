import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Box, Check, Copy, Github, Instagram, MessageSquare } from 'lucide-react';
import { SITE_CONFIG, SocialLinkConfig } from '../config/siteConfig';

gsap.registerPlugin(ScrollTrigger);

function SocialIcon({ id }: { id: SocialLinkConfig['id'] }) {
  switch (id) {
    case 'instagram':
      return <Instagram className="h-5 w-5" aria-hidden="true" />;
    case 'github':
      return <Github className="h-5 w-5" aria-hidden="true" />;
    case 'modrinth':
      return <Box className="h-5 w-5" aria-hidden="true" />;
    case 'discord':
      return <MessageSquare className="h-5 w-5" aria-hidden="true" />;
    case 'x':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-current"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
  }
}

export default function ContactSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-contact-reveal]', {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleCopyDiscord = async (username: string) => {
    try {
      await navigator.clipboard.writeText(username);
      setCopiedDiscord(true);
      window.setTimeout(() => setCopiedDiscord(false), 2000);
    } catch {
      setCopiedDiscord(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          data-contact-reveal
          className="grid grid-cols-1 gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-xs tracking-widest text-red-400">
              07 · CONTACT &amp; SOCIALS
            </p>
            <h2 className="font-display mt-3 max-w-xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Reach me directly on Instagram.
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-zinc-300 lg:col-span-5">
            Instagram is the primary direct contact channel for web design, video editing, Minecraft
            modding, thumbnail design, and Blender inquiries.
          </p>
        </div>

        <div data-contact-reveal className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Primary Direct Contact Card: Instagram */}
          <div className="glass-liminal glass-liminal-blur flex flex-col justify-between rounded-2xl p-7 sm:p-9 lg:col-span-6">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-red-600/15 text-red-300">
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </div>

              <h3 className="font-display mt-6 text-2xl font-bold text-white">
                Direct Instagram Contact
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                Message <span className="font-semibold text-white">{SITE_CONFIG.instagramHandle}</span>{' '}
                directly on Instagram to discuss project ideas, visual references, timelines, and
                creative commissions.
              </p>
            </div>

            <div className="mt-8">
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_0_30px_rgba(220,38,38,0.34)] transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_38px_rgba(239,68,68,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
                <span>CONTACT ON INSTAGRAM</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Exact Social Channels List */}
          <div className="glass-liminal glass-liminal-blur rounded-2xl p-6 sm:p-8 lg:col-span-6">
            <h3 className="font-display text-lg font-bold text-white">Verified Profiles</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Official channels for {SITE_CONFIG.brandName} ({SITE_CONFIG.creatorName})
            </p>

            <ul className="mt-5 divide-y divide-white/10">
              {SITE_CONFIG.socialLinks.map((social) => (
                <li key={social.id} className="py-3 first:pt-0 last:pb-0">
                  {social.url ? (
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-[48px] items-center justify-between gap-4 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/90 text-zinc-200 transition-colors group-hover:border-red-500/45 group-hover:text-red-300">
                          <SocialIcon id={social.id} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-red-200">
                            {social.label}
                          </p>
                          <p className="font-mono text-xs text-zinc-400">{social.username}</p>
                        </div>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-red-400"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    /* Discord username only — no invented invite link */
                    <div className="flex min-h-[48px] items-center justify-between gap-4 rounded-xl px-2 py-1.5">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/90 text-zinc-200">
                          <SocialIcon id={social.id} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{social.label}</p>
                          <p className="font-mono text-xs text-zinc-400">{social.username}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyDiscord(social.username)}
                        className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg border border-white/12 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-red-500/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                      >
                        {copiedDiscord ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                            <span>Copy Username</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
