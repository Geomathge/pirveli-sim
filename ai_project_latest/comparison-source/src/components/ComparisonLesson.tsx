import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, RefreshCw, Sparkles, XCircle } from 'lucide-react';
import { playPop, playRemove, playSuccess } from './SoundEffects';
import { StarBurst } from './StarBurst';

import appleImg from '../assets/comparison/apple.png';
import pearImg from '../assets/comparison/pear.png';
import hippoOpenLeftImg from '../assets/comparison/hippo_open_left.png';

type Side = 'left' | 'right';
type Feedback = 'correct' | 'wrong' | null;

const APPLES = 4;
const PEARS = 2;
const PAIRABLE = Math.min(APPLES, PEARS);

function FruitImage({ src, alt, size = 'normal' }: { src: string; alt: string; size?: 'normal' | 'large' }) {
  const cls = size === 'large' ? 'w-[84px] h-[84px] sm:w-[98px] sm:h-[98px]' : 'w-[62px] h-[62px] sm:w-[74px] sm:h-[74px]';
  return <img src={src} alt={alt} draggable={false} className={`${cls} object-contain select-none`} style={{ imageRendering: 'auto', filter: 'none' }} />;
}

function PairConnector({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="relative w-[80px] sm:w-[94px] h-10 shrink-0 flex items-center justify-center cursor-pointer group" aria-label="დააწყვილე">
      <span className={`absolute w-1 h-9 rounded-full transition-all ${active ? 'bg-emerald-500' : 'bg-slate-200 group-hover:bg-sky-400'}`} />
      <span className={`relative p-1 rounded-full border shadow-sm transition-all ${active ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:text-sky-600 group-hover:border-sky-300'}`}>
        {active ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </span>
    </button>
  );
}

function FruitTile({ src, name, paired, extra, empty }: { src?: string; name: string; paired?: boolean; extra?: boolean; empty?: boolean }) {
  return (
    <div className={`relative w-[80px] h-[80px] sm:w-[94px] sm:h-[94px] rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all ${empty ? 'border-dashed border-slate-100 bg-white' : extra ? 'border-amber-400 bg-amber-50 shadow-sm' : paired ? 'border-emerald-400 bg-emerald-50/60 shadow-sm' : 'border-slate-200 bg-white shadow-sm'}`}>
      {src && <FruitImage src={src} alt={name} />}
      {extra && <span className="absolute -top-2 right-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">დარჩა</span>}
    </div>
  );
}

export function ComparisonLesson() {
  const [paired, setPaired] = useState<number[]>([]);
  const [answer, setAnswer] = useState<Side | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const complete = paired.length === PAIRABLE;

  const pairColumn = (idx: number) => {
    if (paired.includes(idx)) return;
    const next = [...paired, idx];
    setPaired(next);
    playPop();
    if (next.length === PAIRABLE) playSuccess();
  };

  const pairAll = () => {
    setPaired(Array.from({ length: PAIRABLE }, (_, idx) => idx));
    setAnswer(null);
    setFeedback(null);
    playSuccess();
  };

  const reset = () => {
    setPaired([]);
    setAnswer(null);
    setFeedback(null);
    playPop();
  };

  const choose = (side: Side) => {
    if (!complete) return;
    setAnswer(side);
    if (side === 'left') {
      setFeedback('correct');
      playSuccess();
    } else {
      setFeedback('wrong');
      playRemove();
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-5 text-slate-800 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">ვისწავლოთ შედარება, დავითვალოთ</h1>
          <p className="text-sm sm:text-base font-bold text-slate-500 mt-1">ახლა რაოდენობასაც ვითვლით და შედარებას რიცხვებთან ვაკავშირებთ.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-xs font-black text-sm text-slate-700 flex items-center gap-2 cursor-pointer"><RefreshCw className="w-4 h-4 text-sky-500" /> ახალი მაგალითი</button>
          <button type="button" onClick={pairAll} className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 font-black text-sm text-emerald-700 cursor-pointer">✨ დაწყვილება</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px] gap-4 sm:gap-5 items-stretch">
        <section className="rounded-[26px] border-2 border-slate-200 bg-white p-4 sm:p-6 shadow-sm min-w-0">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[610px] flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="w-36 shrink-0 rounded-2xl border-2 border-rose-200 bg-rose-50 px-3 py-3 font-black text-rose-800 flex items-center justify-between">
                  <span>ვაშლი</span><span className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-800 text-lg">4</span>
                </div>
                <div className="flex gap-4 flex-1">
                  {Array.from({ length: APPLES }).map((_, idx) => <FruitTile key={`apple-${idx}`} src={appleImg} name="ვაშლი" paired={idx < PAIRABLE && paired.includes(idx)} extra={idx >= PAIRABLE} />)}
                </div>
              </div>

              <div className="flex items-center gap-4 h-10">
                <div className="w-36 shrink-0" />
                <div className="flex gap-4 flex-1">
                  {Array.from({ length: APPLES }).map((_, idx) => idx < PAIRABLE ? <PairConnector key={`connector-${idx}`} active={paired.includes(idx)} onClick={() => pairColumn(idx)} /> : <div key={`connector-${idx}`} className="w-[80px] sm:w-[94px] h-10 shrink-0" />)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-36 shrink-0 rounded-2xl border-2 border-lime-200 bg-lime-50 px-3 py-3 font-black text-lime-800 flex items-center justify-between">
                  <span>მსხალი</span><span className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-800 text-lg">2</span>
                </div>
                <div className="flex gap-4 flex-1">
                  {Array.from({ length: APPLES }).map((_, idx) => idx < PEARS ? <FruitTile key={`pear-${idx}`} src={pearImg} name="მსხალი" paired={paired.includes(idx)} /> : <FruitTile key={`pear-${idx}`} name="მსხალი" empty />)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600">
            💡 ვაშლი — 4, მსხალი — 2. დაწყვილების შემდეგ ჩანს, რომ 2 ვაშლი დარჩა.
          </div>
        </section>

        <aside className="rounded-[26px] border-2 border-slate-200 bg-white p-4 sm:p-5 shadow-sm relative flex flex-col">
          {feedback === 'correct' && <StarBurst />}
          <div className="flex items-center gap-2 mb-2"><div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center"><HelpCircle className="w-5 h-5" /></div><h3 className="font-black text-slate-800">რომელია მეტი? მონიშნე.</h3></div>
          <p className="text-sm text-slate-500 font-bold mb-2">დავითვალეთ და შევადარეთ.</p>
          <div className="h-32 sm:h-40 flex items-center justify-center my-1">
            <img src={hippoOpenLeftImg} alt="ბეგემოტი" draggable={false} className="h-full max-w-full object-contain" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button type="button" disabled={!complete} onClick={() => choose('left')} className={`rounded-2xl border-2 p-3 bg-white transition-all ${!complete ? 'opacity-45 cursor-not-allowed border-slate-200' : answer === 'left' ? feedback === 'correct' ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200 hover:border-sky-400 cursor-pointer'}`}><FruitImage src={appleImg} alt="ვაშლი" size="large" /><div className="font-black text-slate-800 mt-1">ვაშლი</div><div className="text-sm font-black text-slate-700">4</div></button>
            <button type="button" disabled={!complete} onClick={() => choose('right')} className={`rounded-2xl border-2 p-3 bg-white transition-all ${!complete ? 'opacity-45 cursor-not-allowed border-slate-200' : answer === 'right' ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200 hover:border-sky-400 cursor-pointer'}`}><FruitImage src={pearImg} alt="მსხალი" size="large" /><div className="font-black text-slate-800 mt-1">მსხალი</div><div className="text-sm font-black text-slate-700">2</div></button>
          </div>
          {answer && <div className={`mt-3 rounded-2xl border p-3 text-sm font-black flex items-center gap-2 ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>{feedback === 'correct' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}{feedback === 'correct' ? 'სწორია! 4 ვაშლი მეტია 2 მსხალზე.' : 'კიდევ შეადარე რიცხვები და დარჩენილი საგნები.'}</div>}
        </aside>
      </div>
    </div>
  );
}
