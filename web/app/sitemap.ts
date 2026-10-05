import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{if(process.env.VERCEL_ENV!=='production')return [];const b=process.env.NEXT_PUBLIC_SITE_URL!;return['','/crowdfunding','/investors'].map((p,i)=>({url:b+p,changeFrequency:i?'weekly':'daily',priority:i?.8:1}))}
