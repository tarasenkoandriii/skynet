# Народне ППО / SkyNet — Stage 19 landings

Next.js informational application for Vercel with Preview/Production separation.
Payment and QR are locked until a separately reviewed release closes legal/provider gates.
Hobby is restricted to eligible personal/non-commercial use; see the runbook.

Routes: `/`, `/crowdfunding`, `/investors`, `/api/health`, `/robots.txt`, `/sitemap.xml`.
Checkout and payment APIs are absent.

Local setup (Node 24):

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Before release: `npm run test:deployment`, `npm run typecheck`, `npm run build`.
Live verification: `npm run smoke -- https://your-domain production EXPECTED_FULL_GIT_SHA`.

See [deployment runbook](DEPLOYMENT_RUNBOOK.md) and [environment matrix](deployment/environment-matrix.json).
Live release evidence is recorded by the deployment operator.
The historical Stage 18 npm/build gap is not considered closed without actual successful execution.
