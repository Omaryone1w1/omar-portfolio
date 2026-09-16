import { useCallback, useEffect, useRef, useState } from 'react';
import './CertificateShowcase.css';

export default function CertificateShowcase({ images = [] }) {
  const trackRef = useRef(null);
  const dialogRef = useRef(null);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  const scrollByCards = dir => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.cert-card');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const onPointerDown = e => {
    const el = trackRef.current;
    if (!el) return;
    dragState.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false, pointerId: e.pointerId };
  };
  const onPointerMove = e => {
    const el = trackRef.current;
    const ds = dragState.current;
    if (!el || !ds.active) return;
    const dx = e.clientX - ds.startX;
    if (Math.abs(dx) > 4 && !ds.moved) {
      ds.moved = true;
      el.setPointerCapture(ds.pointerId);
    }
    if (ds.moved) el.scrollLeft = ds.startScroll - dx;
  };
  const endDrag = () => {
    dragState.current.active = false;
  };

  const openCert = index => {
    if (dragState.current.moved) return;
    setActiveIndex(index);
    dialogRef.current?.showModal();
  };
  const closeCert = () => dialogRef.current?.close();

  const step = dir => {
    setActiveIndex(i => {
      const next = (i + dir + images.length) % images.length;
      return next;
    });
  };

  useEffect(() => {
    const onKey = e => {
      if (!dialogRef.current?.open) return;
      if (e.key === 'Escape') closeCert();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length]);

  return (
    <div className="cert-showcase">
      <div
        className="cert-track"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className="cert-card"
            style={{ '--i': i }}
            onClick={() => openCert(i)}
            aria-label={img.alt || `Open certificate ${i + 1}`}
          >
            <img src={img.src} alt={img.alt || ''} draggable={false} loading="lazy" />
            <span className="cert-card-index">{String(i + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      <div className="cert-nav" aria-hidden={images.length <= 1}>
        <button type="button" onClick={() => scrollByCards(-1)} disabled={!canPrev} aria-label="Scroll certificates left">
          ←
        </button>
        <button type="button" onClick={() => scrollByCards(1)} disabled={!canNext} aria-label="Scroll certificates right">
          →
        </button>
      </div>

      <dialog ref={dialogRef} className="lightbox cert-lightbox" onClick={e => e.target === dialogRef.current && closeCert()}>
        {images[activeIndex] ? (
          <>
            <img src={images[activeIndex].src} alt={images[activeIndex].alt || ''} />
            <p>
              Certificate {activeIndex + 1} of {images.length}
            </p>
          </>
        ) : null}
        <button type="button" className="lightbox-close" onClick={closeCert} aria-label="Close">
          ×
        </button>
        <button type="button" className="cert-lightbox-prev" onClick={() => step(-1)} aria-label="Previous certificate">
          ‹
        </button>
        <button type="button" className="cert-lightbox-next" onClick={() => step(1)} aria-label="Next certificate">
          ›
        </button>
      </dialog>
    </div>
  );
}
