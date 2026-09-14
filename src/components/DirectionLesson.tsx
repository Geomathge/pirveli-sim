import React,{useEffect,useRef,useState} from 'react';

type ParentTab = 'horizontal'|'vertical'|'compare'|'count';

export default function DirectionLesson({
  mode,
  onNavigate
}:{
  mode:'horizontal'|'vertical';
  onNavigate:(mode:ParentTab)=>void;
}){
  const ref=useRef<HTMLIFrameElement>(null);
  const [height,setHeight]=useState(920);

  useEffect(()=>{
    const receive=(e:MessageEvent)=>{
      if(e.source!==ref.current?.contentWindow) return;
      if(e.data?.type==='direction-height' && Number.isFinite(e.data.height)){
        setHeight(Math.max(620, Math.min(2200, e.data.height + 24)));
      }
      if(e.data?.type==='direction-navigate'){
        if(e.data.mode==='horizontal') onNavigate('horizontal');
        if(e.data.mode==='vertical') onNavigate('vertical');
        if(e.data.mode==='comparison') onNavigate('compare');
      }
    };
    window.addEventListener('message',receive);
    return()=>window.removeEventListener('message',receive);
  },[onNavigate]);

  return (
    <iframe
      ref={ref}
      key={mode}
      src={`directions.html?mode=${mode}&v=7`}
      title={mode==='horizontal'?'მარჯვნივ და მარცხნივ':'ზევით და ქვევით'}
      style={{width:'100%',height,border:0,display:'block',background:'#fff',borderRadius:16}}
      allow="autoplay"
    />
  );
}
