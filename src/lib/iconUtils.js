import {
  Home,
  Building2,
  Zap,
  Wifi,
  Droplet,
  Tv,
  Phone,
  Laptop,
  Smartphone,
  CreditCard,
  Wallet,
  Landmark,
  Coins,
  Car,
  Dumbbell,
  HeartPulse,
  ShoppingBag,
  ShieldCheck,
  Receipt,
  Sparkles,
  Music,
  Flame,
  Globe
} from "lucide-react";

export function getPaymentCategoryInfo(name = "") {
  const lowerName = name.toLowerCase();

  // Rent / Housing
  if (lowerName.includes("rent") || lowerName.includes("house") || lowerName.includes("flat") || lowerName.includes("home") || lowerName.includes("apartment")) {
    return {
      icon: Home,
      bgClass: "bg-amber-500/10",
      textClass: "text-amber-700",
      borderClass: "border-amber-200/80",
      gradientClass: "from-amber-500/15 via-orange-500/5 to-transparent",
      badgeBg: "bg-amber-100/70 text-amber-800"
    };
  }

  // Electricity / Power / Gas
  if (lowerName.includes("electric") || lowerName.includes("power") || lowerName.includes("light") || lowerName.includes("current") || lowerName.includes("gas") || lowerName.includes("cylinder")) {
    return {
      icon: lowerName.includes("gas") ? Flame : Zap,
      bgClass: "bg-amber-500/10",
      textClass: "text-amber-600",
      borderClass: "border-amber-200/60",
      gradientClass: "from-amber-400/15 via-yellow-400/5 to-transparent",
      badgeBg: "bg-amber-100/70 text-amber-800"
    };
  }

  // Wifi / Internet / Broadband / Phone
  if (lowerName.includes("wifi") || lowerName.includes("internet") || lowerName.includes("broadband") || lowerName.includes("fiber") || lowerName.includes("mobile") || lowerName.includes("recharge") || lowerName.includes("phone")) {
    return {
      icon: lowerName.includes("phone") || lowerName.includes("mobile") ? Phone : Wifi,
      bgClass: "bg-sky-500/10",
      textClass: "text-sky-700",
      borderClass: "border-sky-200/80",
      gradientClass: "from-sky-500/15 via-blue-500/5 to-transparent",
      badgeBg: "bg-sky-100/70 text-sky-800"
    };
  }

  // Subscriptions / Entertainment / Streaming
  if (lowerName.includes("netflix") || lowerName.includes("spotify") || lowerName.includes("prime") || lowerName.includes("youtube") || lowerName.includes("tv") || lowerName.includes("ott") || lowerName.includes("sub") || lowerName.includes("music")) {
    return {
      icon: lowerName.includes("spotify") || lowerName.includes("music") ? Music : Tv,
      bgClass: "bg-purple-500/10",
      textClass: "text-purple-700",
      borderClass: "border-purple-200/80",
      gradientClass: "from-purple-500/15 via-fuchsia-500/5 to-transparent",
      badgeBg: "bg-purple-100/70 text-purple-800"
    };
  }

  // Laptop / EMI / Gadget / Tech / Loan
  if (lowerName.includes("laptop") || lowerName.includes("apple") || lowerName.includes("phone") || lowerName.includes("tech") || lowerName.includes("emi") || lowerName.includes("loan") || lowerName.includes("card") || lowerName.includes("credit")) {
    return {
      icon: lowerName.includes("laptop") ? Laptop : lowerName.includes("phone") ? Smartphone : CreditCard,
      bgClass: "bg-indigo-500/10",
      textClass: "text-indigo-700",
      borderClass: "border-indigo-200/80",
      gradientClass: "from-indigo-500/15 via-violet-500/5 to-transparent",
      badgeBg: "bg-indigo-100/70 text-indigo-800"
    };
  }

  // Car / Vehicle / Transport / Fuel
  if (lowerName.includes("car") || lowerName.includes("bike") || lowerName.includes("auto") || lowerName.includes("vehicle") || lowerName.includes("fuel") || lowerName.includes("petrol") || lowerName.includes("diesel")) {
    return {
      icon: Car,
      bgClass: "bg-blue-500/10",
      textClass: "text-blue-700",
      borderClass: "border-blue-200/80",
      gradientClass: "from-blue-500/15 via-cyan-500/5 to-transparent",
      badgeBg: "bg-blue-100/70 text-blue-800"
    };
  }

  // Gym / Health / Medical / Insurance
  if (lowerName.includes("gym") || lowerName.includes("fitness") || lowerName.includes("health") || lowerName.includes("insurance") || lowerName.includes("medical") || lowerName.includes("doctor")) {
    return {
      icon: lowerName.includes("gym") || lowerName.includes("fitness") ? Dumbbell : lowerName.includes("insurance") ? ShieldCheck : HeartPulse,
      bgClass: "bg-rose-500/10",
      textClass: "text-rose-700",
      borderClass: "border-rose-200/80",
      gradientClass: "from-rose-500/15 via-pink-500/5 to-transparent",
      badgeBg: "bg-rose-100/70 text-rose-800"
    };
  }

  // Water / Maid / Groceries / Utility
  if (lowerName.includes("water") || lowerName.includes("aqua") || lowerName.includes("droplet")) {
    return {
      icon: Droplet,
      bgClass: "bg-cyan-500/10",
      textClass: "text-cyan-700",
      borderClass: "border-cyan-200/80",
      gradientClass: "from-cyan-500/15 via-teal-500/5 to-transparent",
      badgeBg: "bg-cyan-100/70 text-cyan-800"
    };
  }

  // Default / Generic Payment
  return {
    icon: Receipt,
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-200/80",
    gradientClass: "from-emerald-500/15 via-teal-500/5 to-transparent",
    badgeBg: "bg-emerald-100/70 text-emerald-800"
  };
}
