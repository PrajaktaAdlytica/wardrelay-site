/* The motion layer uses native scrolling; all copy and controls remain available without it. */
(() => {
  const hero = document.querySelector('.hero');
  const consolePanel = document.querySelector('.relay-console');
  const typed = document.querySelector('#hero-typed');
  const rows = [...document.querySelectorAll('[data-relay]')];
  const productSection = document.querySelector('#products');
  const productStage = document.querySelector('.products-stage');
  const originalSetModule = setModule;
  let typingTimer, sequenceRun = 0, heroVisible = true, hasPlayed = false;
  let scheduled = false, lastProductStep = -1, manualUntil = 0;
  const isStill = () => document.documentElement.classList.contains('motion-off');
  const isPinned = () => ((innerWidth >= 700 && innerHeight >= 650) || (innerWidth >= 360 && innerWidth < 700 && innerHeight >= 760)) && !isStill();
  const headerHeight = () => document.querySelector('.site-header').getBoundingClientRect().height;
  const clamp = n => Math.max(0, Math.min(1, n));

  function settleHero() {
    clearTimeout(typingTimer); sequenceRun++;
    consolePanel.classList.remove('is-playing');
    typed.textContent = 'Trace ORTH-DEMO-01';
    rows.forEach(row => row.classList.add('arrived'));
  }
  function playHero() {
    if (isStill() || !heroVisible || document.hidden || document.documentElement.classList.contains("intro-active")) return settleHero();
    clearTimeout(typingTimer); const run = ++sequenceRun;
    consolePanel.classList.add('is-playing'); rows.forEach(row => row.classList.remove('arrived'));
    typed.textContent = ''; let character = 0; const command = 'Trace ORTH-DEMO-01';
    function nextCharacter() {
      if (run !== sequenceRun) return;
      typed.textContent = command.slice(0, ++character);
      if (character < command.length) typingTimer = setTimeout(nextCharacter, 65);
      else revealRow(0);
    }
    function revealRow(i) {
      typingTimer = setTimeout(() => {
        if (run !== sequenceRun) return;
        rows[i].classList.add('arrived');
        if (i < rows.length - 1) revealRow(i + 1);
        else typingTimer = setTimeout(() => consolePanel.classList.remove('is-playing'), 500);
      }, i === 0 ? 250 : 720);
    }
    typingTimer = setTimeout(nextCharacter, 350);
  }
  document.querySelector('#replay-hero').addEventListener('click', playHero);
  const heroObserver = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && !hasPlayed) { hasPlayed = true; playHero(); }
    if (!heroVisible) settleHero();
  }, { threshold: .12 });
  heroObserver.observe(consolePanel);

  // Reuse the product state model, with a short, directional visual transition.
  setModule = function(i, focus = false) {
    const changed = i !== activeModule;
    originalSetModule(i, focus);
    document.querySelector('#module-progress-number').textContent = String(i + 1).padStart(2, '0');
    if (innerWidth < 700) { const tab = document.querySelector('#module-tab-' + i); tab.parentElement.scrollTo({ left: tab.offsetLeft - tab.parentElement.offsetLeft - 12, behavior: isStill() ? 'instant' : 'smooth' }); }
    if (changed && !isStill()) {
      const preview = document.querySelector('#module-preview');
      preview.classList.remove('changing'); void preview.offsetWidth; preview.classList.add('changing');
    }
  };
  function moveToModule(i) {
    if (!isPinned()) return;
    manualUntil = performance.now() + 900;
    const distance = productSection.offsetHeight - productStage.offsetHeight;
    const top = scrollY + productSection.getBoundingClientRect().top - headerHeight() + distance * (i / 5 + .055);
    scrollTo({ top, behavior: 'smooth' });
  }
  document.querySelectorAll('[data-module-tab]').forEach(button => {
    button.addEventListener('click', () => moveToModule(Number(button.dataset.moduleTab)));
    button.addEventListener('keydown', event => {
      if (['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key)) moveToModule(activeModule);
    });
  });
  document.querySelectorAll('[data-module]').forEach(link => link.addEventListener('click', event => {
    if (!isPinned()) return; event.preventDefault(); moveToModule(Number(link.dataset.module));
  }));

  const evidence = document.querySelector('.fragment-scene');
  const fragments = [...evidence.querySelectorAll('.fragment')];
  const evidencePath = evidence.querySelector('path');
  evidencePath.setAttribute('d', 'M0 115H1100');
  let evidenceVisible = false, evidenceTick = 0;
  const evidenceObserver = new IntersectionObserver(entries => {
    evidenceVisible = entries[0].isIntersecting;
    if (evidenceVisible) evidenceTick = performance.now();
  }, { threshold: .35 }); evidenceObserver.observe(evidence);
  const sources = document.querySelector('.fit-flow');
  new IntersectionObserver(entries => sources.classList.toggle('offscreen', !entries[0].isIntersecting)).observe(sources);
  function renderJourney(now = performance.now()) {
    scheduled = false;
    const viewport = innerHeight, middle = viewport * .5;
    if (innerWidth < 1000 && !isStill()) {
      const walkBounds = walk.getBoundingClientRect();
      if (walkBounds.top < middle && walkBounds.bottom > middle) {
        const panels = [...document.querySelectorAll('.walk-panel')];
        let nearest = 0, distance = Infinity;
        panels.forEach((panel,i) => { const box=panel.getBoundingClientRect(); const d=Math.abs(box.top+box.height*.45-middle); if(d<distance){distance=d;nearest=i;} });
        if (nearest !== activeStep) setStep(nearest);
      }
    }
    if (!isStill()) {
      document.querySelectorAll('.handoff-intro,.teams').forEach(el => {
        const p = clamp((viewport - el.getBoundingClientRect().top) / (viewport + el.offsetHeight));
        el.style.setProperty('--scenery-y', `${(p - .5) * 90}px`);
      });
      const cta = document.querySelector('.final-cta');
      cta.style.setProperty('--cta-rise', `${-clamp((viewport-cta.getBoundingClientRect().top)/(viewport+cta.offsetHeight))*90}px`);
    }
    if (isPinned() && performance.now() > manualUntil) {
      const rect = productSection.getBoundingClientRect();
      const p = clamp((headerHeight() - rect.top) / Math.max(1, productSection.offsetHeight - productStage.offsetHeight));
      if (rect.top < headerHeight() + 10 && rect.bottom > viewport * .4) {
        const i = Math.min(4, Math.floor(p * 5));
        if (i !== activeModule) setModule(i);
        lastProductStep = i;
      }
    }
  }
  function scheduleJourney() { if (!scheduled) { scheduled = true; requestAnimationFrame(renderJourney); } }
  addEventListener('scroll', scheduleJourney, { passive:true });
  addEventListener('resize', scheduleJourney);
  // Low-frequency state changes, active only while the evidence sequence is visible.
  const evidenceTimer = setInterval(() => {
    if (!evidenceVisible || isStill() || document.hidden) return;
    const step = Math.floor((performance.now() - evidenceTick) / 900) % 6;
    fragments.forEach((el,i) => el.classList.toggle('active-evidence', i <= Math.min(3, step)));
    evidencePath.style.strokeDashoffset = String(1300 * (1 - Math.min(1,(step+1)/4)));
  }, 250);
  new MutationObserver(() => {
    if (isStill()) { settleHero(); fragments.forEach(el => el.classList.add('active-evidence')); evidencePath.style.strokeDashoffset='0'; }
    scheduleJourney();
  }).observe(document.documentElement, { attributes:true,attributeFilter:['class'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settleHero(); });
  renderJourney();
})();
