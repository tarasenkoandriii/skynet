import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
const locales=['uk','en','de','pl','fr'];
const paths=['/','/crowdfunding','/investors'];
const pageRoutes=locales.flatMap(locale=>paths.map(path=>(locale==='uk'?'':'/'+locale)+(path==='/'?(locale==='uk'?'/':''):path)));
const catalogues=Object.fromEntries(locales.map(locale=>[locale,JSON.parse(readFileSync(new URL('../content/locales/'+locale+'.json',import.meta.url),'utf8'))]));
export async function smoke({base,environment,revision,fetcher=fetch,local=false,token,canonical}) {
  const origin=new URL(base);
  if(!['preview','production','development'].includes(environment))throw new Error('Expected environment required');
  if(origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw new Error('Use a clean origin');
  if(origin.protocol!=='https:' && !(local && origin.protocol==='http:' && ['localhost','127.0.0.1'].includes(origin.hostname)))throw new Error('HTTPS required');
  if(!revision)throw new Error('Expected revision required');
  const expectedOrigin=canonical ? new URL(canonical).origin : origin.origin;
  if(canonical && (new URL(canonical).protocol!=="https:" || canonical!==expectedOrigin))throw new Error("Clean HTTPS canonical origin required");
  const headers=token?{'x-vercel-protection-bypass':token}:{};
  const routes=[...pageRoutes,'/api/health','/robots.txt','/sitemap.xml','/checkout','/api/payment','/ru','/ru/investors'];
  for(const route of routes) {
    const response=await fetcher(new URL(route,origin),{redirect:'manual',headers,signal:AbortSignal.timeout(15000)});
    const negative=['/checkout','/api/payment','/ru','/ru/investors'].includes(route);
    if(response.status!==(negative?404:200))throw new Error(`${route}: unexpected status ${response.status}`);
    if(response.headers.get('x-content-type-options')!=='nosniff' || response.headers.get('x-frame-options')!=='DENY')throw new Error(`${route}: missing security headers`);
    if(environment!=='production' && !response.headers.get('x-robots-tag')?.includes('noindex'))throw new Error(`${route}: missing noindex`);
    const body=await response.text();
    if(route==='/api/health') {
      if(!response.headers.get('content-type')?.includes('application/json') || !response.headers.get('cache-control')?.includes('no-store'))throw new Error('Health must be uncached JSON');
      const data=JSON.parse(body);
      if(!/^v24\./.test(data.node_version||''))throw new Error('Node 24 runtime required');
      if(data.ok!==true||data.service!=='narodne-ppo-landings'||data.environment!==environment||data.revision!==revision||data.release_stage!==19||data.informational_only!==true||data.payment_enabled!==false||data.qr_enabled!==false)throw new Error('Health contract mismatch');
    } else if(route==='/robots.txt') {
      if(environment==='production' ? !body.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`) : !/Disallow: \/(?:\r?\n|$)/.test(body))throw new Error('Robots scope mismatch');
    } else if(route==='/sitemap.xml') {
      const locations=[...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
      const expected=environment==='production'?pageRoutes.map(p=>expectedOrigin+p):[];
      if(JSON.stringify(locations.sort())!==JSON.stringify(expected.sort()))throw new Error('Sitemap origin/routes mismatch');
    } else if(!negative) {
      if(!response.headers.get('content-type')?.includes('text/html')||!body.includes('<html')||!body.includes('SkyNet'))throw new Error(`${route}: invalid page`);
      const locale=locales.find(l=>l!=='uk' && (route==='/'+l || route.startsWith('/'+l+'/'))) || 'uk';
      if(!body.includes('<html lang="'+locale+'"'))throw new Error(`${route}: wrong document language`);
      if(!body.includes(`<link rel="canonical" href="${expectedOrigin}${route}"`))throw new Error(`${route}: wrong canonical URL`);
      const suffix=route.endsWith('/crowdfunding')?'/crowdfunding':route.endsWith('/investors')?'/investors':'/';
      for(const language of [...locales,'x-default']){const prefix=language==='uk'||language==='x-default'?'':'/'+language;const path=prefix+(suffix==='/'?(prefix?'':'/'):suffix);if(!body.includes(`hrefLang="${language}" href="${expectedOrigin}${path}"`))throw new Error(`${route}: missing language alternate ${language}`);}

      if(route.endsWith('/crowdfunding') && !body.includes(catalogues[locale].paymentNotice.replaceAll('&','&amp;').replaceAll("'",'&#x27;').replaceAll('"','&quot;')))throw new Error('Payment notice missing');
      if(/Перейти до захищеної оплати|<form\b|<canvas\b/i.test(body))throw new Error(`${route}: unexpected transaction/QR surface`);
    }
  }
  return {ok:true,environment,revision,routes:routes.length};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try { console.log(JSON.stringify(await smoke({base:process.argv[2],environment:process.argv[3],revision:process.argv[4],local:process.env.SMOKE_ALLOW_LOCAL==='true',token:process.env.VERCEL_AUTOMATION_BYPASS_SECRET,canonical:process.env.SMOKE_CANONICAL_ORIGIN}))); }
  catch { console.error('Smoke failed: deployment did not satisfy the release contract. Inspect the deployment without logging bypass secrets.');process.exitCode=1; }
}
