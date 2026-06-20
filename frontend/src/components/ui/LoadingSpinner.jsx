import { Loader2 } from "lucide-react";

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-primary" size={32} />
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{message}</p>
    </div>
  );
}
