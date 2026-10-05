import {fileURLToPath} from 'node:url';
import {configurationErrors} from './lib/deployment.mjs';
const errors=configurationErrors();
if(errors.length)throw new Error(`Deployment contract failed: ${errors.join('; ')}`);
const headers=[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},{key:'X-Frame-Options',value:'DENY'}];
if(process.env.VERCEL_ENV!=='production')headers.push({key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'});
export default {outputFileTracingRoot:fileURLToPath(new URL('.',import.meta.url)),poweredByHeader:false,redirects:async()=>[{source:"/uk",destination:"/",permanent:true},{source:"/uk/crowdfunding",destination:"/crowdfunding",permanent:true},{source:"/uk/investors",destination:"/investors",permanent:true}],reactStrictMode:true,headers:async()=>[{source:'/:path*',headers}]};
