# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Authora Admin is an Angular 21 admin panel application using standalone components (no NgModules).

## Commands

- `npm start` / `ng serve` - Start dev server at http://localhost:4200
- `npm run build` / `ng build` - Production build (output in `dist/`)
- `npm test` / `ng test` - Run unit tests with Vitest
- `ng generate component <name>` - Scaffold a new component

## Architecture

- **Angular 21** with standalone components (imports array on `@Component`, no NgModules)
- **Routing**: Configured in `src/app/app.routes.ts`, provided via `provideRouter()` in `src/app/app.config.ts`
- **Styling**: SCSS with inline style language support; component styles use `.scss` files
- **Testing**: Vitest (not Karma/Jasmine) via `@angular/build:unit-test`
- **Component prefix**: `app` (enforced in `angular.json`)
- **Entry point**: `src/main.ts` bootstraps using `appConfig` from `src/app/app.config.ts`

## Code Conventions

- Strict TypeScript (`strict: true`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`)
- Strict Angular templates (`strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`)
- Prettier: 100 char print width, single quotes, Angular HTML parser for `.html` files
- 2-space indentation (spaces, not tabs)
- Components use signal-based patterns (e.g., `signal()` for reactive state)
