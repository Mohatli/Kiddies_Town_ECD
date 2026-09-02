import React from 'react';

export default function KiddiesTownLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`${className} shrink-0 select-none`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle & Decorative Inner Rings to form a clean emblem */}
      <circle cx="100" cy="100" r="97" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="93" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="3 2" opacity="0.75" />
      
      {/* --- CASTLE & SKYLINE BACKGROUND --- */}
      {/* Spire/Antenna on top of the Purple Building */}
      <path d="M60 22 L60 40 M60 27 L66 22 M60 32 L66 32" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Purple building / tower */}
      <polygon points="45,95 45,50 60,35 75,50 75,95" fill="#818CF8" />
      
      {/* Green skyscraper and white window */}
      <rect x="75" y="42" width="22" height="53" fill="#34D399" />
      <rect x="83" y="50" width="6" height="12" rx="1" fill="#FFFFFF" />
      
      {/* Yellow/Amber center block */}
      <rect x="97" y="55" width="20" height="40" fill="#FBBF24" />
      
      {/* Red brick building with circular attic window */}
      <polygon points="117,95 117,45 140,25 155,45 155,95" fill="#F87171" />
      <circle cx="136" cy="48" r="5.5" fill="#FFFFFF" />
      
      {/* Curved ground line representing the hill */}
      <path d="M35 95 Q100 88 165 95" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />

      {/* --- THE CHARMING KIDS FOREGROUND --- */}
      {/* 1. Waving Girl (Left side) */}
      <g>
        {/* Hair buns */}
        <circle cx="55" cy="70" r="3.5" fill="#78350F" />
        <circle cx="65" cy="70" r="3.5" fill="#78350F" />
        {/* Head and Face */}
        <circle cx="60" cy="75" r="5.5" fill="#FDBA74" />
        {/* Hair line */}
        <path d="M54 73 Q60 70 66 73" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        {/* Eyes and Smile */}
        <circle cx="58" cy="75" r="0.5" fill="#1F2937" />
        <circle cx="62" cy="75" r="0.5" fill="#1F2937" />
        <path d="M58 77 Q60 79 62 77" fill="none" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
        {/* Red dress */}
        <path d="M55 80 L65 80 L63 90 L57 90 Z" fill="#EF4444" />
        {/* Small legs and feet */}
        <line x1="58" y1="90" x2="58" y2="94" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="62" y1="90" x2="62" y2="94" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        {/* Waving arms */}
        <path d="M55 82 Q51 77 50 78 M65 82 Q69 77 70 78" fill="none" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 2. Sitting Toddler (Middle) */}
      <g>
        {/* Head */}
        <circle cx="100" cy="80" r="5" fill="#FDBA74" />
        {/* Hair */}
        <path d="M96 78 Q100 75 104 78" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        {/* Eyes and Smile */}
        <circle cx="98" cy="80" r="0.5" fill="#1F2937" />
        <circle cx="102" cy="80" r="0.5" fill="#1F2937" />
        <path d="M98 82 Q100 84 102 82" fill="none" stroke="#78350F" strokeWidth="0.8" strokeLinecap="round" />
        {/* Cyan shirt */}
        <path d="M96 85 L104 85 L103 91 L97 91 Z" fill="#0EA5E9" />
        {/* Sitting blue/indigo pants */}
        <ellipse cx="100" cy="92" rx="6.5" ry="3.2" fill="#818CF8" />
      </g>

      {/* 3. Cheerful Boy (Right side) */}
      <g>
        {/* Head and short black hair */}
        <circle cx="140" cy="76" r="5.5" fill="#FDBA74" />
        <path d="M134 74 Q140 71 146 74" fill="none" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
        {/* Eyes and Smile */}
        <circle cx="138" cy="76" r="0.5" fill="#1F2937" />
        <circle cx="142" cy="76" r="0.5" fill="#1F2937" />
        <path d="M138 78 Q140 80 142 78" fill="none" stroke="#1F2937" strokeWidth="0.8" strokeLinecap="round" />
        {/* Green top shirt */}
        <rect x="135" y="81" width="10" height="9" rx="1" fill="#10B981" />
        {/* Blue shorts and legs */}
        <rect x="136" y="90" width="8" height="3" fill="#2563EB" />
        <line x1="138" y1="93" x2="138" y2="95" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="142" y1="93" x2="142" y2="95" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" />
        {/* Waving arms */}
        <path d="M135 83 Q131 79 130 81 M145 83 Q149 78 151 79" fill="none" stroke="#FDBA74" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* --- TYPOGRAPHY SECTION --- */}
      {/* Colorful "KIDDIES" block lettering */}
      <text 
        x="100" 
        y="128" 
        textAnchor="middle" 
        fontFamily="'Nunito', 'Segoe UI', system-ui, sans-serif" 
        fontWeight="950" 
        fontSize="27" 
        letterSpacing="0.8"
      >
        <tspan fill="#EF4444">K</tspan>
        <tspan fill="#2563EB">I</tspan>
        <tspan fill="#CA8A04">D</tspan>
        <tspan fill="#10B981">D</tspan>
        <tspan fill="#EC4899">I</tspan>
        <tspan fill="#8B5CF6">E</tspan>
        <tspan fill="#0EA5E9">S</tspan>
      </text>

      {/* Enormous, bold Orange "TOWN" block lettering */}
      <text 
        x="100" 
        y="161" 
        textAnchor="middle" 
        fontFamily="'Arial Black', 'Impact', system-ui, sans-serif" 
        fontWeight="900" 
        fontSize="33" 
        fill="#F97316" 
        letterSpacing="0.5"
      >
        TOWN
      </text>

      {/* Subtext academic "ECD" label */}
      <text 
        x="134" 
        y="180" 
        textAnchor="middle" 
        fontFamily="'Segoe UI', system-ui, sans-serif" 
        fontWeight="bold" 
        fontSize="11" 
        fill="#64748B" 
        letterSpacing="1.2"
      >
        ECD
      </text>
    </svg>
  );
}

