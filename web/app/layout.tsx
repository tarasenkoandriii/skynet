import './globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:{default:'Народне ППО — SkyNet',template:'%s | Народне ППО'},description:'Народне ППО / SkyNet — проєкт акустичного виявлення. Поточний статус: Stage 0, стендова валідація одного вузла.',robots:{index:process.env.VERCEL_ENV==='production',follow:process.env.VERCEL_ENV==='production'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="uk"><body><a className="skip" href="#content">До змісту</a>{children}</body></html>}
