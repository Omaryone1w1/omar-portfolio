import { createRoot } from 'react-dom/client';
import CertificateShowcase from './CertificateShowcase.jsx';
import AccordionGallery from './AccordionGallery.jsx';
import ProfileOrbits from './ProfileOrbits.jsx';
import ScrollStack, { ScrollStackItem } from './ScrollStack.jsx';
import ScrollVelocity from './ScrollVelocity.jsx';

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

// Add as many photos as you like — just add more objects here, each with
// its own image path and title. The gallery lays itself out automatically.
const momentItems = [
  { image: '/gallery/vision-01.jpg', label: 'Synthetic Bloom' },
  { image: '/gallery/vision-02.jpg', label: 'Color Studies' },
  { image: '/gallery/vision-03.jpg', label: 'Future Frame' },
  { image: '/gallery/vision-04.jpg', label: 'Dream Logic' },
  { image: '/gallery/vision-05.jpg', label: 'Signal / Noise' }
];

const timelineEntries = [
  { date: '2025', title: 'HCIA AI v4 Certification', body: 'National Telecommunication Institute · 80 intensive hours in deep learning, CNNs, RNNs, ANNs, and practical ML. Four competitions with 90% average model accuracy.' },
  { date: '2025', title: 'IoT & Soft Skills Training', body: 'National Telecommunication Institute · 120-hour program spanning IoT development, real-time systems, and professional communication.' },
  { date: 'Ongoing', title: 'IEEE Student Branch', body: 'Developing and presenting CNN-from-scratch and transfer-learning work; sharing practical AI applications with peers.' },
  { date: '2023–27', title: 'Bachelor in Intelligent Systems Engineering', body: 'Helwan National University · Expected graduation 2027 · GPA 3.4/4.0.' }
];

const certsRoot = document.getElementById('certs-dome-root');
if (certsRoot) {
  createRoot(certsRoot).render(<CertificateShowcase images={certificateImages} />);
}

const momentsRoot = document.getElementById('momentsAccordionRoot');
if (momentsRoot) {
  createRoot(momentsRoot).render(
    <AccordionGallery items={momentItems} defaultIndex={0} height={420} expandRatio={0.5} grayscale={false} trigger="hover" overlayColor="#050505" />
  );
}

const heroExpandRoot = document.getElementById('heroExpandRoot');
if (heroExpandRoot) {
  createRoot(heroExpandRoot).render(<ProfileOrbits />);
}

const timelineRoot = document.getElementById('timelineStackRoot');
if (timelineRoot) {
  createRoot(timelineRoot).render(
    <ScrollStack
      useWindowScroll
      itemDistance={70}
      itemScale={0.035}
      itemStackDistance={22}
      stackPosition="14%"
      scaleEndPosition="6%"
      baseScale={0.86}
    >
      {timelineEntries.map((entry, i) => (
        <ScrollStackItem key={i}>
          <span className="stack-date">{entry.date}</span>
          <h3>{entry.title}</h3>
          <p>{entry.body}</p>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}

const marqueeRoot = document.getElementById('skillsMarqueeRoot');
if (marqueeRoot) {
  createRoot(marqueeRoot).render(
    <ScrollVelocity
      texts={['Python · TensorFlow · PyTorch', 'Computer Vision · Embedded Systems · IoT']}
      velocity={60}
      className="marquee-text"
      numCopies={4}
    />
  );
}
