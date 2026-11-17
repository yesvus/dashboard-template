# Cloudflare Workers Static Assets pilot

Tracked by [dashboard-template #2](https://github.com/yesvus/dashboard-template/issues/2), [ops #631](https://github.com/yesvus/ops/issues/631), and [shared CI #2](https://github.com/yesvus/.github/issues/2).

This template's Cloudflare target is a **separate, assets-only Worker**; none of the existing domain routes or Kubernetes workloads are changed. No cloud deployment, API token, or production cutover is implied by a successful local build.

## Committed pilot configuration

- `cloudflare.config.ts`: named `yesvus-dashboard-template-pilot`, compatibility date `2026-11-15`, `worker.assets.notFoundHandling: 'single-page-application'`.
- `vite.config.ts`: official `@cloudflare/vite-plugin` v2 beta integration alongside the existing TanStack Router, React, Tailwind and Vitest config.
- `package.json` and `pnpm-lock.yaml`: pinned `cf@1.0.0-beta.32` and `@cloudflare/vite-plugin@2.0.0-beta.v.17`; pnpm 10 lockfile regenerated in a temporary GitHub Actions job on the isolated branch.
- `pnpm run workers:check`: `cf deploy --dry-run`, with **no account credentials or upload**. This checks the Cloudflare build output, not production behavior.
- `.gitignore`: excludes local Cloudflare build output and development secret files.

Cloudflare `cf`/Vite plugin **v2 is beta**, so version updates require CI and a fresh compatibility check. Do not run implicit `cf init .` in CI; review generated changes in a separate PR.

## Local and CI validation

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm build
CF_SEND_TELEMETRY=false pnpm run workers:check
pnpm test:browser:install
pnpm test
```

The ordinary `pnpm build` intentionally preserves the existing `tsc -b` check. Cloudflare `cf` invokes Vite directly and **does not execute** package.json's `build` script. Current CI checks the Cloudflare bundle without needing a token.

## Non-production preview / deployment gate (not executed)

- Only after an explicit operator review, set up a restricted Cloudflare deploy identity scoped to the **pilot Worker**, not all zones.
- Deploy only a trusted branch via Cloudflare native preview tooling. Do not allow untrusted/fork PR code to access deployment tokens.
- Confirm `/`, an existing deep-link route with a hard refresh, JS/CSS/image responses, content types, no unexpected API/auth requests, and SPA fallback.
- Add preview URL + smoke-test evidence to the PR, then delete the preview on branch close. Keep unique worker naming to avoid touching any existing service.
- Review Cloudflare limits and observability, release promotion and reversible version rollback before considering a stable public domain.

## Secrets

No runtime secret is needed for this static demo. Every `VITE_*` variable is **public** and cannot hold a private credential. A future backend Worker can use Cloudflare-native runtime secrets supplied through an approved owner-mediated process; coordinate with [ops #629](https://github.com/yesvus/ops/issues/629).

## References

- [Cloudflare `cf` configuration](https://developers.cloudflare.com/cf/projects/cloudflare-config/)
- [Vite plugin v2 beta](https://developers.cloudflare.com/workers/vite-plugin/v2-beta/)
- [SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Cloudflare CI](https://developers.cloudflare.com/cf/ci/)

## Manual, isolated preview workflow

The repository now includes `.github/workflows/cloudflare-preview.yml` for **manual preview only**, never production promotion. It has no push/PR event, requires an exact trusted `main` checkout by the `yesvus` account, and uses only a fixed disposable Worker name (`yesvus-dashboard-template-pilot`). Do not run it from a fork or an unreviewed branch.

**Operator bootstrap (not performed by this PR):**

1. Merge the credential-free build checks after CI/review and confirm no untrusted script was added. In GitHub, create a `cloudflare-preview` Environment; restrict deployments to `main` and require an authorized reviewer where supported.
2. Provision the environment-only `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` via GitHub's protected secret UI. Limit API access to the intended account/Worker preview operations as far as Cloudflare allows. If the token must be broadly account-scoped, review that exception independently rather than silently reusing an existing production token. **Never paste either value into issues, logs, PRs or Terraform state.**
3. In **Actions → Workers static preview (manual) → Run workflow**, choose branch `main`, operation `deploy`. The job checks the normal build and `cf deploy --dry-run` without credentials in those build steps; only the subsequent `cf previews deploy --preview-name dashboard-static-canary` receives the environment secret.
4. The run summary must show the Cloudflare preview ID and a `workers.dev` preview URL. Remote smoke covers `/`, a hard-refreshed `/sign-in` SPA path, and one hashed JS asset. A smoke failure attempts to remove that exact newly created preview automatically. Review response headers, navigation, logs and quota before recording success.
5. To retire the preview, rerun the **same workflow on main**, select `delete`, and supply the exact preview UUID from the deploy run summary. Deletion is pinned to the pilot Worker's preview API only; verify the URL is gone. If automatic cleanup failed, this explicit delete operation is the recovery path.

**Not yet executed:** a credentialed preview run, actual asset HTTP checks, cleanup test and usage measurement. The presence of this workflow is not a claim that a preview is live. No custom domain, DNS, route, database, billing upgrade, runtime secret or production deployment is part of this flow.

Preview APIs and `cf` commands are beta; verify their actual responses during the first controlled run. The environment is intentionally not provisioned by repository code.
