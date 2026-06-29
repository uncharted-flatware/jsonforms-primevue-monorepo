# jsonforms-primevue-monorepo

## Motivation

The JSONForms.io packages include integrations for vanilla HTML and Vuetify, but we need PrimeVue.
This version supports only PrimeVue 4

## Packages

See the library [package README](./packages/jsonforms-primevue/README.md) for usage details.
See the [playground](./examples/playground/README.md) for a live example to test your schemas.

**Live playground:** https://uncharted-flatware.github.io/jsonforms-primevue-monorepo/

## Releases and CI

Pushes to `main` run [Release Please](https://github.com/googleapis/release-please) (opens release PRs; merging publishes `@uncharted.software/jsonforms-primevue` to npm) and deploy the playground to GitHub Pages.

One-time setup:

- **npm:** Add repo secret `NPM_TOKEN` (granular token with publish access to `@uncharted.software/jsonforms-primevue`).
- **GitHub Pages:** Repo **Settings → Pages → Build and deployment → Source:** GitHub Actions.

First npm release uses manifest bootstrap (`1.0.0` last released → **1.1.0** in the first Release PR). Use [Conventional Commits](https://www.conventionalcommits.org/) on `main` for later semver bumps.

## Development

Setup (Node.js 24 or newer; see `.nvmrc`):

```bash
corepack enable
yarn install
```

Build:

```bash
yarn build
```

Run the development server (playground)

```bash
yarn dev
```

