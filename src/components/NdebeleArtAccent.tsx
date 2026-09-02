import React from 'react';

interface NdebeleArtAccentProps {
  type?: 'banner' | 'vertical-stripe' | 'border-tab' | 'badge';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function NdebeleArtAccent({ 
  type = 'banner', 
  className = '', 
  size = 'md' 
}: NdebeleArtAccentProps) {
  
  if (type === 'banner') {
    // A stunning horizontal tribal banner featuring traditional symmetric geometric chevrons/diamonds.
    return (
      <div className={`relative overflow-hidden rounded-xl border-2 border-slate-900 bg-white select-none shadow-sm ${className}`}>
        <svg 
          viewBox="0 0 400 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full block"
        >
          {/* Base Background Grid */}
          <rect width="400" height="60" fill="#FFFFFF" />

          {/* Left Block - Yellow Diamond Layout */}
          <polygon points="0,0 40,0 20,30" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="0,60 40,60 20,30" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="40,0 40,60 20,30" fill="#3B82F6" stroke="#0F172A" strokeWidth="2.5" />
          
          {/* Black solid center dividers */}
          <rect x="40" y="0" width="8" height="60" fill="#0F172A" />

          {/* Symmetrical Middle Masterpiece */}
          {/* Cobalt Chevron & Coral Triangles */}
          <polygon points="48,0 120,0 84,30" fill="#818CF8" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="miter" />
          <polygon points="48,60 120,60 84,30" fill="#34D399" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="miter" />
          
          {/* Centered Diamond Structure */}
          <polygon points="120,0 160,30 120,60 80,30" fill="#F43F5E" stroke="#0F172A" strokeWidth="2.5" />
          {/* Inside Diamond Core */}
          <polygon points="120,12 144,30 120,48 96,30" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <rect x="115" y="25" width="10" height="10" fill="#0F172A" />

          {/* Mirror Column separators */}
          <rect x="160" y="0" width="8" height="60" fill="#0F172A" />

          {/* Core House Gable shape - Classic Ndebele architecture motif */}
          <polygon points="168,60 200,10 232,60" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="184,60 200,35 216,60" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <polygon points="194,60 200,50 206,60" fill="#0F172A" />

          <rect x="232" y="0" width="8" height="60" fill="#0F172A" />

          {/* Right Chevron Pattern matching Left side to create visual order */}
          <polygon points="240,0 312,0 276,30" fill="#10B981" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="240,60 312,60 276,30" fill="#818CF8" stroke="#0F172A" strokeWidth="2.5" />
          
          <polygon points="312,0 352,30 312,60 272,30" fill="#EC4899" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="312,12 336,30 312,48 288,30" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <rect x="307" y="25" width="10" height="10" fill="#0F172A" />

          <rect x="352" y="0" width="8" height="60" fill="#0F172A" />

          {/* Right End Layout */}
          <polygon points="360,0 400,0 380,30" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="360,60 400,60 380,30" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
          <polygon points="360,0 360,60 380,30" fill="#3B82F6" stroke="#0F172A" strokeWidth="2.5" />
        </svg>

        {/* Small subtle badge at the corner to specify cultural inspiration context */}
        <div className="absolute right-2 bottom-1 bg-slate-900 border border-slate-800 text-[8px] font-bold font-mono tracking-widest text-[#FFFFFF] px-1.5 py-0.5 rounded uppercase leading-normal opacity-90 scale-90">
          Ndebele Motif
        </div>
      </div>
    );
  }

  if (type === 'vertical-stripe') {
    // Beautiful, thin vertical stripe that runs down the sidebar element edge
    return (
      <div className={`w-3.5 h-full relative overflow-hidden bg-white shrink-0 border-r border-slate-900 select-none ${className}`}>
        <svg 
          viewBox="0 0 14 300" 
          preserveAspectRatio="none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full block"
        >
          {/* Repeating elegant triangles of vibrant traditional hues with clear black outlines */}
          {/* Pattern Unit 1 */}
          <polygon points="0,0 14,15 0,30" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="14,30 0,45 14,60" fill="#3F51B5" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="0,60 14,75 0,90" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="14,90 0,105 14,120" fill="#EC4899" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Black solid center dividers */}
          <rect x="0" y="120" width="14" height="6" fill="#0F172A" />

          {/* Pattern Unit 2 */}
          <polygon points="0,126 14,141 0,156" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="14,156 0,171 14,186" fill="#3B82F6" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="0,186 14,201 0,216" fill="#34D399" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="14,216 0,231 14,246" fill="#F43F5E" stroke="#0F172A" strokeWidth="1.5" />

          {/* Black solid divider */}
          <rect x="0" y="246" width="14" height="6" fill="#0F172A" />

          {/* Pattern Unit 3 */}
          <polygon points="0,252 14,267 0,282" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
          <polygon points="14,282 0,297 14,312" fill="#818CF8" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  if (type === 'border-tab') {
    // Decorative tab accent block highlighting selected pages
    return (
      <svg 
        viewBox="0 0 10 40" 
        preserveAspectRatio="none"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`w-2.5 h-full block shrink-0 ${className}`}
      >
        <polygon points="0,0 10,10 0,20" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
        <polygon points="0,20 10,30 0,40" fill="#3B82F6" stroke="#0F172A" strokeWidth="1.5" />
      </svg>
    );
  }

  // Small Badge/Icon Accent representing traditional geometric layout
  return (
    <div className={`w-5 h-5 flex items-center justify-center shrink-0 border border-slate-900 rounded-sm overflow-hidden bg-white scale-110 ${className}`}>
      <svg viewBox="0 0 20 20" fill="none" className="w-full h-full block">
        <rect width="20" height="20" fill="#FFFFFF" />
        <polygon points="0,0 10,10 20,0" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
        <polygon points="0,20 10,10 20,20" fill="#3B82F6" stroke="#0F172A" strokeWidth="1.5" />
        <polygon points="0,0 0,20 10,10" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
        <polygon points="20,0 20,20 10,10" fill="#EC4899" stroke="#0F172A" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
