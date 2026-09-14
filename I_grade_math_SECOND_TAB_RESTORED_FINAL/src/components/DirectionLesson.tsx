import React,{useMemo,useEffect,useRef,useState} from 'react';
import html from '../legacy/directions.html?raw';
import css from '../legacy/directions.css?raw';
import script from '../legacy/directions.js?raw';
export default function DirectionLesson({mode,onNavigate}:{mode:'horizontal'|'vertical',onNavigate:(mode:'horizontal'|'vertical'|'compare')=>void}){
 const ref=useRef<HTMLIFrameElement>(null);const [height,setHeight]=useState(900);
 const doc=useMemo(()=>{
  const bridge=`window.initialMode=${JSON.stringify(mode)};`+script+`;new ResizeObserver(()=>{const box=document.querySelector('.app-shell');parent.postMessage({type:'direction-height',height:Math.ceil(box.getBoundingClientRect().height)},'*')}).observe(document.querySelector('.app-shell'));`;
  return html.replace('</head>','<style>'+css+'</style></head>').replace('</body>','<script>'+bridge.replace(/<\/script/gi,'<\\/script')+'</script></body>');
 },[mode]);
 useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.source!==ref.current?.contentWindow)return;if(e.data?.type==='direction-height'&&Number.isFinite(e.data.height))setHeight(Math.max(500,e.data.height+30));if(e.data?.type==='direction-navigate'&&['horizontal','vertical','comparison'].includes(e.data.mode))onNavigate(e.data.mode==='comparison'?'compare':e.data.mode)};window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive)},[onNavigate]);
 return <iframe ref={ref} srcDoc={doc} title={mode==='horizontal'?'მარჯვნივ და მარცხნივ':'ზევით და ქვევით'} style={{width:'100%',height,border:0,display:'block'}}/>;
}
