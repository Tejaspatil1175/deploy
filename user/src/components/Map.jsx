import React, { useRef } from "react";
import { MapPinIcon } from "./Icons";
import { useMap } from "../hooks/useMap";

const Map = ({ coords, disasters }) => {
  const mapContainerRef = useRef(null);
  useMap(mapContainerRef, coords, disasters);

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg border-0">
      <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
        <MapPinIcon className="w-5 h-5 mr-2 text-blue-600"/>
        Disaster Map
      </h3>
      <div ref={mapContainerRef} id="map" className="h-64 sm:h-80 lg:h-96 w-full rounded-lg border border-gray-200 shadow-inner" />
      {!coords && (
        <div className="text-center mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            Start tracking to see your location on the map.
          </p>
        </div>
      )}
      
      {/* Map Legend */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Disaster Center</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-red-500 rounded-full opacity-20"></div>
          <span>High Danger Zone (0-33%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-orange-500 rounded-full opacity-20"></div>
          <span>Medium Danger Zone (33-66%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full opacity-20"></div>
          <span>Safe Zone (66-100%)</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Click on red markers for disaster details and emergency contacts.
        </div>
      </div>
    </div>
  );
};

export default Map;
