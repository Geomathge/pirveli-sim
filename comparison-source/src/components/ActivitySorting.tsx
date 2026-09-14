/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { RefreshCw, Sparkles, Download, Check, HelpCircle } from 'lucide-react';
import { playPop, playSuccess, playRemove, playPair } from './SoundEffects';
import { CuteBall, CuteFootball, CuteFlower, CuteButterfly } from './CuteAssets';
import { StarBurst } from './StarBurst';
import { toPng } from 'html-to-image';

interface SortingItem {
  id: string;
  type: 'ball' | 'football' | 'flower' | 'butterfly';
  rotation: number;
  scale: number;
  x: number;
  y: number;
}

export function ActivitySorting() {
  const [theme, setTheme] = useState<'balls' | 'nature'>('balls');

  // Items currently scattered in the top box
  const [mixedItems, setMixedItems] = useState<SortingItem[]>([]);

  // Items sorted into the bottom pairing tray
  const [sortedLeft, setSortedLeft] = useState<SortingItem[]>([]);
  const [sortedRight, setSortedRight] = useState<SortingItem[]>([]);

  // Grid dimensions
  const [totalColumns, setTotalColumns] = useState<number>(6);
  const [initialCountA, setInitialCountA] = useState<number>(4);
  const [initialCountB, setInitialCountB] = useState<number>(3);

  // Column that just got paired (for highlight animation)
  const [recentlyPairedCol, setRecentlyPairedCol] = useState<number | null>(null);

  // User interactive answer for "რომელია მეტი?"
  const [selectedAnswer, setSelectedAnswer] = useState<'left' | 'right' | 'equal' | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Formula puzzle states
  const [formulaSign, setFormulaSign] = useState<'<' | '>' | '=' | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);

  // Export & Download Worksheet States
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    playPop();

    setTimeout(async () => {
      try {
        const dataUrl = await toPng(exportRef.current!, {
          backgroundColor: '#ffffff',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left',
            borderRadius: '24px',
          },
          cacheBust: true,
        });

        const link = document.createElement('a');
        link.download = `romelia-meti-${theme}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Failed to export image:', error);
      } finally {
        setIsExporting(false);
      }
    }, 300);
  };

  // Initialize or reset the game
  const initGame = (currentTheme = theme) => {
    setIsWon(false);
    setSortedLeft([]);
    setSortedRight([]);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setFormulaSign(null);
    setRecentlyPairedCol(null);

    // Randomize counts
    const rand = Math.random();
    let countA = 4;
    let countB = 3;

    if (rand < 0.45) {
      countA = Math.floor(Math.random() * 3) + 4; // 4, 5, 6
      countB = Math.floor(Math.random() * 2) + 2; // 2, 3
    } else if (rand < 0.85) {
      countA = Math.floor(Math.random() * 2) + 2; // 2, 3
      countB = Math.floor(Math.random() * 3) + 4; // 4, 5, 6
    } else {
      const eq = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
      countA = eq;
      countB = eq;
    }

    setInitialCountA(countA);
    setInitialCountB(countB);
    setTotalColumns(Math.max(countA, countB));

    const typeA = currentTheme === 'balls' ? 'ball' : 'butterfly';
    const typeB = currentTheme === 'balls' ? 'football' : 'flower';

    // Generate non-overlapping coordinates in the top box
    const total = countA + countB;
    const positions: { x: number; y: number }[] = [];
    const minDistance = 14;

    for (let i = 0; i < total; i++) {
      let x = 6 + (i % 6) * 15 + (Math.random() * 4 - 2);
      let y = 12 + Math.floor(i / 6) * 40 + (Math.random() * 6 - 3);

      for (let attempt = 0; attempt < 150; attempt++) {
        const candX = Math.random() * 82 + 5;
        const candY = Math.random() * 52 + 12;
        let tooClose = false;
        for (const p of positions) {
          const dx = candX - p.x;
          const dy = (candY - p.y) * 1.3;
          if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
            tooClose = true;
            break;
          }
        }
        if (!tooClose) {
          x = candX;
          y = candY;
          break;
        }
      }
      positions.push({ x, y });
    }

    const tempItems: SortingItem[] = [];
    let posIdx = 0;

    for (let i = 0; i < countA; i++) {
      const pos = positions[posIdx++];
      tempItems.push({
        id: `${typeA}-${i}-${Date.now()}-${Math.random()}`,
        type: typeA as any,
        rotation: Math.floor(Math.random() * 24) - 12,
        scale: 1,
        x: pos.x,
        y: pos.y,
      });
    }

    for (let i = 0; i < countB; i++) {
      const pos = positions[posIdx++];
      tempItems.push({
        id: `${typeB}-${i}-${Date.now()}-${Math.random()}`,
        type: typeB as any,
        rotation: Math.floor(Math.random() * 24) - 12,
        scale: 1,
        x: pos.x,
        y: pos.y,
      });
    }

    // Shuffle so they are thoroughly mixed
    setMixedItems(tempItems.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    initGame(theme);
  }, [theme]);

  // Handle clicking an item in the top box (moves down to bottom box)
  const handleTopItemClick = (item: SortingItem) => {
    // Remove from mixed
    setMixedItems((prev) => prev.filter((i) => i.id !== item.id));

    const isLeftType = item.type === 'ball' || item.type === 'butterfly';

    if (isLeftType) {
      const targetIndex = sortedLeft.length;
      setSortedLeft((prev) => [...prev, item]);

      // Check if this newly added item pairs with an existing item in sortedRight
      if (sortedRight[targetIndex]) {
        playPair();
        setRecentlyPairedCol(targetIndex);
        setTimeout(() => setRecentlyPairedCol(null), 1200);
      } else {
        playPop();
      }
    } else {
      const targetIndex = sortedRight.length;
      setSortedRight((prev) => [...prev, item]);

      // Check if this newly added item pairs with an existing item in sortedLeft
      if (sortedLeft[targetIndex]) {
        playPair();
        setRecentlyPairedCol(targetIndex);
        setTimeout(() => setRecentlyPairedCol(null), 1200);
      } else {
        playPop();
      }
    }
  };

  // Handle clicking an item in the bottom box (returns back to top box)
  const handleBottomItemClick = (item: SortingItem, from: 'left' | 'right') => {
    playRemove();
    if (from === 'left') {
      setSortedLeft((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setSortedRight((prev) => prev.filter((i) => i.id !== item.id));
    }
    // Return to mixed with current position
    setMixedItems((prev) => [...prev, item]);
  };

  // Calculate pairs
  const pairedCount = Math.min(sortedLeft.length, sortedRight.length);
  const isAllSorted = mixedItems.length === 0;

  // Handle user answering "რომელია მეტი?"
  const handleAnswerSelect = (ans: 'left' | 'right' | 'equal') => {
    setSelectedAnswer(ans);
    let correct = false;
    if (sortedLeft.length > sortedRight.length && ans === 'left') correct = true;
    if (sortedLeft.length < sortedRight.length && ans === 'right') correct = true;
    if (sortedLeft.length === sortedRight.length && ans === 'equal') correct = true;

    setIsAnswerCorrect(correct);
    if (correct) {
      setIsWon(true);
      playSuccess();
    } else {
      playPop();
    }
  };

  // Handle formula sign select
  const handleSignSelect = (sign: '<' | '>' | '=') => {
    setFormulaSign(sign);
    let correct = false;
    if (sortedLeft.length > sortedRight.length && sign === '>') correct = true;
    if (sortedLeft.length < sortedRight.length && sign === '<') correct = true;
    if (sortedLeft.length === sortedRight.length && sign === '=') correct = true;

    if (correct) {
      setIsWon(true);
      playSuccess();
    } else {
      playPop();
    }
  };

  const nameA = theme === 'balls' ? 'კალათბურთი' : 'პეპელა';
  const nameB = theme === 'balls' ? 'ფეხბურთი' : 'ყვავილი';

  return (
    <LayoutGroup id="sorting-pairing-flow">
      <div
        ref={exportRef}
        id="activity-sorting-root"
        className="w-full max-w-4xl bg-white/75 backdrop-blur-md rounded-3xl border-2 border-sky-100 shadow-xl p-4 sm:p-7 flex flex-col items-center gap-5 sm:gap-6 relative overflow-hidden select-none"
      >
        {/* Top Header matching reference screenshot */}
        {!isExporting && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-sky-100/70 pb-4">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                🎨 რომელია მეტი?
              </h2>
              <span className="text-xs sm:text-sm font-black text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80 shadow-2xs mt-1.5 inline-block">
                ვისწავლოთ ერთად
              </span>
            </div>

            {/* Right Controls: Theme Tabs, Refresh, Download */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {/* Theme Selector */}
              <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center border border-slate-200 shadow-3xs">
                <button
                  onClick={() => {
                    setTheme('balls');
                    playPop();
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                    theme === 'balls'
                      ? 'bg-white text-sky-700 shadow-2xs border border-sky-100'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🏀⚽ ბურთები
                </button>
                <button
                  onClick={() => {
                    setTheme('nature');
                    playPop();
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                    theme === 'nature'
                      ? 'bg-white text-pink-600 shadow-2xs border border-pink-100'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🌸🦋 ყვავილი და პეპელა
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  initGame();
                  playPop();
                }}
                className="w-10 h-10 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white shadow-sm flex items-center justify-center cursor-pointer transition-all border-b-4 border-sky-700"
                title="ახალი მაგალითი"
              >
                <RefreshCw className="w-5 h-5 animate-spin-slow stroke-[2.5px]" />
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer border-b-4 border-amber-700 disabled:opacity-50"
                title="ჩამოტვირთვა"
              >
                <Download className="w-4 h-4 stroke-[2.5px]" />
                <span>ჩამოტვირთვა</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. TOP BOX: ასარევი ყუთი (ობიექტები) */}
        <div className="w-full flex flex-col">
          <div className="w-full bg-slate-50/80 border-2 border-dashed border-sky-300 rounded-3xl p-3.5 sm:p-5 min-h-[160px] sm:min-h-[185px] relative flex flex-col justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
            {/* Box Header Badge */}
            <div className="absolute -top-3.5 left-6 bg-sky-500 text-white font-black text-xs sm:text-sm px-4 py-1 rounded-full shadow-sm border border-sky-600 flex items-center gap-1.5 z-20">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isExporting ? 'რამდენია?' : `რამდენია? (${mixedItems.length})`}</span>
            </div>

            {/* Scattered Items Area */}
            <div className="w-full flex-1 relative min-h-[110px] sm:min-h-[130px]">
              <AnimatePresence>
                {mixedItems.map((item) => (
                  <motion.button
                    key={item.id}
                    layoutId={item.id}
                    onClick={() => handleTopItemClick(item)}
                    initial={{ opacity: 0, scale: 0.5, rotate: item.rotation }}
                    animate={{ opacity: 1, scale: item.scale, rotate: item.rotation }}
                    exit={{ opacity: 0, scale: 0.3 }}
                    whileHover={{ scale: 1.2, rotate: 0 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="p-1.5 rounded-2xl bg-white border-2 border-slate-100 hover:border-sky-400 hover:shadow-md cursor-pointer absolute flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 touch-manipulation transition-colors shadow-2xs group"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                    }}
                    title="დააწკაპე ჩასასვლელად და დასაწყვილებლად!"
                  >
                    {/* Hover indicator arrow pointing down */}
                    <div className="absolute -bottom-2 bg-sky-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs z-10 scale-75">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>

                    {item.type === 'ball' && <CuteBall className="w-8 h-8 sm:w-9 sm:h-9" />}
                    {item.type === 'football' && <CuteFootball className="w-8 h-8 sm:w-9 sm:h-9" />}
                    {item.type === 'flower' && <CuteFlower className="w-8 h-8 sm:w-9 sm:h-9" />}
                    {item.type === 'butterfly' && <CuteButterfly className="w-8 h-8 sm:w-9 sm:h-9" />}
                  </motion.button>
                ))}
              </AnimatePresence>

              {/* When all items have moved down */}
              {mixedItems.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-black text-xs sm:text-sm text-center py-4 gap-1.5">
                  <span className="text-2xl animate-bounce">✨</span>
                  <span className="text-sky-600 bg-sky-50 px-4 py-1.5 rounded-2xl border border-sky-100">
                    ყოჩაღ! ყველა საგანი გადავიდა ქვედა უჯრაში!
                  </span>
                </div>
              )}
            </div>

            {/* Bottom helper prompt */}
            {mixedItems.length > 0 && !isExporting && (
              <div className="w-full text-center text-xs font-black text-sky-600 bg-sky-50/70 py-1 rounded-xl border border-sky-100/60 flex items-center justify-center gap-1.5 mt-1">
                <span className="animate-pulse">👆 დააწკაპე საგანზე — ჩავა დაბლა და დაწყვილდება!</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. BOTTOM BOX: დაწყვილების უჯრა */}
        <div className="w-full flex flex-col">
          <div className="w-full bg-white border-2 border-slate-200 rounded-3xl min-h-[220px] sm:min-h-[240px] shadow-sm relative flex flex-col justify-between overflow-hidden p-3.5 sm:p-5">
            {/* Top Category Badges Row */}
            <div className="w-full flex items-center justify-between gap-2 z-10 pb-3 border-b border-slate-100">
              {/* Left Category Badge */}
              <div className="bg-sky-500 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-2xs border border-sky-600 flex items-center gap-2">
                {theme === 'balls' ? (
                  <>
                    <CuteBall className="w-4 h-4 bg-white rounded-full p-0.5" />
                    <span>კალათბურთი: {sortedLeft.length}</span>
                  </>
                ) : (
                  <>
                    <CuteButterfly className="w-4 h-4 bg-white rounded-full p-0.5" />
                    <span>პეპელა: {sortedLeft.length}</span>
                  </>
                )}
              </div>

              {/* Center Pairing Status Badge */}
              <div className="text-xs font-black text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200/80 shadow-2xs flex items-center gap-1.5">
                <span>↕ დაწყვილება</span>
                {pairedCount > 0 && (
                  <span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {pairedCount} წყვილი
                  </span>
                )}
              </div>

              {/* Right Category Badge */}
              <div className="bg-pink-500 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-2xs border border-pink-600 flex items-center gap-2">
                {theme === 'balls' ? (
                  <>
                    <CuteFootball className="w-4 h-4 bg-white rounded-full p-0.5" />
                    <span>ფეხბურთი: {sortedRight.length}</span>
                  </>
                ) : (
                  <>
                    <CuteFlower className="w-4 h-4 bg-white rounded-full p-0.5" />
                    <span>ყვავილი: {sortedRight.length}</span>
                  </>
                )}
              </div>
            </div>

            {/* Middle: Horizontal Pairing Grid with Column Slots (უჯრები) */}
            <div className="w-full flex-1 flex flex-col justify-center my-3 overflow-x-auto py-2">
              <div className="flex items-center justify-center gap-3 sm:gap-5 overflow-x-auto min-w-max px-3 py-1">
                {Array.from({ length: totalColumns }).map((_, colIdx) => {
                  const itemA = sortedLeft[colIdx];
                  const itemB = sortedRight[colIdx];
                  const isPaired = Boolean(itemA && itemB);
                  const isRecentlyPaired = recentlyPairedCol === colIdx;

                  return (
                    <div key={colIdx} className="flex flex-col items-center gap-0 relative">
                      {/* Top Slot: Category A */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center relative">
                        {itemA ? (
                          <motion.button
                            layoutId={itemA.id}
                            onClick={() => handleBottomItemClick(itemA, 'left')}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center cursor-pointer shadow-xs transition-all relative ${
                              isPaired
                                ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-300/80 shadow-sky-100'
                                : 'bg-white border-sky-200 hover:border-sky-400'
                            } ${isRecentlyPaired ? 'animate-bounce' : ''}`}
                            title="დააბრუნე უკან"
                          >
                            {itemA.type === 'ball' && <CuteBall className="w-8 h-8 sm:w-9 sm:h-9" />}
                            {itemA.type === 'butterfly' && <CuteButterfly className="w-8 h-8 sm:w-9 sm:h-9" />}
                            {isPaired && (
                              <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                ✓
                              </span>
                            )}
                          </motion.button>
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 flex items-center justify-center">
                            {theme === 'balls' ? (
                              <CuteBall className="w-6 h-6 opacity-20 grayscale" />
                            ) : (
                              <CuteButterfly className="w-6 h-6 opacity-20 grayscale" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Middle Vertical Connector */}
                      <div className="h-14 sm:h-16 flex flex-col items-center justify-between my-1 relative">
                        {/* Top dot */}
                        <div
                          className={`w-3 h-3 rounded-full transition-colors ${
                            itemA ? 'bg-[#00AEEF] shadow-2xs' : 'bg-slate-200'
                          }`}
                        />

                        {/* Connector line */}
                        {isPaired ? (
                          <div className="w-0.5 flex-1 bg-[#00AEEF] my-0.5 relative flex items-center justify-center">
                            <span className="absolute bg-white px-1.5 py-0.5 text-[9px] font-black text-sky-600 rounded-full border border-sky-200 shadow-3xs whitespace-nowrap">
                              ↕ წყვილი
                            </span>
                          </div>
                        ) : (
                          <div className="w-0 flex-1 border-r-2 border-dashed border-slate-200 my-0.5" />
                        )}

                        {/* Bottom dot */}
                        <div
                          className={`w-3 h-3 rounded-full transition-colors ${
                            itemB ? 'bg-[#00AEEF] shadow-2xs' : 'bg-slate-200'
                          }`}
                        />
                      </div>

                      {/* Bottom Slot: Category B */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center relative">
                        {itemB ? (
                          <motion.button
                            layoutId={itemB.id}
                            onClick={() => handleBottomItemClick(itemB, 'right')}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center cursor-pointer shadow-xs transition-all relative ${
                              isPaired
                                ? 'bg-pink-50/90 border-pink-400 ring-2 ring-pink-300/80 shadow-pink-100'
                                : 'bg-white border-pink-200 hover:border-pink-400'
                            } ${isRecentlyPaired ? 'animate-bounce' : ''}`}
                            title="დააბრუნე უკან"
                          >
                            {itemB.type === 'football' && <CuteFootball className="w-8 h-8 sm:w-9 sm:h-9" />}
                            {itemB.type === 'flower' && <CuteFlower className="w-8 h-8 sm:w-9 sm:h-9" />}
                            {isPaired && (
                              <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                ✓
                              </span>
                            )}
                          </motion.button>
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/30 flex items-center justify-center">
                            {theme === 'balls' ? (
                              <CuteFootball className="w-6 h-6 opacity-20 grayscale" />
                            ) : (
                              <CuteFlower className="w-6 h-6 opacity-20 grayscale" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hint when not yet sorted */}
            {sortedLeft.length === 0 && sortedRight.length === 0 && (
              <div className="w-full text-center text-slate-400 font-black text-xs sm:text-sm py-1 flex items-center justify-center gap-1">
                <span>{theme === 'balls' ? '🏀 ↕️ ⚽' : '🦋 ↕️ 🌸'}</span>
                <span>დააჭირე საგნებს ზევით და ისინი აქ ჩავლენ წყვილებად</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. QUESTION & CONCLUSION: რომელია მეტი? */}
        {isAllSorted && !isExporting && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-gradient-to-br from-white via-sky-50/40 to-slate-50 border-2 border-sky-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col items-center gap-4 text-center"
          >
            <div className="flex items-center gap-2 text-sky-700 font-black text-base sm:text-lg">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>რომელია მეტი?</span>
            </div>

            {/* Difference note */}
            <div className="text-xs sm:text-sm font-bold text-slate-600">
              {sortedLeft.length > sortedRight.length ? (
                <span className="text-sky-700 font-black">
                  {nameA} მეტია {sortedLeft.length - sortedRight.length}-ით, ვიდრე {nameB}!
                </span>
              ) : sortedLeft.length < sortedRight.length ? (
                <span className="text-pink-700 font-black">
                  {nameB} მეტია {sortedRight.length - sortedLeft.length}-ით, ვიდრე {nameA}!
                </span>
              ) : (
                <span className="text-emerald-700 font-black">ორივე თანაბარია!</span>
              )}
            </div>

            {/* Choice Buttons for child to click */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full pt-1">
              <button
                onClick={() => handleAnswerSelect('left')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                  selectedAnswer === 'left'
                    ? isAnswerCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-600'
                    : 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700'
                }`}
              >
                {theme === 'balls' ? <CuteBall className="w-5 h-5" /> : <CuteButterfly className="w-5 h-5" />}
                <span>{nameA} ({sortedLeft.length})</span>
              </button>

              <button
                onClick={() => handleAnswerSelect('equal')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                  selectedAnswer === 'equal'
                    ? isAnswerCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-600'
                    : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>=</span>
                <span>თანაბარია</span>
              </button>

              <button
                onClick={() => handleAnswerSelect('right')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                  selectedAnswer === 'right'
                    ? isAnswerCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200'
                      : 'bg-rose-50 border-rose-400 text-rose-600'
                    : 'bg-white hover:bg-pink-50 border-slate-200 text-slate-700'
                }`}
              >
                {theme === 'balls' ? <CuteFootball className="w-5 h-5" /> : <CuteFlower className="w-5 h-5" />}
                <span>{nameB} ({sortedRight.length})</span>
              </button>
            </div>

            {/* Sign Formula Picker: [ LeftCount ] [ > = < ] [ RightCount ] */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 bg-white/90 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-3xs mt-1">
              <span className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 font-black text-base flex items-center justify-center">
                {sortedLeft.length}
              </span>

              <div className="flex items-center gap-1">
                {(['>', '=', '<'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSignSelect(s)}
                    className={`w-9 h-9 rounded-xl font-black text-lg transition-all cursor-pointer flex items-center justify-center border ${
                      formulaSign === s
                        ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <span className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 font-black text-base flex items-center justify-center">
                {sortedRight.length}
              </span>
            </div>

            {/* Victory message */}
            {isWon && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-800 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full border border-emerald-300 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>ყოჩაღ! სწორია! 🎉</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Confetti / StarBurst when won */}
        {isWon && <StarBurst />}
      </div>
    </LayoutGroup>
  );
}
