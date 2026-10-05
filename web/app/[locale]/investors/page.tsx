import Landing from '@/components/InvestorsLanding';
import {isLocale,pageMetadata} from '@/lib/i18n';
import {notFound} from 'next/navigation';
type Props={params:Promise<{locale:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return ['en','de','pl','fr'].map(locale=>({locale}))}
export async function generateMetadata({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();return pageMetadata(locale,"investors")}
export default async function Page({params}:Props){const {locale}=await params;if(!isLocale(locale))notFound();return <Landing locale={locale}/>}
