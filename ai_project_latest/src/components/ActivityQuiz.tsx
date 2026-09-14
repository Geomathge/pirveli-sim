/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Star, CheckCircle, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { playPop, playSuccess, playError } from './SoundEffects';
import { StarBurst } from './StarBurst';
import { CuteCat, CuteRabbit, CuteBall, CuteFootball, CuteRedBalloon, CuteFlower, CuteButterfly } from './CuteAssets';

interface QuizQuestion {
  id: number;
  questionText: string;
  subText?: string;
  type: 'count' | 'compare' | 'math' | 'sequence';
  options: (string | number)[];
  correctAnswer: string | number;
  hint?: string;
  renderVisual?: () => React.ReactNode;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionText: 'რამდენი ბაჭიაა სურათზე?',
    subText: 'დაითვალე მხიარული კურდღლები:',
    type: 'count',
    options: [3, 4, 5, 6],
    correctAnswer: 4,
    renderVisual: () => (
      <div className="flex flex-wrap items-center justify-center gap-4 py-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.15, rotate: 5 }}
            className="p-2 bg-amber-50 rounded-2xl border-2 border-amber-200 shadow-xs"
          >
            <CuteRabbit className="w-14 h-14 sm:w-16 sm:h-16" flipped={i % 2 === 1} />
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 2,
    questionText: 'რომელი ნიშანი უნდა ჩავსვათ?',
    subText: 'შეადარე რიცხვები:',
    type: 'compare',
    options: ['>', '<', '='],
    correctAnswer: '>',
    renderVisual: () => (
      <div className="flex items-center justify-center gap-6 py-6 text-3xl sm:text-4xl font-black">
        <div className="w-20 h-20 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-inner border-2 border-sky-300">
          7
        </div>
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 border-2 border-dashed border-amber-400 flex items-center justify-center text-2xl font-black">
          ?
        </div>
        <div className="w-20 h-20 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center shadow-inner border-2 border-pink-300">
          4
        </div>
      </div>
    ),
  },
  {
    id: 3,
    questionText: 'რამდენია 3 + 2?',
    subText: 'შეაერთე ბუშტები:',
    type: 'math',
    options: [4, 5, 6, 7],
    correctAnswer: 5,
    renderVisual: () => (
      <div className="flex items-center justify-center gap-3 sm:gap-6 py-4">
        <div className="flex gap-2 p-3 bg-red-50 rounded-2xl border border-red-200">
          {[1, 2, 3].map((i) => (
            <CuteRedBalloon key={i} className="w-10 h-10 sm:w-12 sm:h-12" />
          ))}
        </div>
        <span className="text-3xl font-black text-slate-600">+</span>
        <div className="flex gap-2 p-3 bg-red-50 rounded-2xl border border-red-200">
          {[1, 2].map((i) => (
            <CuteRedBalloon key={i} className="w-10 h-10 sm:w-12 sm:h-12" />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 4,
    questionText: 'რომელი რიცხვი აკლია მიმდევრობას?',
    subText: '1, 2, 3, ?, 5',
    type: 'sequence',
    options: [3, 4, 6, 7],
    correctAnswer: 4,
    renderVisual: () => (
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-white border-2 border-sky-200 flex items-center justify-center text-2xl font-black text-sky-700 shadow-xs"
          >
            {n}
          </div>
        ))}
        <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-amber-100 border-2 border-dashed border-amber-400 flex items-center justify-center text-2xl font-black text-amber-600 animate-pulse">
          ?
        </div>
        <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl bg-white border-2 border-sky-200 flex items-center justify-center text-2xl font-black text-sky-700 shadow-xs">
          5
        </div>
      </div>
    ),
  },
  {
    id: 5,
    questionText: 'სად არის მეტი?',
    subText: 'შეადარე კნუტები და ბურთები:',
    type: 'compare',
    options: ['კნუტები მეტია', 'ბურთები მეტია', 'ტოლია'],
    correctAnswer: 'კნუტები მეტია',
    renderVisual: () => (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
        <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 rounded-2xl border border-orange-200">
          <div className="flex gap-2">
            <CuteCat className="w-12 h-12" />
            <CuteCat className="w-12 h-12" />
            <CuteCat className="w-12 h-12" />
          </div>
          <span className="text-xs font-black text-orange-700">3 კნუტი</span>
        </div>
        <span className="text-2xl font-bold text-slate-400">vs</span>
        <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="flex gap-2">
            <CuteBall className="w-12 h-12" />
            <CuteBall className="w-12 h-12" />
          </div>
          <span className="text-xs font-black text-blue-700">2 ბურთი</span>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    questionText: 'რამდენია 6 - 2?',
    subText: 'მოაკელი 2 ბურთი 6 ბურთს:',
    type: 'math',
    options: [2, 3, 4, 5],
    correctAnswer: 4,
    renderVisual: () => (
      <div className="flex flex-wrap items-center justify-center gap-2 py-4 max-w-sm mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <CuteFootball className="w-10 h-10" />
          </div>
        ))}
        {[5, 6].map((i) => (
          <div key={i} className="p-2 bg-slate-100 rounded-xl border border-slate-300 opacity-40 relative">
            <CuteFootball className="w-10 h-10" />
            <span className="absolute inset-0 flex items-center justify-center text-red-500 text-2xl font-black">
              ✕
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 7,
    questionText: 'რამდენი ყვავილია სულ?',
    subText: 'დაითვალე ყვავილები:',
    type: 'count',
    options: [4, 5, 6, 7],
    correctAnswer: 6,
    renderVisual: () => (
      <div className="flex flex-wrap items-center justify-center gap-3 py-4 max-w-md mx-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="p-2 bg-pink-50 rounded-2xl border border-pink-200 shadow-2xs"
          >
            <CuteFlower className="w-12 h-12" />
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 8,
    questionText: 'რომელი ნიშანია სწორი: 5 _ 5?',
    subText: 'დააკვირდი რიცხვებს:',
    type: 'compare',
    options: ['>', '<', '='],
    correctAnswer: '=',
    renderVisual: () => (
      <div className="flex items-center justify-center gap-6 py-6 text-4xl font-black">
        <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner border-2 border-indigo-300">
          5
        </div>
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 border-2 border-dashed border-amber-400 flex items-center justify-center text-3xl font-black">
          ?
        </div>
        <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner border-2 border-indigo-300">
          5
        </div>
      </div>
    ),
  },
];

export function ActivityQuiz() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (option: string | number) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      playSuccess();
      setShowCelebration(true);
      setScore((s) => s + 1);
    } else {
      playError();
    }
  };

  const handleNext = () => {
    playPop();
    setShowCelebration(false);
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      setIsFinished(true);
      playSuccess();
    }
  };

  const handleRestart = () => {
    playPop();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setShowCelebration(false);
    setIsFinished(false);
  };

  return (
    <div id="quiz-container" className="w-full max-w-4xl mx-auto flex flex-col items-center select-none px-4">
      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 shadow-2xs">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>მათემატიკის ვიქტორინა</span>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-1.5 bg-yellow-100 text-amber-800 px-3.5 py-1 rounded-full font-black text-sm border border-yellow-300">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{score} ქულა</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden border border-slate-200">
        <motion.div
          className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIdx + (isFinished ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      {/* Celebration burst */}
      {showCelebration && <StarBurst />}

      {!isFinished ? (
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-amber-100 relative overflow-hidden">
          {/* Character illustration guide */}
          <div className="absolute top-4 right-4 hidden md:flex items-center gap-2 opacity-90 pointer-events-none">
            <img
              src={isAnswered && isCorrect ? '/assets/book/check/book-girl-hands-up.png' : '/assets/characters/girl-point-side.png'}
              alt="Character"
              className="h-24 w-auto object-contain transition-all"
              onError={(e) => {
                // Hide if not found
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Question Counter */}
          <div className="text-xs sm:text-sm font-bold text-slate-400 mb-1">
            შეკითხვა {currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </div>

          {/* Question Title */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-1">
            {currentQ.questionText}
          </h2>
          {currentQ.subText && (
            <p className="text-sm font-medium text-slate-500 mb-4">{currentQ.subText}</p>
          )}

          {/* Question Visual */}
          {currentQ.renderVisual && (
            <div className="my-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-center justify-center">
              {currentQ.renderVisual()}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {currentQ.options.map((opt, i) => {
              const isChosen = selectedOption === opt;
              const isTargetCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-white hover:bg-amber-50/50 border-slate-200 text-slate-700 shadow-xs';
              if (isAnswered) {
                if (isTargetCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
                } else if (isChosen && !isCorrect) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-sm';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!isAnswered ? { scale: 1.03 } : {}}
                  whileTap={!isAnswered ? { scale: 0.97 } : {}}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`py-4 px-3 rounded-2xl border-2 font-black text-lg sm:text-2xl transition-all cursor-pointer flex items-center justify-center min-h-[64px] ${btnStyle}`}
                >
                  <span>{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-lg">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                      <span>ყოჩაღ! სწორი პასუხია! 🎉</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-500 font-black text-lg">
                      <span>სცადე შემდეგში! სწორი პასუხია: {currentQ.correctAnswer}</span>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-2xl shadow-md hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 cursor-pointer text-base"
                >
                  <span>შემდეგი</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Finished Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full bg-white rounded-3xl p-8 sm:p-12 shadow-lg border-2 border-amber-200 text-center flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-white flex items-center justify-center shadow-lg mb-4">
            <Trophy className="w-12 h-12" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            ვიქტორინა დასრულდა!
          </h2>
          <p className="text-slate-600 font-bold text-lg mb-6">
            შენ დააგროვე <span className="text-amber-600 text-2xl font-black">{score}</span> ქულა{' '}
            {QUIZ_QUESTIONS.length}-დან!
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <img
              src="/assets/book/check/book-boy-jump-up.png"
              alt="Happy Boy"
              className="h-28 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <CuteRabbit className="w-16 h-16" />
            </div>
            <img
              src="/assets/book/check/book-girl-hands-up.png"
              alt="Happy Girl"
              className="h-28 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-lg"
          >
            <RefreshCw className="w-5 h-5" />
            <span>თავიდან დაწყება</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
