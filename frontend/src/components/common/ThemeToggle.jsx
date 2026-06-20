import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../ThemeContext";

export function ThemeToggle({ className = "" }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      className={`p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/40 transition-all ${className}`}
    >
      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
