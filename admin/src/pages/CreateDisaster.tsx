import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Navigation, Plus, Loader2, Edit3, Target } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface DisasterLocation {
  lat: number;
  lng: number;
}

interface DisasterForm {
  type: string;
  description: string;
  location: DisasterLocation | null;
  radius: number;
  resources: {
    food: number;
    medikits: number;
    water: number;
    blankets: number;
  };
}

const DISASTER_TYPES = [
  'Earthquake',
  'Flood',
  'Hurricane',
  'Wildfire',
  'Tornado',
  'Landslide',
  'Tsunami',
  'Volcanic Eruption',
  'Drought',
  'Blizzard',
  'Cyclone',
  'Other'
];

const RESOURCE_TYPES = [
  { key: 'food', label: 'Food Supplies (units)', placeholder: 'Enter food units' },
  { key: 'medikits', label: 'Medical Kits', placeholder: 'Enter medical kit count' },
  { key: 'water', label: 'Water Supplies (liters)', placeholder: 'Enter water amount' },
  { key: 'blankets', label: 'Blankets', placeholder: 'Enter blanket count' }
] as const;

function LocationMarker({ position, onLocationSelect }: { 
  position: DisasterLocation | null; 
  onLocationSelect: (location: DisasterLocation) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]} />
  );
}

const CreateDisaster: React.FC = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const mapRef = useRef<L.Map | null>(null);
  
  const [formData, setFormData] = useState<DisasterForm>({
    type: '',
    description: '',
    location: null,
    radius: 5, // Default 5km radius
    resources: {
      food: 0,
      medikits: 0,
      water: 0,
      blankets: 0
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });

  const handleLocationSelect = useCallback((location: DisasterLocation) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
    toast({
      title: "Location Selected",
      description: `Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
    });
  }, [toast]);

  const setDefaultLocation = () => {
    const defaultLocation = {
      lat: 21.361501,
      lng: 74.879309
    };
    
    setFormData(prev => ({
      ...prev,
      location: defaultLocation
    }));

    if (mapRef.current) {
      mapRef.current.setView([defaultLocation.lat, defaultLocation.lng], 15);
    }

    toast({
      title: "Default Location Set",
      description: `Coordinates: ${defaultLocation.lat.toFixed(6)}, ${defaultLocation.lng.toFixed(6)}`,
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by this browser. Using default location.",
        variant: "destructive",
      });
      setDefaultLocation();
      return;
    }

    setIsGettingLocation(true);
    
    // First attempt with high accuracy settings
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        const accuracy = position.coords.accuracy;
        
        setFormData(prev => ({
          ...prev,
          location
        }));

        // Center map on current location with higher zoom for accuracy
        if (mapRef.current) {
          mapRef.current.setView([location.lat, location.lng], 15);
        }

        toast({
          title: "High Accuracy Location Found",
          description: `Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)} (±${Math.round(accuracy)}m accuracy)`,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        // If high accuracy fails, try with lower accuracy settings
        console.log("High accuracy failed, trying with lower accuracy...");
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            const accuracy = position.coords.accuracy;
            
            setFormData(prev => ({
              ...prev,
              location
            }));

            if (mapRef.current) {
              mapRef.current.setView([location.lat, location.lng], 15);
            }

            toast({
              title: "Location Found (Standard Accuracy)",
              description: `Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)} (±${Math.round(accuracy)}m accuracy)`,
            });
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
            
            toast({
              title: "Location Error",
              description: errorMessage,
              variant: "destructive",
            });
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
  };

  const handleManualLocationSet = () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Invalid Coordinates",
        description: "Please enter valid latitude and longitude values.",
        variant: "destructive",
      });
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Invalid Coordinates",
        description: "Latitude must be between -90 and 90, longitude between -180 and 180.",
        variant: "destructive",
      });
      return;
    }
    
    const location = { lat, lng };
    setFormData(prev => ({ ...prev, location }));
    
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
    }
    
    toast({
      title: "Manual Location Set",
      description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    });
    
    setShowManualInput(false);
    setManualCoords({ lat: '', lng: '' });
  };

  const getMultipleLocationAttempts = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    
    // Try to get location multiple times and average them for better accuracy
    const locations: { lat: number; lng: number; accuracy: number }[] = [];
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
              lat: weightedLat / totalWeight,
              lng: weightedLng / totalWeight
            };
            
            setFormData(prev => ({ ...prev, location: avgLocation }));
            
            if (mapRef.current) {
              mapRef.current.setView([avgLocation.lat, avgLocation.lng], 16);
            }
            
            const bestAccuracy = Math.min(...locations.map(l => l.accuracy));
            
            toast({
              title: "Precision Location Found",
              description: `Average coordinates: ${avgLocation.lat.toFixed(6)}, ${avgLocation.lng.toFixed(6)} (Best: ±${Math.round(bestAccuracy)}m)`,
            });
            setIsGettingLocation(false);
          }
        },
        (error) => {
          console.error(`Location attempt ${attempts + 1} failed:`, error);
          attempts++;
          
          if (attempts < maxAttempts) {
            setTimeout(getLocationAttempt, 2000);
          } else {
            // Fall back to single attempt if all precision attempts fail
            getCurrentLocation();
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

  const handleResourceChange = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select a location on the map.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://deploy-4f2g.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/admin/disasters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: formData.type,
          description: formData.description,
          location: {
            coordinates: [formData.location.lng, formData.location.lat],
            type: 'Point'
          },
          radius: formData.radius, // Keep in kilometers as entered
          resources: formData.resources
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      toast({
        title: "Disaster Created Successfully",
        description: `${formData.type} disaster has been registered and alerts will be sent to affected areas.`,
      });

      // Reset form
      setFormData({
        type: '',
        description: '',
        location: null,
        radius: 5,
        resources: {
          food: 0,
          medikits: 0,
          water: 0,
          blankets: 0
        }
      });
      setShowManualInput(false);
      setManualCoords({ lat: '', lng: '' });

    } catch (error) {
      console.error('Create disaster error:', error);
      toast({
        title: "Error Creating Disaster",
        description: error instanceof Error ? error.message : "Failed to create disaster. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Disaster Alert</h1>
        <p className="text-muted-foreground">
          Register a new disaster and set up emergency response zones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Disaster Information
            </CardTitle>
            <CardDescription>
              Fill in the disaster details and select the affected area on the map
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Disaster Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select disaster type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISASTER_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the disaster situation, severity, and immediate concerns..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="radius">Affected Radius (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.radius}
                  onChange={(e) => setFormData(prev => ({ ...prev, radius: parseFloat(e.target.value) || 5 }))}
                />
              </div>

              <div>
                <Label>Resource Requirements</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {RESOURCE_TYPES.map(resource => (
                    <div key={resource.key}>
                      <Label htmlFor={resource.key} className="text-sm">{resource.label}</Label>
                      <Input
                        id={resource.key}
                        type="number"
                        min="0"
                        placeholder={resource.placeholder}
                        value={formData.resources[resource.key as keyof typeof formData.resources]}
                        onChange={(e) => handleResourceChange(resource.key, parseInt(e.target.value) || 0)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <Label>Location * {formData.location && `(${formData.location.lat.toFixed(6)}, ${formData.location.lng.toFixed(6)})`}</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={setDefaultLocation}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Set My Location
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Navigation className="h-4 w-4 mr-2" />
                      )}
                      GPS Location
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getMultipleLocationAttempts}
                      disabled={isGettingLocation}
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Target className="h-4 w-4 mr-2" />
                      )}
                      Precision Location
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowManualInput(!showManualInput)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Manual Entry
                    </Button>
                  </div>

                  {showManualInput && (
                    <div className="border rounded-lg p-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="manual-lat" className="text-xs">Latitude</Label>
                          <Input
                            id="manual-lat"
                            type="number"
                            step="any"
                            placeholder="e.g., 20.123456"
                            value={manualCoords.lat}
                            onChange={(e) => setManualCoords(prev => ({ ...prev, lat: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="manual-lng" className="text-xs">Longitude</Label>
                          <Input
                            id="manual-lng"
                            type="number"
                            step="any"
                            placeholder="e.g., 73.123456"
                            value={manualCoords.lng}
                            onChange={(e) => setManualCoords(prev => ({ ...prev, lng: e.target.value }))}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleManualLocationSet}
                        disabled={!manualCoords.lat || !manualCoords.lng}
                      >
                        Set Location
                      </Button>
                    </div>
                  )}

                  {formData.location && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Set My Location" to use your default coordinates (21.361501, 74.879309), or use GPS/Precision Location for current position
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !formData.location}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Disaster Alert...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Disaster Alert
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Selection
            </CardTitle>
            <CardDescription>
              Click on the map to select the disaster epicenter
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] rounded-b-lg overflow-hidden">
              <MapContainer
                center={[21.361501, 74.879309]} // Default center (India)
                zoom={6}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                  position={formData.location} 
                  onLocationSelect={handleLocationSelect}
                />
                {formData.location && (
                  <Circle
                    center={[formData.location.lat, formData.location.lng]}
                    radius={formData.radius * 1000} // Convert km to meters for map display only
                    color="red"
                    fillColor="red"
                    fillOpacity={0.1}
                    weight={2}
                  />
                )}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateDisaster;