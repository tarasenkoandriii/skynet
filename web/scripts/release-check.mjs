import fs from 'node:fs';
import {configurationErrors} from '../lib/deployment.mjs';
const required=['package-lock.json','app/page.tsx','app/crowdfunding/page.tsx','app/investors/page.tsx','app/api/health/route.ts','app/robots.ts','app/sitemap.ts','components/PaymentGate.tsx','content/truth-registry.json','vercel.json','deployment/environment-matrix.json','DEPLOYMENT_RUNBOOK.md'];
const errors=configurationErrors();
for(const file of required)if(!fs.existsSync(file))errors.push(`Missing ${file}`);
for(const file of ['content/truth-registry.json','vercel.json','deployment/environment-matrix.json'])try{JSON.parse(fs.readFileSync(file,'utf8'))}catch{errors.push(`Invalid JSON: ${file}`)}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Release configuration contract: PASS (does not attest build or live deployment)');
