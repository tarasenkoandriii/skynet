import {ImageResponse} from 'next/og';
export const dynamic='force-static';
export function GET(){return new ImageResponse(<div style={{width:192,height:192,display:'flex',alignItems:'center',justifyContent:'center',background:'#080b0d',borderRadius:42,position:'relative'}}>{[134,88,42].map(size=><div key={size} style={{position:'absolute',width:size,height:size,border:'5px solid #78e08f',borderRadius:'50%',display:'flex'}}/>)}<div style={{width:14,height:14,borderRadius:'50%',background:'#78e08f',display:'flex'}}/></div>,{width:192,height:192})}
