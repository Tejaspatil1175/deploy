import { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Dashboard() {
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const intervalRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");
    
    // Get user profile if token exists
    if (storedToken) {
      fetchUserProfile(storedToken);
    }
  }, []);

  async function fetchUserProfile(token) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setEmail(data.user.email);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }

  function initMapIfNeeded(lat, lng) {
    if (!window.L) return;
    if (!mapRef.current) {
      mapRef.current = window.L.map("map").setView([lat, lng], 14);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
    if (!markerRef.current) {
      markerRef.current = window.L.marker([lat, lng]).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng([lat, lng]);
    }
    mapRef.current.setView([lat, lng]);
  }

  async function ping(c) {
    try {
      const body = { email, location: { type: "Point", coordinates: [c.longitude, c.latitude] } };
      await fetch(`${API_BASE}/api/users/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("Ping error", err);
    }
  }

  function start() {
    if (!navigator.geolocation) return setStatus("Geolocation not supported");
    if (!email) return setStatus("Please login first");
    setStatus("requesting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("tracking...");
        initMapIfNeeded(pos.coords.latitude, pos.coords.longitude);
        ping(pos.coords);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (p) => { initMapIfNeeded(p.coords.latitude, p.coords.longitude); ping(p.coords); },
            (e) => console.warn("geo error", e),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
          );
        }, 60000);
      },
      (err) => setStatus("permission denied: " + err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus("stopped");
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        {user && (
          <div className="text-sm text-gray-600">
            Welcome, {user.name} ({user.email})
          </div>
        )}
      </div>
      
      <div className="bg-white rounded shadow p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 flex-1">
            {email ? `Logged in as: ${email}` : "Please login first"}
          </div>
          <button 
            onClick={start} 
            disabled={!email}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Start Tracking
          </button>
          <button onClick={stop} className="bg-gray-600 text-white px-4 py-2 rounded">Stop</button>
        </div>
        <div className="text-sm text-gray-600">Status: {status}</div>
        <div id="map" className="h-96 rounded border" />
      </div>
    </div>
  );
}
