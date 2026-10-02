"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Calendar, Plus, Settings, Sparkles, Layers } from "lucide-react";

import { getAuthStatus } from "@/lib/storage";
import { getCurrentMonthString } from "@/lib/dateUtils";

import FloatingNav from "@/components/FloatingNav";
import DashboardHome from "@/components/DashboardHome";
import MonthExplorer from "@/components/MonthExplorer";
import SettingsView from "@/components/SettingsView";
import AddPaymentModal from "@/components/AddPaymentModal";

export default function DashboardPage() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [activeView, setActiveView] = useState("home");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    getAuthStatus().then((isAuth) => {
      if (!isMounted) return;
      if (!isAuth) {
        router.replace("/login");
      } else {
        setIsAuthenticated(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [router]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddPayment = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    triggerRefresh();
  };

  if (isAuthenticated !== true) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-card flex flex-col items-center gap-4 p-8 rounded-3xl shadow-xl border border-white/80">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full rounded-[14px] bg-white flex items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            </div>
          </div>
          <p className="text-sm font-semibold tracking-wide text-slate-600">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Desktop & Laptop Top Header Bar */}
      <header className="hidden md:block sticky top-0 z-30 pt-4 px-6 mb-4">
        <div className="max-w-6xl mx-auto glass-card rounded-full px-6 py-3 border border-white/90 shadow-md shadow-slate-900/5 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/15">
              <Sparkles size={20} className="text-indigo-400" />
            </div>
            <div>
              <span className="text-sm font-black tracking-wider text-slate-900 uppercase">MONTHLY</span>
              <span className="text-[10px] font-bold text-slate-400 block -mt-1">Personal Checklist</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/50">
            <button
              onClick={() => setActiveView("home")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeView === "home"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Home size={15} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView("calendar")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeView === "calendar"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Calendar size={15} />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => setActiveView("settings")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeView === "settings"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Settings size={15} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Add Payment CTA Button */}
          <button
            onClick={handleAddPayment}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Payment</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Layout Wrapper */}
      <div className="relative mx-auto min-h-screen w-full max-w-md md:max-w-4xl lg:max-w-6xl px-4 sm:px-6">

        <main className="min-h-screen pb-32 pt-2 md:pt-4">
          {activeView === "home" && (
            <DashboardHome
              monthStr={selectedMonth}
              refreshTrigger={refreshTrigger}
              onStatusChange={triggerRefresh}
            />
          )}

          {activeView === "calendar" && (
            <MonthExplorer
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              refreshTrigger={refreshTrigger}
              onStatusChange={triggerRefresh}
            />
          )}

          {activeView === "settings" && (
            <SettingsView />
          )}
        </main>

        {/* Floating Navigation Dock for Mobile (Hidden on Desktop Header) */}
        <div className="md:hidden">
          <FloatingNav
            activeView={activeView}
            setActiveView={setActiveView}
            onAddClick={handleAddPayment}
          />
        </div>

        {isAddModalOpen && (
          <AddPaymentModal
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleAddSuccess}
          />
        )}
      </div>
    </div>
  );
}