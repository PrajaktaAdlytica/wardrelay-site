WARDRELAY — WARD WALK WEBSITE

Current scope
Homepage plus 29 supporting pages. The approved Human Relay identity, Ward Walk palette, self-hosted fonts and original corridor artwork are included. ROUTE-MANIFEST.json lists all canonical pages and compatibility redirects.

Local preview
Run npm start, then open http://127.0.0.1:8787.
No dependency installation is needed. Pages are static HTML with native JavaScript and CSS motion.

Editing
Supporting page content and shared navigation/footer: source/build_pages.py.
Regenerate supporting HTML with: python3 source/build_pages.py
Supporting page styles and behavior: dist/site.css and dist/site.js.
Homepage: dist/index.html, dist/styles.css, dist/app.js, dist/motion-v2.css, dist/motion-v2.js, dist/home-walk.css and dist/home-walk.js.
The generator preserves the homepage visual sections and updates its shared shell. It does not overwrite site.css or site.js.

Pages
Five product detail pages, product overview, platform, solution overview and three role-specific solution pages, data/integrations discovery, governance, pilot/pricing, evaluation, differentiation, resources and two substantive guides, company, contact, request-pilot, sign-in, password recovery, access help, privacy, terms, accessibility and isolated synthetic demo.

Interaction boundaries
Forms, sign-in and password recovery are frontend previews. Entries are not transmitted or persisted. No actual authentication, email, analytics, payment, live integrations, PHI, clinical guidance or external action is implemented. Submit buttons stay disabled until local handlers are attached. Synthetic review feedback is session-local and never grants clinical or purchasing approval. Privacy and terms are clearly identified preview notices, not finalized operating policies.

Synthetic demo
Ten fictional records with searchable/filterable queue, opened record, dated evidence, attributed local review history, blocked edge cases and a labeled text summary download. No patient records are required. All five proposed modules remain separate hypotheses; the first pilot is bounded to one high-variance item family and the Supply Desk exception board.

Motion and accessibility
Native scrolling with homepage pinned walkthrough and reversible product progression. Page-specific interactive illustrations, route animation and reveal motion. Pause motion and system reduced-motion support. Keyboard menus, Escape and focus restoration, visible labels and mobile navigation. Local font licenses are in dist/assets/fonts. Automated checks do not constitute a comprehensive accessibility audit.

Verification
QA-MULTIPAGE.json records the route crawl, local-link audit, 27 interaction checks, tablet checks and homepage regression checks. Screenshots are in previews/. All 30 canonical pages were checked at 390px and 1440px; representative pages also at 775px. Earlier QA files document homepage iterations.

Publishing
The .openai/hosting.json identity belongs to the existing owner-private WardRelay site. Keep this site and its audience when publishing updates. The website is a concept preview, not an operating hospital supply product.

WARD WALK PRESENTATION REDESIGN — 19 OCTOBER 2026
Supporting pages now use dist/ward-walk.css and dist/ward-walk.js. The source generator renders a full-viewport architectural environment on every supporting page. Three existing original images progress through short scroll crossfades, with a restrained camera shift and route trace. Cropped hero image shapes and alternating sage/beige sections are replaced by full photographic heroes and one ivory reading material. Module workflow chapters use native scrolling with a sticky numbered introduction on larger screens; mobile is stacked. Hero words/evidence assemble progressively, product rows respond to scrolling, and the closing half-circle draws in the review room. Pause and reduced-motion controls stop decorative motion. No product record or approval changes automatically.
The new presentation assets are scoped to supporting pages; homepage visual files are unchanged. QA-WARD-WALK.json records 90 route/viewport checks, 27 existing interaction checks, 13 motion/fallback checks, local-link validation and key color-pair contrast ratios. Image-background contrast was also visually reviewed; numeric color-pair ratios alone do not constitute a complete accessibility audit.

HOMEPAGE CONTINUOUS WARD WALK — 19 OCTOBER 2026
The homepage now has a single fixed photographic environment, moving from the arrival corridor to the supply junction and review room. The full-image hero pairs a large editorial headline with an upright ivory typed-handoff console. Opening evidence, walkthrough, teams and governance share the environment. Products/demo and fit/pilot/FAQ use two consistent ivory reading surfaces with visible image gutters. The closing invitation retains the half-circle over the review-room image. Native scrolling, reversible five-module progression, replay, Pause and system reduced-motion behavior are preserved.
This revision is scoped through body.home-walk in dist/home-walk.css and dist/home-walk.js. Supporting pages are unchanged from their approved redesign. QA-HOMEPAGE-WALK.json records 42 passing checks, five viewport sizes and 138 local link/asset checks. Current homepage images are in previews/homepage-current-*.png.
