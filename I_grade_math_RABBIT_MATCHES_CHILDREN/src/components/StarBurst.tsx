import React from 'react';
import { motion } from 'motion/react';
import { Star, Sparkles } from 'lucide-react';

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  rotate: number;
}

export const StarBurst: React.FC = () => {
  // Generate 16 colorful star particles exploding outwards
  const colors = [
    '#FACC15', // Gold
    '#FBBF24', // Amber
    '#A855F7', // Purple
    '#EC4899', // Pink
    '#38BDF8', // Sky Blue
    '#F97316', // Orange
    '#34D399', // Mint Green
  ];

  const particles: StarParticle[] = React.useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const angle = (i * (360 / 18) + (Math.random() * 20 - 10)) * (Math.PI / 180);
      const distance = 80 + Math.random() * 120;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 20, // slightly upwards
        size: 16 + Math.random() * 22,
        color: colors[i % colors.length],
        delay: Math.random() * 0.15,
        rotate: Math.random() * 360,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0, 1.4, 0.9, 0],
            opacity: [1, 1, 0.8, 0],
            rotate: p.rotate + 180,
          }}
          transition={{
            duration: 1.4,
            ease: 'easeOut',
            delay: p.delay,
          }}
          className="absolute"
          style={{ color: p.color }}
        >
          {p.id % 2 === 0 ? (
            <Star style={{ width: p.size, height: p.size, fill: 'currentColor' }} />
          ) : (
            <Sparkles style={{ width: p.size, height: p.size, fill: 'currentColor' }} />
          )}
        </motion.div>
      ))}
    </div>
  );
};
