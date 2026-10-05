# Народне ППО / SkyNet — Stage 19 landings

Next.js informational application for Vercel with Preview/Production separation.
Payment and QR are locked until a separately reviewed release closes legal/provider gates.
Hobby is restricted to eligible personal/non-commercial use; see the runbook.

Languages: Ukrainian is the default at `/`, `/crowdfunding`, `/investors`. English, German, Polish and French use `/en`, `/de`, `/pl`, `/fr` with the same page suffixes (15 landing routes total). `/uk` aliases redirect to the unprefixed Ukrainian pages. Russian routes are absent.

Operational routes: `/api/health`, `/robots.txt`, `/sitemap.xml`.
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

Translations live in `content/locales/{uk,en,de,pl,fr}.json`, with English message keys. Shared page components preserve the selected language across navigation. Per-language HTML, canonical URLs, hreflang and a 15-URL Production sitemap are tested; Preview remains protected and unindexed. No browser-language redirect overrides the Ukrainian default.
