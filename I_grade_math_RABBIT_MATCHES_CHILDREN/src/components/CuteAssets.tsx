/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AssetProps {
  className?: string;
}

/**
 * A cute, charming soft 3D pastel kitten illustration.
 * Features volumetric radial gradients, shiny anime eyes, rosy cheeks, and smooth shadows.
 */
export const CuteCat: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md overflow-visible`}
    >
      <defs>
        {/* Soft volumetric warm ginger fur radial gradient */}
        <radialGradient id="catHeadGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="45%" stopColor="#FB923C" />
          <stop offset="85%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
        {/* Soft pink inner ear gradient */}
        <linearGradient id="catInnerEar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE8E8" />
          <stop offset="50%" stopColor="#FBCFE8" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
        {/* Muzzle gradient */}
        <radialGradient id="catMuzzleGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="80%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FFEDD5" />
        </radialGradient>
      </defs>

      {/* Outer Ears */}
      {/* Left Ear */}
      <path
        d="M 18 42 L 10 12 C 10 12, 28 14, 38 28 Z"
        fill="url(#catHeadGrad)"
        stroke="#7C2D12"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Left Inner Ear (Pink) */}
      <path
        d="M 21 38 L 15 18 C 15 18, 27 20, 33 30 Z"
        fill="url(#catInnerEar)"
      />

      {/* Right Ear */}
      <path
        d="M 82 42 L 90 12 C 90 12, 72 14, 62 28 Z"
        fill="url(#catHeadGrad)"
        stroke="#7C2D12"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Right Inner Ear (Pink) */}
      <path
        d="M 79 38 L 85 18 C 85 18, 73 20, 67 30 Z"
        fill="url(#catInnerEar)"
      />

      {/* Cat Head Base */}
      <ellipse
        cx="50"
        cy="54"
        rx="38"
        ry="32"
        fill="url(#catHeadGrad)"
        stroke="#7C2D12"
        strokeWidth="3"
      />

      {/* Cute Tabby Forehead Stripes */}
      <path d="M 50 25 L 50 36" stroke="#9A3412" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 43 28 L 45 37" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 57 28 L 55 37" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" />

      {/* Rosy Soft Cheeks */}
      <circle cx="21" cy="62" r="7.5" fill="#FB7185" opacity="0.65" />
      <circle cx="79" cy="62" r="7.5" fill="#FB7185" opacity="0.65" />

      {/* Soft White Muzzle Area */}
      <ellipse
        cx="50"
        cy="63"
        rx="16"
        ry="12"
        fill="url(#catMuzzleGrad)"
        stroke="#9A3412"
        strokeWidth="1.5"
      />

      {/* Big Expressive Sparkling Anime Eyes */}
      {/* Left Eye */}
      <g>
        <ellipse cx="34" cy="49" rx="6.5" ry="7.5" fill="#18181B" />
        {/* Shiny highlights */}
        <circle cx="32" cy="46" r="2.8" fill="#FFFFFF" />
        <circle cx="36" cy="52" r="1.3" fill="#FFFFFF" />
      </g>

      {/* Right Eye */}
      <g>
        <ellipse cx="66" cy="49" rx="6.5" ry="7.5" fill="#18181B" />
        {/* Shiny highlights */}
        <circle cx="64" cy="46" r="2.8" fill="#FFFFFF" />
        <circle cx="68" cy="52" r="1.3" fill="#FFFFFF" />
      </g>

      {/* Whiskers */}
      <path d="M 17 58 L 2 56 M 17 64 L 3 67" stroke="#7C2D12" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 83 58 L 98 56 M 83 64 L 97 67" stroke="#7C2D12" strokeWidth="2.2" strokeLinecap="round" />

      {/* Cute Little Heart-shaped Pink Nose */}
      <polygon
        points="50,60 46,55 54,55"
        fill="#F43F5E"
        stroke="#9E1238"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Cute Cat Smile (:3) */}
      <path
        d="M 44 63 Q 50 67, 50 62 Q 50 67, 56 63"
        stroke="#7C2D12"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

/**
 * A beautiful, realistic classic orange basketball.
 * Designed with curved seams, high-contrast rich orange gradient, and light reflection overlay.
 */
export const CuteBall: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
    >
      <defs>
        {/* Rich orange radial gradient for 3D sphere depth */}
        <radialGradient id="basketballGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="70%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </radialGradient>
        {/* Soft gloss shine overlay */}
        <radialGradient id="sphereShine" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      {/* Main Base Sphere */}
      <circle cx="50" cy="50" r="46" fill="url(#basketballGrad)" stroke="#1E293B" strokeWidth="3.5" />

      {/* Black Seams */}
      {/* Horizontal Seam */}
      <path d="M 4 50 L 96 50" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
      
      {/* Vertical Seam */}
      <path d="M 50 4 L 50 96" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />

      {/* Left Curved Seam */}
      <path d="M 17.5 17.5 Q 45 50 17.5 82.5" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />

      {/* Right Curved Seam */}
      <path d="M 82.5 17.5 Q 55 50 82.5 82.5" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />

      {/* 3D Volumetric Shine Overlay */}
      <circle cx="50" cy="50" r="46" fill="url(#sphereShine)" pointerEvents="none" />
    </svg>
  );
};

/**
 * A beautiful, cute black and white soccer ball (football).
 * Designed with perfect pentagons, clean seam curves, and high-contrast 3D gradient overlay.
 */
export const CuteFootball: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
    >
      <defs>
        {/* Clipping path to keep everything perfectly circular */}
        <clipPath id="soccerBallClip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>

        {/* Soft gloss shine overlay */}
        <radialGradient id="soccerShine" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="80%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
        </radialGradient>

        {/* White ball base gradient */}
        <radialGradient id="soccerBaseGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="75%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </radialGradient>
      </defs>

      {/* Outer Border ring for depth */}
      <circle cx="50" cy="50" r="47" fill="none" stroke="#0F172A" strokeWidth="4.5" />

      {/* Clipped Soccer Content */}
      <g clipPath="url(#soccerBallClip)">
        {/* Base Sphere */}
        <circle cx="50" cy="50" r="46" fill="url(#soccerBaseGrad)" />

        {/* 1. Center Pentagon (Black/Slate) */}
        <polygon
          points="50,35 64.3,45.4 58.8,62.1 41.2,62.1 35.7,45.4"
          fill="#1E293B"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* 2. Outer Pentagons (Partially clipped at the border) */}
        {/* Top Pentagon */}
        <polygon
          points="50,18 62,9 57,-5 43,-5 38,9"
          fill="#1E293B"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Top-Right Pentagon */}
        <polygon
          points="79,40.6 86,25 102,28 104,45 88,53"
          fill="#1E293B"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Bottom-Right Pentagon */}
        <polygon
          points="68,79.4 81,74 92,85 77,105 61,93"
          fill="#1E293B"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Bottom-Left Pentagon */}
        <polygon
          points="32,79.4 19,74 8,85 23,105 39,93"
          fill="#1E293B"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Top-Left Pentagon */}
        <polygon
          points="21,40.6 14,25 -2,28 -4,45 12,53"
          fill="#1E293B"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* 3. Radial Seam Lines (Inner) */}
        <line x1="50" y1="35" x2="50" y2="18" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="64.3" y1="45.4" x2="79" y2="40.6" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="58.8" y1="62.1" x2="68" y2="79.4" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="41.2" y1="62.1" x2="32" y2="79.4" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="35.7" y1="45.4" x2="21" y2="40.6" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />

        {/* 4. Outer Connecting Seam Lines */}
        <line x1="62" y1="9" x2="86" y2="25" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="88" y1="53" x2="81" y2="74" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="61" y1="93" x2="39" y2="93" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="19" y1="74" x2="12" y2="53" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="14" y1="25" x2="38" y2="9" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />

        {/* 5. Volumetric Shine Overlay */}
        <circle cx="50" cy="50" r="46" fill="url(#soccerShine)" pointerEvents="none" />
      </g>
    </svg>
  );
};

/**
 * A beautiful, bright 3D red balloon with glossy shine, knot, and string.
 */
export const CuteRedBalloon: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md overflow-visible`}
    >
      <defs>
        <radialGradient id="redBalloonGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="45%" stopColor="#EF4444" />
          <stop offset="85%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </radialGradient>
        <radialGradient id="balloonShine" cx="30%" cy="25%" r="45%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dangling String */}
      <path
        d="M 50 78 C 44 85, 56 90, 50 98"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Knot at bottom */}
      <polygon
        points="50,75 44,82 56,82"
        fill="#B91C1C"
        stroke="#7F1D1D"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Main Oval Balloon Body */}
      <ellipse
        cx="50"
        cy="42"
        rx="36"
        ry="37"
        fill="url(#redBalloonGrad)"
        stroke="#991B1B"
        strokeWidth="1.5"
      />

      {/* Curved Gloss Reflection Spot */}
      <ellipse
        cx="36"
        cy="28"
        rx="11"
        ry="6.5"
        fill="url(#balloonShine)"
        transform="rotate(-30 36 28)"
      />
      <circle cx="30" cy="36" r="2.5" fill="#FFFFFF" opacity="0.75" />
    </svg>
  );
};

/**
 * A beautiful, shiny 3D blue ball with volumetric gradients and glossy shine.
 */
export const CuteBlueBall: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
    >
      <defs>
        <radialGradient id="blueBallGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="40%" stopColor="#3B82F6" />
          <stop offset="80%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </radialGradient>
        <radialGradient id="blueBallShine" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="45" fill="url(#blueBallGrad)" stroke="#1E3A8A" strokeWidth="2" />
      <ellipse cx="36" cy="32" rx="14" ry="8" fill="url(#blueBallShine)" transform="rotate(-25 36 32)" />
      <circle cx="28" cy="40" r="3" fill="#FFFFFF" opacity="0.7" />

      {/* Subtle Curved Stripe for playful ball texture */}
      <path
        d="M 12 50 C 30 65, 70 65, 88 50"
        stroke="#93C5FD"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
    </svg>
  );
};

/**
 * A beautiful, cute glossy yellow tally stick.
 */
export const CuteStick: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
    >
      <defs>
        <linearGradient id="stickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      {/* Single cute vertical glossy tally stick centered */}
      <rect x="41" y="10" width="18" height="80" rx="9" fill="url(#stickGrad)" stroke="#1E293B" strokeWidth="3.5" />
    </svg>
  );
};

/**
 * A beautiful, cute glossy blue/teal circle.
 */
export const CuteCircle: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
    >
      <defs>
        <radialGradient id="circleGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </radialGradient>
        <radialGradient id="circleShine" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill="url(#circleGrad)" stroke="#1E293B" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="44" fill="url(#circleShine)" pointerEvents="none" />
    </svg>
  );
};

/**
 * A stunning, mathematically accurate 3D isometric toy block (cube) with realistic shaded faces and bevel highlights.
 */
export const CuteCube: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md overflow-visible`}
    >
      <defs>
        {/* Top Face - Bright Light Source */}
        <linearGradient id="cubeTop3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="60%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Left Face - Deep Shadow */}
        <linearGradient id="cubeLeft3D" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="60%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>

        {/* Right Face - Medium Shadow */}
        <linearGradient id="cubeRight3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Ground Contact Shadow */}
      <ellipse cx="50" cy="87" rx="36" ry="9" fill="#064E3B" opacity="0.3" filter="blur(3px)" />

      <g stroke="#022C22" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Left Face */}
        <polygon
          points="16,34 50,52 50,86 16,68"
          fill="url(#cubeLeft3D)"
        />

        {/* Right Face */}
        <polygon
          points="50,52 84,34 84,68 50,86"
          fill="url(#cubeRight3D)"
        />

        {/* Top Face */}
        <polygon
          points="50,16 84,34 50,52 16,34"
          fill="url(#cubeTop3D)"
        />
      </g>

      {/* Inner Glossy Top Surface Reflection */}
      <polygon
        points="50,21 76,34 50,47 24,34"
        fill="#FFFFFF"
        opacity="0.3"
      />

      {/* Crisp 3D Bevel Highlights on Top Vertices */}
      <path
        d="M 16 34 L 50 16 L 84 34"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
        fill="none"
      />
      <line x1="50" y1="16" x2="50" y2="52" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * A cute, charming soft 3D puppy face illustration.
 * Features volumetric gradients, shiny puppy eyes, rosy cheeks, and smooth 3D depth.
 */
export const CuteDog: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md overflow-visible`}
    >
      <defs>
        {/* Warm creamy puppy head gradient */}
        <radialGradient id="puppyHeadGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FEF3C7" />
          <stop offset="90%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        {/* Warm chestnut brown ear gradient */}
        <radialGradient id="puppyEarGrad" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="60%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        {/* Soft caramel patch gradient */}
        <radialGradient id="puppyPatchGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
      </defs>

      {/* Floppy Left Ear */}
      <path
        d="M 26 28 C 8 28, 4 58, 12 74 C 18 82, 28 78, 28 62 C 28 48, 28 36, 26 28 Z"
        fill="url(#puppyEarGrad)"
        stroke="#451A03"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Floppy Right Ear */}
      <path
        d="M 74 28 C 92 28, 96 58, 88 74 C 82 82, 72 78, 72 62 C 72 48, 72 36, 74 28 Z"
        fill="url(#puppyEarGrad)"
        stroke="#451A03"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Puppy Head Base */}
      <ellipse
        cx="50"
        cy="52"
        rx="37"
        ry="32"
        fill="url(#puppyHeadGrad)"
        stroke="#78350F"
        strokeWidth="3"
      />

      {/* Cute Caramel Eye Patch around Left Eye */}
      <path
        d="M 26 40 C 26 30, 44 28, 45 42 C 46 54, 32 58, 26 50 C 23 46, 26 44, 26 40 Z"
        fill="url(#puppyPatchGrad)"
        opacity="0.85"
      />

      {/* Big Sparkling Puppy Eyes */}
      {/* Left Eye */}
      <g>
        <ellipse cx="35" cy="46" rx="6" ry="7" fill="#18181B" />
        <circle cx="33" cy="43" r="2.7" fill="#FFFFFF" />
        <circle cx="37" cy="49" r="1.2" fill="#FFFFFF" />
      </g>

      {/* Right Eye */}
      <g>
        <ellipse cx="65" cy="46" rx="6" ry="7" fill="#18181B" />
        <circle cx="63" cy="43" r="2.7" fill="#FFFFFF" />
        <circle cx="67" cy="49" r="1.2" fill="#FFFFFF" />
      </g>

      {/* Rosy Pastel Cheeks */}
      <circle cx="20" cy="58" r="7" fill="#FB7185" opacity="0.65" />
      <circle cx="80" cy="58" r="7" fill="#FB7185" opacity="0.65" />

      {/* Soft White Muzzle / Snout Area */}
      <ellipse
        cx="50"
        cy="64"
        rx="17"
        ry="13"
        fill="#FFFFFF"
        stroke="#92400E"
        strokeWidth="1.8"
      />

      {/* Cute Happy Pink Tongue */}
      <path
        d="M 45 68 C 45 77, 55 77, 55 68 Z"
        fill="#FB7185"
        stroke="#9E1238"
        strokeWidth="1.5"
      />
      <line x1="50" y1="68" x2="50" y2="74" stroke="#E11D48" strokeWidth="1.2" strokeLinecap="round" />

      {/* Shiny Black Puppy Button Nose */}
      <path
        d="M 43 57 C 43 52, 57 52, 57 57 C 57 62, 50 65, 43 57 Z"
        fill="#18181B"
      />
      <ellipse cx="48" cy="55" rx="2.5" ry="1.2" fill="#FFFFFF" opacity="0.8" />

      {/* Happy Puppy Mouth */}
      <path
        d="M 42 63 Q 46 67, 50 63 Q 54 67, 58 63"
        stroke="#78350F"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

/**
 * A beautiful, cute glossy vertical book.
 * It takes a bookColor prop so we can render books in multiple vivid colors!
 */
export const CuteBook: React.FC<AssetProps & { bookColor?: string }> = ({ className = "w-12 h-12", bookColor = "#F43F5E" }) => {
  return (
    <svg
      viewBox="18 5 64 90"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
    >
      <defs>
        <linearGradient id="bookGloss" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <rect x="25" y="10" width="50" height="80" rx="4" fill="#F8FAFC" stroke="#1E293B" strokeWidth="3" />
      <line x1="28" y1="16" x2="72" y2="16" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="28" y1="84" x2="72" y2="84" stroke="#E2E8F0" strokeWidth="2" />

      <rect x="22" y="8" width="56" height="84" rx="5" fill={bookColor} stroke="#1E293B" strokeWidth="3.5" />
      <rect x="22" y="8" width="56" height="84" rx="5" fill="url(#bookGloss)" pointerEvents="none" />

      <line x1="22" y1="22" x2="32" y2="22" stroke="#FBBF24" strokeWidth="3" />
      <line x1="22" y1="78" x2="32" y2="78" stroke="#FBBF24" strokeWidth="3" />
      <line x1="22" y1="50" x2="32" y2="50" stroke="#FBBF24" strokeWidth="2" />

      <circle cx="48" cy="46" r="3.5" fill="#1E293B" />
      <circle cx="46.5" cy="44.5" r="1.2" fill="white" />
      <circle cx="62" cy="46" r="3.5" fill="#1E293B" />
      <circle cx="60.5" cy="44.5" r="1.2" fill="white" />

      <circle cx="43" cy="51" r="3" fill="#FFA4A4" opacity="0.85" />
      <circle cx="67" cy="51" r="3" fill="#FFA4A4" opacity="0.85" />

      <path
        d="M 52 51 Q 55 54, 58 51"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export interface CuteRabbitProps extends AssetProps {
  flipped?: boolean;
}

/**
 * A highly refined, soft 3D-styled white rabbit illustration with striking blue eyes,
 * upright sitting pose with paws raised, soft fur volumetric gradients, and pink inner ears.
 * Matches the reference educational artwork style.
 */
export const CuteRabbit: React.FC<CuteRabbitProps> = ({ className = "w-12 h-12", flipped = false }) => {
  return (
    <div className={`${className} inline-flex items-center justify-center select-none leading-none drop-shadow-md ${flipped ? '-scale-x-100' : ''}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="rabbit3DBody" cx="45%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="88%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>

          <radialGradient id="rabbit3DHead" cx="45%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#D1D5DB" />
          </radialGradient>

          <linearGradient id="rabbitEarPink3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="40%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          <radialGradient id="rabbitBlueEye" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>

          <filter id="softRabbitShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.15" />
          </filter>
        </defs>

        <g filter="url(#softRabbitShadow)">
          <circle cx="22" cy="72" r="8.5" fill="url(#rabbit3DBody)" stroke="#94A3B8" strokeWidth="0.8" />
          <circle cx="20" cy="70" r="6" fill="#FFFFFF" opacity="0.9" />

          <path
            d="M 38 52 C 24 52, 20 70, 30 84 C 36 90, 52 90, 58 80 C 62 66, 54 52, 38 52 Z"
            fill="url(#rabbit3DBody)"
            stroke="#94A3B8"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <ellipse cx="40" cy="87" rx="11" ry="5.5" fill="url(#rabbit3DBody)" stroke="#94A3B8" strokeWidth="0.8" />
          <ellipse cx="38" cy="86" rx="8" ry="3.5" fill="#FFFFFF" opacity="0.8" />

          <path
            d="M 38 48 C 30 55, 30 75, 46 82 C 60 84, 66 72, 60 56 C 56 46, 46 44, 38 48 Z"
            fill="url(#rabbit3DBody)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />

          <path
            d="M 52 56 C 58 56, 64 62, 60 67 C 56 70, 50 66, 48 60 Z"
            fill="url(#rabbit3DBody)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          <path
            d="M 56 58 C 65 58, 71 63, 67 70 C 62 74, 55 70, 52 64 Z"
            fill="url(#rabbit3DBody)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          <ellipse cx="64" cy="66" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.9" />

          <path
            d="M 54 26 C 48 8, 54 -6, 65 -4 C 74 -2, 68 15, 61 26 Z"
            fill="url(#rabbit3DBody)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          <path
            d="M 56 22 C 51 8, 56 0, 63 2 C 68 4, 65 15, 60 22 Z"
            fill="url(#rabbitEarPink3D)"
            opacity="0.9"
          />

          <path
            d="M 62 28 C 60 6, 70 -10, 81 -8 C 89 -6, 82 14, 71 28 Z"
            fill="url(#rabbit3DBody)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          <path
            d="M 64 24 C 63 8, 70 -3, 78 -1 C 83 1, 78 15, 70 24 Z"
            fill="url(#rabbitEarPink3D)"
          />

          <ellipse
            cx="64"
            cy="40"
            rx="17"
            ry="15"
            fill="url(#rabbit3DHead)"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />

          <path
            d="M 72 40 C 79 40, 83 44, 79 48 C 75 51, 68 49, 67 44 Z"
            fill="#FFFFFF"
          />

          <path
            d="M 80 43 C 82 43, 83 44, 82 45.5 C 81 46.5, 79.5 46.5, 79 45 Z"
            fill="#F43F5E"
          />

          <path
            d="M 79 46.5 C 79 48.5, 77.5 49.5, 76 48"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          <ellipse cx="69" cy="37" rx="4.5" ry="5.5" fill="#1E293B" />
          <ellipse cx="69" cy="37" rx="3.8" ry="4.8" fill="url(#rabbitBlueEye)" />
          <circle cx="69" cy="37" r="2.2" fill="#0F172A" />
          <circle cx="67.5" cy="35" r="1.6" fill="#FFFFFF" />
          <circle cx="70.5" cy="39" r="0.8" fill="#FFFFFF" opacity="0.9" />

          <ellipse cx="64" cy="46" rx="4" ry="2.5" fill="#F472B6" opacity="0.45" />

          <path d="M 78 46 L 86 44 M 78 47.5 L 87 47 M 78 49 L 85 51" stroke="#94A3B8" strokeWidth="0.7" opacity="0.6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

/**
 * A cute cozy 3D dog house illustration.
 */
export const CuteHouse: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md`}
    >
      <defs>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>
        <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      {/* House Body */}
      <rect
        x="18"
        y="42"
        width="64"
        height="48"
        rx="6"
        fill="url(#wallGrad)"
        stroke="#1E293B"
        strokeWidth="3.5"
      />

      {/* Roof */}
      <polygon
        points="50,12 8,45 92,45"
        fill="url(#roofGrad)"
        stroke="#1E293B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Door / Archway */}
      <path
        d="M 38 90 V 62 C 38 55, 62 55, 62 62 V 90 Z"
        fill="#334155"
        stroke="#1E293B"
        strokeWidth="3"
      />

      {/* Bone sign above door */}
      <path
        d="M 42 50 C 40 48 40 52 44 50 L 56 50 C 60 52 60 48 58 50 Z"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="2"
      />
    </svg>
  );
};

/**
 * A cute soft 3D green frog illustration.
 */
export const FrogAsset: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md overflow-visible`}
    >
      <defs>
        <radialGradient id="frogBody3D" cx="45%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="70%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </radialGradient>
      </defs>

      {/* Frog Eyes Back */}
      <circle cx="32" cy="30" r="16" fill="url(#frogBody3D)" stroke="#14532D" strokeWidth="2.5" />
      <circle cx="68" cy="30" r="16" fill="url(#frogBody3D)" stroke="#14532D" strokeWidth="2.5" />

      {/* White Eye Globes */}
      <circle cx="32" cy="30" r="10" fill="#FFFFFF" />
      <circle cx="68" cy="30" r="10" fill="#FFFFFF" />

      {/* Pupils */}
      <circle cx="34" cy="30" r="5" fill="#14532D" />
      <circle cx="66" cy="30" r="5" fill="#14532D" />
      <circle cx="32.5" cy="28.5" r="1.8" fill="#FFFFFF" />
      <circle cx="64.5" cy="28.5" r="1.8" fill="#FFFFFF" />

      {/* Head & Body */}
      <ellipse cx="50" cy="58" rx="38" ry="28" fill="url(#frogBody3D)" stroke="#14532D" strokeWidth="2.5" />

      {/* Rosy Cheeks */}
      <ellipse cx="26" cy="60" rx="6" ry="4" fill="#F472B6" opacity="0.75" />
      <ellipse cx="74" cy="60" rx="6" ry="4" fill="#F472B6" opacity="0.75" />

      {/* Happy Mouth */}
      <path d="M 38 64 Q 50 74 62 64" stroke="#14532D" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
};

/**
 * A beautiful, vibrant 3D flower SVG illustration with clear rounded pink/magenta petals, green leaves, and a sunny golden center.
 */
export const CuteFlower: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-sm overflow-visible`}
    >
      {/* Straight Green Stem */}
      <rect x="46.5" y="45" width="7" height="48" rx="3.5" fill="#6EA838" />

      {/* Leaf on Left Side of Stem */}
      <path
        d="M 47 70 C 25 65, 20 85, 47 84 Z"
        fill="#7CB342"
        stroke="#558B2F"
        strokeWidth="1"
      />
      <path d="M 47 77 C 36 75, 30 76, 26 74" stroke="#AED581" strokeWidth="1" strokeLinecap="round" />

      {/* 6 Round Pink Petals around center (50, 38) */}
      {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
        <circle
          key={idx}
          cx={50 + 17 * Math.sin((angle * Math.PI) / 180)}
          cy={38 - 17 * Math.cos((angle * Math.PI) / 180)}
          r="13"
          fill="#EC789B"
        />
      ))}

      {/* Inner Pink Highlights on Petals */}
      {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
        <circle
          key={`sub-${idx}`}
          cx={50 + 17 * Math.sin((angle * Math.PI) / 180)}
          cy={38 - 17 * Math.cos((angle * Math.PI) / 180)}
          r="10"
          fill="#E86E93"
          opacity="0.3"
        />
      ))}

      {/* White Central Disc */}
      <circle cx="50" cy="38" r="10" fill="#FFFFFF" />

      {/* Circle of 8 Pink Dots inside White Disc */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <circle
          key={`dot-${idx}`}
          cx={50 + 6.5 * Math.sin((angle * Math.PI) / 180)}
          cy={38 - 6.5 * Math.cos((angle * Math.PI) / 180)}
          r="1.2"
          fill="#EC789B"
        />
      ))}
    </svg>
  );
};

/**
 * Blue Morpho Butterfly SVG illustration matching Apple 🦋 emoji styling with vibrant iridescent blue wings, black borders with white dots, and elegant body.
 */
export const CuteButterfly: React.FC<AssetProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md overflow-visible`}
    >
      <defs>
        {/* Iridescent Blue Wing Gradient */}
        <radialGradient id="morphoBlueTop" cx="40%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="30%" stopColor="#38BDF8" />
          <stop offset="65%" stopColor="#0284C7" />
          <stop offset="90%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </radialGradient>

        <radialGradient id="morphoBlueBottom" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="85%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>

        {/* Butterfly Body Gradient */}
        <linearGradient id="butterflyBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Left Top Wing */}
      <g>
        {/* Black Outer Border Base */}
        <path
          d="M 48 44 C 35 15, 8 12, 6 36 C 5 52, 28 58, 48 48 Z"
          fill="#0F172A"
        />
        {/* Iridescent Blue Core */}
        <path
          d="M 47 43 C 35 20, 12 18, 10 36 C 9 48, 28 54, 47 47 Z"
          fill="url(#morphoBlueTop)"
        />
        {/* Wing Veins Left Top */}
        <path d="M 47 43 C 35 32, 20 28, 14 30" stroke="#0369A1" strokeWidth="1.2" opacity="0.6" />
        <path d="M 47 43 C 38 40, 24 40, 16 42" stroke="#0369A1" strokeWidth="1.2" opacity="0.6" />
        <path d="M 47 43 C 40 45, 28 48, 22 50" stroke="#0369A1" strokeWidth="1" opacity="0.6" />

        {/* White Border Dots */}
        <circle cx="8" cy="22" r="0.9" fill="#FFFFFF" opacity="0.9" />
        <circle cx="7" cy="28" r="1.1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="7" cy="35" r="1.1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="9" cy="42" r="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="13" cy="48" r="0.9" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Right Top Wing */}
      <g>
        {/* Black Outer Border Base */}
        <path
          d="M 52 44 C 65 15, 92 12, 94 36 C 95 52, 72 58, 52 48 Z"
          fill="#0F172A"
        />
        {/* Iridescent Blue Core */}
        <path
          d="M 53 43 C 65 20, 88 18, 90 36 C 91 48, 72 54, 53 47 Z"
          fill="url(#morphoBlueTop)"
        />
        {/* Wing Veins Right Top */}
        <path d="M 53 43 C 65 32, 80 28, 86 30" stroke="#0369A1" strokeWidth="1.2" opacity="0.6" />
        <path d="M 53 43 C 62 40, 76 40, 84 42" stroke="#0369A1" strokeWidth="1.2" opacity="0.6" />
        <path d="M 53 43 C 60 45, 72 48, 78 50" stroke="#0369A1" strokeWidth="1" opacity="0.6" />

        {/* White Border Dots */}
        <circle cx="92" cy="22" r="0.9" fill="#FFFFFF" opacity="0.9" />
        <circle cx="93" cy="28" r="1.1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="93" cy="35" r="1.1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="91" cy="42" r="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="87" cy="48" r="0.9" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Left Bottom Wing */}
      <g>
        {/* Black Outer Border Base */}
        <path
          d="M 47 48 C 28 50, 16 68, 25 86 C 36 94, 46 72, 47 48 Z"
          fill="#0F172A"
        />
        {/* Iridescent Blue Core */}
        <path
          d="M 47 48 C 30 52, 20 68, 27 82 C 35 88, 44 70, 47 48 Z"
          fill="url(#morphoBlueBottom)"
        />
        {/* Wing Veins Left Bottom */}
        <path d="M 47 48 C 38 60, 28 72, 28 80" stroke="#0284C7" strokeWidth="1" opacity="0.5" />
        <path d="M 47 48 C 42 62, 36 76, 36 84" stroke="#0284C7" strokeWidth="1" opacity="0.5" />

        {/* White Border Dots */}
        <circle cx="21" cy="74" r="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="25" cy="82" r="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="31" cy="87" r="1" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Right Bottom Wing */}
      <g>
        {/* Black Outer Border Base */}
        <path
          d="M 53 48 C 72 50, 84 68, 75 86 C 64 94, 54 72, 53 48 Z"
          fill="#0F172A"
        />
        {/* Iridescent Blue Core */}
        <path
          d="M 53 48 C 70 52, 80 68, 73 82 C 65 88, 56 70, 53 48 Z"
          fill="url(#morphoBlueBottom)"
        />
        {/* Wing Veins Right Bottom */}
        <path d="M 53 48 C 62 60, 72 72, 72 80" stroke="#0284C7" strokeWidth="1" opacity="0.5" />
        <path d="M 53 48 C 58 62, 64 76, 64 84" stroke="#0284C7" strokeWidth="1" opacity="0.5" />

        {/* White Border Dots */}
        <circle cx="79" cy="74" r="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="75" cy="82" r="1" fill="#FFFFFF" opacity="0.9" />
        <circle cx="69" cy="87" r="1" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Delicate Antennae */}
      <path d="M 48 30 C 44 18, 34 10, 28 12" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M 52 30 C 56 18, 66 10, 72 12" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="12" r="1.5" fill="#0F172A" />
      <circle cx="72" cy="12" r="1.5" fill="#0F172A" />

      {/* Slender Dark Butterfly Body */}
      <ellipse cx="50" cy="50" rx="3.5" ry="20" fill="url(#butterflyBodyGrad)" stroke="#0F172A" strokeWidth="0.8" />
      <circle cx="50" cy="30" r="4.5" fill="url(#butterflyBodyGrad)" stroke="#0F172A" strokeWidth="0.8" />
      {/* Body Segment Lines */}
      <line x1="47.5" y1="42" x2="52.5" y2="42" stroke="#64748B" strokeWidth="0.8" />
      <line x1="47" y1="48" x2="53" y2="48" stroke="#64748B" strokeWidth="0.8" />
      <line x1="47.5" y1="54" x2="52.5" y2="54" stroke="#64748B" strokeWidth="0.8" />
      <line x1="48" y1="60" x2="52" y2="60" stroke="#64748B" strokeWidth="0.8" />
    </svg>
  );
};


