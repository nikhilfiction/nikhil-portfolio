# Nikhil Sahu · Portfolio

React + TypeScript + Tailwind CSS (v4), built with Vite.

The hero is an illustrated me that reacts to the cursor: move left and I look left,
move right and I look right, come to the centre and I take my headphones off, wave
and point down at the portfolio. On phones, tap left, right, or on me.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Build for production:

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ at http://localhost:4173
```

## Edit the content

Everything you'd want to change (name, projects, live links, experience, skills,
contact) is in **`src/data/content.ts`**. To add a GitHub button to a project,
give it a `code: 'https://github.com/...'` field.

Colours and fonts are Tailwind theme tokens at the top of `src/index.css`
(`--color-maroon`, `--color-rose`, …).

## How the hero works

- `public/frames/` holds 156 WebP frames cut from an 8-second AI video
  (typing, look left, look right, greeting). Backgrounds were whitened so the
  canvas can blend into the page with `mix-blend-mode: multiply`.
- `src/lib/characterPlayer.ts` plays those frames on a `<canvas>` with
  `requestAnimationFrame`. It runs outside React and only calls back when the
  speech bubble text changes, so the animation never causes re-renders.
- `src/components/Hero.tsx` maps the cursor to three zones (left / centre / right)
  and tells the player where to go.

## Project structure

```
src/
  App.tsx
  index.css              Tailwind import, theme tokens, a few hero-only styles
  data/content.ts        all the text and links
  lib/characterPlayer.ts frame player
  lib/useMediaQuery.ts
  components/
    Nav.tsx  Hero.tsx  Work.tsx  Experience.tsx  About.tsx  Contact.tsx  ui.tsx
public/frames/           000.webp … 184.webp
```

## Deploy

Vercel or Netlify detect Vite automatically: build command `npm run build`,
output folder `dist`.
