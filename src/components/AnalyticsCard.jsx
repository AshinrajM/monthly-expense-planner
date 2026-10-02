import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, BarChart3, PieChart, ArrowUpRight, ChevronRight, Layers, Sparkles } from "lucide-react";
import { getCurrentMonthString, getSurroundingMonths, formatMonthString } from "@/lib/dateUtils";
import { getPaymentsForMonth, calculateMonthStats } from "@/lib/paymentUtils";
import { getPaymentCategoryInfo } from "@/lib/iconUtils";

export default function AnalyticsCard({ currentMonthStr }) {
  const [chartData, setChartData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Get 6 surrounding months for comparison (3 past, current, 2 future)
    const surrounding = getSurroundingMonths(currentMonthStr, 3, 2);

    Promise.all(
      surrounding.map(async (m) => {
        const payments = await getPaymentsForMonth(m);
        const stats = calculateMonthStats(payments);
        return { monthStr: m, payments, stats };
      })
    ).then((results) => {
      if (!isMounted) return;

      // Calculate chart data
      setChartData(results);

      // Find current vs previous month comparison
      const currentIndex = results.findIndex(r => r.monthStr === currentMonthStr);
      if (currentIndex > 0) {
        const curr = results[currentIndex].stats;
        const prev = results[currentIndex - 1].stats;

        const totalDiff = curr.totalAmount - prev.totalAmount;
        const totalDiffPct = prev.totalAmount > 0 
          ? Math.round((totalDiff / prev.totalAmount) * 100) 
          : 0;

        setComparison({
          currTotal: curr.totalAmount,
          prevTotal: prev.totalAmount,
          currPaid: curr.paidAmount,
          prevPaid: prev.paidAmount,
          totalDiff,
          totalDiffPct,
          prevMonthName: formatMonthString(results[currentIndex - 1].monthStr).split(" ")[0]
        });
      }

      // Calculate category breakdown for current month
      const currentPayments = results.find(r => r.monthStr === currentMonthStr)?.payments || [];
      const categoriesMap = {};
      let monthTotal = 0;

      currentPayments.forEach(p => {
        const catInfo = getPaymentCategoryInfo(p.name);
        const catName = p.name.toLowerCase().includes("rent") ? "Housing & Rent"
          : p.name.toLowerCase().includes("electric") || p.name.toLowerCase().includes("wifi") || p.name.toLowerCase().includes("gas") || p.name.toLowerCase().includes("water") ? "Utilities & Bills"
          : p.name.toLowerCase().includes("netflix") || p.name.toLowerCase().includes("spotify") || p.name.toLowerCase().includes("sub") ? "Subscriptions"
          : p.name.toLowerCase().includes("emi") || p.name.toLowerCase().includes("loan") || p.name.toLowerCase().includes("card") || p.name.toLowerCase().includes("laptop") ? "Loans & EMIs"
          : "General Expenses";

        if (!categoriesMap[catName]) {
          categoriesMap[catName] = { name: catName, total: 0, catInfo, count: 0 };
        }
        categoriesMap[catName].total += p.monthlyAmount;
        categoriesMap[catName].count += 1;
        monthTotal += p.monthlyAmount;
      });

      const categoriesList = Object.values(categoriesMap).map(c => ({
        ...c,
        percentage: monthTotal > 0 ? Math.round((c.total / monthTotal) * 100) : 0
      })).sort((a, b) => b.total - a.total);

      setCategoryBreakdown(categoriesList);
    });

    return () => {
      isMounted = false;
    };
  }, [currentMonthStr]);

  if (chartData.length === 0) return null;

  const maxMonthTotal = Math.max(...chartData.map(d => d.stats.totalAmount), 1);

  return (
    <div className="glass-card rounded-[32px] p-5 border border-white/90 shadow-md shadow-slate-900/5 mb-6 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <BarChart3 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-none">Spending Analytics</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">MoM Trends & Distribution</p>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
        >
          {isExpanded ? "Hide Breakdown" : "View Breakdown"}
          <ChevronRight size={14} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </button>
      </div>

      {/* MoM Comparison Highlight */}
      {comparison && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">vs {comparison.prevMonthName}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-base font-extrabold text-slate-900">
                {comparison.totalDiff >= 0 ? `+₹${comparison.totalDiff.toLocaleString('en-IN')}` : `-₹${Math.abs(comparison.totalDiff).toLocaleString('en-IN')}`}
              </span>
              <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                comparison.totalDiff >= 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}>
                {comparison.totalDiff >= 0 ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
                {Math.abs(comparison.totalDiffPct)}%
              </span>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Planned MoM</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-extrabold text-slate-900">₹{comparison.currTotal.toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-medium text-slate-400">/ mo</span>
            </div>
          </div>
        </div>
      )}

      {/* 6-Month Visual Bar Chart */}
      <div className="pt-2 pb-1">
        <div className="flex items-end justify-between gap-2 h-28 px-1 mb-2">
          {chartData.map((item) => {
            const isSelected = item.monthStr === currentMonthStr;
            const total = item.stats.totalAmount;
            const paid = item.stats.paidAmount;
            
            // Height ratio (between 15% minimum and 100%)
            const heightPct = total > 0 ? Math.max(15, Math.round((total / maxMonthTotal) * 100)) : 10;
            const paidRatio = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

            const monthAbbr = formatMonthString(item.monthStr).split(" ")[0].substring(0, 3).toUpperCase();

            return (
              <div key={item.monthStr} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                {/* Amount preview on hover/active */}
                <span className={`text-[9px] font-extrabold transition-opacity ${isSelected ? "text-indigo-600 font-black" : "text-slate-400 opacity-60 group-hover:opacity-100"}`}>
                  ₹{Math.round(total / 1000)}k
                </span>

                {/* Vertical Bar Container */}
                <div 
                  className="w-full max-w-[28px] bg-slate-100 rounded-t-xl overflow-hidden relative shadow-2xs transition-all duration-500 group-hover:scale-105 flex flex-col justify-end"
                  style={{ height: `${heightPct}%` }}
                >
                  {/* Total planned background bar */}
                  <div className={`w-full h-full absolute inset-0 ${isSelected ? "bg-indigo-100" : "bg-slate-200/70"}`} />
                  
                  {/* Paid portion bar */}
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-700 relative z-10 ${
                      isSelected 
                        ? "bg-gradient-to-t from-indigo-600 to-purple-500" 
                        : "bg-gradient-to-t from-emerald-500 to-teal-400 opacity-80"
                    }`}
                    style={{ height: `${paidRatio}%` }}
                  />
                </div>

                {/* Month Label */}
                <span className={`text-[10px] font-bold tracking-wider ${isSelected ? "text-indigo-600 font-black bg-indigo-50 px-1.5 py-0.5 rounded-full" : "text-slate-400"}`}>
                  {monthAbbr}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 pt-2 text-[10px] font-semibold text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400" />
            <span>Settled Amount</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-200" />
            <span>Total Planned</span>
          </div>
        </div>
      </div>

      {/* Expanded Category Breakdown */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
            <PieChart size={12} className="text-indigo-500" />
            Category Distribution
          </p>

          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-2">No payment categories for this month.</p>
          ) : (
            categoryBreakdown.map((cat) => {
              const Icon = cat.catInfo.icon;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${cat.catInfo.bgClass} ${cat.catInfo.textClass}`}>
                        <Icon size={13} />
                      </div>
                      <span className="font-bold text-slate-800">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">₹{cat.total.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cat.catInfo.bgClass.replace('/10', '')} bg-indigo-500`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
