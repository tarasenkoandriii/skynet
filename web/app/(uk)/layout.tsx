import '../globals.css';
import type {Metadata} from 'next';
import {isLocale,messages} from '@/lib/i18n';
export const metadata:Metadata={icons:{icon:{url:'/brand/site-icon.svg',type:'image/svg+xml'},apple:{url:'/brandmark',sizes:'192x192'}},title:{default:'SkyNet',template:'%s | SkyNet'},robots:{index:process.env.VERCEL_ENV==='production',follow:process.env.VERCEL_ENV==='production'}};
export default async function RootLayout({children,params}:{children:React.ReactNode;params:Promise<{locale?:string}>}){const {locale:value}=await params;const locale=value&&isLocale(value)?value:'uk';return <html lang={locale}><body><a className="skip" href="#content">{messages(locale).skipToContent}</a>{children}</body></html>}
