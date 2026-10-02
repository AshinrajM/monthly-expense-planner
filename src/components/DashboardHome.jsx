import { useState, useEffect } from "react";
import { Clock, ArrowUpRight, CalendarDays, Sparkles, CheckCircle2 } from "lucide-react";
import { formatMonthString, getCurrentMonthString } from "@/lib/dateUtils";
import { getPaymentsForMonth, calculateMonthStats, togglePaymentStatus } from "@/lib/paymentUtils";
import { getPaymentCategoryInfo } from "@/lib/iconUtils";
import ProgressCard from "./ProgressCard";
import PaymentCard from "./PaymentCard";
import PaymentDetailModal from "./PaymentDetailModal";
import AnalyticsCard from "./AnalyticsCard";

export default function DashboardHome({ monthStr, refreshTrigger, onStatusChange }) {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const currentRealMonth = getCurrentMonthString();
  const isHistory = monthStr < currentRealMonth;
  const isFuture = monthStr > currentRealMonth;

  useEffect(() => {
    let isMounted = true;
    if (monthStr) {
      getPaymentsForMonth(monthStr).then((currentPayments) => {
        if (!isMounted) return;
        const sortedPayments = [...currentPayments].sort((a, b) => {
          if (a.paid !== b.paid) return a.paid ? 1 : -1;
          return a.dueDay - b.dueDay;
        });
        setPayments(sortedPayments);
        setStats(calculateMonthStats(currentPayments));
      });
    }
    return () => {
      isMounted = false;
    };
  }, [monthStr, refreshTrigger]);

  const handleToggle = async (monthStr, id, newStatus) => {
    await togglePaymentStatus(monthStr, id, newStatus);
    onStatusChange();
  };

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
  };

  if (!stats) return null;

  // Find the most immediate upcoming payment that is not paid
  const upcomingPayment = (!isHistory && payments.length > 0) 
    ? payments.find(p => !p.paid) 
    : null;

  const upcomingCategory = upcomingPayment ? getPaymentCategoryInfo(upcomingPayment.name) : null;
  const UpcomingIcon = upcomingCategory ? upcomingCategory.icon : Clock;

  return (
    <div className="animate-in fade-in duration-500 w-full pt-2">
      {/* Responsive Grid Layout: Single column on mobile, 2-column grid on desktop/tablet */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Overview & Analytics (md: 5 columns) */}
        <div className="md:col-span-5 lg:col-span-5 space-y-6">
          <ProgressCard stats={stats} monthStr={monthStr} isHistory={isHistory} />
          
          <div className="hidden md:block">
            <AnalyticsCard currentMonthStr={monthStr} />
          </div>
        </div>

        {/* RIGHT COLUMN: Priority Banner & Payment List (md: 7 columns) */}
        <div className="md:col-span-7 lg:col-span-7 space-y-6">
          
          {/* Upcoming Highlight Banner */}
          {upcomingPayment && !isFuture && !isHistory && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                  <Clock size={12} className="text-amber-500" />
                  Immediate Priority
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  Next Due
                </span>
              </div>

              <div 
                onClick={() => handlePaymentClick(upcomingPayment)}
                className="group relative overflow-hidden rounded-[24px] p-5 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-white backdrop-blur-xl border border-amber-200/80 shadow-[0_12px_30px_-5px_rgba(245,158,11,0.12)] cursor-pointer active:scale-[0.98] hover:shadow-md transition-all"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-orange-500 rounded-l-[24px]" />
                
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${upcomingCategory.bgClass} ${upcomingCategory.textClass} ${upcomingCategory.borderClass}`}>
                      <UpcomingIcon size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors flex items-center gap-1">
                        {upcomingPayment.name}
                        <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
                      </h3>
                      <p className="text-xs text-amber-700 font-semibold mt-0.5">
                        Due {formatMonthString(monthStr).split(" ")[0]} {upcomingPayment.dueDay}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-black tracking-tight text-slate-900">
                      ₹{upcomingPayment.monthlyAmount.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">Monthly</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment List Header */}
          <div>
            <div className="flex justify-between items-center mb-3.5 px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  {isHistory ? "Settled Payments" : isFuture ? "Scheduled Payments" : "Active Payments"}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {payments.length}
                </span>
              </div>

              {stats.pendingCount > 0 && !isHistory && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  {stats.pendingCount} pending
                </span>
              )}
            </div>
            
            {payments.length === 0 ? (
              <div className="glass-card rounded-[28px] text-center py-12 px-6 border border-slate-200/60 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={24} />
                </div>
                <p className="text-slate-900 font-bold text-base mb-1">
                  {isFuture ? "No Payments Scheduled Yet" : "All Clear for This Month!"}
                </p>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                  {isFuture ? "Tap the '+' button to add your recurring payment plan." : "Enjoy your peace of mind. No pending checklist items."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((payment, index) => (
                  <PaymentCard 
                    key={payment.id} 
                    payment={payment} 
                    monthStr={monthStr} 
                    onToggle={handleToggle}
                    onClick={() => handlePaymentClick(payment)}
                    isHistory={isHistory}
                    isFuture={isFuture}
                    style={{ animationDelay: `${index * 40}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Analytics card on mobile stays in main stack */}
          <div className="block md:hidden">
            <AnalyticsCard currentMonthStr={monthStr} />
          </div>

        </div>

      </div>

      {selectedPayment && (
        <PaymentDetailModal 
          payment={selectedPayment} 
          monthStr={monthStr}
          onClose={() => setSelectedPayment(null)}
          onUpdate={() => {
            setSelectedPayment(null);
            onStatusChange();
          }}
        />
      )}
    </div>
  );
}
