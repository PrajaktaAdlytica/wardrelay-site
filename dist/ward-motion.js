/* Shared presentation motion. Data, quantities and approval states never autoplay. */
'use strict';
(() => {
 const root = document.documentElement;
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const still = () => preference.matches || root.classList.contains('motion-off') || document.hidden;
 const cameras = new Set();
 // Damping only affects photographs. Page scrolling, focus and input remain native.
 function camera(photos, route) {
  let current = [0, 0, 0], target = [...current], frame = 0, previous = 0;
  function paint() {
   const [progress, junction, review] = current;
   if (photos[1]) photos[1].style.opacity = junction;
   if (photos[2]) photos[2].style.opacity = review;
   const transform = `scale(${1.025 + progress * .025}) translate3d(0,${-progress * .6}%,0)`;
   photos.forEach(photo => { photo.style.transform = transform; });
   if (route) route.style.strokeDashoffset = String(1 - progress);
  }
  function tick(time) {
   frame = 0;
   if (still()) { previous = 0; return; }
   const dt = previous ? Math.min(48, time - previous) : 16;
   previous = time;
   const blend = 1 - Math.exp(-dt / 135);
   current = current.map((v, i) => v + (target[i] - v) * blend);
   if (current.every((v, i) => Math.abs(v - target[i]) < .0005)) {
    current = [...target]; previous = 0; paint(); return;
   }
   paint(); frame = requestAnimationFrame(tick);
  }
  const api = {
   set(progress, junction, review) {
    target = [progress, junction, review];
    if (!still() && !frame) frame = requestAnimationFrame(tick);
   },
   stop() { cancelAnimationFrame(frame); frame = 0; previous = 0; },
  };
  cameras.add(api); paint(); return api;
 }
 window.WardMotion = {camera};
 function sync() { if (still()) {cameras.forEach(c => c.stop());document.getAnimations().filter(a=>a.id==='ward-feedback').forEach(a=>a.finish());} }
 new MutationObserver(sync).observe(root, {attributes: true, attributeFilter: ['class']});
 preference.addEventListener('change', sync);
 document.addEventListener('visibilitychange', sync);

 function mount() {
  root.classList.add('ward-motion-ready');
  const revealSelector = '.section-intro,.section-heading,.info-card,.resource-card,.boundary-split>div,.before-after>article,.gate-grid>div,.pilot-gates>div,.team-card,.fit-boundaries>p,.article-body>section,.price-block,.form-next,.auth-form,.page-form,.demo-toolbar';
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {entry.target.classList.add('motion-entered');observer.unobserve(entry.target);}
   });
  }, {threshold: .12, rootMargin: '0px 0px -18px 0px'});
  document.querySelectorAll(revealSelector).forEach(el => {
   el.classList.add('motion-reveal');
   const siblings = [...el.parentElement.children].filter(x => x.matches(revealSelector));
   el.style.setProperty('--reveal-delay', `${Math.min(3, siblings.indexOf(el)) * 85}ms`);
   observer.observe(el);
  });
  // Only in-view instruments run their trace. Reveal motion runs once, never on a reading loop.
  const instruments = document.querySelectorAll('.artifact-panel,.scene-card,.fragment-scene,.fit-flow,.module-preview,.team-deck,.final-cta,.page-cta,.relay-console,.workbench,.demo-workspace');
  const active = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('motion-visible', e.isIntersecting)), {threshold: .08});
  instruments.forEach(el => active.observe(el));
  const svgNS = 'http://www.w3.org/2000/svg';
  // A travelling point shows the direction of the existing evidence connection.
  document.querySelectorAll('.fragment-scene>svg,.fit-connector>svg,.stock-link').forEach(svg => {
   const path = svg.querySelector('path'); if (!path) return;
   const dot = document.createElementNS(svgNS, 'circle');
   dot.setAttribute('r', '3.5');dot.setAttribute('class', 'signal-traveller');
   dot.setAttribute('fill', '#c35413');dot.setAttribute('aria-hidden', 'true');
   dot.style.offsetPath = `path('${path.getAttribute('d')}')`;
   svg.append(dot);
  });
  document.querySelectorAll('.facility-map,.mapping-lines,.approval-chain,.trail-stations,.scenario-dates,.calendar,.document-pair,.evidence-timeline').forEach(group => {
   [...group.children].forEach((el,i) => el.style.setProperty('--trace-index',i));
  });
  // Animate only the result of a deliberate control change, not the decision itself.
  const resultTargets = '#facility-detail,#proof-status,#receipt-result,#readiness-result,#approval-result,#case-detail,#case-title,#demo-record,#demo-sources';
  document.querySelectorAll(resultTargets).forEach(el => {
   const changes = new MutationObserver(() => {
    if (still()) return;
    el.getAnimations().filter(a=>a.id==='ward-feedback').forEach(a=>a.cancel());
    const a = el.animate([{opacity:.5,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.2,.7,.2,1)'});
    a.id = 'ward-feedback';
   });
   changes.observe(el,{childList:true,subtree:true,characterData:true});
  });
  document.addEventListener('toggle', event => {
   const details = event.target;
   if (!(details instanceof HTMLDetailsElement) || !details.open || still() || details.closest('nav')) return;
   [...details.children].filter(x=>x.tagName!=='SUMMARY').forEach(el=>{const a=el.animate([{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});a.id='ward-feedback';});
  }, true);
 }
 if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
