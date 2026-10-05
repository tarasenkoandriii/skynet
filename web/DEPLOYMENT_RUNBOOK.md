# Stage 19 — Vercel deployment / release runbook

Date: 2026-10-05. Scope: `web/` informational landings only. This is a procedure, not evidence of deployment.

## Environment matrix and ownership

Machine-readable matrix: `deployment/environment-matrix.json`. Set each value independently in Development, Preview and Production in Vercel Project Settings → Environment Variables. Never copy production secrets into Preview. No payment/provider secrets are needed or permitted by this release. `NEXT_PUBLIC_*` values are public and build-time bound. `VERCEL_ENV` and `VERCEL_GIT_COMMIT_SHA` are Vercel system values; enable their exposure and do not override them in Vercel.

For every deployed scope explicitly set `CAMPAIGN_MODE=DISABLED`, `PAYMENT_STATUS=DISABLED`, `LEGAL_PAYMENT_APPROVED=false`, `CONTACT_ENDPOINT_ENABLED=false`. Leave `PAYMENT_PROVIDER` and `PAYMENT_CANONICAL_URL` unset/empty; remove obsolete `PAYMENT_ENABLED` and `PAYMENT_LEGAL_APPROVED`. Set `NEXT_PUBLIC_SITE_URL` to the environment's actual HTTPS origin, without a path, query, fragment, or trailing slash. Preview may use its stable branch domain; smoke must target that same origin. For an ephemeral Preview, set its actual origin and rebuild before testing. Production uses the canonical live domain.

Set `HOSTING_PLAN` to the actual account plan (`hobby`, `pro`, `enterprise`). Hobby additionally requires `HOBBY_NONCOMMERCIAL_APPROVED=true` backed by a dated owner assessment of personal/non-commercial eligibility. Non-transactional alone does not establish eligibility: commercial investor marketing also requires suitable hosting. The flag records an assessment; software cannot verify the subscription or legal status. Use Pro or other suitable hosting when eligibility is uncertain. No production deployment until this assessment is recorded.

Development allows absent flags and always stays locked; local production-mode checks use the explicit Production matrix. Missing/invalid deployed settings fail the build and cause uncached health HTTP 503. Payments and QR are unconditionally disabled in Stage 19 even with forged approval flags. Closing external gates later requires a separately reviewed implementation/release, provider verification and transaction compliance; a dashboard toggle cannot enable them.

## Project setup and Preview separation

1. Import the repository containing this archive's `project/` contents. Set Root Directory to `web` (if you import an enclosing directory, use its relative `project/web` path). Framework: Next.js; install: `npm ci`; build: `npm run build`; no custom output directory. Use Node 24 in Vercel and CI.
2. Configure `main` as the production branch; all feature branches use Preview. Protect `main` and require the Web release gate check before merging. Disable direct pushes/unaudited manual production deploys. GitHub checks alone do not block Vercel builds; branch protection and Vercel's own build gate both matter.
3. Enable Preview deployment protection. Noindex, robots disallow and empty Preview sitemap prevent accidental indexing but are not access control. Keep any nonpublic material out of public routes.
4. Add the scoped variables above. Changing variables requires a new deployment. Never commit `.env.local`, `.vercel/`, credentials or automation bypass tokens.
5. Record project/team ID, actual plan, eligibility assessment, production branch/domain, release owner and incident owner in the private operations record. Do not put credentials in this archive.

## Build and acceptance

From `web/`, use Node 24:

```sh
npm ci
npm run test:deployment
npm run typecheck
npm run build
```

`build` validates the configuration and deployment tests before Next builds. Commit `package-lock.json`; never replace `npm ci` with an unreviewed dependency resolution during release. Inspect dependency advisories before production; a passing functional build is not a security approval.

After Preview is Ready, test the exact domain and expected Git commit:

```sh
npm run smoke -- https://your-preview-domain preview EXPECTED_FULL_GIT_SHA
```

For protected Preview, supply `VERCEL_AUTOMATION_BYPASS_SECRET` via your secret manager in the process environment. Never put it in the URL or command argument. Smoke refuses redirects/auth pages, insecure remote HTTP, wrong revisions and unsafe payment/QR state. Do not disable protection to make a test pass. Check the three Ukrainian pages and `/en`, `/de`, `/pl`, `/fr` versions of each visually on desktop/mobile, payment disabled notice, navigation, branding and absence of transaction controls. Automated smoke checks all 15 pages, their document languages and translated payment notices, health, robots, the 15-URL Production sitemap (empty in Preview), and inactive checkout/payment/Russian routes.

## Production release

1. Record the previously known-good production deployment ID/URL and commit, plus its disabled payment/QR state and environment assessment. Confirm rollback permissions and available target before release. On a first deployment, plan to remove production domain exposure if no safe rollback target exists.
2. Require green CI and Preview acceptance for the exact commit. Record build logs, release-check and test results. Do not use a green historic audit as evidence for this release.
3. Recheck Production-scoped variables and hosting eligibility. Merge the approved commit into `main` to create a fresh Production build. Do not assume a Preview promotion preserves the tested environment: Production settings may trigger a rebuild. This project uses the production-branch workflow.
4. Wait for Ready, verify commit and run against the canonical domain:

```sh
npm run smoke -- https://your-production-domain production EXPECTED_FULL_GIT_SHA
```

5. Confirm Production sitemap contains only the canonical origin, HTTPS/domain assignment works, payment/QR are false, health is uncached, and no secrets occur in HTML/logs. Record release time (UTC), deployment ID, SHA, actual build result, smoke output, operator and rollback target. Watch error logs and health immediately and again after 15 minutes. A failed smoke means release acceptance failed; initiate rollback, do not label the deployment passed.

## Rollback procedure

Trigger on failed health/smoke, wrong commit/origin, unexpected indexing, payment/QR exposure or new route failures.

1. Pause merges/releases; record incident and failing deployment ID. Select the pre-recorded known-good informational deployment, verifying that it belongs to this project and keeps payments/QR closed. Do not roll back to an older payment-enabled artifact.
2. In Vercel Project → Deployments select the known-good deployment and use Instant Rollback. An authorized operator may alternatively use `vercel rollback <known-good-deployment-url>` with their installed, authenticated CLI. Confirm domain alias now points to the target. Hobby rollback is limited to the previous production deployment; if no safe target is available, remove public domain exposure and deploy a corrected informational build.
3. Rollback restores the previous artifact and its environment, not newly edited dashboard variables. Verify the target's environment contract. Older stages lacking the Stage 19 health contract are not acceptable automatic rollback targets; prepare a safe Stage 19 target first.
4. Run the same Production smoke with the rollback target's SHA. Recheck logs, canonical domain, disabled controls and robots/sitemap. Record outcome and restoration time. If unsafe state remains, remove public exposure until a verified locked deployment is ready.
5. Revert/fix the source commit and re-run CI/Preview before the next production release. Dashboard rollback alone does not fix the production branch or future automatic deploys. No data migration/payment reversal is included: Stage 19 has no transactional backend.

## Release evidence template

Record privately: environment, domain, deployment ID, commit SHA, Node version, lockfile hash, npm ci/typecheck/build/test result and timestamp, actual plan/eligibility assessment, Preview and Production smoke result, visual reviewer, rollback target/SHA, incident owner. Use PASS, FAIL or NOT RUN explicitly. Do not include secrets.

## Primary references (checked 2026-10-05)

- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/deployments/environments
- https://vercel.com/docs/plans/hobby — personal/non-commercial restriction
- https://vercel.com/docs/instant-rollback — previous artifact/environment semantics
- https://vercel.com/docs/cli/rollback — Hobby previous-production limit
- https://vercel.com/docs/deployments/promoting-a-deployment

## Manual CLI deployment and rollback drill

A CLI upload from `web/` uses that directory as the Vercel project root; its project setting Root Directory is empty. The repository integration described above uses `web` relative to repository root. Do not combine these two root settings.

For a release without a Git repository, set `RELEASE_REVISION` explicitly at both build and runtime. It takes precedence over the Git SHA in health. Use a recorded artifact label containing the source digest; pass that exact label to smoke instead of a Git SHA. Never use a local/default revision as evidence of a live release. Configure Node 24, independent Preview/Production origins and disabled flags in the cloud project. Keep Preview protected.

For a first real rollback drill, create and live-test informational baseline A, then create and live-test informational candidate B with a different RELEASE_REVISION. Roll back to A, verify the production alias and re-run smoke expecting A's revision. Both artifacts must keep transactions locked. A successful drill leaves the verified baseline serving production; no intentionally unsafe deployment is needed.

Public repository: https://github.com/tarasenkoandriii/skynet . Production branch: main. Vercel project Root Directory: web. Runtime: Node 24.x. Public production origin: https://narodne-ppo-skynet.vercel.app .

## Multilingual landing release

Ukrainian is the unprefixed default. EN/DE/PL/FR have explicit URL prefixes; language selection preserves the current landing. English message keys are shared across all five catalogues. Review copy changes together across languages, including legal/payment notices. Translation tests reject missing, empty or extra keys and Ukrainian text in foreign catalogues. Do not enable transactions as part of a translation/design release.
