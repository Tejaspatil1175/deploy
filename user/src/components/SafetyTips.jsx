import React, { useState } from "react";

const SafetyTips = () => {
  const [activeTip, setActiveTip] = useState(0);

  const safetyTips = [
    {
      title: "Earthquake Safety",
      icon: "🌍",
      tips: [
        "Drop, Cover, and Hold On under a sturdy table",
        "Stay away from windows, mirrors, and heavy objects",
        "If outdoors, move to an open area away from buildings",
        "After shaking stops, check for injuries and gas leaks"
      ]
    },
    {
      title: "Flood Safety",
      icon: "🌊",
      tips: [
        "Move to higher ground immediately",
        "Do not walk or drive through floodwaters",
        "Turn off electricity and gas if safe to do so",
        "Keep emergency supplies ready"
      ]
    },
    {
      title: "Fire Safety",
      icon: "🔥",
      tips: [
        "Stop, Drop, and Roll if clothes catch fire",
        "Crawl low under smoke to exit",
        "Feel doors before opening - if hot, use another exit",
        "Call emergency services immediately"
      ]
    },
    {
      title: "General Emergency",
      icon: "🚨",
      tips: [
        "Stay calm and assess the situation",
        "Follow official instructions and evacuation routes",
        "Keep emergency contacts handy",
        "Have a family emergency plan ready"
      ]
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
        <span className="text-blue-500 mr-2">🛡️</span>
        Safety Tips
      </h3>
      
      {/* Tip Navigation */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {safetyTips.map((tip, index) => (
          <button
            key={index}
            onClick={() => setActiveTip(index)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTip === index
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tip.icon} {tip.title}
          </button>
        ))}
      </div>

      {/* Active Tip Content */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 flex items-center">
          {safetyTips[activeTip].icon} {safetyTips[activeTip].title}
        </h4>
        <ul className="space-y-2">
          {safetyTips[activeTip].tips.map((tip, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <span className="text-blue-500 mr-2 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">📱 Remember:</span> Keep your phone charged and have a portable charger ready during emergencies.
        </p>
      </div>
    </div>
  );
};

export default SafetyTips;
