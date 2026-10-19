/* One photographic environment follows the homepage's operational story. */
'use strict';
(() => {
 if(!document.body.classList.contains('home-walk'))return;
 const root=document.documentElement,body=document.body;
 const hero=document.querySelector('.hero'),walk=document.querySelector('#how-it-works'),stage=document.querySelector('.walk-stage'),governance=document.querySelector('#governance');
 const photos=[...document.querySelectorAll('.home-photo')],junction=photos[1],review=photos[2],route=document.querySelector('.home-route path'),progress=document.querySelector('.home-progress span');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>n*n*(3-2*n);
 const camera=window.WardMotion.camera(photos,route);
 let pending=false;
 function render(){
  pending=false;if(document.hidden)return;
  const vh=innerHeight,header=document.querySelector('.site-header').offsetHeight;
  const p=clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-vh));
  progress.style.transform=`scaleX(${p})`;
  body.classList.toggle('home-story',hero.getBoundingClientRect().bottom<vh*.5);
  if(reduce.matches||root.classList.contains('motion-off'))return;
  const bounds=walk.getBoundingClientRect();
  // The arrival view becomes the supply junction at the stock chapter, then holds.
  const anchor=innerWidth>=1000?bounds.top+(walk.offsetHeight-stage.offsetHeight)*.21:document.querySelector('.walk-panel[data-step="1"]').getBoundingClientRect().top;
  const a=ease(clamp((vh*.95-anchor)/Math.max(vh*1.4,1)));
  // The review room arrives at the governance section and remains through the closing CTA.
  const b=ease(clamp((vh*1.25-governance.getBoundingClientRect().top)/Math.max(vh*1.15,1)));
  camera.set(p,a,b);
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(render);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule,{once:true});document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);
 new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:['class']});
 document.fonts.ready.then(schedule);schedule();
})();
