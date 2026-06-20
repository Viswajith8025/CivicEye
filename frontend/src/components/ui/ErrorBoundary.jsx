import { Component } from "react";
import { Link } from "react-router-dom";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bgColor dark:bg-slate-950 p-6">
          <div className="governance-card p-8 max-w-md text-center">
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-500 mb-6">Try refreshing the page or return home.</p>
            <div className="flex gap-3 justify-center">
              <button type="button" onClick={() => window.location.reload()} className="btn-primary !py-2 !px-4 text-sm">
                Refresh
              </button>
              <Link to="/" className="btn-secondary !py-2 !px-4 text-sm">Home</Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
