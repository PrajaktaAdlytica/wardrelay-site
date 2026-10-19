/* Shared Ward Walk camera and narrative progression. No data changes. */
'use strict';
(() => {
 const body=document.body;if(!body.classList.contains('ward-journey'))return;
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const root=document.documentElement, main=$('main'), photos=$$('.walk-photo'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const smooth=v=>v*v*(3-2*v);
 // First editorial paragraph remains in the photo, like a walking conversation.
 const first=$('.content-section');if(first){first.id='page-story';if(first.querySelector(':scope > .section-lead'))first.classList.add('first-narrative');}
 else {const target=$('.article-layout,.demo-workspace');if(target)target.id='page-story';}
 // Use real workflow copy as scroll chapters; nothing is hidden behind a timing gate.
 const workflows=[];
 $$('.content-section').forEach(section=>{
  const steps=section.querySelector(':scope > .process-steps');if(!steps||section.children.length!==2)return;
  const intro=section.querySelector('.section-intro'),items=[...steps.children];section.classList.add('walk-workflow');
  const layout=document.createElement('div');layout.className='workflow-layout';
  const heading=document.createElement('div');heading.className='workflow-intro';heading.append(intro);
  const marker=document.createElement('div');marker.className='workflow-marker';marker.setAttribute('aria-hidden','true');marker.innerHTML='<b>01</b><span>/ '+String(items.length).padStart(2,'0')+' · THE HANDOFF</span>';
  const rail=document.createElement('div');rail.className='workflow-rail';rail.setAttribute('aria-hidden','true');rail.innerHTML='<span></span>';
  const caption=document.createElement('p');caption.className='workflow-caption';caption.textContent='Follow the route. Every step keeps its source and its reviewer.';
  heading.append(marker,rail,caption);layout.append(heading,steps);section.append(layout);
  workflows.push({section,items,number:marker.querySelector('b'),bar:rail.firstElementChild});
 });
 // Progressive type entrance retains the original accessible heading and emphasis.
 const title=$('.page-hero h1');if(title){
  const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);const texts=[];while(walker.nextNode())texts.push(walker.currentNode);
  let n=0;texts.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word)return;if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));return;}const span=document.createElement('span');span.className='hero-word';span.style.setProperty('--word',n++);span.textContent=word;fragment.append(span);});node.replaceWith(fragment);});
 }
 $$('.page-hero .artifact-panel').forEach(panel=>{panel.querySelectorAll('.artifact-heading,.artifact-footer,.artifact-warning,.trail-stations>div,.evidence-timeline>div,.facility,.approval-lane').forEach((el,i)=>el.style.setProperty('--assembly',i));});
 root.classList.add('journey-ready');
 const cards=$$('.module-directory-card'),ctas=$$('.page-cta'),articleSections=$$('.article-body>section');
 const progress=$('.walk-page-progress span'),trail=$('.walk-trail path'),hero=$('.page-hero'),art=$('.page-hero-art');
 const camera=window.WardMotion.camera(photos,trail);
 let scheduled=false;
 function render(){
  scheduled=false;if(document.hidden)return;
  const still=root.classList.contains('motion-off')||reduced.matches;
  const height=innerHeight,y=scrollY,max=Math.max(1,document.documentElement.scrollHeight-height),global=clamp(y/max);
  progress.style.transform=`scaleX(${global})`;
  // Broad cross-dissolves connect corridor, junction and review room.
  if(!still){
   const span=clamp(height*1.6/max,.08,.18);
   const t=smooth(clamp((global-.28)/span)),u=smooth(clamp((global-.68)/span));
   camera.set(global,t,u);
   if(art&&hero&&innerWidth>900){const r=hero.getBoundingClientRect();art.style.setProperty('--hero-drift',Math.min(28,Math.max(0,-r.top)*.045)+'px');}
  }
  $('.walk-environment').classList.toggle('story-view',workflows.some(w=>{const r=w.section.getBoundingClientRect();return r.top<height*.4&&r.bottom>height*.6;}));
  workflows.forEach(w=>{let index=0,nearest=Infinity;w.items.forEach((item,i)=>{const r=item.getBoundingClientRect(),distance=Math.abs(r.top+r.height*.4-height*.52);if(distance<nearest){nearest=distance;index=i;}});w.items.forEach((item,i)=>item.classList.toggle('is-current',i===index));w.number.textContent=String(index+1).padStart(2,'0');w.bar.style.transform=`scaleX(${(index+1)/w.items.length})`;});
  cards.forEach(card=>{const r=card.getBoundingClientRect();card.classList.toggle('is-current',r.top<height*.7&&r.bottom>height*.35);});
  ctas.forEach(cta=>{const r=cta.getBoundingClientRect();cta.classList.toggle('is-current',r.top<height*.9&&r.bottom>0);});
  if(articleSections.length){let active=articleSections[0];articleSections.forEach(section=>{if(section.getBoundingClientRect().top<height*.45)active=section;});$$('.article-toc a').forEach(link=>{if(link.hash==='#'+active.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
 }
 function request(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});document.addEventListener('visibilitychange',request);reduced.addEventListener('change',request);
 new MutationObserver(request).observe(root,{attributes:true,attributeFilter:['class']});
 // Source → stock → assumptions → review. This highlights the illustration only.
 let trailStep=0;const stationGroups=$$('.page-hero .trail-stations,.page-hero .evidence-timeline,.page-hero .mapping-lines,.page-hero .document-pair');
 const interval=setInterval(()=>{if(document.hidden||reduced.matches||root.classList.contains('motion-off'))return;stationGroups.forEach(group=>{const r=group.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;[...group.children].forEach((item,i)=>item.classList.toggle('is-tracing',i===trailStep%group.children.length));});trailStep++;},2200);
 addEventListener('pagehide',()=>clearInterval(interval),{once:true});
 request();document.fonts.ready.then(request);addEventListener('load',request,{once:true});
})();
