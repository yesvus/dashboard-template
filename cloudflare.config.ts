import { defineConfig } from 'cf/config'

// Isolated non-production Worker: no custom domain, bindings or runtime secrets.
// Deployment is intentionally manual until preview credentials and CI gates
// are reviewed in dashboard-template#2 and ops#631.
export default defineConfig({
  worker: {
    name: 'yesvus-dashboard-template-pilot',
    compatibilityDate: '2026-11-15',
    assets: {
      notFoundHandling: 'single-page-application',
    },
  },
})
