import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Monthly | Personal Expense & Payment Planner",
  description: "A premium color-graded personal monthly payment checklist application.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen pb-24 relative overflow-x-hidden bg-[#F8FAFC] text-slate-900`}>
        {/* Soft Ambient Light Color-Graded Background Blobs */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#F8FAFC]">
          {/* Emerald / Teal aura top right */}
          <div className="absolute -top-[15%] -right-[10%] w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] bg-emerald-200/40 rounded-full filter blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
          {/* Soft Violet / Indigo aura middle left */}
          <div className="absolute top-[35%] -left-[15%] w-[80vw] h-[80vw] max-w-[550px] max-h-[550px] bg-indigo-200/40 rounded-full filter blur-[110px] opacity-60"></div>
          {/* Soft Amber / Rose aura bottom right */}
          <div className="absolute -bottom-[10%] -right-[10%] w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] bg-amber-200/40 rounded-full filter blur-[120px] opacity-50"></div>
          {/* Subtle grid pattern overlay for precision feel */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
