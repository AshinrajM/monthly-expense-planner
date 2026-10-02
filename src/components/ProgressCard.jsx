import { TrendingUp, CheckCircle2, Clock, Sparkles, AlertCircle } from "lucide-react";

export default function ProgressCard({ stats, monthStr, isHistory }) {
  const { totalAmount, paidAmount, remainingAmount, completedCount, pendingCount, progress } = stats;

  const isComplete = progress === 100 && totalAmount > 0;

  return (
    <div className="relative overflow-hidden rounded-[32px] p-6 glass-card border border-white/90 shadow-[0_16px_40px_-10px_rgba(15,23,42,0.06)] mb-6 transition-all duration-300">
      {/* Light gradient ambient background tint inside card */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-emerald-50/20 to-slate-50/50 pointer-events-none" />
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-gradient-to-tr from-emerald-200/30 to-teal-200/20 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10">
        {isHistory ? (
          // Past Month History View
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-slate-100/90 text-slate-600 border border-slate-200/60 shadow-xs">
                <Clock size={12} className="text-slate-500" />
                Past Overview
              </span>
              {isComplete && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200/80">
                  <CheckCircle2 size={13} />
                  Fully Settled
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-[2.75rem] font-extrabold tracking-tight text-slate-900 leading-none">
                ₹{paidAmount.toLocaleString('en-IN')}
              </h2>
              <span className="text-base font-semibold text-slate-400">Total Paid</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span>{completedCount} of {completedCount + pendingCount} items completed</span>
              </div>
              <span className="font-bold text-slate-900">{progress}%</span>
            </div>
          </div>
        ) : (
          // Current/Future Month View
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs">
                <Sparkles size={12} className="text-indigo-500" />
                {totalAmount === 0 ? "Monthly Overview" : "Remaining Due"}
              </span>

              {isComplete && totalAmount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={13} />
                  All Paid!
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-[3.25rem] font-extrabold tracking-tight text-slate-900 leading-none">
                ₹{remainingAmount.toLocaleString('en-IN')}
              </h2>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/80 rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid So Far</p>
                  <p className="text-sm font-bold text-slate-900">₹{paidAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Planned</p>
                  <p className="text-sm font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Color-Graded Progress Bar */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-slate-500">Completion Status</span>
                <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-bold">
                  {progress}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200/70 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
