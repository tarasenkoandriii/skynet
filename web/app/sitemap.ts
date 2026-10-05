import type {MetadataRoute} from 'next';
import {locales,localizedPath} from '@/lib/i18n';
export default function sitemap():MetadataRoute.Sitemap{if(process.env.VERCEL_ENV!=='production')return [];const b=process.env.NEXT_PUBLIC_SITE_URL!;return locales.flatMap(locale=>['/','/crowdfunding','/investors'].map(path=>({url:b+localizedPath(locale,path),changeFrequency:'weekly' as const,priority:path==='/'?1:.8,alternates:{languages:Object.fromEntries(locales.map(l=>[l,b+localizedPath(l,path)]))}})))}
