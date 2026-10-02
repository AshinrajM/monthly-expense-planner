import { useState, useEffect } from "react";
import { X, Trash2, Edit2, Calendar, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { formatMonthString } from "@/lib/dateUtils";
import { getMonthlyStatuses } from "@/lib/storage";
import { deletePaymentPlan } from "@/lib/paymentUtils";
import { getPaymentCategoryInfo } from "@/lib/iconUtils";

export default function PaymentDetailModal({ payment, monthStr, onClose, onUpdate }) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    getMonthlyStatuses().then((statuses) => {
      if (!isMounted) return;
      let paidCount = 0;
      Object.values(statuses).forEach((monthData) => {
        if (monthData[payment.id]?.paid) {
          paidCount++;
        }
      });
      setCompletedCount(paidCount);
    });

    return () => {
      isMounted = false;
    };
  }, [payment.id]);

  const category = getPaymentCategoryInfo(payment.name);
  const CategoryIcon = category.icon;

  const progress = Math.min(100, Math.round((completedCount / payment.durationMonths) * 100));
  const remainingAmount = Math.max(0, payment.totalAmount - (completedCount * payment.monthlyAmount));

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    if (confirm("Are you sure you want to delete this payment plan? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deletePaymentPlan(payment.id);
        onUpdate();
      } catch (err) {
        console.error("Failed to delete payment:", err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Centered Modal / Mobile Bottom Sheet */}
      <div className="relative bg-white w-full max-w-md mx-auto rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-6 sm:zoom-in-95 fade-in duration-300 border border-slate-100">
        
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${category.bgClass} ${category.textClass} ${category.borderClass}`}>
              <CategoryIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{payment.name}</h2>
              <p className="text-slate-500 font-semibold text-sm">
                ₹{payment.monthlyAmount.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ month</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Plan</p>
            <p className="text-lg font-extrabold text-slate-900">₹{payment.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
            <p className="text-lg font-extrabold text-slate-900">₹{remainingAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan Timeline</span>
            <span className="text-xs font-bold text-slate-900">
              {completedCount} of {payment.durationMonths} payments
            </span>
          </div>

          <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-[11px] font-medium text-slate-500 mt-2 flex items-center gap-1">
            <Calendar size={12} className="text-slate-400" />
            Due on the {payment.dueDay}th of every month
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
            onClick={() => alert("Edit functionality is currently in read-only mode.")}
          >
            <Edit2 size={16} />
            Edit
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm border border-rose-100 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Plan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
