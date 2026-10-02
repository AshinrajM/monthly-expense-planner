import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { formatMonthString } from "@/lib/dateUtils";
import { getPaymentCategoryInfo } from "@/lib/iconUtils";

export default function PaymentCard({ payment, monthStr, onToggle, onClick, isHistory, isFuture, style }) {
  const { id, name, monthlyAmount, dueDay, paid } = payment;
  const [isToggling, setIsToggling] = useState(false);
  
  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = monthStr === currentMonthStr;
  const isOverdue = !paid && isCurrentMonth && new Date().getDate() > dueDay;

  const category = getPaymentCategoryInfo(name);
  const CategoryIcon = category.icon;

  const handleToggleClick = async (e) => {
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    try {
      await onToggle(monthStr, id, !paid);
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div 
      style={style}
      className={`group flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-300 mb-2 border ${
        paid 
          ? "bg-slate-50/60 border-slate-200/50 opacity-75" 
          : isOverdue 
            ? "bg-rose-50/40 border-rose-200/70 shadow-xs" 
            : "bg-white/90 border-slate-200/70 shadow-xs hover:shadow-md hover:border-slate-300 cursor-pointer active:scale-[0.985]"
      }`}
    >
      {/* Checkbox Button */}
      {!isFuture && (
        <button 
          onClick={handleToggleClick}
          disabled={isToggling}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            paid 
              ? "bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 scale-100" 
              : "border-2 border-slate-300 hover:border-indigo-500 bg-white text-transparent hover:bg-indigo-50/50 active:scale-95"
          }`}
          aria-label={paid ? "Mark as unpaid" : "Mark as paid"}
        >
          {isToggling ? (
            <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-indigo-700 rounded-full animate-spin" />
          ) : (
            <Check size={14} strokeWidth={3} className={paid ? "opacity-100" : "opacity-0"} />
          )}
        </button>
      )}

      {/* Category Icon Container */}
      <div 
        onClick={onClick}
        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform duration-200 group-hover:scale-105 ${category.bgClass} ${category.textClass} ${category.borderClass}`}
      >
        <CategoryIcon size={20} />
      </div>

      {/* Payment Details */}
      <div 
        className="flex-1 min-w-0 flex items-center justify-between cursor-pointer"
        onClick={onClick}
      >
        <div className="flex-1 min-w-0 pr-2">
          <h3 className={`font-semibold text-sm truncate transition-colors duration-200 ${
            paid ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900"
          }`}>
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className={`text-xs ${
              isOverdue 
                ? "text-rose-600 font-semibold" 
                : paid 
                  ? "text-slate-400" 
                  : "text-slate-500 font-medium"
            }`}>
              {paid 
                ? `Paid for ${formatMonthString(monthStr).split(" ")[0]}` 
                : `Due ${formatMonthString(monthStr).split(" ")[0]} ${dueDay}`}
            </p>
          </div>
        </div>

        {/* Amount & Status Badge */}
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-sm tracking-tight transition-colors duration-200 ${
            paid ? "text-slate-400" : "text-slate-900"
          }`}>
            ₹{monthlyAmount.toLocaleString('en-IN')}
          </p>
          
          {!paid && !isFuture && !isHistory && isOverdue && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100/90 text-rose-700 border border-rose-200/80 shadow-2xs">
              <AlertCircle size={10} />
              Overdue
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
