import React from 'react';

export default function AppLogo({ className = "", iconOnly = false, size = "md" }) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const svgSizes = {
    sm: 18,
    md: 22,
    lg: 26
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon Badge */}
      <div className={`${iconSizes[size] || iconSizes.md} rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center shadow-md shadow-indigo-950/20 border border-slate-800 relative group overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-indigo-500/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        {/* SVG Vector Logo Mark */}
        <svg 
          width={svgSizes[size] || 22} 
          height={svgSizes[size] || 22} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Calendar Body Base */}
          <rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" fill="none" />
          {/* Calendar Header Bar */}
          <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
          {/* Top Pins */}
          <path d="M8 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Glowing Emerald Checkmark */}
          <path d="M8 14.5L11 17.5L16.5 11" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="text-left">
          <span className="text-sm font-black tracking-wider text-slate-900 uppercase block leading-none">
            MONTHLY
          </span>
          <span className="text-[10px] font-bold text-slate-400 block mt-0.5 tracking-tight">
            Personal Expense Planner
          </span>
        </div>
      )}
    </div>
  );
}
