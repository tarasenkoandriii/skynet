import {test} from 'node:test';
import assert from 'node:assert/strict';
import {smoke} from './smoke.mjs';
import {readFileSync} from 'node:fs';
const locales=['uk','en','de','pl','fr'];
const routes=locales.flatMap(l=>['/','/crowdfunding','/investors'].map(p=>(l==='uk'?'':'/'+l)+(p==='/'?(l==='uk'?'/':''):p)));
function notice(l){return JSON.parse(readFileSync(new URL('../content/locales/'+l+'.json',import.meta.url))).paymentNotice.replaceAll('&','&amp;').replaceAll("'",'&#x27;').replaceAll('"','&quot;')}

function mock(environment,patch={}) {return async url=>{const route=url.pathname;const locale=locales.find(l=>l!=='uk'&&(route==='/'+l||route.startsWith('/'+l+'/'))) || 'uk';const suffix=route.endsWith('/crowdfunding')?'/crowdfunding':route.endsWith('/investors')?'/investors':'/';const alternates=[...locales,'x-default'].map(l=>{const prefix=l==='uk'||l==='x-default'?'':'/'+l;return `<link rel="alternate" hrefLang="${l}" href="https://release.invalid${prefix}${suffix==='/'?(prefix?'':'/'):suffix}"/>`}).join('');let body=`<html lang="${locale}"><link rel="canonical" href="https://release.invalid${route}"/>${alternates}SkyNet ${notice(locale)}</html>`;let status=['/checkout','/api/payment','/ru','/ru/investors'].includes(route)?404:200;const headers={'x-content-type-options':'nosniff','x-frame-options':'DENY','content-type':'text/html','x-robots-tag':'noindex'};if(route==='/api/health'){headers['content-type']='application/json';headers['cache-control']='no-store';body=JSON.stringify({ok:true,node_version:'v24.0.0',service:'narodne-ppo-landings',environment,revision:'abc',release_stage:19,informational_only:true,payment_enabled:false,qr_enabled:false,...patch})}if(route==='/robots.txt')body=environment==='production'?'Sitemap: https://release.invalid/sitemap.xml':'Disallow: /\n';if(route==='/sitemap.xml')body=environment==='production'?routes.map(p=>`<loc>https://release.invalid${p}</loc>`).join(''):'';return new Response(body,{status,headers})}}
test('full smoke contracts preview and production',async()=>{for(const environment of ['preview','production'])assert.equal((await smoke({base:'https://release.invalid',environment,revision:'abc',fetcher:mock(environment)})).routes,22)});
test('reject wrong revision, environment and activated gates',async()=>{for(const patch of [{revision:'old'},{environment:'production'},{payment_enabled:true},{qr_enabled:true},{ok:false},{node_version:'v22.16.0'}])await assert.rejects(smoke({base:'https://release.invalid',environment:'preview',revision:'abc',fetcher:mock('preview',patch)}))});
test('redirects/auth screens and insecure URLs fail',async()=>{await assert.rejects(smoke({base:'https://release.invalid',environment:'preview',revision:'abc',fetcher:async()=>new Response('',{status:302})}));await assert.rejects(smoke({base:'http://release.invalid',environment:'preview',revision:'abc'}))});
test('security, robots, sitemap and disabled endpoints are enforced',async()=>{
  for(const [target,change] of [
    ['/',r=>new Response('<html>SkyNet</html>',{status:200,headers:{'content-type':'text/html'}})],
    ['/robots.txt',r=>new Response('Allow: /',{status:200,headers:r.headers})],
    ['/sitemap.xml',r=>new Response('<loc>https://wrong.invalid/</loc>',{status:200,headers:r.headers})],
    ['/checkout',r=>new Response('checkout',{status:200,headers:r.headers})],
    ['/crowdfunding',r=>new Response('<html>SkyNet <form></form></html>',{status:200,headers:r.headers})]
  ]) await assert.rejects(smoke({base:'https://release.invalid',environment:'preview',revision:'abc',fetcher:async url=>{const r=await mock('preview')(url);return url.pathname===target?change(r):r}}));
});

test('translated pages must identify their language and keep payment notices',async()=>{for(const target of ['/de/investors','/fr/crowdfunding'])await assert.rejects(smoke({base:'https://release.invalid',environment:'preview',revision:'abc',fetcher:async url=>{const r=await mock('preview')(url);return url.pathname===target?new Response('<html lang="uk">SkyNet</html>',{status:200,headers:r.headers}):r}}));});
