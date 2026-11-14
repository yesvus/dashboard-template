# Dashboard Template

Reusable **Vite + React + TypeScript** dashboard starter, adapted from
[Shadcn Admin](https://github.com/satnaing/shadcn-admin).

Includes shadcn/ui + Tailwind, TanStack Router/Query/Table, Recharts, forms,
responsive sidebar, light/dark mode, and demonstration screens. The UI works
without a backend. The optional Clerk demo is **not** production authentication.

## Install with your coding agent

Copy and paste into your agent:

```text
Set up https://github.com/yesvus/dashboard-template locally.
First read INSTALL_PROMPT.md and README.md. Verify Node.js 24+ and
pnpm 10, use the checked-in lockfile, and run real project checks.
Ask before installing software or changing system configuration.
Do not configure production auth, secrets, or deployment automatically.
```

[Full copyable install prompt](INSTALL_PROMPT.md).

## Create a dashboard

Use the GitHub **Use this template** button, or run:

    gh repo create OWNER/NEW_REPO --public --template yesvus/dashboard-template --clone
    cd NEW_REPO

Requirements: Node.js 24+ and pnpm 10.

    pnpm install --frozen-lockfile
    pnpm dev

Optional Clerk demo: copy .env.example to .env.local and configure the
publishable key. All other dashboard screens can be used without Clerk.

## Validate

    pnpm lint
    pnpm format:check
    pnpm build
    pnpm test:browser:install
    pnpm test

GitHub Actions runs these checks on pushes and pull requests.

## Customize

1. Replace placeholder routes, example data, navigation, images and branding.
2. Rename the package, metadata and favicon.
3. Integrate your API and server-side authentication/authorization. Remove the
   Clerk example if using another provider.
4. Configure client-side routing fallback for your deployment environment.
5. Add project-specific tests, permissions and CI policies before production.

Never put secrets in VITE\_ environment variables: they are public in the
client-side bundle.

## Conventions and attribution

AGENTS.md gives baseline agent instructions. CLAUDE.md imports them.
Default issue and PR templates come from
[yesvus/.github](https://github.com/yesvus/.github).

Derived from [Sat Naing's Shadcn Admin](https://github.com/satnaing/shadcn-admin).
The original [MIT license](LICENSE) and copyright attribution are retained.
