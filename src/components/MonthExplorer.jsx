import { useState, useEffect, useRef } from "react";
import { ChevronDown, Calendar, CheckCircle2, Sparkles, Clock, ArrowRight } from "lucide-react";
import { getCurrentMonthString, getSurroundingMonths, formatMonthString } from "@/lib/dateUtils";
import { getPaymentsForMonth, calculateMonthStats } from "@/lib/paymentUtils";
import DashboardHome from "./DashboardHome";

export default function MonthExplorer({ selectedMonth, setSelectedMonth, refreshTrigger, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [months, setMonths] = useState([]);
  const [monthStats, setMonthStats] = useState({});
  const currentRealMonth = getCurrentMonthString();
  const timelineRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const surrounding = getSurroundingMonths(currentRealMonth, 8, 8);
    setMonths(surrounding);
    
    // Pre-calculate stats for all surrounding months to show in the timeline
    Promise.all(
      surrounding.map(async (m) => {
        const payments = await getPaymentsForMonth(m);
        return { month: m, stats: calculateMonthStats(payments) };
      })
    ).then((results) => {
      if (!isMounted) return;
      const statsObj = {};
      results.forEach(({ month, stats }) => {
        statsObj[month] = stats;
      });
      setMonthStats(statsObj);
    });

    return () => {
      isMounted = false;
    };
  }, [currentRealMonth, refreshTrigger]);

  // Scroll to selected month when timeline opens
  useEffect(() => {
    if (isOpen && timelineRef.current) {
      const selectedEl = timelineRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isOpen]);

  const handleSelect = (monthStr) => {
    setSelectedMonth(monthStr);
    setIsOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-md mx-auto pt-2">
      {/* Month Selector Header Pill */}
      <div className="mb-5 text-center">
        <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase mb-1.5 flex items-center justify-center gap-1">
          <Calendar size={12} className="text-indigo-500" />
          {isOpen ? "Select Timeline" : "Active Statement Period"}
        </p>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 active:scale-[0.98] transition-all glass-card px-5 py-2.5 rounded-full border border-white/90 shadow-md shadow-slate-900/5 hover:border-slate-300"
        >
          <span>{formatMonthString(selectedMonth)}</span>
          <div className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-300 ${isOpen ? "rotate-180 bg-slate-900 text-white" : ""}`}>
            <ChevronDown size={14} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {isOpen ? (
        <div 
          ref={timelineRef}
          className="glass-card rounded-[32px] p-5 shadow-xl border border-white/90 max-h-[65vh] overflow-y-auto animate-in slide-in-from-top-4 fade-in duration-300 relative"
        >
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline History</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">Tap month to switch</span>
          </div>

          <div className="space-y-3 relative z-10">
            {months.map(monthStr => {
              const isSelected = monthStr === selectedMonth;
              const isCurrent = monthStr === currentRealMonth;
              const isPast = monthStr < currentRealMonth;
              const isFuture = monthStr > currentRealMonth;
              const stats = monthStats[monthStr] || { totalAmount: 0, pendingCount: 0, completedCount: 0 };
              
              const hasActivity = stats.totalAmount > 0;
              
              if (!hasActivity && !isCurrent && !isSelected) return null; // Hide empty non-current months

              return (
                <div
                  key={monthStr}
                  data-selected={isSelected}
                  onClick={() => handleSelect(monthStr)}
                  className={`relative flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15 border-slate-900 scale-[1.02]" 
                      : "bg-white/80 hover:bg-white text-slate-900 border-slate-200/60 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                    isSelected 
                      ? "bg-white/15 text-white" 
                      : isCurrent 
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                        : isPast 
                          ? "bg-slate-100 text-slate-500" 
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}>
                    {isCurrent ? <Sparkles size={16} /> : isPast ? <Clock size={16} /> : <Calendar size={16} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`font-bold tracking-tight text-sm ${isSelected ? "text-white" : "text-slate-900"}`}>
                        {formatMonthString(monthStr).toUpperCase()}
                      </span>

                      {isCurrent && (
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-emerald-400 text-slate-900" : "bg-indigo-100 text-indigo-700"
                        }`}>
                          Current
                        </span>
                      )}
                    </div>

                    <div className={`text-xs font-medium ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                      {hasActivity ? (
                        <>
                          {isPast && (
                            <span className="flex items-center gap-1">
                              {stats.progress === 100 && <CheckCircle2 size={12} className="text-emerald-400" />}
                              ₹{stats.paidAmount.toLocaleString('en-IN')} Paid • {stats.completedCount} items
                            </span>
                          )}
                          {isCurrent && (
                            <span>
                              ₹{stats.remainingAmount.toLocaleString('en-IN')} Due • {stats.pendingCount} pending
                            </span>
                          )}
                          {isFuture && (
                            <span>
                              ₹{stats.totalAmount.toLocaleString('en-IN')} Scheduled
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="italic text-slate-400">No scheduled payments</span>
                      )}
                    </div>
                  </div>

                  <ArrowRight size={16} className={isSelected ? "text-white/60" : "text-slate-300"} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <DashboardHome 
          monthStr={selectedMonth} 
          refreshTrigger={refreshTrigger} 
          onStatusChange={onStatusChange} 
        />
      )}
    </div>
  );
}
