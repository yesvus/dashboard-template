# Cloudflare Workers Static Assets pilot

Tracked in [dashboard-template #2](https://github.com/yesvus/dashboard-template/issues/2) and [ops #631](https://github.com/yesvus/ops/issues/631).

This is an **isolated, non-production deployment pilot**, not permission to change DNS, deploy on the account, wire real authentication or modify production assets.

## Current baseline

This is a Vite/React/TanStack Router UI template; it builds locally as a **client-side SPA** and has no trusted backend. Clerk is demo-only. Keep the existing Vite dev server, `pnpm lint`, `pnpm format:check`, `pnpm build` and Chromium-based tests.

## Enable the Worker target (reviewable implementation checklist)

1. In an isolated checkout with Node 24 and pnpm 10, run Cloudflare's official `cf init .` interactively. **Review the generated patch before retaining it**. This currently adds `cf` and `@cloudflare/vite-plugin` to development dependencies, updates `vite.config.ts`, and generates `cloudflare.config.ts`.
2. Commit **both** package.json and the regenerated pnpm lockfile; never bypass `pnpm install --frozen-lockfile`. Pin the beta tool versions as selected and confirm compatibility with Vite 8 and the TanStack Router plugin.
3. Confirm the generated config uses a **new, uniquely named pilot Worker**, no production custom domain, a reviewed current `compatibilityDate` and SPA routing `worker.assets.notFoundHandling = 'single-page-application'`. The `cf` config uses camelCase and **does not** support `assets.directory`; Vite build output supplies assets.
4. Ensure `cf build` and `cf deploy --dry-run` pass. Since `cf build` runs Vite directly, run `pnpm build` separately first to preserve the existing `tsc -b` check.
5. Use the credential-free shared CI workflow from [yesvus/.github #2](https://github.com/yesvus/.github/issues/2). Do not enable `check-cloudflare` until the config + dependencies + lockfile are committed.
6. After approved Cloudflare access is scoped to **this Worker**, publish a disposable trusted-branch preview and verify: `/`, deep-link reload (e.g. `/dashboard` if present), assets, MIME types, SPA error handling, cache headers, no accidental external API/auth requests, and preview deletion on close.
7. Record preview URL and smoke results in the PR; add a documented version rollback and budget before any stable public domain is considered.

Cloudflare docs:
- [cf init in an existing project](https://developers.cloudflare.com/cf/get-started/first-worker/#start-from-an-existing-project)
- [Config / SPA routing](https://developers.cloudflare.com/cf/projects/cloudflare-config/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [cf CI](https://developers.cloudflare.com/cf/ci/)

## Secret contract

The static UI requires **no runtime secrets**. `VITE_*` is publicly bundled and cannot hold private keys. Future signed requests must come from a server-side Worker using native runtime secrets; coordinate owner-entry/rotation with [ops #629](https://github.com/yesvus/ops/issues/629).

## Outstanding before a ready-for-review deploy PR

The exact `cf init .` output, compatible pinned dependency versions, regenerated lockfile, Worker dry-run, real preview URL and browser smoke checks **must be produced by CI/a trusted environment**. They are intentionally not fabricated in this preparatory patch.
