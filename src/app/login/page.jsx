"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/storage";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  User,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const res = await loginUser(username, password);
      if (res.success) {
        router.replace("/dashboard");
        return;
      }
      setError(res.error || "Invalid username or password");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 relative">
      <div className="w-full max-w-sm">

        <div className="glass-card rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/90 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-200/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="mb-8 text-center relative z-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl shadow-indigo-950/20">
              <LockKeyhole size={24} />
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 mb-1.5">
              <Sparkles size={11} className="text-indigo-500" />
              Monthly App
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-1.5 text-xs font-semibold text-slate-500">
              Sign in to manage your monthly payment checklist
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">

            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="h-12 w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`h-12 w-full rounded-2xl border bg-slate-50/80 pl-11 pr-12 text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${
                    error
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200/80 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-900"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {error && (
                <p className="mt-2 text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-100 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-sm font-bold text-white transition-all hover:shadow-xl active:scale-[0.98] shadow-lg shadow-slate-900/15 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" />
          Encrypted Offline Authentication
        </p>
      </div>
    </main>
  );
}