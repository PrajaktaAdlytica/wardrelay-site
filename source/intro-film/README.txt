WardRelay: A world in one thread

15 seconds, 30fps, silent. Original generated miniature photographs animated with Remotion camera movements and cross-dissolves. These are fictional concept scenes. No production/product or clinical claims.

Install: npm ci
Preview: npm run dev
Export desktop: npx remotion render src/index.ts WardWalkIntro wardrelay-intro.mp4 --codec=h264 --crf=23
Export portrait: npx remotion render src/index.ts WardWalkPortrait wardrelay-intro-mobile.mp4 --codec=h264 --crf=24

Website integration: dist/intro.css and dist/intro.js. Film is shown before the hero on the first homepage visit in a session. Query ?intro=1 forces a preview. Replay control remains in hero. Header is hidden and inert during film, then fades in. The last 2.4 seconds blend into the exact live hero background. Reduced-motion preference bypasses autoplay; intentional replay remains available. No audio, navbar, or dashboard is baked into the MP4.
