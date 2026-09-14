import React from 'react';
import { createRoot } from 'react-dom/client';
import { ComparisonLesson } from './components/ComparisonLesson';
import { setMuteState } from './components/SoundEffects';
import './comparison.css';

setMuteState(new URLSearchParams(location.search).get('muted') === 'true');

window.addEventListener('message', (event) => {
  if (
    event.source === parent &&
    event.origin === location.origin &&
    event.data?.type === 'comparison-mute'
  ) {
    setMuteState(event.data.muted);
  }
});

createRoot(document.getElementById('root')!).render(<ComparisonLesson />);

new ResizeObserver(() => {
  const root = document.getElementById('root')!;
  parent.postMessage(
    { type: 'comparison-height', height: root.scrollHeight },
    location.origin
  );
}).observe(document.getElementById('root')!);
