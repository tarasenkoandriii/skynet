import Image from 'next/image';
import type {Messages} from '@/lib/i18n';
export function ConceptIllustration({kind,t,priority=false}:{kind:'node'|'signal';t:Messages;priority?:boolean}){return <figure className="concept-illustration"><Image src={kind==='node'?'/illustrations/acoustic-node.webp':'/illustrations/signal-research.webp'} alt={kind==='node'?t.nodeIllustrationAlt:t.signalIllustrationAlt} width={1536} height={1024} sizes="(max-width:760px) 100vw, 50vw" priority={priority}/><figcaption>{t.conceptIllustrationNote}</figcaption></figure>}
