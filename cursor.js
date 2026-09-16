// Lightweight custom cursor + magnetic-button effect.
// No dependencies so it can run on every page (including static resume.html).
export function initCursor() {
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || reduceMotion) return;

  document.body.classList.add('has-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = innerWidth / 2,
    mouseY = innerHeight / 2;
  let dotX = mouseX,
    dotY = mouseY,
    ringX = mouseX,
    ringY = mouseY;

  addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const hoverTargets = 'a, button, .cert-card, input, textarea, [role="button"]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('is-active');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('is-active');
  });

  // Magnetic pull for elements marked .magnetic
  document.querySelectorAll('.magnetic').forEach(el => {
    let raf = null;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.35;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      el.style.transform = 'translate(0, 0)';
    });
  });

  // Hide custom cursor when over an iframe (e.g. the embedded resume PDF),
  // since we cannot track the mouse once it enters another document.
  document.querySelectorAll('iframe').forEach(frame => {
    frame.addEventListener('mouseenter', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
  });
  addEventListener('mouseover', e => {
    if (!e.target.closest('iframe')) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
  });

  return { dot, ring };
}

initCursor();
