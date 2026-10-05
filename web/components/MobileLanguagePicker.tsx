'use client';

import Link from 'next/link';
import {useEffect,useRef} from 'react';
import type {Locale} from '@/lib/i18n';

type LanguageOption={locale:Locale;name:string;flag:string;href:string};

export function MobileLanguagePicker({locale,label,currentName,currentFlag,options}:{
  locale:Locale;label:string;currentName:string;currentFlag:string;options:LanguageOption[];
}){
  const picker=useRef<HTMLDetailsElement>(null);

  useEffect(()=>{
    function dismissOutside(event:PointerEvent){
      const element=picker.current;
      if(element?.open&&event.target instanceof Node&&!element.contains(event.target)) element.open=false;
    }
    function dismissWithEscape(event:KeyboardEvent){
      const element=picker.current;
      if(event.key==='Escape'&&element?.open){
        event.preventDefault();
        element.open=false;
        element.querySelector('summary')?.focus();
      }
    }
    document.addEventListener('pointerdown',dismissOutside);
    document.addEventListener('keydown',dismissWithEscape);
    return ()=>{
      document.removeEventListener('pointerdown',dismissOutside);
      document.removeEventListener('keydown',dismissWithEscape);
    };
  },[]);

  return <details className="mobile-language-picker" ref={picker}>
    <summary lang={locale} aria-label={label+': '+currentName}>
      <span className="language-flag" aria-hidden="true">{currentFlag}</span>
      {currentName}<span aria-hidden="true">⌄</span>
    </summary>
    <nav aria-label={label}>{options.map(option=><Link key={option.locale}
      lang={option.locale} hrefLang={option.locale} href={option.href}
      aria-current={option.locale===locale?'true':undefined}
      onClick={()=>{if(picker.current) picker.current.open=false;}}>
      <span className="language-option-name"><span className="language-flag" aria-hidden="true">{option.flag}</span>{option.name}</span>
      <span aria-hidden="true">{option.locale.toUpperCase()}</span>
    </Link>)}</nav>
  </details>;
}
