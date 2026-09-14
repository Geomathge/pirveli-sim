/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let isMuted = false;

// Attempt to restore mute setting from localStorage
try {
  const saved = localStorage.getItem('math_play_muted');
  if (saved !== null) {
    isMuted = JSON.parse(saved);
  }
} catch (e) {
  // Ignore localStorage issues
}

export function getMuteState(): boolean {
  return isMuted;
}

export function setMuteState(muted: boolean): void {
  isMuted = muted;
  try {
    localStorage.setItem('math_play_muted', JSON.stringify(muted));
  } catch (e) {
    // Ignore
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  return new AudioContextClass();
}

/**
 * Cute bubble-like pop for adding items (ascending frequency sweep)
 */
export function playPop(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  // Fast frequency sweep up
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  osc.start(now);
  osc.stop(now + 0.08);
}

/**
 * Lower-pitched bubble for deleting/removing items
 */
export function playRemove(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  // Frequency sweep down
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Ascending happy arpeggio for victory/correct answers
 */
export function playSuccess(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
  
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    const noteStart = now + idx * 0.08;
    
    osc.frequency.setValueAtTime(freq, noteStart);
    gain.gain.setValueAtTime(0.12, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.3);
    
    osc.start(noteStart);
    osc.stop(noteStart + 0.3);
  });
}

/**
 * Friendly soft warning/wrong-answer sound (disappointment chord, dual pitch)
 */
export function playError(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Custom simple chord (soft low tones)
  const freqs = [196.00, 185.00]; // G3 and F#3 (slightly dissonant but gentle)
  freqs.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sawtooth';
    // Lowpass filter to make it cozy rather than harsh
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    
    osc.disconnect(gain);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
    
    osc.start(now);
    osc.stop(now + 0.25);
  });
}

/**
 * Delightful two-note chime for pairing items
 */
export function playPair(): void {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [659.25, 1046.50]; // E5 -> C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    const noteStart = now + idx * 0.09;
    osc.frequency.setValueAtTime(freq, noteStart);
    gain.gain.setValueAtTime(0.14, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);
    osc.start(noteStart);
    osc.stop(noteStart + 0.35);
  });
}
