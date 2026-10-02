"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  // Initialize directly instead of setting it inside useEffect
  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonthString
  );

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
      <div className="relative mx-auto min-h-screen w-full max-w-md">

        <main className="min-h-screen px-4 pb-32 pt-4 sm:px-6 sm:pt-6">
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

        <FloatingNav
          activeView={activeView}
          setActiveView={setActiveView}
          onAddClick={handleAddPayment}
        />

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