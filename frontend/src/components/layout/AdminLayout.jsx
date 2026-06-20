import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3, Building2, FileText, LogOut, Map, Menu, MessageSquare, Tag, Users, X,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../common/Logo";
import { ThemeToggle } from "../common/ThemeToggle";

const navItems = [
  { to: "/overview", icon: BarChart3, label: "Overview" },
  { to: "/heatmap", icon: Map, label: "Heatmap" },
  { to: "/complaintmanagement", icon: FileText, label: "Reports" },
  { to: "/departments", icon: Building2, label: "Departments" },
  { to: "/categories", icon: Tag, label: "Categories" },
  { to: "/usermanagement", icon: Users, label: "Users" },
  { to: "/feedbackmanagement", icon: MessageSquare, label: "Feedback" },
];

export function AdminLayout({ children, title, subtitle, actions }) {
  const location = useLocation();
  const { logout, name } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = ({ onNavigate }) => (
    <>
      {navItems.map(({ to, icon: Icon, label }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            location.pathname === to || location.pathname.startsWith(to + "/")
              ? "bg-primary text-white"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-bgColor dark:bg-slate-950 flex">
      <Toaster position="top-right" />
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-accent-dark flex-col z-50">
        <div className="p-6 border-b border-white/10">
          <Link to="/"><Logo className="h-6 brightness-0 invert" /></Link>
          <p className="text-xs text-slate-400 mt-2">Admin Console</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <aside className="relative w-72 max-w-[85vw] h-full bg-accent-dark flex flex-col shadow-xl">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <Logo className="h-6 brightness-0 invert" />
              <button type="button" onClick={() => setMobileOpen(false)} className="text-slate-400 p-2"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </nav>
            <div className="p-4 border-t border-white/10">
              <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400">
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button type="button" onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                <Menu size={18} />
              </button>
              <div className="min-w-0">
                {title && <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">{title}</h1>}
                {subtitle && <p className="text-sm text-slate-500 truncate">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {actions}
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
                <p className="text-xs text-primary font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-8 pb-24 lg:pb-8">{children}</main>
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around py-2 z-40">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 p-1.5 text-[9px] font-medium ${
                location.pathname.startsWith(to) ? "text-primary" : "text-slate-400"
              }`}
            >
              <Icon size={18} />
              {label.split(" ")[0]}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
