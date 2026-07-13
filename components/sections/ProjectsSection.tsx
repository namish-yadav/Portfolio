'use client';

import { useRef, useEffect, useCallback, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GLOW_COLOR = '233, 69, 245';           // #e945f5 in RGB
const SPOTLIGHT_RADIUS = 320;
const PARTICLE_COUNT = 10;
const MOBILE_BREAKPOINT = 768;

const languageColors: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Java:       '#b07219',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  default:    '#e945f5',
};

// ─── Inline styles ────────────────────────────────────────────────────────────

const inlineStyles = `
  :root {
    --glow-color-rgb: ${GLOW_COLOR};
    --border-color: #2F293A;
    --bg-dark: #120F17;
  }

  /* ── grid ── */
  .pb-card-grid {
    display: grid;
    gap: 0.75em;
    padding: 0.75em;
    width: 100%;
    font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
  }
  @media (max-width: 599px)  { .pb-card-grid { grid-template-columns: 1fr; padding: 0.5em; } }
  @media (min-width: 600px)  { .pb-card-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) {
    .pb-card-grid { grid-template-columns: repeat(3, 1fr); }
    .pb-card-grid .pb-card:nth-child(1) { grid-column: span 2; }
  }

  /* ── base card ── */
  .pb-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    min-height: 200px;
    padding: 1.5em;
    border-radius: 20px;
    border: 1px solid var(--border-color);
    background: var(--bg-dark);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    --glow-x: 50%;
    --glow-y: 50%;
    --glow-intensity: 0;
    --glow-radius: 220px;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }
  .pb-card:hover {
    transform: translateY(-3px);
  }

  /* ── border glow ── */
  .pb-card--glow::after {
    content: '';
    position: absolute;
    inset: 0;
    padding: 5px;
    background: radial-gradient(
      var(--glow-radius) circle at var(--glow-x) var(--glow-y),
      rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.9)) 0%,
      rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.4)) 35%,
      transparent 65%
    );
    border-radius: inherit;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
  }
  .pb-card--glow:hover {
    box-shadow: 0 4px 24px rgba(46, 24, 78, 0.5), 0 0 35px rgba(${GLOW_COLOR}, 0.18);
  }

  /* ── card content ── */
  .pb-card__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5em;
    position: relative;
    z-index: 2;
  }
  .pb-card__name {
    font-weight: 700;
    font-size: 1.1rem;
    color: #fff;
    text-transform: capitalize;
    line-height: 1.25;
    transition: color 0.2s;
    margin: 0;
  }
  .pb-card:hover .pb-card__name {
    color: #e945f5;
  }
  .pb-card__live {
    flex-shrink: 0;
    font-size: 0.7rem;
    padding: 0.25em 0.9em;
    border-radius: 9999px;
    background: rgba(233,69,245,0.15);
    color: #e945f5;
    border: 1px solid rgba(233,69,245,0.35);
    transition: background 0.2s;
    text-decoration: none;
  }
  .pb-card__live:hover { background: rgba(233,69,245,0.35); }

  .pb-card__desc {
    font-size: 0.82rem;
    line-height: 1.55;
    color: rgba(255,255,255,0.45);
    margin: 0.6em 0 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }
  .pb-card__topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    margin-top: 0.75em;
    position: relative;
    z-index: 2;
  }
  .pb-card__topic {
    font-size: 0.65rem;
    padding: 0.2em 0.65em;
    border-radius: 9999px;
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.55);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .pb-card__meta {
    display: flex;
    align-items: center;
    gap: 1em;
    margin-top: 1.25em;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    position: relative;
    z-index: 2;
  }
  .pb-card__lang {
    display: flex;
    align-items: center;
    gap: 0.4em;
  }
  .pb-card__lang-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  /* ── particle ── */
  .pb-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
  }

  /* ── global spotlight ── */
  .pb-spotlight {
    position: fixed;
    width: 750px;
    height: 750px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(
      circle,
      rgba(${GLOW_COLOR}, 0.14) 0%,
      rgba(${GLOW_COLOR}, 0.07) 18%,
      rgba(${GLOW_COLOR}, 0.03) 30%,
      transparent 65%
    );
    z-index: 200;
    opacity: 0;
    transform: translate(-50%, -50%);
    mix-blend-mode: screen;
  }

  /* ── skeleton ── */
  @keyframes pb-pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
  .pb-skeleton {
    min-height: 200px;
    border-radius: 20px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    animation: pb-pulse 1.6s ease-in-out infinite;
  }
`;

// ─── Particle helpers ─────────────────────────────────────────────────────────

const createParticle = (x: number, y: number) => {
  const el = document.createElement('div');
  el.className = 'pb-particle';
  el.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    background: rgba(${GLOW_COLOR}, 1);
    box-shadow: 0 0 6px rgba(${GLOW_COLOR}, 0.6);
  `;
  return el;
};

const calcSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlow = (card: HTMLElement, mx: number, my: number, intensity: number, radius: number) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mx - r.left) / r.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((my - r.top) / r.height) * 100}%`);
  card.style.setProperty('--glow-intensity', intensity.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// ─── ParticleCard ─────────────────────────────────────────────────────────────

interface ParticleCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const ParticleCard = ({ children, className = '', style, disabled = false, onClick }: ParticleCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoveredRef = useRef(false);
  const memoRef = useRef<HTMLElement[]>([]);
  const initRef = useRef(false);

  const init = useCallback(() => {
    if (initRef.current || !ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    memoRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(Math.random() * width, Math.random() * height)
    );
    initRef.current = true;
  }, []);

  const clear = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    particlesRef.current.forEach(p =>
      gsap.to(p, { scale: 0, opacity: 0, duration: 0.25, ease: 'back.in(1.7)', onComplete: () => p.remove() })
    );
    particlesRef.current = [];
  }, []);

  const spawn = useCallback(() => {
    if (!ref.current || !hoveredRef.current) return;
    if (!initRef.current) init();
    memoRef.current.forEach((src, i) => {
      const t = setTimeout(() => {
        if (!hoveredRef.current || !ref.current) return;
        const clone = src.cloneNode(true) as HTMLElement;
        ref.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, ease: 'back.out(1.7)' });
        gsap.to(clone, { x: (Math.random() - 0.5) * 90, y: (Math.random() - 0.5) * 90, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.4, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, i * 90);
      timersRef.current.push(t);
    });
  }, [init]);

  useEffect(() => {
    if (disabled || !ref.current) return;
    const el = ref.current;

    const onEnter = () => { hoveredRef.current = true; spawn(); };
    const onLeave = () => { hoveredRef.current = false; clear(); };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientX - r.left) / r.width - 0.5) * -12;
      const ry = ((e.clientY - r.left) / r.width - 0.5) * 12; // subtle tilt
      gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.12, ease: 'power2.out', transformPerspective: 900 });
    };
    const onReset = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' });

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onReset);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onReset);
      hoveredRef.current = false;
      clear();
    };
  }, [disabled, spawn, clear]);

  return (
    <div ref={ref} className={className} style={{ ...style, position: 'relative', overflow: 'hidden' }} onClick={onClick}>
      {children}
    </div>
  );
};

// ─── GlobalSpotlight ──────────────────────────────────────────────────────────

const GlobalSpotlight = ({ gridRef }: { gridRef: React.RefObject<HTMLDivElement | null> }) => {
  useEffect(() => {
    if (!gridRef.current) return;
    const spot = document.createElement('div');
    spot.className = 'pb-spotlight';
    document.body.appendChild(spot);

    const onMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      const section = gridRef.current.closest('.pb-bento-section');
      const r = section?.getBoundingClientRect();
      const inside = r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      const cards = gridRef.current.querySelectorAll<HTMLElement>('.pb-card');

      if (!inside) {
        gsap.to(spot, { opacity: 0, duration: 0.3 });
        cards.forEach(c => c.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = calcSpotlightValues(SPOTLIGHT_RADIUS);
      let minDist = Infinity;
      cards.forEach(c => {
        const cr = c.getBoundingClientRect();
        const cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2;
        const d = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2);
        minDist = Math.min(minDist, d);
        const gi = d <= proximity ? 1 : d <= fadeDistance ? (fadeDistance - d) / (fadeDistance - proximity) : 0;
        updateCardGlow(c, e.clientX, e.clientY, gi, SPOTLIGHT_RADIUS);
      });

      gsap.to(spot, { left: e.clientX, top: e.clientY, duration: 0.1 });
      const targetOpacity = minDist <= proximity ? 0.8 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spot, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5 });
    };

    const onLeave = () => {
      gridRef.current?.querySelectorAll<HTMLElement>('.pb-card').forEach(c => c.style.setProperty('--glow-intensity', '0'));
      gsap.to(spot, { opacity: 0, duration: 0.3 });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      spot.remove();
    };
  }, [gridRef]);

  return null;
};

// ─── RepoCard ─────────────────────────────────────────────────────────────────

const RepoCard = ({ repo, isMobile }: { repo: Repo; isMobile: boolean }) => {
  const cardClass = `pb-card pb-card--glow`;

  const content = (
    <>
      <div>
        <div className="pb-card__top">
          <h3 className="pb-card__name">{repo.name.replace(/-/g, ' ')}</h3>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="pb-card__live"
              onClick={e => e.stopPropagation()}
            >
              Live ↗
            </a>
          )}
        </div>
        <p className="pb-card__desc">
          {repo.description ?? 'No description provided.'}
        </p>
        {repo.topics.length > 0 && (
          <div className="pb-card__topics">
            {repo.topics.slice(0, 4).map(t => (
              <span key={t} className="pb-card__topic">{t}</span>
            ))}
          </div>
        )}
      </div>
      <div className="pb-card__meta">
        {repo.language && (
          <span className="pb-card__lang">
            <span
              className="pb-card__lang-dot"
              style={{ backgroundColor: languageColors[repo.language] ?? languageColors.default }}
            />
            {repo.language}
          </span>
        )}
        <span>★ {repo.stargazers_count}</span>
        <span>⑂ {repo.forks_count}</span>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {content}
      </a>
    );
  }

  return (
    <ParticleCard
      className={cardClass}
      onClick={() => window.open(repo.html_url, '_blank', 'noopener,noreferrer')}
    >
      {content}
    </ParticleCard>
  );
};

// ─── ProjectsSection ──────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/users/namish-yadav/repos?sort=updated&per_page=12')
      .then(r => r.json())
      .then((data: Repo[]) => {
        setRepos(data.filter(r => !r.fork).slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="pb-bento-section relative py-32 px-6">
      {/* Inject styles */}
      <style>{inlineStyles}</style>

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Projects<span style={{ color: '#e945f5' }}>.</span>
          </h2>
          <p className="text-neutral-400 mt-4 text-lg">
            Auto-synced from GitHub.
          </p>
        </div>

        {/* Spotlight (desktop only) */}
        {!isMobile && <GlobalSpotlight gridRef={gridRef} />}

        {/* Grid */}
        <div className="pb-card-grid" ref={gridRef}>
          {loading
            ? [...Array(6)].map((_, i) => <div key={i} className="pb-skeleton" />)
            : repos.length > 0
              ? repos.map(repo => <RepoCard key={repo.id} repo={repo} isMobile={isMobile} />)
              : (
                <p className="text-neutral-500 text-lg text-center py-20 col-span-3">
                  No public repositories found.
                </p>
              )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/namish-yadav"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'border-color 0.3s, color 0.3s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e945f5';
              (e.currentTarget as HTMLAnchorElement).style.color = '#e945f5';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
            }}
          >
            View all on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
