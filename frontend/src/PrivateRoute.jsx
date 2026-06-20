import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./lib/apiClient";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

export const PrivateRoute = ({ children, requiredRole }) => {
  const [state, setState] = useState({ status: "loading", role: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState({ status: "unauthenticated", role: null });
      return;
    }

    api
      .get("/user/profile")
      .then((res) => {
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("name", res.data.name);
        setState({ status: "authenticated", role: res.data.role });
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        setState({ status: "unauthenticated", role: null });
      });
  }, []);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgColor dark:bg-slate-950">
        <LoadingSpinner message="Checking session..." />
      </div>
    );
  }

  if (state.status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && state.role !== requiredRole) {
    return <Navigate to={state.role === "admin" ? "/overview" : "/userhome"} replace />;
  }

  return children;
};
