/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, RefreshCw, Star, ArrowRight, Download, Sparkles, CheckCircle2, MousePointerClick, XCircle } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { playPop, playRemove, playSuccess } from './SoundEffects';
import { CuteCat, CuteBall, CuteStick, CuteCircle, CuteCube, CuteFootball } from './CuteAssets';
import { ItemType } from '../types';
import { StarBurst } from './StarBurst';
import { ActivitySorting } from './ActivitySorting';

// Pre-defined non-overlapping scattered positions spaced generously to prevent overlap completely
const SCATTERED_COORDINATES = [
  // Row 1 (top, fully spread out)
  { left: '14%', top: '18%' },
  { left: '38%', top: '20%' },
  { left: '62%', top: '17%' },
  { left: '85%', top: '22%' },

  // Row 2 (middle height, fully spread out)
  { left: '16%', top: '48%' },
  { left: '40%', top: '45%' },
  { left: '64%', top: '50%' },
  { left: '83%', top: '46%' },

  // Row 3 (lower part, avoiding controls in the bottom-right corner)
  { left: '15%', top: '78%' },
  { left: '38%', top: '81%' },
  { left: '60%', top: '76%' },
  { left: '78%', top: '74%' }
];

interface ComparisonItem {
  id: string;
  coordIndex: number;
}

export function ActivityFour() {
  const [mode, setMode] = useState<'pair' | 'sort' | 'count'>('pair');
  const [selectedType, setSelectedType] = useState<ItemType>('kitty');

  // PAIRING MODE & UPPER GRID COUNTING STATE ("შედარება დაწყვილებით")
  const [pairBasketballCount, setPairBasketballCount] = useState<number>(4);
  const [pairFootballCount, setPairFootballCount] = useState<number>(3);
  const [pairedColumns, setPairedColumns] = useState<number[]>([]);

  // 3 Formula boxes state removed in favor of "რომელია მეტი? მონიშნე"
  const [selectedMore, setSelectedMore] = useState<'basketball' | 'football' | 'equal' | null>(null);

  // UPPER GRID COUNTING STATE ("რამდენია? (7)")
  const gridTotalCount = 7;
  const [gridCounts, setGridCounts] = useState<(number | null)[]>(() => Array(7).fill(null));

  const resetPairingState = (bCount = 4, fCount = 3) => {
    setPairBasketballCount(bCount);
    setPairFootballCount(fCount);
    setPairedColumns([]);
    setSelectedMore(null);
  };

  const handleSelectMore = (choice: 'basketball' | 'football' | 'equal') => {
    setSelectedMore(choice);
    const correct = pairBasketballCount > pairFootballCount
      ? 'basketball'
      : pairFootballCount > pairBasketballCount
        ? 'football'
        : 'equal';
    if (choice === correct) {
      playSuccess();
    } else {
      playRemove();
    }
  };

  const handleRandomPairingExample = () => {
    let b = Math.floor(Math.random() * 5) + 2; // 2 to 6
    let f = Math.floor(Math.random() * 5) + 2; // 2 to 6
    if (b === pairBasketballCount && f === pairFootballCount) {
      b = (b % 5) + 2;
    }
    resetPairingState(b, f);
    playPop();
  };

  const handleGridItemClick = (idx: number) => {
    if (gridCounts[idx] !== null) return;
    const currentFilled = gridCounts.filter(x => x !== null).length;
    const nextVal = currentFilled + 1;
    const updated = [...gridCounts];
    updated[idx] = nextVal;
    setGridCounts(updated);
    playPop();
    if (nextVal === gridTotalCount) {
      playSuccess();
    }
  };

  const resetGridCounts = () => {
    setGridCounts(Array(7).fill(null));
    playPop();
  };

  const handleColumnPairClick = (colIdx: number, maxPairable: number) => {
    if (colIdx >= maxPairable) return;
    if (pairedColumns.includes(colIdx)) return;
    const updated = [...pairedColumns, colIdx];
    setPairedColumns(updated);
    playPop();
    if (updated.length === maxPairable) {
      playSuccess();
    }
  };

  const handlePairAll = (maxPairable: number) => {
    const all = Array.from({ length: maxPairable }, (_, i) => i);
    setPairedColumns(all);
    playSuccess();
  };

  const diagramRef = useRef<HTMLDivElement>(null);

  const handleDownloadJpg = () => {
    if (diagramRef.current === null) return;
    const node = diagramRef.current;
    
    const width = node.scrollWidth || node.offsetWidth;
    const height = node.scrollHeight || node.offsetHeight;

    const paddingVal = 24; // 1.5rem = 24px
    const options = {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#f8fafc',
      width: width + paddingVal * 2,
      height: height + paddingVal * 2,
      style: {
        transform: 'none',
        width: `${width}px`,
        height: `${height}px`,
        margin: '0',
        padding: `${paddingVal}px`,
        boxSizing: 'content-box' as const,
        borderRadius: '1.5rem'
      }
    };

    toJpeg(node, options)
      .then(() => toJpeg(node, options))
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `comparison-diagram-${Date.now()}.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  };

  // MODE 1 - COUNT & COMPARE STATE
  const [countLeft, setCountLeft] = useState<number>(4);
  const [countRight, setCountRight] = useState<number>(3);
  const [countLeftItems, setCountLeftItems] = useState<ComparisonItem[]>([]);
  const [countRightItems, setCountRightItems] = useState<ComparisonItem[]>([]);

  // Stable random pool of coordinate indexes for the current challenge session to keep positions completely stable
  const [leftIndices, setLeftIndices] = useState<number[]>(() =>
    Array.from({ length: SCATTERED_COORDINATES.length }, (_, i) => i).sort(() => Math.random() - 0.5)
  );
  const [rightIndices, setRightIndices] = useState<number[]>(() =>
    Array.from({ length: SCATTERED_COORDINATES.length }, (_, i) => i).sort(() => Math.random() - 0.5)
  );

  // Sign Selection and Evaluation
  const [userLeftNum, setUserLeftNum] = useState<string>('');
  const [userRightNum, setUserRightNum] = useState<string>('');
  const [userSign, setUserSign] = useState<'<' | '>' | '=' | null>(null);
  const [activePopover, setActivePopover] = useState<'left' | 'right' | 'sign' | null>(null);

  const [selectedSign, setSelectedSign] = useState<'<' | '>' | '=' | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const startNewChallenge = () => {
    setSelectedSign(null);
    setUserLeftNum('');
    setUserRightNum('');
    setUserSign(null);
    setActivePopover(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setErrorMessage('');

    const newLeftIndices = Array.from({ length: SCATTERED_COORDINATES.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    const newRightIndices = Array.from({ length: SCATTERED_COORDINATES.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    setLeftIndices(newLeftIndices);
    setRightIndices(newRightIndices);

    const left = Math.floor(Math.random() * 8) + 1; // Random 1-8
    let right = Math.floor(Math.random() * 8) + 1;
    while (right === left && Math.random() > 0.35) {
      right = Math.floor(Math.random() * 8) + 1;
    }
    setCountLeft(left);
    setCountRight(right);
    setCountLeftItems(Array.from({ length: left }, (_, i) => ({
      id: `count-left-${i}`,
      coordIndex: newLeftIndices[i % newLeftIndices.length]
    })));
    setCountRightItems(Array.from({ length: right }, (_, i) => ({
      id: `count-right-${i}`,
      coordIndex: newRightIndices[i % newRightIndices.length]
    })));
  };

  // Sync challenge on load or mode change
  useEffect(() => {
    if (mode === 'count') {
      startNewChallenge();
    }
  }, [mode]);

  // Auto-advance to next challenge on correct answer
  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        startNewChallenge();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  // Auto-evaluation when child provides left number, right number, and sign
  useEffect(() => {
    if (isCorrect || mode !== 'count') return;

    if (!userLeftNum || !userRightNum || !userSign) {
      setShowFeedback(false);
      setErrorMessage('');
      return;
    }

    const targetLeft = countLeft;
    const targetRight = countRight;
    const targetSign = targetLeft > targetRight ? '>' : targetLeft < targetRight ? '<' : '=';

    const userLeftParsed = parseInt(userLeftNum, 10);
    const userRightParsed = parseInt(userRightNum, 10);

    const leftMatch = userLeftParsed === targetLeft;
    const rightMatch = userRightParsed === targetRight;
    const signMatch = userSign === targetSign;

    if (leftMatch && rightMatch && signMatch) {
      setIsCorrect(true);
      setSelectedSign(userSign);
      setShowFeedback(true);
      playSuccess();
      setErrorMessage('');
      setTimeout(() => {
        startNewChallenge();
      }, 1400);
    } else {
      setIsCorrect(false);
      setSelectedSign(userSign);
      setShowFeedback(true);
      playRemove();
      if (!leftMatch && !rightMatch) {
        setErrorMessage('შეამოწმე მარცხენა და მარჯვენა რიცხვები! 🧐');
      } else if (!leftMatch) {
        setErrorMessage('შეამოწმე მარცხენა რიცხვი! 🧐');
      } else if (!rightMatch) {
        setErrorMessage('შეამოწმე მარჯვენა რიცხვი! 🧐');
      } else if (!signMatch) {
        setErrorMessage('შეამოწმე ნიშანი! (> = <)');
      }
    }
  }, [userLeftNum, userRightNum, userSign, mode, countLeft, countRight, isCorrect]);

  // Evaluate the answer when child clicks on <, =, > in the middle
  const handleSignClick = (sign: '<' | '>' | '=') => {
    if (isCorrect) return;
    setUserSign(sign);
    setSelectedSign(sign);
    setActivePopover(null);
  };

  return (
    <div id="activity-four-root" className="w-full flex flex-col items-center select-none">
      
      {/* Top Header Bar with Rubric Badge aligned to the left */}
      {mode !== 'sort' && (
        <div className="w-full max-w-5xl flex items-center justify-start px-4 mb-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200/80 shadow-2xs">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>ვისწავლოთ ერთად</span>
          </div>
        </div>
      )}

      {/* Top Toggle Panel (Georgian labels) */}
      <div className="flex gap-2 sm:gap-3 p-1.5 bg-sky-100/50 rounded-2xl border border-sky-200 shadow-xs mb-6">
        <button
          onClick={() => { setMode('pair'); playPop(); }}
          className={`px-3.5 sm:px-6 py-2.5 rounded-xl font-black transition-all cursor-pointer text-xs sm:text-base flex items-center gap-1.5 ${
            mode === 'pair'
              ? 'bg-white shadow-sm text-sky-700 border border-sky-100'
              : 'text-sky-650 hover:bg-white/40'
          }`}
          title="დაწყვილება"
        >
          <span>🔗</span>
          <span>დაწყვილება</span>
        </button>
        <button
          onClick={() => { setMode('sort'); playPop(); }}
          className={`px-3.5 sm:px-6 py-2.5 rounded-xl font-black transition-all cursor-pointer text-xs sm:text-base flex items-center gap-1.5 ${
            mode === 'sort'
              ? 'bg-white shadow-sm text-sky-700 border border-sky-100'
              : 'text-sky-650 hover:bg-white/40'
          }`}
          title="სამუშაო ფურცელი"
        >
          <span>🎨</span>
          <span>სამუშაო ფურცელი</span>
        </button>
        <button
          onClick={() => { setMode('count'); playPop(); }}
          className={`px-3.5 sm:px-6 py-2.5 rounded-xl font-black transition-all cursor-pointer text-xs sm:text-base flex items-center gap-1.5 ${
            mode === 'count'
              ? 'bg-white shadow-sm text-sky-700 border border-sky-100'
              : 'text-sky-650 hover:bg-white/40'
          }`}
          title="დათვლა და შედარება"
        >
          <span>&gt; = &lt;</span>
          <span>დათვლა</span>
        </button>
      </div>

      {/* Toy Item Selection Box + Refresh Button side-by-side (Only for count mode) */}
      {mode === 'count' && (
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-8 bg-white/70 px-5 py-3 rounded-2xl border-2 border-white shadow-xs">
          <span className="text-slate-500 font-bold text-sm">სათამაშო:</span>
          <div className="flex gap-2.5 sm:gap-4 items-center">
            <button
              onClick={() => { setSelectedType('kitty'); playPop(); }}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                selectedType === 'kitty'
                  ? 'bg-pink-50 border-pink-200 text-pink-600 scale-105 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <CuteCat className="w-8 h-8" />
            </button>

            <button
              onClick={() => { setSelectedType('ball'); playPop(); }}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                selectedType === 'ball'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 scale-105 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <CuteBall className="w-8 h-8" />
            </button>

            <button
              onClick={() => { setSelectedType('stick'); playPop(); }}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                selectedType === 'stick'
                  ? 'bg-amber-50 border-amber-200 text-amber-600 scale-105 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <CuteStick className="w-8 h-8" />
            </button>

            <button
              onClick={() => { setSelectedType('circle'); playPop(); }}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                selectedType === 'circle'
                  ? 'bg-sky-50 border-sky-200 text-sky-600 scale-105 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <CuteCircle className="w-8 h-8" />
            </button>

            <button
              onClick={() => { setSelectedType('cube'); playPop(); }}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                selectedType === 'cube'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 scale-105 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 opacity-60'
              }`}
              title="კუბიკი"
            >
              <CuteCube className="w-8 h-8" />
            </button>
          </div>

          <div className="w-px h-8 bg-slate-200 hidden sm:block" />

          <motion.button
            id="btn-random-comparison-target"
            onClick={startNewChallenge}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 shadow-2xs flex items-center justify-center cursor-pointer transition-all"
            title="ახალი მაგალითი"
          >
            <RefreshCw className="w-6 h-6 stroke-[2.5px] text-sky-500 animate-spin-slow" />
          </motion.button>
        </div>
      )}

      {/* Main Diagram Area */}
      {mode === 'sort' ? (
        <ActivitySorting />
      ) : (
        <div ref={diagramRef} className="w-full max-w-5xl flex flex-col items-center">
        {mode === 'pair' ? (
          /* PAIRING & HORIZONTAL ROW COMPARISON VIEW */
          <div className="w-full max-w-5xl flex flex-col gap-6 animate-fade-in">
            {/* SECTION: Horizontal Row Pairing Panel */}
            <div className="bg-white/95 border-2 border-sky-200/90 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col items-center">
              
              {/* Action Toolbar */}
              <div className="w-full flex items-center justify-end gap-2 mb-4 pb-2 border-b border-sky-100">
                <button
                  onClick={handleRandomPairingExample}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer transition-all shadow-2xs flex items-center gap-1.5"
                  title="ახალი მაგალითი"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
                  <span>ახალი მაგალითი</span>
                </button>
                <button
                  onClick={() => handlePairAll(Math.min(pairBasketballCount, pairFootballCount))}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer transition-all shadow-2xs"
                >
                  ✨ დაწყვილება
                </button>
              </div>

              {/* Row Layout Container */}
              <div className="w-full flex flex-col items-start gap-3 overflow-x-auto pb-4 pt-2">
                
                {/* TOP ROW: Basketballs */}
                <div className="w-full flex items-center gap-3 sm:gap-4 min-w-[540px]">
                  <div
                    onClick={() => handleSelectMore('basketball')}
                    className={`w-32 sm:w-36 shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none ${
                      selectedMore === 'basketball'
                        ? pairBasketballCount > pairFootballCount
                          ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 shadow-xs'
                          : 'bg-rose-100 border-rose-400 ring-2 ring-rose-200'
                        : 'bg-amber-50 hover:bg-amber-100/80 border-amber-200'
                    }`}
                    title="მონიშნე კალათბურთი"
                  >
                    <CuteBall className="w-6 h-6 shrink-0" />
                    <span className="font-black text-xs sm:text-sm text-amber-900">
                      კალათბურთი
                    </span>
                    <MousePointerClick className="w-3.5 h-3.5 text-amber-600 ml-auto opacity-70 shrink-0" />
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 flex-1">
                    {Array.from({ length: Math.max(pairBasketballCount, pairFootballCount) }).map((_, colIdx) => {
                      const hasBasketball = colIdx < pairBasketballCount;
                      const isPaired = pairedColumns.includes(colIdx);
                      const maxPairable = Math.min(pairBasketballCount, pairFootballCount);
                      const isExtra = colIdx >= maxPairable && colIdx < pairBasketballCount;

                      if (!hasBasketball) {
                        return (
                          <div key={colIdx} className="w-16 sm:w-20 h-16 sm:h-20 shrink-0 opacity-20 border-2 border-dashed border-slate-200 rounded-2xl" />
                        );
                      }

                      return (
                        <div key={colIdx} className="relative flex flex-col items-center">
                          <motion.div
                            onClick={() => handleColumnPairClick(colIdx, maxPairable)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center cursor-pointer transition-all border-2 ${
                              isExtra
                                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200/80 shadow-xs'
                                : isPaired
                                  ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-2 ring-emerald-200/60'
                                  : 'bg-white hover:bg-amber-50/50 border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <CuteBall className="w-12 h-12 sm:w-14 sm:h-14" />
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* MIDDLE VERTICAL PAIRING LINES ZONE */}
                <div className="w-full flex items-center gap-3 sm:gap-4 min-w-[540px] h-12">
                  <div className="w-32 sm:w-36 shrink-0" />

                  <div className="flex items-center gap-4 sm:gap-6 flex-1">
                    {Array.from({ length: Math.max(pairBasketballCount, pairFootballCount) }).map((_, colIdx) => {
                      const maxPairable = Math.min(pairBasketballCount, pairFootballCount);
                      const canPair = colIdx < maxPairable;
                      const isPaired = pairedColumns.includes(colIdx);

                      return (
                        <div key={colIdx} className="w-16 sm:w-20 flex justify-center items-center h-full relative">
                          {canPair ? (
                            <div
                              onClick={() => handleColumnPairClick(colIdx, maxPairable)}
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer group"
                            >
                              <div className={`transition-all ${
                                isPaired
                                  ? 'bg-emerald-500 w-1 h-full shadow-sm'
                                  : 'w-0.5 h-full bg-slate-300 group-hover:bg-sky-400 border-dashed border-l-2 border-slate-300'
                              }`} />

                              <div className={`absolute p-1 rounded-full border shadow-2xs transition-all ${
                                isPaired
                                  ? 'bg-emerald-500 text-white border-white scale-110'
                                  : 'bg-white text-slate-400 group-hover:text-sky-500 group-hover:border-sky-300 border-slate-200'
                              }`}>
                                <Sparkles className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM ROW: Footballs */}
                <div className="w-full flex items-center gap-3 sm:gap-4 min-w-[540px]">
                  <div
                    onClick={() => handleSelectMore('football')}
                    className={`w-32 sm:w-36 shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none ${
                      selectedMore === 'football'
                        ? pairFootballCount > pairBasketballCount
                          ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 shadow-xs'
                          : 'bg-rose-100 border-rose-400 ring-2 ring-rose-200'
                        : 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200'
                    }`}
                    title="მონიშნე ფეხბურთი"
                  >
                    <CuteFootball className="w-6 h-6 shrink-0" />
                    <span className="font-black text-xs sm:text-sm text-indigo-900">
                      ფეხბურთი
                    </span>
                    <MousePointerClick className="w-3.5 h-3.5 text-indigo-600 ml-auto opacity-70 shrink-0" />
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 flex-1">
                    {Array.from({ length: Math.max(pairBasketballCount, pairFootballCount) }).map((_, colIdx) => {
                      const hasFootball = colIdx < pairFootballCount;
                      const isPaired = pairedColumns.includes(colIdx);
                      const maxPairable = Math.min(pairBasketballCount, pairFootballCount);
                      const isExtra = colIdx >= maxPairable && colIdx < pairFootballCount;

                      if (!hasFootball) {
                        return (
                          <div key={colIdx} className="w-16 sm:w-20 h-16 sm:h-20 shrink-0 opacity-20 border-2 border-dashed border-slate-200 rounded-2xl" />
                        );
                      }

                      return (
                        <div key={colIdx} className="relative flex flex-col items-center">
                          <motion.div
                            onClick={() => handleColumnPairClick(colIdx, maxPairable)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center cursor-pointer transition-all border-2 ${
                              isExtra
                                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200/80 shadow-xs'
                                : isPaired
                                  ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-2 ring-emerald-200/60'
                                  : 'bg-white hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300'
                            }`}
                          >
                            <CuteFootball className="w-12 h-12 sm:w-14 sm:h-14" />
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* "რომელია მეტი? მონიშნე" SELECTION PANEL */}
              {(() => {
                const correctMore: 'basketball' | 'football' | 'equal' =
                  pairBasketballCount > pairFootballCount
                    ? 'basketball'
                    : pairFootballCount > pairBasketballCount
                      ? 'football'
                      : 'equal';

                const isCorrect = selectedMore === correctMore;

                return (
                  <div className="w-full max-w-xl bg-gradient-to-b from-sky-50/80 to-blue-50/50 border-2 border-sky-200 rounded-3xl p-4 sm:p-5 flex flex-col items-center gap-3.5 mt-4 shadow-xs relative">
                    {/* Starburst on correct celebration */}
                    {selectedMore && isCorrect && <StarBurst />}

                    {/* Header with mouse pointer icon */}
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-sky-200 shadow-2xs">
                      <MousePointerClick className="w-5 h-5 text-sky-600 stroke-[2.5px] animate-bounce" />
                      <h3 className="text-sm sm:text-base font-black text-slate-800">
                        რომელია მეტი? მონიშნე
                      </h3>
                    </div>

                    {/* Choice Buttons */}
                    <div className={`grid ${pairBasketballCount === pairFootballCount ? 'grid-cols-3' : 'grid-cols-2'} gap-3 sm:gap-4 w-full max-w-md`}>
                      {/* Basketball Option */}
                      <button
                        type="button"
                        onClick={() => handleSelectMore('basketball')}
                        className={`relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                          selectedMore === 'basketball'
                            ? correctMore === 'basketball'
                              ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200/80 scale-105'
                              : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200/80'
                            : 'bg-white hover:bg-amber-50/70 border-slate-200 hover:border-amber-400 hover:scale-102'
                        }`}
                      >
                        <div className="relative">
                          <CuteBall className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xs" />
                          {selectedMore === 'basketball' && (
                            <div className="absolute -top-1 -right-1">
                              {correctMore === 'basketball' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white rounded-full fill-white" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-500 bg-white rounded-full fill-white" />
                              )}
                            </div>
                          )}
                        </div>
                        <span className="font-black text-xs sm:text-sm text-slate-800">
                          კალათბურთი
                        </span>
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full">
                          {pairBasketballCount} ბურთი
                        </span>
                      </button>

                      {/* Football Option */}
                      <button
                        type="button"
                        onClick={() => handleSelectMore('football')}
                        className={`relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                          selectedMore === 'football'
                            ? correctMore === 'football'
                              ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200/80 scale-105'
                              : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200/80'
                            : 'bg-white hover:bg-indigo-50/70 border-slate-200 hover:border-indigo-400 hover:scale-102'
                        }`}
                      >
                        <div className="relative">
                          <CuteFootball className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xs" />
                          {selectedMore === 'football' && (
                            <div className="absolute -top-1 -right-1">
                              {correctMore === 'football' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white rounded-full fill-white" />
                              ) : (
                                <XCircle className="w-5 h-5 text-rose-500 bg-white rounded-full fill-white" />
                              )}
                            </div>
                          )}
                        </div>
                        <span className="font-black text-xs sm:text-sm text-slate-800">
                          ფეხბურთი
                        </span>
                        <span className="text-[11px] font-bold text-indigo-900 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                          {pairFootballCount} ბურთი
                        </span>
                      </button>

                      {/* Equal Option (when equal) */}
                      {pairBasketballCount === pairFootballCount && (
                        <button
                          type="button"
                          onClick={() => handleSelectMore('equal')}
                          className={`relative flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                            selectedMore === 'equal'
                              ? correctMore === 'equal'
                                ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200/80 scale-105'
                                : 'bg-rose-50 border-rose-400 ring-4 ring-rose-200/80'
                              : 'bg-white hover:bg-sky-50/70 border-slate-200 hover:border-sky-400 hover:scale-102'
                          }`}
                        >
                          <span className="text-3xl sm:text-4xl">⚖️</span>
                          <span className="font-black text-xs sm:text-sm text-slate-800">
                            იმდენივეა
                          </span>
                          <span className="text-[11px] font-bold text-sky-900 bg-sky-100/70 px-2 py-0.5 rounded-full">
                            ტოლია
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Result feedback */}
                    {selectedMore !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`w-full max-w-md p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                          isCorrect
                            ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900 shadow-xs'
                            : 'bg-rose-100/90 border-rose-300 text-rose-900 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              <div className="text-xs sm:text-sm font-black">
                                {correctMore === 'basketball' && `ყოჩაღ! 🎉 კალათბურთის ბურთები მეტია (${pairBasketballCount} > ${pairFootballCount})`}
                                {correctMore === 'football' && `ყოჩაღ! 🎉 ფეხბურთის ბურთები მეტია (${pairFootballCount} > ${pairBasketballCount})`}
                                {correctMore === 'equal' && `ყოჩაღ! 🎉 ორივე ჯგუფში იმდენივეა (${pairBasketballCount} = ${pairFootballCount})`}
                              </div>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                              <div className="text-xs sm:text-sm font-black">
                                სცადე კიდევ! დააკვირდი, რომელ ჯგუფს დარჩა დაუწყვილებელი ბურთი.
                              </div>
                            </>
                          )}
                        </div>

                        {isCorrect && (
                          <button
                            type="button"
                            onClick={handleRandomPairingExample}
                            className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>შემდეგი</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })()}

            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Main Sandbox comparison Grid */}
            <div className="w-full max-w-5xl grid grid-cols-5 gap-1 md:gap-4 items-center justify-center px-1 xs:px-4">
        
        {/* LEFT COMPONENT */}
        <div className="col-span-2 flex flex-col w-full h-full justify-between animate-fade-in">
          
          {/* Label Header */}
          <div className="text-center font-black text-slate-700 text-[10px] sm:text-xs md:text-sm tracking-wide py-1.5 md:py-2.5 bg-pink-50/60 rounded-xl mb-2.5 border border-pink-100/40 select-none">
            მარცხნივ
          </div>

          {/* BOX */}
          <div className="bg-gradient-to-br from-pink-50/75 via-rose-50/50 to-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-pink-100 shadow-sm md:shadow-md p-2 md:p-4 h-[150px] xs:h-[195px] md:h-[270px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#fdf2f8_1px,transparent_1px),linear-gradient(to_bottom,#fdf2f8_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] md:bg-[size:2rem_2rem] opacity-30" />

            {/* Display Zones */}
            <div className="absolute inset-0 w-full h-full z-10">
              <AnimatePresence>
                {countLeftItems.map((item) => {
                  const coord = SCATTERED_COORDINATES[item.coordIndex % SCATTERED_COORDINATES.length];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, opacity: 0, x: '-50%', y: '-100%' }}
                      animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                      exit={{ scale: 0, opacity: 0, x: '-50%', y: '10%' }}
                      style={{
                        position: 'absolute',
                        left: coord.left,
                        top: coord.top,
                      }}
                      className="w-9 h-9 xs:w-11 xs:h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white shadow-2xs flex items-center justify-center border border-pink-100/60"
                    >
                      {selectedType === 'kitty' ? (
                        <CuteCat className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : selectedType === 'ball' ? (
                        <CuteBall className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : selectedType === 'stick' ? (
                        <CuteStick className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : selectedType === 'cube' ? (
                        <CuteCube className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : (
                        <CuteCircle className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {countLeft === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate-300 font-bold text-[10px] md:text-sm">ცარიელია</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* MIDDLE SECTION - Greater, Equal, Less Interactive Buttons (შუაში იყოს ნიშნები) */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2 md:gap-4 py-2 md:py-4 h-full">
            <span className="text-[9px] md:text-xs font-black text-slate-400 tracking-wide text-center uppercase mb-0.5 select-none leading-none">
              აირჩიე<br className="md:hidden" /> ნიშანი
            </span>
            {(['>', '=', '<'] as const).map((sign) => {
              const isSelected = selectedSign === sign;
              let btnStyle = "bg-white border-slate-100 text-sky-600 shadow-2xs text-slate-600 hover:bg-slate-50 hover:scale-105 border md:border-2";
              
              if (isSelected) {
                btnStyle = isCorrect
                  ? "bg-emerald-500 border-emerald-600 text-white shadow-xs md:shadow-md border md:border-2"
                  : "bg-rose-500 border-rose-600 text-white shadow-xs md:shadow-md border md:border-2";
              }

              return (
                <motion.button
                  key={sign}
                  onClick={() => handleSignClick(sign)}
                  disabled={isCorrect}
                  whileHover={{ scale: isCorrect ? 1 : 1.1 }}
                  whileTap={{ scale: isCorrect ? 1 : 0.95 }}
                  className={`relative w-9 h-9 xs:w-12 xs:h-12 md:w-16 md:h-16 rounded-full text-lg xs:text-2xl md:text-3.5xl font-sans font-black flex items-center justify-center cursor-pointer transition-all ${btnStyle} ${isCorrect && !isSelected ? "opacity-30" : ""}`}
                >
                  {isSelected && isCorrect && (
                    <>
                      <StarBurst />
                      <span className="absolute -top-2 -right-2 text-xl animate-bounce pointer-events-none">⭐</span>
                      <span className="absolute -bottom-2 -left-2 text-xl animate-bounce pointer-events-none">🎉</span>
                    </>
                  )}
                  {sign}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COMPONENT */}
        <div className="col-span-2 flex flex-col w-full h-full justify-between animate-fade-in">
          
          {/* Label Header */}
          <div className="text-center font-black text-slate-700 text-[10px] sm:text-xs md:text-sm tracking-wide py-1.5 md:py-2.5 bg-amber-50/60 rounded-xl mb-2.5 border border-amber-100/40 select-none">
            მარჯვნივ
          </div>

          {/* BOX */}
          <div className="bg-gradient-to-br from-amber-50/75 via-amber-100/40 to-white rounded-2xl md:rounded-3xl border-2 md:border-4 border-amber-500 shadow-sm md:shadow-md p-2 md:p-4 h-[150px] xs:h-[195px] md:h-[270px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#fef3c7_1.5px,transparent_1.5px),linear-gradient(to_bottom,#fef3c7_1.5px,transparent_1.5px)] bg-[size:1.5rem_1.5rem] md:bg-[size:2rem_2rem] opacity-30" />

            {/* Display Zones */}
            <div className="absolute inset-0 w-full h-full z-10">
              <AnimatePresence>
                {countRightItems.map((item) => {
                  const coord = SCATTERED_COORDINATES[item.coordIndex % SCATTERED_COORDINATES.length];
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0, opacity: 0, x: '-50%', y: '-100%' }}
                      animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                      exit={{ scale: 0, opacity: 0, x: '-50%', y: '10%' }}
                      style={{
                        position: 'absolute',
                        left: coord.left,
                        top: coord.top,
                      }}
                      className="w-9 h-9 xs:w-11 xs:h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-white shadow-2xs flex items-center justify-center border border-amber-100"
                    >
                      {selectedType === 'kitty' ? (
                        <CuteCat className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : selectedType === 'ball' ? (
                        <CuteBall className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : selectedType === 'stick' ? (
                        <CuteStick className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : selectedType === 'cube' ? (
                        <CuteCube className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      ) : (
                        <CuteCircle className="w-7 h-7 xs:w-9 xs:h-9 md:w-11 md:h-11" />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {countRight === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate-300 font-bold text-[10px] md:text-sm">ცარიელია</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Click outside overlay to dismiss popover */}
      {activePopover !== null && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActivePopover(null)}
        />
      )}

      {/* EQUATION ZONE UNDER RECTANGLES (რიცხვები მართკუთხედის დაბლა, მათ შორის ნიშანი) */}
      <div id="equation-display-zone" className="w-full max-w-2xl flex justify-center items-center gap-4 md:gap-12 mt-10 mb-2 select-none relative z-40">
        
        {/* Left Side Number Under Left Box */}
        <div className="relative flex flex-col items-center">
          {/* Keypad Popover for Left Box */}
          <AnimatePresence>
            {activePopover === 'left' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                className="absolute top-full mt-2.5 z-50 bg-white border-3 border-pink-300 rounded-2xl shadow-xl p-2.5 w-56 md:w-64 flex flex-col items-center gap-2"
              >
                <div className="w-full flex justify-between items-center px-1">
                  <span className="font-black text-pink-500 text-xs md:text-sm tracking-wider uppercase">
                    აირჩიე ციფრი
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePopover(null); }}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 w-full">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                    <button
                      key={digit}
                      onClick={(e) => {
                        e.stopPropagation();
                        playPop();
                        setUserLeftNum(prev => (prev.length >= 2 ? digit : (prev === '0' ? digit : prev + digit)));
                      }}
                      className="h-9 md:h-10 rounded-xl bg-slate-50 hover:bg-pink-100 hover:text-pink-700 active:scale-95 font-black text-lg md:text-xl text-slate-700 border border-slate-200/80 cursor-pointer transition-all flex items-center justify-center"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5 w-full pt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playRemove();
                      setUserLeftNum(prev => prev.slice(0, -1));
                    }}
                    className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200/80 cursor-pointer transition-all"
                  >
                    <span>⌫</span>
                    <span>წაშლა</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playRemove();
                      setUserLeftNum('');
                    }}
                    className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1 border border-rose-200/80 cursor-pointer transition-all"
                  >
                    <span className="font-black">C</span>
                    <span>გასუფთავება</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            onClick={() => setActivePopover(prev => prev === 'left' ? null : 'left')}
            onMouseEnter={() => setActivePopover('left')}
            className={`rounded-3xl w-18 h-18 md:w-24 md:h-24 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer border-4 ${
              activePopover === 'left'
                ? 'bg-pink-50 border-pink-400 scale-105 ring-4 ring-pink-200/60'
                : userLeftNum
                  ? 'bg-pink-50/80 border-pink-300'
                  : 'bg-pink-50/50 border-pink-300/80'
            }`}
          >
            <span className={`text-3xl md:text-5xl font-sans font-black ${userLeftNum ? 'text-pink-600' : 'text-pink-400/60'}`}>
              {userLeftNum || '?'}
            </span>
          </div>
          <span className="text-[10px] md:text-sm font-black text-pink-500 mt-2 tracking-wide">
            მარცხნივ
          </span>
        </div>

        {/* Comparison Sign in between the Numbers */}
        <div className="relative flex flex-col items-center">
          {/* Sign Popover */}
          <AnimatePresence>
            {activePopover === 'sign' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                className="absolute top-full mt-2.5 z-50 bg-white border-3 border-sky-400 rounded-2xl shadow-xl p-2.5 w-56 md:w-64 flex flex-col items-center gap-2"
              >
                <div className="w-full flex justify-between items-center px-1">
                  <span className="font-black text-sky-500 text-xs md:text-sm tracking-wider uppercase">
                    აირჩიე ნიშანი
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePopover(null); }}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex justify-center items-center gap-2 w-full py-1">
                  {[
                    { sign: '>', label: 'მეტია' },
                    { sign: '=', label: 'ტოლია' },
                    { sign: '<', label: 'ნაკლებია' },
                  ].map(({ sign, label }) => (
                    <button
                      key={sign}
                      onClick={(e) => {
                        e.stopPropagation();
                        playPop();
                        setUserSign(sign as '<' | '>' | '=');
                        setActivePopover(null);
                      }}
                      className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl border transition-all cursor-pointer ${
                        userSign === sign
                          ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-105'
                          : 'bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <span className="text-2xl font-sans font-black">{sign}</span>
                      <span className="text-[10px] font-bold mt-0.5 opacity-90">{label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={isCorrect ? 'correct' : 'incorrect'}
            initial={{ scale: 0.8 }}
            animate={{ scale: isCorrect ? [1, 1.15, 1] : 1 }}
            onClick={() => setActivePopover(prev => prev === 'sign' ? null : 'sign')}
            onMouseEnter={() => setActivePopover('sign')}
            className={`rounded-3xl w-18 h-18 md:w-24 md:h-24 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer border-4 relative ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-600 ring-4 ring-emerald-200/60'
                : activePopover === 'sign'
                  ? 'bg-sky-50 border-sky-400 text-sky-600 scale-105 ring-4 ring-sky-200/60'
                  : userSign
                    ? 'bg-sky-50 border-sky-300 text-sky-600'
                    : 'bg-sky-50/50 border-sky-300/80 text-sky-400/60'
            }`}
          >
            <span className={`text-3xl md:text-5xl font-sans font-black ${isCorrect ? 'text-emerald-600' : userSign ? 'text-sky-600' : 'text-sky-400/60'}`}>
              {userSign || '?'}
            </span>

            {/* Star Explosion centered here when correct */}
            <AnimatePresence>
              {isCorrect && (
                <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    const radius = 80 + Math.random() * 40;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1.4, 1.1, 0],
                          x: [0, x],
                          y: [0, y],
                          opacity: [1, 1, 0.9, 0],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.04,
                          ease: "easeOut",
                          repeat: Infinity,
                          repeatDelay: 1.5
                        }}
                        className="absolute"
                      >
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 fill-yellow-300 stroke-yellow-500 stroke-[1.5px] filter drop-shadow-sm" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
          <span className="text-[10px] md:text-sm font-black text-sky-500 mt-2 tracking-wide">
            ნიშანი
          </span>
        </div>

        {/* Right Side Number Under Right Box */}
        <div className="relative flex flex-col items-center">
          {/* Keypad Popover for Right Box */}
          <AnimatePresence>
            {activePopover === 'right' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                className="absolute top-full mt-2.5 z-50 bg-white border-3 border-amber-300 rounded-2xl shadow-xl p-2.5 w-56 md:w-64 flex flex-col items-center gap-2"
              >
                <div className="w-full flex justify-between items-center px-1">
                  <span className="font-black text-amber-500 text-xs md:text-sm tracking-wider uppercase">
                    აირჩიე ციფრი
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActivePopover(null); }}
                    className="text-slate-400 hover:text-slate-600 font-bold text-xs bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 w-full">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                    <button
                      key={digit}
                      onClick={(e) => {
                        e.stopPropagation();
                        playPop();
                        setUserRightNum(prev => (prev.length >= 2 ? digit : (prev === '0' ? digit : prev + digit)));
                      }}
                      className="h-9 md:h-10 rounded-xl bg-slate-50 hover:bg-amber-100 hover:text-amber-700 active:scale-95 font-black text-lg md:text-xl text-slate-700 border border-slate-200/80 cursor-pointer transition-all flex items-center justify-center"
                    >
                      {digit}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-1.5 w-full pt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playRemove();
                      setUserRightNum(prev => prev.slice(0, -1));
                    }}
                    className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200/80 cursor-pointer transition-all"
                  >
                    <span>⌫</span>
                    <span>წაშლა</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playRemove();
                      setUserRightNum('');
                    }}
                    className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1 border border-rose-200/80 cursor-pointer transition-all"
                  >
                    <span className="font-black">C</span>
                    <span>გასუფთავება</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            onClick={() => setActivePopover(prev => prev === 'right' ? null : 'right')}
            onMouseEnter={() => setActivePopover('right')}
            className={`rounded-3xl w-18 h-18 md:w-24 md:h-24 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer border-4 ${
              activePopover === 'right'
                ? 'bg-amber-50 border-amber-400 scale-105 ring-4 ring-amber-200/60'
                : userRightNum
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-amber-50/50 border-amber-300/80'
            }`}
          >
            <span className={`text-3xl md:text-5xl font-sans font-black ${userRightNum ? 'text-amber-500' : 'text-amber-400/60'}`}>
              {userRightNum || '?'}
            </span>
          </div>
          <span className="text-[10px] md:text-sm font-black text-amber-500 mt-2 tracking-wide">
            მარჯვნივ
          </span>
        </div>

      </div>
      </div>
      )}

      </div>
      )}

      {/* JPG Download Button */}
      {mode !== 'sort' && (
        <div className="mt-6 mb-4 flex flex-col items-center justify-center">
          <motion.button
            id="btn-download-activity-four"
            onClick={handleDownloadJpg}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-200 shadow-2xs text-xs md:text-sm font-black text-slate-700 cursor-pointer transition-all animate-fade-in"
            title="ჩამოტვირთე სურათი"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5 text-sky-500 stroke-[2.5px]" />
            <span>ჩამოტვირთე სურათი (JPG)</span>
          </motion.button>
        </div>
      )}

      {/* FEEDBACK STATUS CARDS & FLOATING HELPERS */}
      {mode === 'count' && (
        <div className="min-h-[50px] flex flex-col items-center justify-start w-full mt-4 relative">
          <AnimatePresence mode="wait">
            {showFeedback && !isCorrect && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3 w-full relative"
              >
                <div className="flex flex-col items-center gap-1 p-2 bg-rose-50 border border-rose-100 rounded-xl px-6 py-2 shadow-2xs">
                  <span className="text-rose-600 font-bold text-sm md:text-base">
                    {errorMessage || 'სცადე კიდევ ერთხელ! 🤔'}
                  </span>
                  {errorMessage === '' && (
                    <span className="text-slate-400 font-bold text-xs">
                      მოიფიქრე, რომელი ნიშანია სწორი და დააწკაპუნე
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
