import { useState, useEffect } from "react";
import { API_BASE } from "../utils/constants";

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (tokenToFetch) => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${tokenToFetch}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          handleLogout(); // Invalid token
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // The user will be fetched in the useEffect when token changes
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return {
    token,
    user,
    loading,
    handleLogin,
    handleLogout,
    isAuthenticated: !!token && !!user
  };
};
