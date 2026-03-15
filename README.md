# Authora Admin

Admin panel for the Authora authentication API. Built with Angular 21 and Angular Material (Material 2 theme).

## Features

- **Angular Material** with Material 2 theming (Indigo/Pink palette)
- **Light/Dark theme** toggle with persistence in localStorage
- **Internationalization** (i18n) with Transloco — supports English, French, Spanish, and German
- **Language in URL** — routes are prefixed with the language code (e.g. `/en/users`, `/fr/settings`)
- **Lazy-loaded modules** — Registrations, Users, Settings

## Development

```bash
npm install
npm start
```

Open http://localhost:4200/. The app will reload on file changes.

## Build

```bash
npm run build
```

Build artifacts are output to `dist/authora-admin/browser/`.

## Tests

```bash
npm test
```

Runs unit tests with [Vitest](https://vitest.dev/).

## npm package

The CI pipeline publishes the built static files as `@kylliangautier/authora-admin` to GitHub Packages. This allows the Authora API (NestJS) to install it as a dependency and serve the files with `@nestjs/serve-static`.

### Consuming in Authora API

```bash
npm install @kylliangautier/authora-admin
```

```typescript
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'node_modules', '@authora', 'admin'),
  exclude: ['/api/(.*)'],
})
```

### Version format

Packages are versioned as `0.0.0-{branch}.{short-sha}` (e.g. `0.0.0-main.a1b2c3d`).

## CI/CD

A GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on push and PRs to `main` and `develop`:

1. **build-and-test** — installs dependencies, builds, and runs tests
2. **publish** — builds the Angular app and publishes the `dist/` output to GitHub Packages (only on push to `main` or `develop`)

## Project structure

```
src/app/
  core/
    components/
      lang-switcher/    # Language switcher component
      theme-toggle/     # Theme toggle component
    lang.guard.ts       # Route guard for language prefix
    theme.service.ts    # Light/dark theme service
    transloco-loader.ts # Transloco HTTP translation loader
  registrations/        # Registrations module (lazy-loaded)
  users/                # Users module (lazy-loaded)
  settings/             # Settings module (lazy-loaded)
public/
  i18n/                 # Translation files (en.json, fr.json, es.json, de.json)
```
