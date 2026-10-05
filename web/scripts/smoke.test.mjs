import {test} from 'node:test';
import assert from 'node:assert/strict';
import {smoke} from './smoke.mjs';
function mock(environment,patch={}) {return async url=>{const route=url.pathname;let body='<html>SkyNet QR-оплата ще не активовані</html>';let status=['/checkout','/api/payment'].includes(route)?404:200;const headers={'x-content-type-options':'nosniff','x-frame-options':'DENY','content-type':'text/html','x-robots-tag':'noindex'};if(route==='/api/health'){headers['content-type']='application/json';headers['cache-control']='no-store';body=JSON.stringify({ok:true,service:'narodne-ppo-landings',environment,revision:'abc',release_stage:19,informational_only:true,payment_enabled:false,qr_enabled:false,...patch})}if(route==='/robots.txt')body=environment==='production'?'Sitemap: https://release.invalid/sitemap.xml':'Disallow: /\n';if(route==='/sitemap.xml')body=environment==='production'?['','/crowdfunding','/investors'].map(p=>`<loc>https://release.invalid${p}</loc>`).join(''):'';return new Response(body,{status,headers})}}
test('full smoke contracts preview and production',async()=>{for(const environment of ['preview','production'])assert.equal((await smoke({base:'https://release.invalid',environment,revision:'abc',fetcher:mock(environment)})).routes,8)});
test('reject wrong revision, environment and activated gates',async()=>{for(const patch of [{revision:'old'},{environment:'production'},{payment_enabled:true},{qr_enabled:true},{ok:false}])await assert.rejects(smoke({base:'https://release.invalid',environment:'preview',revision:'abc',fetcher:mock('preview',patch)}))});
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
