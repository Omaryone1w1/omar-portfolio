import { useEffect, useRef } from 'react';
import './ProfileOrbits.css';

const PROFILES = [
  {
    key: 'github',
    label: 'GitHub',
    tag: 'Code & repos',
    href: 'https://github.com/Omaryone1w1',
    img: '/avatars/github.jpg',
    cluster: { x: -18, y: -6 },
    spread: { x: -300, y: 10 }
  },
  {
    key: 'kaggle',
    label: 'Kaggle',
    tag: 'Notebooks & comps',
    href: 'https://www.kaggle.com/omarmohamed1w1',
    img: '/avatars/kaggle.jpg',
    cluster: { x: 0, y: 12 },
    spread: { x: 0, y: -30 }
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    tag: 'The full story',
    href: 'https://www.linkedin.com/in/omar-mohamed-fathallah-59912b335/',
    img: '/avatars/linkedin.jpg',
    cluster: { x: 18, y: -6 },
    spread: { x: 300, y: 10 }
  }
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ProfileOrbits() {
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const orbRefs = useRef([]);
  const headingRef = useRef(null);
  const rafRef = useRef(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const raw = total > 0 ? -rect.top / total : 0;
      const progress = easeOutCubic(clamp01(raw));

      orbRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = PROFILES[i];
        const x = lerp(p.cluster.x, p.spread.x, progress);
        const y = lerp(p.cluster.y, p.spread.y, progress);
        const scale = lerp(0.55, 1, progress);
        el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(lerp(0.75, 1, progress));
      });

      if (headingRef.current) {
        headingRef.current.style.opacity = String(clamp01(progress * 1.6));
        headingRef.current.style.transform = `translateY(${lerp(16, 0, progress)}px)`;
      }

      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="orbits-track" ref={trackRef}>
      <div className="orbits-stage" ref={stageRef}>
        <p className="orbits-eyebrow">Elsewhere</p>
        <h2 className="orbits-heading" ref={headingRef}>
          Same builder,
          <br />
          <em>three profiles.</em>
        </h2>
        <div className="orbits-field">
          {PROFILES.map((p, i) => (
            <a
              key={p.key}
              className={`orbit orbit--${p.key}`}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              ref={el => (orbRefs.current[i] = el)}
            >
              <span className="orbit__float">
                <img src={p.img} alt={`${p.label} profile`} />
              </span>
              <span className="orbit__label">
                {p.label}
                <em>{p.tag}</em>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
