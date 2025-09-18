import React, { useState } from "react";
import { API_BASE } from "../utils/constants";

const RegisterPage = ({ onRegister, onNavigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("idle");

  function requestLocation() {
    if (!navigator.geolocation) return setStatus("Geolocation not supported");
    setStatus("requesting location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => { 
        setCoords(pos.coords); 
        setStatus("location granted successfully!"); 
      },
      (err) => setStatus("Permission denied: " + err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!coords) return setStatus("Please allow location access first");
    setStatus("registering...");
    try {
      const body = { 
        name, 
        email, 
        phone, 
        password, 
        location: { 
          type: "Point", 
          coordinates: [coords.longitude, coords.latitude] 
        } 
      };
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");
      setStatus("Registered successfully! Logging in...");
      onRegister(data.token);
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Create an Account</h1>
        <p className="text-center text-gray-500">Join the Disaster Management network</p>
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <div className="flex flex-col sm:flex-row gap-2 items-center p-3 bg-gray-50 rounded-lg border">
            <button 
              type="button" 
              onClick={requestLocation} 
              className="w-full sm:w-auto flex-shrink-0 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              Allow Location
            </button>
            <span className="text-xs text-gray-600 text-center sm:text-left">
              {coords 
                ? `Lat: ${coords.latitude.toFixed(3)}, Lon: ${coords.longitude.toFixed(3)}` 
                : "Location is required for registration"
              }
            </span>
          </div>

          <button 
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors" 
            type="submit"
          >
            Register
          </button>
          {status !== 'idle' && <div className="text-sm text-center text-gray-600">{status}</div>}
        </form>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')} 
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
