# Agent instructions

- Read README.md and relevant architecture/source documentation first.
- Prefer minimal, reviewable changes and reuse existing components.
- Preserve responsive layout, keyboard access and dark mode.
- Run pnpm lint, pnpm format:check and pnpm build as appropriate; install a
  Chromium test browser before pnpm test.
- Report exact verification results, or explain what could not be run.
- Never commit secrets or mistake demo sign-in screens for production auth.
- Never deploy, merge, modify production data or credentials without approval.
- Add project-specific testing, API, deployment and security rules here.

- Keep INSTALL_PROMPT.md aligned with actual package.json commands, safe
  local-first onboarding, and this repository's demo-only auth boundaries.
- For Cloudflare changes, run `pnpm run workers:check` after `pnpm build`;
  the command is a credential-free dry run, NOT an actual deployment.
- Keep Cloudflare beta versions pinned and update `pnpm-lock.yaml` together
  with package.json; do not disable frozen-lockfile checks to hide drift.
