 'use client';
import {useState} from 'react';
export function ShareButton({href,label,success,fallback}:{href:string;label:string;success:string;fallback:string}){const [message,setMessage]=useState('');async function share(){try{await navigator.clipboard.writeText(new URL(href,window.location.href).href);setMessage(success)}catch{setMessage(fallback)}}return <div className="share-control"><button className="btn primary" type="button" onClick={share}>{label} ↗</button><p className="share-message" role="status">{message}</p></div>}
