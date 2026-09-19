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

  // Native <dialog> content (the certificate lightbox) renders in the
  // browser's top layer, which always sits above anything in the normal
  // document — including this custom cursor, no matter its z-index. Since
  // the real cursor is hidden site-wide (`cursor:none`), that made the
  // pointer visually vanish — and feel frozen — while a certificate was
  // open. Fix: fall back to the native cursor whenever any <dialog> is open.
  function syncCursorForDialogs() {
    const dialogOpen = !!document.querySelector('dialog[open]');
    document.body.classList.toggle('has-cursor', !dialogOpen);
    dot.style.opacity = dialogOpen ? '0' : '1';
    ring.style.opacity = dialogOpen ? '0' : '1';
  }
  const dialogAttrObserver = new MutationObserver(syncCursorForDialogs);
  function watchDialog(el) {
    dialogAttrObserver.observe(el, { attributes: true, attributeFilter: ['open'] });
  }
  document.querySelectorAll('dialog').forEach(watchDialog);
  // The certificate dialog is rendered by React after this script runs, so
  // keep watching for any dialog added to the page later too.
  new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches?.('dialog')) watchDialog(node);
        node.querySelectorAll?.('dialog').forEach(watchDialog);
      });
    }
  }).observe(document.body, { childList: true, subtree: true });

  return { dot, ring };
}

initCursor();
