import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useAuth() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return {
    token: localStorage.getItem("token"),
    id: localStorage.getItem("id"),
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
    isAdmin: localStorage.getItem("role") === "admin",
    logout,
  };
}
