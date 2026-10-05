import type {Metadata} from 'next';
import uk from '@/content/locales/uk.json';
import en from '@/content/locales/en.json';
import de from '@/content/locales/de.json';
import pl from '@/content/locales/pl.json';
import fr from '@/content/locales/fr.json';
export const locales=['uk','en','de','pl','fr'] as const;
export type Locale=typeof locales[number];
export const languageNames:Record<Locale,string>={uk:'Українська',en:'English',de:'Deutsch',pl:'Polski',fr:'Français'};
export const languageFlags:Record<Locale,string>={uk:'🇺🇦',en:'🇬🇧',de:'🇩🇪',pl:'🇵🇱',fr:'🇫🇷'};
export type Messages=Record<keyof typeof en,string>;
export type PageKind='home'|'support'|'investors';
const catalogues:Record<Locale,Messages>={uk,en,de,pl,fr};
export function isLocale(value:string):value is Locale{return locales.some(l=>l===value)}
export function messages(locale:Locale):Messages{return catalogues[locale]}
export function localizedPath(locale:Locale,path='/'){return (locale==='uk'?'':'/'+locale)+(path==='/'?(locale==='uk'?'/':''):path)}
const socialLocales:Record<Locale,string>={uk:'uk_UA',en:'en_GB',de:'de_DE',pl:'pl_PL',fr:'fr_FR'};
export function pageMetadata(locale:Locale,page:PageKind):Metadata {
 const t=messages(locale);
 const path=page==='home'?'/':page==='support'?'/crowdfunding':'/investors';
 const origin=process.env.NEXT_PUBLIC_SITE_URL;
 const title=page==='home'?'SkyNet':page==='support'?t.supportNav:t.investorsNav;
 const description=t[page==='home'?'homeDescription':page==='support'?'supportDescription':'investorsDescription'];
 const socialTitle=page==='home'?`SkyNet — ${t.homeEyebrow}`:`${title} | SkyNet`;
 const image=origin?`${origin}/brandmark`:undefined;
 return {title,description,
  alternates:origin?{canonical:origin+localizedPath(locale,path),languages:Object.fromEntries([...locales.map(l=>[l,origin+localizedPath(l,path)]),['x-default',origin+localizedPath('uk',path)]])}:undefined,
  openGraph:{type:'website',siteName:'SkyNet',title:socialTitle,description,url:origin?origin+localizedPath(locale,path):undefined,locale:socialLocales[locale],alternateLocale:locales.filter(l=>l!==locale).map(l=>socialLocales[l]),images:image?[{url:image,width:192,height:192,alt:t.brand}]:undefined},
  twitter:{card:'summary',title:socialTitle,description,images:image?[{url:image,alt:t.brand}]:undefined}
 };
}
