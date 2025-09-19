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
const [isGettingLocation, setIsGettingLocation] = useState(false);
const [locationAccuracy, setLocationAccuracy] = useState(null);
const navigate = useNavigate();

const setDefaultLocation = () => {
const defaultLocation = {
latitude: 21.361501,
longitude: 74.879309
};
    
setCoords(defaultLocation);
setStatus(`Default location set: ${defaultLocation.latitude.toFixed(6)}, ${defaultLocation.longitude.toFixed(6)}`);
};

function requestLocation() {
if (!navigator.geolocation) {
setStatus("Geolocation not supported by this browser. Using default location.");
setDefaultLocation();
return;
}

setIsGettingLocation(true);
setStatus("Getting your precise location...");
    
// First attempt with high accuracy settings
navigator.geolocation.getCurrentPosition(
(position) => {
const location = {
latitude: position.coords.latitude,
longitude: position.coords.longitude
};
        
const accuracy = position.coords.accuracy;
        
setCoords(location);
setLocationAccuracy(accuracy);
setStatus(`High accuracy location found: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (±${Math.round(accuracy)}m accuracy)`);
setIsGettingLocation(false);
},
(error) => {
// If high accuracy fails, try with lower accuracy settings
console.log("High accuracy failed, trying with standard accuracy...");
setStatus("High accuracy failed, trying standard accuracy...");
        
navigator.geolocation.getCurrentPosition(
(position) => {
const location = {
latitude: position.coords.latitude,
longitude: position.coords.longitude
};
            
const accuracy = position.coords.accuracy;
            
setCoords(location);
setLocationAccuracy(accuracy);
setStatus(`Location found: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (±${Math.round(accuracy)}m accuracy)`);
setIsGettingLocation(false);
},
(fallbackError) => {
let errorMessage = "Unable to retrieve your location. Using default location.";
switch (fallbackError.code) {
case fallbackError.PERMISSION_DENIED:
errorMessage = "Location access denied. Using default location.";
break;
case fallbackError.POSITION_UNAVAILABLE:
errorMessage = "Location information is unavailable. Using default location.";
break;
case fallbackError.TIMEOUT:
errorMessage = "Location request timed out. Using default location.";
break;
}
            
setStatus(errorMessage);
setDefaultLocation();
setIsGettingLocation(false);
},
{
enableHighAccuracy: false,
timeout: 15000,
maximumAge: 60000
}
);
},
{
enableHighAccuracy: true,
timeout: 20000,
maximumAge: 0
}
);
}

const getPrecisionLocation = () => {
if (!navigator.geolocation) {
setStatus("Geolocation not supported by this browser.");
setDefaultLocation();
return;
}

setIsGettingLocation(true);
setStatus("Getting precision location (multiple attempts)...");
    
// Try to get location multiple times and average them for better accuracy
const locations = [];
let attempts = 0;
const maxAttempts = 3;
    
const getLocationAttempt = () => {
navigator.geolocation.getCurrentPosition(
(position) => {
attempts++;
locations.push({
lat: position.coords.latitude,
lng: position.coords.longitude,
accuracy: position.coords.accuracy
});
          
setStatus(`Precision attempt ${attempts}/${maxAttempts} completed...`);
          
if (attempts < maxAttempts) {
// Wait a bit before next attempt
setTimeout(getLocationAttempt, 1000);
} else {
// Calculate average of all attempts, weighted by accuracy
let totalWeight = 0;
let weightedLat = 0;
let weightedLng = 0;
            
locations.forEach(loc => {
const weight = 1 / loc.accuracy; // Higher weight for more accurate readings
totalWeight += weight;
weightedLat += loc.lat * weight;
weightedLng += loc.lng * weight;
});
            
const avgLocation = {
latitude: weightedLat / totalWeight,
longitude: weightedLng / totalWeight
};
            
setCoords(avgLocation);
const bestAccuracy = Math.min(...locations.map(l => l.accuracy));
setLocationAccuracy(bestAccuracy);
            
setStatus(`Precision location found: ${avgLocation.latitude.toFixed(6)}, ${avgLocation.longitude.toFixed(6)} (Best: ±${Math.round(bestAccuracy)}m)`);
setIsGettingLocation(false);
}
},
(error) => {
console.error(`Location attempt ${attempts + 1} failed:`, error);
attempts++;
          
if (attempts < maxAttempts) {
setStatus(`Attempt ${attempts} failed, retrying...`);
setTimeout(getLocationAttempt, 2000);
} else {
// Fall back to single attempt if all precision attempts fail
setStatus("Precision location failed, trying standard location...");
requestLocation();
}
},
{
enableHighAccuracy: true,
timeout: 15000,
maximumAge: 0
}
);
};
    
getLocationAttempt();
};

  async function register(e) {
  e.preventDefault();
  if (!coords) return setStatus("Please allow location access first");
  setStatus("Registering with coordinates...");
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
  setStatus("Registration successful! Redirecting to dashboard...");
  setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err) {
  setStatus("Registration failed: " + err.message);
  }
  }

  return (
  <div className="max-w-md mx-auto p-6">
  <h1 className="text-2xl font-semibold mb-4 text-center">Create Account</h1>
  <form onSubmit={register} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
  <div>
  <label className="block text-sm font-medium mb-2">Full Name</label>
  <input
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  placeholder="Enter your full name"
  />
  </div>
  <div>
  <label className="block text-sm font-medium mb-2">Email Address</label>
  <input
  type="email"
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  placeholder="Enter your email address"
  />
  </div>
  <div>
  <label className="block text-sm font-medium mb-2">Phone Number</label>
  <input
  type="tel"
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  required
  placeholder="Enter your phone number"
  />
  </div>
  <div>
  <label className="block text-sm font-medium mb-2">Password</label>
  <input
  type="password"
  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter a secure password"
  />
  </div>
        
  {/* Location Section */}
  <div className="border-t pt-4">
  <label className="block text-sm font-medium mb-3">
  Location Access Required *
  </label>
  <div className="space-y-3">
  <div className="flex flex-wrap gap-2">
  <button
  type="button"
  onClick={setDefaultLocation}
  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
  >
  📍 Use Default Location
  </button>
  <button
  type="button"
  onClick={requestLocation}
  disabled={isGettingLocation}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
  >
  {isGettingLocation ? (
  <>
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
  Getting GPS...
  </>
  ) : (
  <>🌐 Get GPS Location</>
  )}
  </button>
  <button
  type="button"
  onClick={getPrecisionLocation}
  disabled={isGettingLocation}
  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
  >
  {isGettingLocation ? (
  <>
  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
  Getting Precision...
  </>
  ) : (
  <>🎯 Precision Location</>
  )}
  </button>
  </div>
            
  {/* Location Display */}
  {coords && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
  <div className="text-sm font-medium text-green-800 mb-1">✓ Location Obtained</div>
  <div className="text-xs text-green-700">
  Coordinates: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
  {locationAccuracy && (
  <span className="ml-2">
  (±{Math.round(locationAccuracy)}m accuracy)
  </span>
  )}
  </div>
  </div>
  )}
            
  {/* Status Messages */}
  {status !== 'idle' && (
  <div className={`rounded-lg p-3 text-sm ${
  status.includes('Error') || status.includes('failed') || status.includes('denied')
  ? 'bg-red-50 border border-red-200 text-red-800'
  : status.includes('found') || status.includes('successful') || coords
  ? 'bg-green-50 border border-green-200 text-green-800'
  : 'bg-blue-50 border border-blue-200 text-blue-800'
  }`}>
  {isGettingLocation && (
  <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-2"></span>
  )}
  {status}
  </div>
  )}
  </div>
          
  <p className="text-xs text-gray-500 mt-2">
  We need your location for emergency services. Click "Use Default Location" for quick setup or "Get GPS Location" for your exact position.
  </p>
  </div>

  <button
  className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
  coords
  ? 'bg-green-600 hover:bg-green-700'
  : 'bg-gray-400 cursor-not-allowed'
  }`}
  type="submit"
  disabled={!coords || isGettingLocation}
  >
  {!coords ? 'Location Required to Register' : 'Create Account'}
  </button>
        
  <div className="text-center">
  <button
  type="button"
  onClick={() => navigate("/login")}
  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
  >
  Already have an account? Sign in
  </button>
  </div>
  </form>
  </div>
  );
}
