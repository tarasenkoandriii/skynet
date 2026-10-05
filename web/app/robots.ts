import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{if(process.env.VERCEL_ENV!=='production')return{rules:{userAgent:'*',disallow:'/'}};const base=process.env.NEXT_PUBLIC_SITE_URL!;return{rules:{userAgent:'*',allow:['/','/crowdfunding','/investors'],disallow:['/api/','/diligence','/checkout','/admin','/preview']},sitemap:`${base}/sitemap.xml`}}
