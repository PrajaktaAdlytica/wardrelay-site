/* The movie is decorative, muted, skippable, and never a prerequisite to access. */
(() => {
 'use strict';
 const root=document.documentElement, overlay=document.querySelector('#ward-intro');
 if(!overlay)return;
 clearTimeout(window.wardIntroFailSafe);
 const video=overlay.querySelector('video'), pause=overlay.querySelector('#intro-pause'), skip=overlay.querySelector('#intro-skip'), caption=overlay.querySelector('.intro-caption p'), chapter=overlay.querySelector('.intro-caption small');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), key='wardrelay-intro-v1';
 let active=false,ending=false,raf=0,stallTimer=0,readyTimer=0,lastTime=-1,lastCaption=-1,returnFocus=null,wasPlaying=false;
 const locked=new Map();
 const captions=[['01 / A CONNECTED WORLD','A world of moving parts.'],['02 / THE HUMAN HANDOFF','Every handoff needs a person.'],['03 / FOLLOW THE THREAD','One continuous thread.']];
 const clamp=n=>Math.max(0,Math.min(1,n));
 const ease=n=>n*n*(3-2*n);
 function markSeen(){try{sessionStorage.setItem(key,'seen');}catch(_){}}
 function lockPage(on){
  document.querySelectorAll('body > :is(header,main,footer,.mobile-menu,.motion-control,.skip-link)').forEach(el=>{
   if(on){locked.set(el,el.inert);el.inert=true;}else if(locked.has(el)){el.inert=locked.get(el);}
  });
  if(!on)locked.clear();
 }
 function tick(){
  if(!active||ending)return;
  const t=video.currentTime, duration=Number.isFinite(video.duration)?video.duration:15;
  overlay.style.setProperty('--film-progress',String(clamp(t/duration)));
  const arrive=ease(clamp((t-12.6)/2));
  overlay.style.setProperty('--arrival',String(arrive));
  const i=t<4.4?0:t<8.4?1:2;
  if(i!==lastCaption){lastCaption=i;chapter.textContent=captions[i][0];caption.textContent=captions[i][1];caption.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});}
  // Time advancing proves actual playback, unlike a successful play() call alone.
  if(t!==lastTime){clearTimeout(stallTimer);lastTime=t;}
  if(t>=duration-.05){finish(false);return;}
  raf=requestAnimationFrame(tick);
 }
 function finish(immediate=false){
  if(!active&& !root.classList.contains('intro-pending'))return;
  if(ending)return;ending=true;active=false;clearTimeout(readyTimer);clearTimeout(stallTimer);cancelAnimationFrame(raf);video.pause();markSeen();
  root.classList.remove('intro-pending','intro-active');root.classList.add('intro-revealing');lockPage(false);
  // At natural completion, the DOM landing plate precisely matches the live background.
  if(!immediate && video.currentTime>12.5)overlay.style.setProperty('--arrival','1');
  overlay.classList.add('is-exiting');
  const focused=overlay.contains(document.activeElement);
  if(focused){const target=returnFocus||document.querySelector('.hero h1');if(target?.tagName==='H1')target.setAttribute('tabindex','-1');target?.focus({preventScroll:true});}
  setTimeout(()=>{overlay.hidden=true;overlay.classList.remove('is-exiting');ending=false;video.removeAttribute('src');video.load();},immediate?0:850);
  setTimeout(()=>document.querySelector('#replay-hero')?.click(),350);
  setTimeout(()=>root.classList.remove('intro-revealing'),1600);
 }
 function start(replay=false){
  if(active||ending)return;
  if(reduced.matches&&!replay){root.classList.remove('intro-pending');return;}
  returnFocus=replay?document.querySelector('#intro-replay'):null;
  scrollTo({top:0,behavior:'instant'});active=true;lastCaption=-1;lastTime=-1;
  root.classList.add('intro-active');root.classList.remove('intro-pending','intro-revealing');lockPage(true);
  overlay.hidden=false;overlay.dataset.playback='loading';overlay.style.setProperty('--arrival','0');overlay.style.setProperty('--film-progress','0');
  video.src=matchMedia('(max-aspect-ratio: 3/4)').matches?'/assets/video/wardrelay-intro-mobile.mp4':'/assets/video/wardrelay-intro.mp4';
  video.muted=true;video.playsInline=true;video.currentTime=0;pause.textContent='Pause';pause.setAttribute('aria-pressed','false');
  // A slow or blocked video must never hold visitors behind the intro.
  readyTimer=setTimeout(()=>finish(true),7000);
  raf=requestAnimationFrame(tick);
  video.play().then(()=>{clearTimeout(readyTimer);}).catch(error=>{if(error.name==='AbortError'&&pause.getAttribute('aria-pressed')==='true')return;overlay.dataset.playback=error.name;finish(true);});
  if(replay)skip.focus({preventScroll:true});
 }
 video.addEventListener('ended',()=>finish(false));
 video.addEventListener('error',()=>{if(active){overlay.dataset.playback='media-error-'+(video.error?.code||0);finish(true);}});
 video.addEventListener('waiting',()=>{clearTimeout(stallTimer);stallTimer=setTimeout(()=>finish(true),6000);});
 video.addEventListener('playing',()=>{overlay.dataset.playback='playing';clearTimeout(stallTimer);clearTimeout(readyTimer);});
 skip.addEventListener('click',()=>finish(false));
 pause.addEventListener('click',()=>{
  if(video.paused){video.play().catch(()=>finish(true));pause.textContent='Pause';pause.setAttribute('aria-pressed','false');}
  else{video.pause();clearTimeout(stallTimer);clearTimeout(readyTimer);overlay.dataset.playback='paused';pause.textContent='Play';pause.setAttribute('aria-pressed','true');}
 });
 overlay.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();finish(false);}
  if(e.key==='Tab'){
   if(e.shiftKey&&document.activeElement===pause){e.preventDefault();skip.focus();}
   else if(!e.shiftKey&&document.activeElement===skip){e.preventDefault();pause.focus();}
  }
 });
 document.addEventListener('visibilitychange',()=>{
  if(!active)return;
  if(document.hidden){wasPlaying=!video.paused;video.pause();clearTimeout(stallTimer);}
  else if(wasPlaying)video.play().catch(()=>finish(true));
 });
 reduced.addEventListener('change',()=>{if(reduced.matches)finish(true);});
 document.querySelector('#intro-replay')?.addEventListener('click',()=>start(true));
 if(root.classList.contains('intro-pending'))start();
})();
