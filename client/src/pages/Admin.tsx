import { useState, useEffect } from "react";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}