import React,{useState} from 'react';
import {ComparisonLesson} from './components/ComparisonLesson';
import {BallComparisonLesson} from './components/BallComparisonLesson';
import DirectionLesson from './components/DirectionLesson';
import {getMuteState,setMuteState} from './components/SoundEffects';
import learnTogetherImg from './assets/characters/face-pair-right-hands-up.png';
import headerHomeScene from './assets/header-home-scene.svg';

const tabs=[
  {id:'horizontal',label:'მარჯვნივ და მარცხნივ',icon:'↔️'},
  {id:'vertical',label:'ზევით და ქვევით',icon:'↕️'},
  {id:'compare',label:'ვისწავლოთ შედარება',icon:'⚖️'},
  {id:'count',label:'ვისწავლოთ შედარება, დავითვალოთ',icon:'🍎'},
] as const;

type Tab=typeof tabs[number]['id'];

export default function App(){
 const [active,setActive]=useState<Tab>('horizontal');
 const [muted,setMuted]=useState(getMuteState());
 return <div className="unified-app">
  <header className="unified-header" style={{backgroundImage:`linear-gradient(90deg, rgba(244,251,255,.90), rgba(255,255,255,.72)), url(${headerHomeScene})`}}>
   <div className="unified-brand"><div className="unified-number">1</div><div><div className="unified-eyebrow">მათემატიკა • I კლასი</div><h1>მოვემზადოთ მათემატიკისთვის</h1></div></div>
   <div className="unified-header-actions">
    <div className="learn-together-card"><img src={learnTogetherImg} alt="გოგო და ბიჭი"/><span>ვისწავლოთ ერთად</span></div>
    <button className="unified-sound" onClick={()=>{setMuteState(!muted);setMuted(!muted)}} aria-label={muted?'ხმის ჩართვა':'ხმის გამორთვა'}>{muted?'🔇':'🔊'}</button>
   </div>
  </header>
  <nav className="unified-nav" aria-label="გაკვეთილები">{tabs.map((t,i)=><button key={t.id} aria-pressed={active===t.id} onClick={()=>setActive(t.id)}><span>{t.icon}</span> <span>{i+1}. {t.label}</span></button>)}</nav>
  <main className="unified-main">{active==='compare'?<BallComparisonLesson/>:active==='count'?<ComparisonLesson/>:<DirectionLesson mode={active} onNavigate={setActive}/>}</main>
 </div>
}
