"use client";

import { Home, Calendar, Plus, Settings } from "lucide-react";

export default function FloatingNav({ activeView, setActiveView, onAddClick }) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "add", icon: Plus, label: "Add Payment", isAction: true },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4">
      <div className="glass-nav rounded-full p-2 flex items-center justify-between shadow-[0_20px_50px_-10px_rgba(15,23,42,0.12)] border border-white/90">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onAddClick}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg shadow-indigo-950/20 hover:scale-105 active:scale-95 transition-all duration-300 relative group"
                aria-label={item.label}
              >
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon size={22} strokeWidth={2.5} className="relative z-10" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`relative h-11 px-4 flex items-center gap-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/15" 
                  : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 active:scale-95"
              }`}
              aria-label={item.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="text-xs font-bold tracking-tight animate-in fade-in slide-in-from-left-2 duration-200">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}