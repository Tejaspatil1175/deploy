import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login";
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Disaster Management</Link>
        <div className="flex gap-4 text-sm">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <button onClick={logout} className="hover:text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
