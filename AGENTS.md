# Repository Guidelines

## Project Structure & Module Organization
Capoeira SU Songs is a Create React App project. `src/index.js` boots the React tree, with `App.js` orchestrating layout and pulling helpers from `language.service.js` and `song.service.js`. View logic lives in `src/components/` (e.g., `SongList.js`, `LanguageSelector.js`, `MediaSection.js`) and should remain small, focused modules. Song metadata, translations, and media references live under `src/songs/`; keep related assets together and reference them via the service helpers. Static assets and the HTML shell belong in `public/`, while published artifacts or docs go in `docs/`. Tests and styles sit alongside the files they cover (`App.test.js`, `App.css`) to keep intent visible.

## Build, Test, and Development Commands
Run `npm install` once before contributing. Use `npm start` for the development server with hot reload at `http://localhost:3000`. Execute `npm test` for the Jest/React Testing Library watch runner; add `-- --coverage` locally before publishing large changes. Build optimized assets with `npm run build`, producing `build/` for deployment to GitHub Pages (`homepage` in `package.json`). Avoid `npm run eject` unless alignment with maintainers is documented, because it is irreversible.

## Coding Style & Naming Conventions
Follow the CRA ESLint defaults (`react-app`, `react-app/jest`); run `npx eslint src` if you need an explicit lint pass. Use 2-space indentation, semicolons, and single quotes for JavaScript literals. Components are PascalCase (`Header.js`), hooks and helpers are camelCase, and service modules keep the `.service.js` suffix. Keep UI text in `language.service.js` so selectors stay centralized, and store reusable Bootstrap styles inside `App.css` or `index.css`.

## Testing Guidelines
Add `*.test.js` files next to the module under test so Jest auto-discovers them. Prefer React Testing Library queries (role/text) over DOM internals and mock service helpers through dependency injection when possible. Extend `setupTests.js` for shared utilities rather than duplicating boilerplate. For major features, aim for coverage that exercises both Portuguese and English branches plus at least one media embed path.

## Commit & Pull Request Guidelines
Recent history (`Built new version`, `Added more song`) shows short, imperative summaries—keep that style and limit the subject to 72 characters. Reference an issue or song ID in the body when applicable, and describe user-facing impacts plus localization implications. PRs should include a concise description, screenshots or GIFs for UI deltas, and notes about data migrations (new entries in `src/songs/`). Confirm `npm test` before requesting review and link to the relevant deployment preview if you built locally.
