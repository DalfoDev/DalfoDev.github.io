# Dominic Portfolio

Static portfolio refactored around editable source files in `src/`, generated Tailwind CSS in `dist/`, and automated GitHub Pages deployment.

## Structure

```text
dalfodev.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── css/
│   │   ├── main.css
│   │   └── easter-egg.css
│   └── js/
│       └── script.js
├── dist/
│   ├── main.css
│   └── easter-egg.css
├── img/
├── index.html
├── easter-egg.html
├── favicon.ico
├── .gitignore
├── .nojekyll
├── package.json
├── package-lock.json
└── README.md
```

`dist/` is generated output and is ignored by Git. It is included in this ZIP so the site can be previewed immediately after extraction, but GitHub Actions rebuilds it from `src/css/` on every deployment.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

This runs both Tailwind v4 watchers in parallel:

- `src/css/main.css` -> `dist/main.css`
- `src/css/easter-egg.css` -> `dist/easter-egg.css`

## Production build

```bash
npm run build
```

Both outputs are minified.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` installs dependencies with `npm ci`, runs the production build, uploads the repository root (including the freshly generated `dist/` directory), and deploys through GitHub Pages.

After pushing the repository, set **Settings > Pages > Source** to **GitHub Actions**.

The workflow is configured for a default branch named `main`. Change the branch in `.github/workflows/deploy.yml` if your default branch has another name.

## Tailwind

Both source stylesheets use Tailwind v4 CSS-first configuration via `@import "tailwindcss"` and `@theme`. No `tailwind.config.js` is required.

## Asset note

The original image assets and favicon were not included with the supplied source files. Placeholder files are present for the local paths referenced by the HTML. Replace them with the real assets when available.

## About terminal easter egg

The About terminal plays a boot-style command sequence. After `cd projects/`, it reveals a final clickable `vim .easter_egg` command that opens `easter-egg.html`.
