import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell, FileText, Flag, Gift, Globe, Home, LogOut, MessageSquare, Trophy, User,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import api from "../../lib/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../common/Logo";
import { ThemeToggle } from "../common/ThemeToggle";

const navItems = [
  { to: "/userhome", icon: Home, label: "Dashboard" },
  { to: "/community", icon: Globe, label: "Community" },
  { to: "/complaintlist", icon: FileText, label: "My Reports" },
  { to: "/registercomplaint", icon: Flag, label: "New Report" },
  { to: "/rewards", icon: Gift, label: "Rewards" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/feedback", icon: MessageSquare, label: "Feedback" },
  { to: "/notifications", icon: Bell, label: "Alerts" },
  { to: "/userprofile", icon: User, label: "Profile" },
];

export function CitizenLayout({ children, title, subtitle }) {
  const location = useLocation();
  const { logout, name } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get("/notifications").then((res) => setUnread(res.data.unreadCount || 0)).catch(() => {});
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bgColor dark:bg-slate-950 flex">
      <Toaster position="top-right" />
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col z-50">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/"><Logo className="h-6 dark:brightness-0 dark:invert" /></Link>
          <p className="text-xs text-slate-500 mt-2">Citizen Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === to || location.pathname.startsWith(to + "/")
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={17} />
              {label}
              {to === "/notifications" && unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div>
              {title && <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>}
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              <Link to="/notifications" className="lg:hidden relative p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <Bell size={18} />
                {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
              </Link>
              <ThemeToggle />
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-slate-500">Citizen</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8 pb-24 lg:pb-8">{children}</main>
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around py-2 z-50">
          {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 p-1.5 text-[9px] font-medium ${location.pathname.startsWith(to) ? "text-primary" : "text-slate-400"}`}>
              <Icon size={18} />
              {label.split(" ")[0]}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
