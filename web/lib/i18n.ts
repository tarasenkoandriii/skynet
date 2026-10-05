import type {Metadata} from 'next';
import uk from '@/content/locales/uk.json';
import en from '@/content/locales/en.json';
import de from '@/content/locales/de.json';
import pl from '@/content/locales/pl.json';
import fr from '@/content/locales/fr.json';
export const locales=['uk','en','de','pl','fr'] as const;
export type Locale=typeof locales[number];
export const languageNames:Record<Locale,string>={uk:'Українська',en:'English',de:'Deutsch',pl:'Polski',fr:'Français'};
export type Messages=Record<keyof typeof en,string>;
export type PageKind='home'|'support'|'investors';
const catalogues:Record<Locale,Messages>={uk,en,de,pl,fr};
export function isLocale(value:string):value is Locale{return locales.some(l=>l===value)}
export function messages(locale:Locale):Messages{return catalogues[locale]}
export function localizedPath(locale:Locale,path='/'){return (locale==='uk'?'':'/'+locale)+(path==='/'?(locale==='uk'?'/':''):path)}
export function pageMetadata(locale:Locale,page:PageKind):Metadata{const t=messages(locale);const path=page==='home'?'/':page==='support'?'/crowdfunding':'/investors';const origin=process.env.NEXT_PUBLIC_SITE_URL;return {title:page==='home'?'SkyNet':page==='support'?t.supportNav:t.investorsNav,description:t[page==='home'?'homeDescription':page==='support'?'supportDescription':'investorsDescription'],alternates:origin?{canonical:origin+localizedPath(locale,path),languages:Object.fromEntries([...locales.map(l=>[l,origin+localizedPath(l,path)]),['x-default',origin+localizedPath('uk',path)]])}:undefined}}
