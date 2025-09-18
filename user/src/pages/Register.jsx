import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "https://deploy-4f2g.onrender.com";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  function requestLocation() {
    if (!navigator.geolocation) return setStatus("Geolocation not supported");
    setStatus("requesting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords(pos.coords); setStatus("location granted"); },
      (err) => setStatus("permission denied: " + err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function register(e) {
    e.preventDefault();
    if (!coords) return setStatus("click Allow Location first");
    setStatus("registering...");
    try {
      const body = {
        name, email, phone, password,
        location: { type: "Point", coordinates: [coords.longitude, coords.latitude] },
      };
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");
      
      // Auto-login after registration
      localStorage.setItem("token", data.token);
      setStatus("registered successfully, redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form onSubmit={register} className="bg-white rounded shadow p-4 space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input className="w-full border rounded px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex gap-2 items-center">
          <button type="button" onClick={requestLocation} className="bg-purple-600 text-white px-3 py-2 rounded">Allow Location</button>
          <span className="text-sm">{coords ? `lat:${coords.latitude.toFixed(4)} lng:${coords.longitude.toFixed(4)}` : "no location yet"}</span>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Register</button>
        <div className="text-sm">Status: {status}</div>
      </form>
    </div>
  );
}
