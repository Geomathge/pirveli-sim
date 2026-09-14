import React,{useEffect,useMemo,useRef,useState} from 'react';
import {getMuteState} from './SoundEffects';

type Mode='horizontal'|'vertical';
type NavMode='horizontal'|'vertical'|'compare';

export default function DirectionLesson({mode,onNavigate}:{mode:Mode,onNavigate:(mode:NavMode)=>void}){
  const ref=useRef<HTMLIFrameElement>(null);
  const [height,setHeight]=useState(900);
  const src=useMemo(()=>`${import.meta.env.BASE_URL}directions.html?mode=${mode}&v=20260914-rabbit-final-2`,[mode]);

  useEffect(()=>{
    const receive=(e:MessageEvent)=>{
      if(e.source!==ref.current?.contentWindow)return;
      if(e.data?.type==='direction-height'&&Number.isFinite(e.data.height)){
        setHeight(Math.max(520,Math.ceil(e.data.height)+8));
      }
      if(e.data?.type==='direction-navigate'&&['horizontal','vertical','comparison'].includes(e.data.mode)){
        onNavigate(e.data.mode==='comparison'?'compare':e.data.mode);
      }
    };
    window.addEventListener('message',receive);
    return()=>window.removeEventListener('message',receive);
  },[onNavigate]);

  const handleLoad=()=>{
    ref.current?.contentWindow?.postMessage({type:'direction-mute',muted:getMuteState()},'*');
  };

  return <iframe
    ref={ref}
    key={mode}
    src={src}
    onLoad={handleLoad}
    title={mode==='horizontal'?'მარჯვნივ და მარცხნივ':'ზევით და ქვევით'}
    style={{width:'100%',height,border:0,display:'block',background:'#fff'}}
    allow="autoplay"
  />;
}
