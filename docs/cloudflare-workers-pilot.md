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

The repository now includes `.github/workflows/cloudflare-preview.yml` for **manual preview only**, never production promotion. It has no push/PR event, requires an exact trusted `main` checkout initiated **and rerun** by `yesvus` (both `github.actor` and `github.triggering_actor`), and uses only a fixed disposable Worker name (`yesvus-dashboard-template-pilot`). Do not run it from a fork or an unreviewed branch.

**Operator bootstrap (separate from this PR; current state checked 2026-11-17):**

1. The credential-free Workers CI workflow and static pilot are merged. GitHub Environment `cloudflare-preview` is already created and restricted to `main`; the **nonsecret Environment variable** `CLOUDFLARE_ACCOUNT_ID` exists. The named Cloudflare pilot Worker exists with Preview URLs enabled and ordinary workers.dev publication disabled. Review additional Environment protection rules where supported.
2. `CLOUDFLARE_API_TOKEN` is present in the protected Environment (secret **name** independently verified; value not read). The approved direction in [ops #629](https://github.com/yesvus/ops/issues/629) is one trusted provider-level issuer stored privately in OpenBao and a distinct **Individual Worker Editor** child for this exact Worker. Issuer creation, exact-scope proof, private OpenBao escrow and protected GitHub Environment encrypted-secret delivery belong to WS-SECRETS, not this app workflow. Never reuse the issuer, R2, zone or broad production token as the deployment credential. Do **not** copy the token into issues, logs, PRs or Terraform state. Scoped child escrow and owner-private Environment delivery were independently verified before the first dispatch.
3. After credential delivery is verified, in **Actions → Workers static preview (manual) → Run workflow**, choose branch `main`, operation `deploy`. The initial validation step checks **presence only** of `vars.CLOUDFLARE_ACCOUNT_ID` and `secrets.CLOUDFLARE_API_TOKEN`, not their plaintext. The build and `cf deploy --dry-run` run without credentials; only deploy, failure-cleanup and explicit delete receive the token, while account ID comes from the Environment variable. A rerun by a different user is rejected even when the original initiating actor was `yesvus`.
4. The run summary must show the Cloudflare preview ID and a `workers.dev` preview URL. Remote smoke covers `/`, a hard-refreshed `/sign-in` SPA path, and one hashed JS asset. A smoke failure attempts to remove that exact newly created preview automatically; the workflow records a valid preview ID before URL validation to permit scoped cleanup when preview response URL metadata is invalid. If no parseable ID is returned at all, check Cloudflare's preview inventory manually for an orphan. Review response headers, navigation, logs and quota before recording success.
5. To retire the preview, rerun the **same workflow on main**, select `delete`, and supply the exact **32-character hex Preview ID** from the deploy run summary (the Cloudflare Preview API uses 32-hex IDs, not RFC 4122 UUIDs). Deletion is pinned to the pilot Worker's preview API only; verify the URL is gone. If automatic cleanup failed, this explicit delete operation is the recovery path.

**First credentialed preview run executed successfully (2026-11-17):** [Actions #44171223838](https://github.com/yesvus/dashboard-template/actions/runs/44171223838), triggered by owner-authenticated GitHub workflow dispatch on trusted `main`. The job's credential-name preflight, full build, scoped preview deploy and remote smoke checks for `/`, hard-refreshed `/sign-in` and hashed JS asset all passed. Cloudflare API independently confirms preview `d11b9ddf913c4b73aec49e0db879da42`, named `dashboard-static-canary`, under worker `yesvus-dashboard-template-pilot`, accessible at `https://dashboard-static-canary-yesvus-dashboard-template-pilot.yusufemirsamsa1930.workers.dev`. No production DNS route/deployment.

**Not yet executed:** explicit preview deletion/teardown verification, usage measurements and production release. The preview is deliberately left available for inspection; remove it using the existing `delete` operation on `main` with the exact 32-character ID above. No token values were inspected. The presence of this workflow is not a claim that a preview is live. No custom domain, DNS, route, database, billing upgrade, runtime secret or production deployment is part of this flow.

Preview APIs and `cf` commands are beta; verify their actual responses during the first controlled run. The environment is intentionally not provisioned by repository code.
