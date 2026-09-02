import React from 'react';

interface FloatingBalloonsProps {
  count?: number;
  seed?: number;
  opacity?: string; // custom opacity override if needed
}

export default function FloatingBalloons({ count = 5, seed = 0, opacity = 'opacity-[0.45]' }: FloatingBalloonsProps) {
  const colors = [
    'text-red-500 bg-red-400/15 border-red-300/40',
    'text-amber-500 bg-amber-400/15 border-amber-300/40',
    'text-emerald-500 bg-emerald-400/15 border-emerald-300/40',
    'text-indigo-500 bg-indigo-400/15 border-indigo-300/40',
    'text-rose-500 bg-rose-400/15 border-rose-300/40',
    'text-violet-500 bg-violet-400/15 border-violet-300/40',
    'text-sky-500 bg-sky-400/15 border-sky-300/40'
  ];

  const sizes = [
    'w-10 h-10',
    'w-14 h-14',
    'w-20 h-20',
    'w-24 h-24',
    'w-32 h-32',
    'w-40 h-40'
  ];

  const positions = [
    { top: '8%', left: '4%' },
    { top: '82%', left: '7%' },
    { top: '15%', right: '9%' },
    { top: '78%', right: '6%' },
    { top: '48%', left: '12%' },
    { top: '35%', right: '14%' },
    { top: '65%', left: '82%' },
    { top: '12%', left: '45%' },
    { top: '88%', left: '50%' },
    { top: '55%', right: '22%' }
  ];

  const items = Array.from({ length: count }).map((_, i) => {
    const posIndex = (i + seed) % positions.length;
    const colorIndex = (i + seed * 3 + 2) % colors.length;
    const sizeIndex = (i * 2 + seed) % sizes.length;
    
    // Speed between 7s and 15s for visual variety
    const animSpeed = 7 + ((i * 3 + seed) % 9);
    const animDelay = ((i * 2 + seed) % 6) * 0.8;

    return {
      pos: positions[posIndex],
      color: colors[colorIndex],
      size: sizes[sizeIndex],
      speed: animSpeed,
      delay: animDelay
    };
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none ${opacity}`}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`absolute rounded-full border backdrop-blur-[1px] ${item.color} ${item.size} flex items-center justify-center animate-balloon-float`}
          style={{
            ...item.pos,
            animationDuration: `${item.speed}s`,
            animationDelay: `${item.delay}s`
          }}
        >
          {/* Balloon sheen shine reflection */}
          <div className="absolute top-2 left-2 w-1/4 h-1/4 rounded-full bg-white/40 filter blur-[1px]" />
          
          {/* Triangular knot/tie at the bottom coordinates of the balloon */}
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-current opacity-30" 
            style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} 
          />
          {/* Thin hanging string */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-current opacity-20" />
        </div>
      ))}
    </div>
  );
}
