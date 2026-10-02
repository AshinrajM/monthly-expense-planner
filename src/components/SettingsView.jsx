"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearAllData, logout } from "@/lib/storage";

import {
  LogOut,
  Trash2,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Database,
  UserCheck
} from "lucide-react";

export default function SettingsView() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleClearData = async () => {
    if (isClearing) return;
    const confirmed = window.confirm(
      "Are you sure you want to clear all data? This cannot be undone."
    );

    if (!confirmed) return;

    setIsClearing(true);
    try {
      await clearAllData();
      await logout();
      router.replace("/login");
    } catch (err) {
      console.error("Clear data failed:", err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md md:max-w-4xl animate-in fade-in duration-500 pt-3 px-1">

      {/* Header */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 mb-1">
          <Sparkles size={11} className="text-indigo-500" />
          Preferences & Data
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-0.5 text-xs font-semibold text-slate-500">
          Manage your account session and offline storage
        </p>
      </div>

      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 items-start">

        {/* Account Section */}
        <section>
          <p className="mb-2.5 px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Account & Security
          </p>

          <div className="overflow-hidden rounded-[24px] glass-card border border-white/90 shadow-xs divide-y divide-slate-100">
            {/* Signed In Info */}
            <div className="flex items-center justify-between p-4 bg-white/50">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <UserCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Active Session
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Local Device Storage
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Protected
              </span>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-50 active:bg-slate-100/80 group disabled:opacity-60"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {isLoggingOut ? (
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                  ) : (
                    <LogOut size={18} />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Support Section */}
        <section>
          <p className="mb-2.5 px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Help & Documentation
          </p>

          <div className="overflow-hidden rounded-[24px] glass-card border border-white/90 shadow-xs">
            <button
              onClick={() => alert("Monthly Checklist v2.0 - All data is stored locally in your browser.")}
              className="flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-50 active:bg-slate-100/80 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
                  <HelpCircle size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Help & Privacy Info
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Offline-first storage & guidelines
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <p className="mb-2.5 px-2 text-[10px] font-extrabold uppercase tracking-widest text-rose-500">
            Danger Zone
          </p>

          <div className="overflow-hidden rounded-[24px] bg-rose-50/30 border border-rose-100 shadow-xs">
            <button
              onClick={handleClearData}
              disabled={isClearing}
              className="flex w-full items-center justify-between p-4 transition-colors hover:bg-rose-100/50 active:bg-rose-100 group disabled:opacity-60"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 border border-rose-200">
                  {isClearing ? (
                    <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-rose-600">
                    {isClearing ? "Clearing All Data..." : "Reset & Clear All Data"}
                  </p>
                  <p className="text-xs font-medium text-rose-400">
                    Permanently wipe payment history
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

      </div>

      {/* Branding Footer */}
      <div className="mb-8 mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200/60 shadow-2xs">
          <Database size={12} className="text-indigo-500" />
          <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase">
            MONTHLY CHECKLIST
          </span>
          <span className="text-[10px] font-bold text-slate-400">v2.0</span>
        </div>
      </div>

    </div>
  );
}