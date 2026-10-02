import { useState, useEffect } from "react";
import { X, Minus, Plus, Calendar, Tag, CreditCard, Sparkles, ChevronDown } from "lucide-react";
import { savePaymentPlan } from "@/lib/storage";
import { getCurrentMonthString, formatMonthString, getSurroundingMonths } from "@/lib/dateUtils";

export default function AddPaymentModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [calculationMode, setCalculationMode] = useState("split"); // "split" (Total ÷ Months) or "fixed" (Monthly × Months)
  const [amountInput, setAmountInput] = useState("");
  const [durationMonths, setDurationMonths] = useState(1);
  const [splitMonths, setSplitMonths] = useState(1);
  const [startMonth, setStartMonth] = useState(getCurrentMonthString());
  const [dueDay, setDueDay] = useState("5");
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const monthOptions = getSurroundingMonths(getCurrentMonthString(), 0, 12);
  
  // Calculate amounts dynamically based on selected mode
  useEffect(() => {
    const val = parseFloat(amountInput) || 0;
    if (val > 0 && durationMonths > 0) {
      if (calculationMode === "split") {
        setTotalAmount(val);
        const months = splitMonths > 0 ? splitMonths : durationMonths;
        setMonthlyAmount(Math.ceil(val / months));
      } else {
        setMonthlyAmount(val);
        setTotalAmount(val * durationMonths);
      }
    } else {
      setMonthlyAmount(0);
      setTotalAmount(0);
    }
  }, [amountInput, durationMonths, calculationMode, splitMonths]);

  const handleModeSwitch = (mode) => {
    setCalculationMode(mode);
    if (mode === "fixed" && durationMonths === 1) {
      setDurationMonths(12);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amountInput || !startMonth || !dueDay || isLoading) return;

    setIsLoading(true);
    try {
      const finalDuration = calculationMode === "split" ? (parseInt(splitMonths) || 1) : (parseInt(durationMonths) || 12);
      const newPlan = {
        id: `payment-${Date.now()}`,
        name,
        totalAmount,
        durationMonths: finalDuration,
        monthlyAmount,
        splitMonths: calculationMode === "split" ? splitMonths : undefined,
        startMonth,
        dueDay: parseInt(dueDay),
        createdAt: new Date().toISOString()
      };

      await savePaymentPlan(newPlan);
      onSuccess();
    } catch (err) {
      console.error("Failed to add payment:", err);
    } finally {
      setIsLoading(false);
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
      <div className="relative bg-white w-full max-w-md mx-auto rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 sm:p-8 animate-in slide-in-from-bottom-6 sm:zoom-in-95 fade-in duration-300 max-h-[90vh] overflow-y-auto border border-slate-100">
        
        {/* Mobile drag bar */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 mb-1">
              <Sparkles size={11} />
              New Entry
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Add Payment Plan</h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Segmented Control */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 border border-slate-200/50">
          <button
            type="button"
            onClick={() => handleModeSwitch("split")}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 ${
              calculationMode === "split"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Split Total (EMI)
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("fixed")}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 ${
              calculationMode === "fixed"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Fixed Monthly (Rent)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Payment Name
            </label>
            <div className="relative">
              <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={calculationMode === "fixed" ? "e.g. House Rent, WiFi, Netflix" : "e.g. iPhone EMI, Car Loan"}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-semibold placeholder:font-normal placeholder:text-slate-400 text-sm"
                required
              />
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              {calculationMode === "split" ? "Total Plan Amount" : "Monthly Amount"}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="5000"
                min="1"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xl font-extrabold text-slate-900"
                required
              />
            </div>

            {calculationMode === "split" && (
              <div className="mt-2.5 flex items-center justify-between bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                <label className="text-xs font-semibold text-indigo-900">Split amount into</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    value={splitMonths}
                    onChange={(e) => setSplitMonths(parseInt(e.target.value) || 1)}
                    className="w-16 px-2.5 py-1 border border-indigo-200 rounded-lg text-sm font-bold text-center bg-white"
                  />
                  <span className="text-xs font-bold text-indigo-700">months</span>
                </div>
              </div>
            )}
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Total Duration
            </label>
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5">
              <button 
                type="button" 
                onClick={() => setDurationMonths(Math.max(1, durationMonths - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-700 shadow-xs border border-slate-200 active:scale-95 transition-all hover:bg-slate-50"
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>

              <div className="text-center flex-1">
                <span className="text-lg font-extrabold text-slate-900">{durationMonths}</span>
                <span className="text-xs font-semibold text-slate-500 ml-1.5">Months</span>
              </div>

              <button 
                type="button" 
                onClick={() => setDurationMonths(durationMonths + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-slate-700 shadow-xs border border-slate-200 active:scale-95 transition-all hover:bg-slate-50"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Dynamic Summary Card */}
          {monthlyAmount > 0 && (
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl relative overflow-hidden animate-in fade-in duration-300 shadow-lg shadow-slate-900/10">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-indigo-200 text-xs font-medium mb-0.5">
                    {calculationMode === "split" ? "Calculated Monthly Payment" : "Calculated Total Plan"}
                  </p>
                  <div className="text-2xl font-extrabold tracking-tight">
                    ₹{(calculationMode === "split" ? monthlyAmount : totalAmount).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right text-indigo-300 text-xs font-medium bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  {calculationMode === "split" 
                    ? `₹${parseFloat(amountInput).toLocaleString('en-IN')} ÷ ${splitMonths} mos`
                    : `₹${parseFloat(amountInput).toLocaleString('en-IN')} × ${durationMonths} mos`}
                </div>
              </div>
            </div>
          )}

          {/* Start Month & Due Day */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Start Month</label>
              <div className="relative">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none text-slate-900 font-semibold text-xs"
                  required
                >
                  {monthOptions.map(m => (
                    <option key={m} value={m}>{formatMonthString(m).split(' ')[0]}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Due Date</label>
              <div className="relative flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl pr-4 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <input
                  type="number"
                  value={dueDay}
                  onChange={(e) => setDueDay(e.target.value)}
                  placeholder="05"
                  min="1"
                  max="31"
                  className="w-full px-4 py-3 bg-transparent focus:outline-none text-slate-900 font-bold text-xs text-center"
                  required
                />
                <span className="text-slate-400 text-xs font-bold">th</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-4 rounded-2xl font-bold mt-3 hover:shadow-xl active:scale-[0.98] transition-all text-base shadow-lg shadow-slate-900/15 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Payment Plan...</span>
              </>
            ) : (
              <span>Create Payment Plan</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}