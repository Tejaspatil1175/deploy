import React, { useState } from "react";
import "./index.css";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import { LoadingScreen } from "./components/Loading";
import AnimatedBackground from "./components/AnimatedBackground";

export default function App() {
  const [page, setPage] = useState("login"); // 'login', 'register', 'dashboard'
  const { token, user, loading, handleLogin, handleLogout, isAuthenticated } = useAuth();

  // Auto-redirect to dashboard if authenticated
  React.useEffect(() => {
    if (isAuthenticated && page !== "dashboard") {
      setPage("dashboard");
    }
  }, [isAuthenticated, page]);

  const handleRegister = (newToken) => {
    handleLogin(newToken);
    setPage("dashboard");
  };

  const handleLoginSuccess = (newToken) => {
    handleLogin(newToken);
    setPage("dashboard");
  };

  const handleLogoutSuccess = () => {
    handleLogout();
    setPage("login");
  };

  const renderPage = () => {
    if (loading) {
      return <LoadingScreen message="Initializing SafeZone..." />;
    }

    switch (page) {
      case "register":
        return <RegisterPage onRegister={handleRegister} onNavigate={setPage} />;
      case "dashboard":
        return <DashboardPage user={user} token={token} onLogout={handleLogoutSuccess} />;
      case "login":
      default:
        return <LoginPage onLogin={handleLoginSuccess} onNavigate={setPage} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      {renderPage()}
    </div>
  );
}