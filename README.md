# Vardy's Jungle: Vardhan Mittal's portfolio

**Live:** https://vardhan-mittal.vercel.app

A scroll-driven animated story told by Vardy the monkey, from the seed (NTSE) to the treetop (contact).

- `npm run dev`: local dev server at http://localhost:5173
- `npm run build`: production build in `dist/`
- Pushing to `main` deploys to Vercel automatically
- Contact form: set `VITE_WEB3FORMS_KEY` (see `.env.example`)

## Where things live
- `src/data/content.js`: every fact, number and link on the site
- `src/scenes/*.js`: one file per chapter (art, transition in, scroll timeline)
- `src/art/vardy.js`: Vardy's SVG rig and pose library
- `src/art/kit.js`: shared jungle art helpers
- `src/ui/sound.js`: synthesized sound (Web Audio, on by default, starts on first interaction)
- `storyboard/`: the design storyboard (open `/storyboard/` on the dev server)
