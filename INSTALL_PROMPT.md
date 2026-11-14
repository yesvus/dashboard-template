# Install this dashboard with an AI coding agent

Copy the following into ChatGPT Work, Codex, OpenCode, Claude Code,
Cursor or a similar agent.

~~~text
Please set up this dashboard template for local development:
https://github.com/yesvus/dashboard-template

Read README.md, AGENTS.md and INSTALL_PROMPT.md first. My goal is a
working local Vite dashboard, not a deployed or authenticated service.

1. Check that I have Node.js 24+ and pnpm 10. Inspect the actual package.json
   and lockfile. Explain missing tools and ask before installing anything.
2. Clone to a directory I choose; do not overwrite an existing checkout.
3. Run pnpm install --frozen-lockfile and pnpm dev, using official documented
   tools and respecting the existing package manager.
4. Verify UI accessibility locally and report the actual localhost URL,
   without automatically opening firewall access.
5. Run pnpm lint, pnpm format:check and pnpm build. For browser tests,
   follow the documented browser setup and run pnpm test if practical.
6. Explain which screens are mock/demo and that Clerk example auth is
   NOT production authorization.
7. Never put secrets in VITE_ environment variables, as they are
   included in the public client build.
8. Show me what was changed, exact verification results and rollback steps.

Ask me before installing system dependencies, modifying shared config,
enabling remote connectivity, editing secrets or deploying. Never deploy,
change production resources or commit credentials without explicit approval.
~~~

[Quick start](README.md) · [Agent instructions](AGENTS.md)

Keep the prompt aligned with actual package scripts and runtime versions.
