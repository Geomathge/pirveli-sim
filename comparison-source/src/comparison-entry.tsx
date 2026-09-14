import React from 'react';
import {createRoot} from 'react-dom/client';
import {ActivityFour} from './components/ActivityFour';
import {setMuteState} from './components/SoundEffects';
import './comparison.css';
setMuteState(new URLSearchParams(location.search).get('muted') === 'true');
window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='comparison-mute')setMuteState(e.data.muted)});
createRoot(document.getElementById('root')!).render(<ActivityFour/>);
new ResizeObserver(()=>{const root=document.getElementById('root')!;parent.postMessage({type:'comparison-height',height:root.scrollHeight},location.origin)}).observe(document.getElementById('root')!);
