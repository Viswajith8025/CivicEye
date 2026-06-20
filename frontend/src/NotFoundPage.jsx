import { Link } from "react-router-dom";
import { Logo } from "./components/common/Logo";

export const NotFoundPage = () => (
  <div className="min-h-screen bg-bgColor dark:bg-slate-950 flex flex-col items-center justify-center p-6">
    <Link to="/" className="mb-8"><Logo className="h-8 dark:brightness-0 dark:invert" /></Link>
    <p className="text-6xl font-bold text-primary mb-4">404</p>
    <p className="text-slate-500 mb-6 text-center">This page doesn&apos;t exist or was moved.</p>
    <Link to="/" className="btn-primary">Back to home</Link>
  </div>
);
