import React, { useState } from 'react';
import { CheckCircle2, RefreshCw, Sparkles, XCircle } from 'lucide-react';
import { CuteBall, CuteFootball } from './CuteAssets';
import { playPop, playRemove, playSuccess } from './SoundEffects';
import { StarBurst } from './StarBurst';

type Side = 'left' | 'right';
type Feedback = 'correct' | 'wrong' | null;

const BASKETBALLS = 4;
const FOOTBALLS = 3;
const PAIRABLE = Math.min(BASKETBALLS, FOOTBALLS);

function PairConnector({ active, onClick }: { key?: React.Key; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[80px] sm:w-[94px] h-10 shrink-0 flex items-center justify-center cursor-pointer group"
      aria-label="დააწყვილე"
    >
      <span className={`absolute w-1 h-9 rounded-full transition-all ${active ? 'bg-emerald-500' : 'bg-slate-200 group-hover:bg-sky-400'}`} />
      <span className={`relative p-1 rounded-full border shadow-sm transition-all ${active ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:text-sky-600 group-hover:border-sky-300'}`}>
        {active ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </span>
    </button>
  );
}

function BallTile({
  kind,
  paired,
  extra,
  empty,
  onClick,
}: {
  key?: React.Key;
  kind?: 'basketball' | 'football';
  paired?: boolean;
  extra?: boolean;
  empty?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`relative w-[80px] h-[80px] sm:w-[94px] sm:h-[94px] rounded-2xl border-2 flex items-center justify-center shrink-0 transition-all ${
        empty
          ? 'border-dashed border-slate-100 bg-white'
          : extra
            ? 'border-amber-400 bg-amber-50 shadow-sm'
            : paired
              ? 'border-emerald-400 bg-emerald-50/60 shadow-sm'
              : 'border-slate-200 bg-white shadow-sm'
      } ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-sky-300 active:scale-95' : 'cursor-default'}`}
      aria-label={
        empty
          ? 'ცარიელი ადგილი'
          : `${kind === 'basketball' ? 'კალათბურთი' : 'ფეხბურთი'} — ${paired ? 'დაწყვილებული' : extra ? 'დარჩენილი' : 'დააწყვილე'}`
      }
    >
      {kind === 'basketball' && <CuteBall className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px]" />}
      {kind === 'football' && <CuteFootball className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px]" />}
      {extra && (
        <span className="absolute -top-2 right-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
          დარჩა
        </span>
      )}
    </button>
  );
}

export function BallComparisonLesson() {
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">ვისწავლოთ შედარება</h1>
          <p className="text-sm sm:text-base font-bold text-slate-500 mt-1">ჯერ დააწყვილე, შემდეგ შეადარე.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-xs font-black text-sm text-slate-700 flex items-center gap-2 cursor-pointer"><RefreshCw className="w-4 h-4 text-sky-500" /> ახალი მაგალითი</button>
          <button type="button" onClick={pairAll} className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 font-black text-sm text-emerald-700 cursor-pointer">✨ დაწყვილება</button>
        </div>
      </div>

      <section className="rounded-[26px] border-2 border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[610px] flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="w-36 shrink-0 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-3 flex items-center gap-2 font-black text-amber-900">
                <CuteBall className="w-9 h-9" />
                <span>კალათბურთი</span>
              </div>
              <div className="flex gap-4 flex-1">
                {Array.from({ length: BASKETBALLS }).map((_, idx) => (
                  <BallTile
                    key={`basketball-${idx}`}
                    kind="basketball"
                    paired={idx < PAIRABLE && paired.includes(idx)}
                    extra={idx >= PAIRABLE}
                    onClick={idx < PAIRABLE && !paired.includes(idx) ? () => pairColumn(idx) : undefined}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 h-10">
              <div className="w-36 shrink-0" />
              <div className="flex gap-4 flex-1">
                {Array.from({ length: BASKETBALLS }).map((_, idx) => idx < PAIRABLE
                  ? <PairConnector key={`connector-${idx}`} active={paired.includes(idx)} onClick={() => pairColumn(idx)} />
                  : <div key={`connector-${idx}`} className="w-[80px] sm:w-[94px] h-10 shrink-0" />)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-36 shrink-0 rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-3 flex items-center gap-2 font-black text-indigo-900">
                <CuteFootball className="w-9 h-9" />
                <span>ფეხბურთი</span>
              </div>
              <div className="flex gap-4 flex-1">
                {Array.from({ length: BASKETBALLS }).map((_, idx) => idx < FOOTBALLS
                  ? (
                    <BallTile
                      key={`football-${idx}`}
                      kind="football"
                      paired={paired.includes(idx)}
                      onClick={!paired.includes(idx) ? () => pairColumn(idx) : undefined}
                    />
                  )
                  : <BallTile key={`football-${idx}`} empty />)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 max-w-3xl mx-auto rounded-[26px] border-2 border-sky-200 bg-[#f8fcff] p-4 sm:p-5 relative">
          {feedback === 'correct' && <StarBurst />}
          <div className="text-center mb-4">
            <span className="inline-flex px-5 py-2 rounded-full bg-white border border-sky-200 font-black text-slate-800">რომელია მეტი? მონიშნე</span>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            <button type="button" disabled={!complete} onClick={() => choose('left')} className={`rounded-2xl border-2 bg-white p-4 transition-all ${!complete ? 'opacity-45 cursor-not-allowed border-slate-200' : answer === 'left' ? feedback === 'correct' ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200 hover:border-sky-400 cursor-pointer'}`}>
              <CuteBall className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
              <div className="mt-2 font-black text-slate-800">კალათბურთი</div>
            </button>
            <button type="button" disabled={!complete} onClick={() => choose('right')} className={`rounded-2xl border-2 bg-white p-4 transition-all ${!complete ? 'opacity-45 cursor-not-allowed border-slate-200' : answer === 'right' ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200 hover:border-sky-400 cursor-pointer'}`}>
              <CuteFootball className="w-20 h-20 sm:w-24 sm:h-24 mx-auto" />
              <div className="mt-2 font-black text-slate-800">ფეხბურთი</div>
            </button>
          </div>
          {answer && <div className={`mt-4 max-w-xl mx-auto rounded-2xl border p-3 text-sm font-black flex items-center gap-2 ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>{feedback === 'correct' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}{feedback === 'correct' ? 'სწორია! ერთ ჯგუფში დაუწყვილებელი ბურთი დარჩა.' : 'კიდევ დააკვირდი, რომელ მხარეს დარჩა ბურთი.'}</div>}
        </div>
      </section>
    </div>
  );
}
