import {ConceptIllustration} from '@/components/ConceptIllustration';
import {messages,localizedPath,type Locale} from "@/lib/i18n";
import Link from 'next/link';
import {Shell} from '@/components/Shell';
import {HeroHeadline,SectionHeading,StatusStrip,Roadmap,NextPage} from '@/components/Editorial';
export default function Home({locale="uk"}:{locale?:Locale}){const t=messages(locale);return <Shell locale={locale} page="home"><main id="content">
  <div className="wrap hero"><div className="hero-copy"><div className="eyebrow"><span className="signal-dot" aria-hidden="true"/>{t.homeEyebrow}</div><HeroHeadline text={t.homeHeadline}/><p className="lead">{t.homeLead}</p><div className="actions"><Link className="btn primary" href={localizedPath(locale,"/crowdfunding")}>{t.homePrimary} <span aria-hidden="true">↗</span></Link><a className="btn" href="#approach">{t.homeSecondary} <span aria-hidden="true">↓</span></a></div><p className="hero-note">{t.homeNote}</p></div><ConceptIllustration kind="node" t={t} priority/></div>
  <div className="wrap"><StatusStrip t={t}/></div>
  <section id="approach"><div className="wrap"><SectionHeading number="01" label={t.ideaLabel} title={t.ideaTitle} description={t.ideaDescription}/><div className="grid"><article className="card"><span className="card-index">{t.approach1Label}</span><h3>{t.approach1Title}</h3><p>{t.approach1Body}</p></article><article className="card"><span className="card-index">{t.approach2Label}</span><h3>{t.approach2Title}</h3><p>{t.approach2Body}</p></article><article className="card"><span className="card-index">{t.approach3Label}</span><h3>{t.approach3Title}</h3><p>{t.approach3Body}</p></article></div></div></section>
  <section><div className="wrap"><SectionHeading number="02" label={t.roadmapLabel} title={t.roadmapTitle} description={t.roadmapDescription}/><Roadmap t={t}/></div></section>
  <section className="principles"><div className="wrap"><SectionHeading number="03" label={t.principlesLabel} title={t.principlesTitle}/><div className="principle-list"><div><span>01</span><h3>{t.principle1Title}</h3><p>{t.principle1Body}</p></div><div><span>02</span><h3>{t.principle2Title}</h3><p>{t.principle2Body}</p></div><div><span>03</span><h3>{t.principle3Title}</h3><p>{t.principle3Body}</p></div></div></div></section>
  <NextPage label={t.joinLabel} title={t.joinTitle} href={localizedPath(locale,"/crowdfunding")} action={t.supportAction}/>
</main></Shell>}
