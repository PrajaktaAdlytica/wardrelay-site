'use strict';
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const home = document.body.dataset.page === 'home';
  document.documentElement.classList.add('site-enhanced');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function closeOtherMenus(returnFocus = false) {
    $$('[data-nav-toggle]').forEach(button => {
      if (button.getAttribute('aria-expanded') === 'true' && returnFocus) button.focus();
      button.setAttribute('aria-expanded','false'); $('#'+button.dataset.navToggle).hidden = true;
    });
  }
  $$('[data-nav-toggle]').forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true'; closeOtherMenus();
    $('#products-menu').hidden = true; $('#products-toggle').setAttribute('aria-expanded','false');
    button.setAttribute('aria-expanded',String(open)); $('#'+button.dataset.navToggle).hidden = !open;
  }));
  $('#products-toggle').addEventListener('click', () => closeOtherMenus());
  document.addEventListener('click', event => { if (!event.target.closest('.other-nav')) closeOtherMenus(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeOtherMenus(true); });
  const current = location.pathname.replace(/\/$/,'') || '/';
  $$('header a, footer a').forEach(a => { if ((new URL(a.href).pathname.replace(/\/$/,'') || '/') === current) a.setAttribute('aria-current','page'); });
  if (!home) {
    const toggle = $('#products-toggle'), menu = $('#products-menu'), mobileToggle = $('#menu-toggle'), mobile = $('#mobile-menu');
    const closeProducts = () => { menu.hidden=true; toggle.setAttribute('aria-expanded','false'); };
    function closeMobile() { mobile.hidden=true; mobileToggle.setAttribute('aria-expanded','false'); mobileToggle.setAttribute('aria-label','Open navigation'); document.body.classList.remove('locked'); }
    toggle.addEventListener('click', () => { const open=menu.hidden; menu.hidden=!open; toggle.setAttribute('aria-expanded',String(open)); });
    mobileToggle.addEventListener('click', () => { const open=mobile.hidden; mobile.hidden=!open; mobileToggle.setAttribute('aria-expanded',String(open)); mobileToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation'); document.body.classList.toggle('locked',open); });
    document.addEventListener('click', e => { if (!e.target.closest('.nav-group')) closeProducts(); });
    document.addEventListener('keydown', e => {
      if (e.key==='Escape') { if(!menu.hidden){closeProducts();toggle.focus();} if(!mobile.hidden){closeMobile();mobileToggle.focus();} }
      if(e.key==='Tab'&&!mobile.hidden){const controls=[mobileToggle,...mobile.querySelectorAll('a,summary')].filter(el=>el.getClientRects().length);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    });
    function setMotion() { document.documentElement.classList.toggle('motion-off',paused||motion.matches); const b=$('#site-motion'); b.textContent=paused||motion.matches?'▶ Motion paused':'Ⅱ Pause motion'; b.setAttribute('aria-pressed',String(paused||motion.matches)); }
    function toggleMotion() { if(motion.matches){$('#site-motion').textContent='System: reduced motion';return;} paused=!paused;setMotion(); }
    $('#site-motion').addEventListener('click',toggleMotion);$('#motion-footer').addEventListener('click',toggleMotion);$$('[data-toggle-motion]').forEach(b=>b.addEventListener('click',toggleMotion));
    motion.addEventListener('change',()=>{paused=motion.matches;setMotion();});setMotion();
  }
  const visible = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add(e.target.classList.contains('page-hero')?'scene-visible':'visible');visible.unobserve(e.target);}}),{threshold:.12});
  $$('.page-reveal,.page-hero').forEach(el=>visible.observe(el));
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('is-hidden-page',document.hidden));

  // Each module visual owns a bounded, synthetic interaction.
  $$('[data-site]').forEach(button=>button.addEventListener('click',()=>{
    const north=button.dataset.site==='north';$$('[data-site]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    $('#facility-detail').innerHTML=[[north?'North on-hand':'South on-hand',north?'6 EA':'8 EA'],['Reserved / held','2 EA'],['Usable snapshot',north?'4 EA':'6 EA']].map(([a,b])=>`<div class="evidence-row"><span>${a}</span><b>${b}</b></div>`).join('');
  }));
  $('#demand')?.addEventListener('input',event=>{const n=Number(event.target.value);$('#demand-value').textContent=n;$('#demand-gap').textContent=Math.max(0,n-4)+' EA';});
  $$('[data-proof]').forEach(button=>button.addEventListener('click',()=>{$$('[data-proof]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});$('#proof-status').textContent=button.dataset.proof==='conflict'?'A later fictional update disagrees with the notice. Keep both sources; source review required.':'Source linked. Local availability still requires stock evidence.';}));
  const reviewed=new Set();
  $$('[data-record-review]').forEach(button=>button.addEventListener('click',()=>{reviewed.add(button.dataset.recordReview);button.disabled=true;button.textContent='Review recorded';$('#approval-result').textContent=reviewed.size===2?'Both fictional reviews recorded. A manual decision is still required. No substitute selected.':'One fictional review recorded. The other review and both decisions remain pending.';}));
  $('#reset-reviews')?.addEventListener('click',()=>{reviewed.clear();$$('[data-record-review]').forEach(b=>{b.disabled=false;b.textContent='Record review';});$('#approval-result').textContent='Both decisions pending. No substitute selected.';});
  $('#receipt-unit')?.addEventListener('change',e=>{$('#receipt-unit-label').textContent=e.target.value;$('#receipt-result').textContent=e.target.value==='EA'?'2 EA discrepancy. Cause unresolved; investigation required.':'Difference unresolved. BX-to-EA conversion must be verified before calculation.';});
  $$('.readiness-check').forEach(input=>input.addEventListener('change',()=>{const count=$$('.readiness-check:checked').length;$('#readiness-result').textContent=`${count} of 5 conditions marked in this local example.${count===5?' All boxes are marked; readiness still requires real evidence and signed approvals.':''}`;}));
  const query=new URLSearchParams(location.search),roleMap={idn:'Supply-chain leader',perioperative:'Perioperative materials manager',partners:'GPO / ERP partner'};
  $$('[data-preview-form]').forEach(form=>{
    const module=form.querySelector('[name="module"]');if(module){const value=query.get('module')||query.get('topic');if([...module.options].some(o=>o.value===value))module.value=value;}
    const role=form.querySelector('[name="role"]');if(role&&roleMap[query.get('role')])role.value=roleMap[query.get('role')];
    form.addEventListener('submit',event=>{event.preventDefault();const kind=form.dataset.previewForm;let message;
      if(kind==='signin'){message='Design preview only. No authentication request was made. Password cleared; no credentials were transmitted or stored.';form.querySelector('[name="password"]').value='';}
      else if(kind==='recovery')message='Recovery preview complete. A future service would show a generic confirmation here. No email was sent and no account was checked.';
      else message='Inquiry preview complete. Nothing was sent or stored. A future conversation would review workflow fit, a sponsor and a bounded data path.';
      form.querySelector('.form-message').textContent=message;
    });
    form.querySelector('button[type="submit"]').disabled=false;
  });
  $('#auth-password-toggle')?.addEventListener('click',()=>{const input=$('#auth-password'),show=input.type==='password';input.type=show?'text':'password';$('#auth-password-toggle').textContent=show?'Hide':'Show';$('#auth-password-toggle').setAttribute('aria-pressed',String(show));});

  // Isolated demo state. No network calls, persistence or real approvals.
  const data=$('#synthetic-records');
  if(data){
    const records=JSON.parse(data.textContent),audit=new Map();let selected=records[0].id;
    const badge=status=>`<span class="status ${escapeHTML(status)}">${escapeHTML(status)}</span>`;
    function filtered(){const q=$('#demo-search').value.trim().toLowerCase(),state=$('#demo-filter').value;return records.filter(r=>(state==='all'||r.status===state)&&[r.id,r.sku,r.title,r.owner].join(' ').toLowerCase().includes(q));}
    function renderQueue(){const list=filtered();if(list.length&&!list.some(r=>r.id===selected))selected=list[0].id;$('#demo-export').disabled=!list.length;$('#demo-count').textContent=`${list.length} of ${records.length} records`;$('#demo-queue').innerHTML=list.length?list.map(r=>`<button class="demo-record-button ${r.id===selected?'selected':''}" data-record="${r.id}" aria-pressed="${r.id===selected}"><span class="micro">${r.id}</span><b>${escapeHTML(r.title)}</b><small>${r.sku}</small>${badge(r.status)}</button>`).join(''):'<p class="empty-queue">No matching records. Change the search or review state.</p>';$('#demo-queue').querySelectorAll('[data-record]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.record;renderQueue();}));if(list.length)renderRecord();else{$('#demo-record').innerHTML='<h2>No matching exceptions.</h2><p>Change your search or review state to continue the synthetic walkthrough.</p>';$('#demo-sources').innerHTML='<span class="preview-badge">DEMO / SOURCE EVIDENCE</span><p>Select a matching record to view its evidence.</p>';}}
    function renderRecord(){const r=records.find(x=>x.id===selected),entry=audit.get(r.id);$('#demo-record').innerHTML=`<span class="micro">${r.sku}</span><h2>${escapeHTML(r.title)}</h2><p>${escapeHTML(r.summary)}</p><div class="demo-record-stats">${r.facts.map(([v,l])=>`<div><b>${escapeHTML(l)}</b><span>${escapeHTML(v)}</span></div>`).join('')}</div><p class="artifact-warning">${escapeHTML(r.boundary)}</p><button class="button" id="demo-review" ${!r.review||entry?'disabled':''}>${entry?'Materials review recorded':r.review?'Record demo materials review':'Review action unavailable'} <span>↗</span></button><div class="demo-audit"><h3>Attributed history</h3><p>12 Oct 2026 · 10:00 UTC<br>Fictional intake reviewer linked ${r.source}.</p><p id="demo-review-result">${entry?escapeHTML(entry):'No new session review. The existing scenario state is illustrative.'}</p></div>`;
      $('#demo-sources').innerHTML=`<span class="preview-badge">DEMO / SOURCE EVIDENCE</span><h3 style="margin-top:24px">Keep the context.</h3><dl>${[['Source reference',r.source],['Source date','12 Oct 2026 · 08:00 UTC'],['Inventory snapshot','12 Oct 2026 · 09:00 UTC'],['Fictional owner',r.owner],['Dated next action',r.next],['Review state',r.status]].map(([a,b])=>`<dt>${escapeHTML(a)}</dt><dd>${escapeHTML(b)}</dd>`).join('')}</dl><p class="artifact-warning">No PHI, live connection, clinical advice or external action.</p>`;
      // Preserve the stale-snapshot edge case instead of overwriting it with the common date.
      if(r.id==='EX-DEMO-04')$('#demo-sources').querySelectorAll('dd')[2].textContent='10 Oct 2026 · 09:00 UTC';
      $('#demo-review').addEventListener('click',()=>{if(!r.review||audit.has(r.id))return;audit.set(r.id,`${new Date().toISOString()} · Fictional materials reviewer recorded a local review. Clinical and purchasing approvals remain pending. No external action.`);renderRecord();});
    }
    $('#demo-search').addEventListener('input',renderQueue);$('#demo-filter').addEventListener('change',renderQueue);
    $('#demo-reset').addEventListener('click',()=>{audit.clear();selected=records[0].id;$('#demo-search').value='';$('#demo-filter').value='all';renderQueue();renderRecord();});
    $('#demo-export').addEventListener('click',()=>{const r=records.find(x=>x.id===selected);const text=['WARDRELAY — DEMO / SYNTHETIC DATA','CONCEPT PREVIEW — NOT CLINICAL GUIDANCE','',r.id+' / '+r.sku,r.title,'State: '+r.status,'Source: '+r.source,'Fictional owner: '+r.owner,'Next action: '+r.next,'',r.summary,...r.facts.map(([a,b])=>a+': '+b),'',r.boundary,'',audit.get(r.id)||'No new local review recorded.','No external action, system write or authorization.'].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download=r.id+'-SYNTHETIC-summary.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    renderQueue();renderRecord();
  }
})();
