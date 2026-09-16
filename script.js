import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis=null;
if(!reduceMotion){
  lenis=new Lenis({duration:1.05,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});
  lenis.on('scroll',ScrollTrigger.update);
  gsap.ticker.add(time=>lenis.raf(time*1000));
  gsap.ticker.lagSmoothing(0);
  window.lenis=lenis;
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href').slice(1);
      const target=id?document.getElementById(id):null;
      if(target){e.preventDefault();lenis.scrollTo(target,{offset:-10,duration:1.2})}
    });
  });
}
document.getElementById('year').textContent=new Date().getFullYear();
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach((el,index)=>{el.style.transitionDelay=`${Math.min(index%5,3)*75}ms`;revealObserver.observe(el)});
function endIntro(){document.querySelector('.intro')?.remove();document.body.classList.remove('is-loading');ScrollTrigger.refresh()}
function playHeadline(){gsap.to('.hero-title .line-inner',{yPercent:0,rotateX:0,filter:'blur(0px)',duration:1.4,stagger:.14,ease:'power4.out'})}
gsap.set('.hero-title .line-inner',{yPercent:112,rotateX:12,filter:'blur(10px)',transformOrigin:'50% 100%'});
const introLettersEl=document.querySelector('.intro-letters');
if(introLettersEl){introLettersEl.innerHTML=introLettersEl.textContent.split('').map(ch=>`<span class="char">${ch}</span>`).join('')}
if(reduceMotion){endIntro();gsap.set('.hero-title .line-inner',{yPercent:0,rotateX:0,filter:'blur(0px)'});}else{
  gsap.timeline({onComplete:endIntro})
    .set('.intro-caret',{opacity:1})
    .to('.intro-letters .char',{opacity:1,duration:.01,stagger:.11,ease:'none'})
    .to('.intro-caret',{opacity:0,duration:.15,repeat:1,yoyo:true})
    .fromTo('.intro-sub',{opacity:0,y:24},{opacity:.85,y:0,duration:.45})
    .to('.intro-caret',{opacity:0,duration:.2},'<')
    .to('.intro-line',{scaleX:0,duration:.6,ease:'power4.inOut'},'+=.4')
    .to('.intro',{clipPath:'inset(0 0 100% 0)',duration:.9,ease:'expo.inOut'},'-=.1');
  gsap.delayedCall(2.4,playHeadline);
}
if(!reduceMotion){gsap.to('.hero-portrait',{yPercent:-18,rotation:3,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});gsap.to('h1',{letterSpacing:'-.09em',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});gsap.utils.toArray('.project').forEach((item,i)=>{gsap.from(item,{x:i%2?150:-150,rotation:i%2?3:-3,opacity:0,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:item,start:'top 82%'}});gsap.to(item.querySelector('.project-copy'),{y:-35,scrollTrigger:{trigger:item,start:'top bottom',end:'bottom top',scrub:1}})});gsap.from('.proof-item',{scale:.45,rotateX:60,opacity:0,stagger:.13,duration:1.1,ease:'back.out(1.5)',scrollTrigger:{trigger:'.proof',start:'top 76%'}});gsap.to('.about-mark',{rotation:-8,y:60,scrollTrigger:{trigger:'.about',start:'top bottom',end:'bottom top',scrub:.6}})}

// Count-up stats
document.querySelectorAll('.count-up').forEach(el=>{
  const target=parseFloat(el.dataset.count);
  const decimals=parseInt(el.dataset.decimals||'0',10);
  const obj={v:0};
  ScrollTrigger.create({
    trigger:el,
    start:'top 88%',
    once:true,
    onEnter:()=>{
      if(reduceMotion){el.textContent=target.toFixed(decimals);return}
      gsap.to(obj,{v:target,duration:1.6,ease:'power2.out',onUpdate:()=>{el.textContent=obj.v.toFixed(decimals)}});
    }
  });
});

// Cursor-following preview thumbnail for the project list.
// Only shows for projects that actually have a real photo — a plain color
// swatch for projects without one is more confusing than helpful.
if(!reduceMotion && matchMedia('(hover:hover) and (pointer:fine)').matches){
  const preview=document.createElement('div');
  preview.className='project-preview';
  document.body.appendChild(preview);
  let px=0,py=0,tx=0,ty=0,active=false;
  function raf(){
    px+=(tx-px)*0.18;py+=(ty-py)*0.18;
    preview.style.left=(px+28)+'px';preview.style.top=(py-140)+'px';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  document.querySelectorAll('.project').forEach((item,i)=>{
    const photo=item.querySelector('.project-photo');
    if(!photo)return; // no real image yet — skip the preview rather than fake it
    const label=item.querySelector('h3')?.innerHTML.replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').trim()||`Project ${i+1}`;
    item.addEventListener('mouseenter',e=>{
      active=true;
      preview.innerHTML=`<img src="${photo.src}" alt="" /><span>${String(i+1).padStart(2,'0')} · ${label}</span>`;
      tx=e.clientX;ty=e.clientY;px=tx;py=ty;
      gsap.to(preview,{opacity:1,scale:1,duration:.35,ease:'power3.out'});
    });
    item.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY});
    item.addEventListener('mouseleave',()=>{
      active=false;
      gsap.to(preview,{opacity:0,scale:.85,duration:.25,ease:'power2.in'});
    });
  });
  function hidePreview(){
    if(!active)return;
    active=false;
    gsap.to(preview,{opacity:0,scale:.85,duration:.2,ease:'power2.in'});
  }
  addEventListener('scroll',hidePreview,{passive:true});
  if(lenis)lenis.on('scroll',hidePreview);
}
function safeRefresh(){ if(window.scrollY<80) ScrollTrigger.refresh(); }
window.addEventListener('load',safeRefresh);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(safeRefresh);
