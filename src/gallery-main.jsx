import { createRoot } from 'react-dom/client';
import AccordionGallery from './AccordionGallery.jsx';
import CertificateShowcase from './CertificateShowcase.jsx';

const momentItems = [
  { image: '/gallery/vision-06.jpg', label: 'Omar Fathallah' },
  { image: '/gallery/vision-01.jpg', label: 'Synthetic Bloom' },
  { image: '/gallery/vision-02.jpg', label: 'Color Studies' },
  { image: '/gallery/vision-03.jpg', label: 'Future Frame' },
  { image: '/gallery/vision-04.jpg', label: 'Dream Logic' },
  { image: '/gallery/vision-05.jpg', label: 'Signal / Noise' },
  { image: '/gallery/atmosphere.jpg', label: 'Atmosphere' }
];

const certificateImages = [
  { src: '/certificates/1739739672846.jpg', alt: 'Professional certificate' },
  { src: '/certificates/1755033359767.jpg', alt: 'Professional certificate' },
  { src: '/certificates/1755035328978.jpg', alt: 'Professional certificate' },
  { src: '/certificates/1756211098321.jpg', alt: 'Professional certificate' },
  { src: '/certificates/1756225833572.jpg', alt: 'Professional certificate' },
  { src: '/certificates/1756318598377.png', alt: 'Professional certificate' },
  { src: '/certificates/1757617179384.png', alt: 'Professional certificate' },
  { src: '/certificates/1758089857560.jpg', alt: 'Professional certificate' },
  { src: '/certificates/1758122942969.jpg', alt: 'Professional certificate' }
];

function App() {
  return (
    <main className="page-shell">
      <nav className="subnav">
        <a href="index.html">← Home</a>
        <a href="resume.html">View resume ↗</a>
      </nav>
      <div className="gallery-page-head">
        <p className="eyebrow">Moments &amp; journey</p>
        <h1>Snapshots from workshops, competitions, and the projects behind them.</h1>
      </div>
      <div className="gallery-accordion-wrap">
        <AccordionGallery items={momentItems} defaultIndex={0} height={560} expandRatio={0.5} trigger="hover" />
      </div>

      <div className="gallery-page-head gallery-page-head--certs">
        <p className="eyebrow">Nine, and counting</p>
        <h1>Proof of practice — every certificate, in one place.</h1>
      </div>
      <div className="gallery-dome-wrap">
        <CertificateShowcase images={certificateImages} />
      </div>
    </main>
  );
}

createRoot(document.getElementById('gallery-root')).render(<App />);
