/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActivityType {
  PARALLEL_COUNTING = 'PARALLEL_COUNTING',
  DECOMPOSITION = 'DECOMPOSITION',
  DOMINO_QUIZ = 'DOMINO_QUIZ',
  COMPARISON = 'COMPARISON',
  SORTING = 'SORTING'
}

export type ItemType = 'rabbit' | 'kitty' | 'dog' | 'balloon' | 'ball' | 'football' | 'stick' | 'circle' | 'cube';

export interface CountingItem {
  id: string;
  type: ItemType;
  color: string;
}

export interface QuizOption {
  value: number;
  isCorrect: boolean;
  state: 'idle' | 'correct' | 'wrong';
}

export interface DominoState {
  topDots: number;
  bottomDots: number;
  total: number;
  options: QuizOption[];
  answered: boolean;
}
