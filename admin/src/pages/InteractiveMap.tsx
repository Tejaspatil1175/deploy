import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
Map,
Layers,
MapPin,
Navigation,
Zap,
Home,
Plus,
Settings,
Filter,
Loader2,
RefreshCw,
Users,
Shield,
AlertTriangle
} from "lucide-react";

interface MapData {
disasters: Array<{
_id: string;
type: string;
description: string;
location: {
coordinates: [number, number];
};
radius: number;
active: boolean;
createdAt: string;
}>;
volunteers: Array<{
_id: string;
name: string;
location?: {
coordinates: [number, number];
};
status: string;
}>;
stats: {
totalDisasters: number;
activeDisasters: number;
totalVolunteers: number;
activeSOS: number;
};
}

interface RecentActivity {
id: string;
type: string;
title: string;
location: string;
time: string;
severity: string;
}

export default function InteractiveMap() {
const { toast } = useToast();
const { token } = useAuth();
  
const [activeLayer, setActiveLayer] = useState("all");
const [mapData, setMapData] = useState<MapData | null>(null);
const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
const [loading, setLoading] = useState(true);

// Fetch map data from multiple APIs
const fetchMapData = async () => {
try {
setLoading(true);
const apiUrl = import.meta.env.VITE_API_URL || 'https://deploy-4f2g.onrender.com';
      
// Fetch disasters
const disastersResponse = await fetch(`${apiUrl}/api/disasters`, {
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
});

// Fetch dashboard stats for counts
const dashboardResponse = await fetch(`${apiUrl}/api/dashboard/stats`, {
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
});

if (!disastersResponse.ok || !dashboardResponse.ok) {
throw new Error('Failed to fetch map data');
}

const disasters = await disastersResponse.json();
const dashboardData = await dashboardResponse.json();

// Generate recent activity from disasters
const activities: RecentActivity[] = disasters.slice(0, 3).map((disaster: any, index: number) => ({
id: disaster._id,
type: disaster.active ? "danger-zone" : "resolved",
title: disaster.active ? `${disaster.type} Alert Active` : `${disaster.type} Resolved`,
location: `${disaster.location.coordinates[1].toFixed(4)}, ${disaster.location.coordinates[0].toFixed(4)}`,
time: getTimeAgo(disaster.createdAt),
severity: disaster.active ? getSeverityFromRadius(disaster.radius) : "resolved"
}));

setMapData({
disasters,
volunteers: [], // Mock data - replace with real volunteer API
stats: {
totalDisasters: disasters.length,
activeDisasters: disasters.filter((d: any) => d.active).length,
totalVolunteers: dashboardData.statistics?.totalVolunteers || 0,
activeSOS: dashboardData.metrics?.activeSOS || 0,
}
});

setRecentActivity(activities);

} catch (error) {
console.error('Fetch map data error:', error);
toast({
title: "Error Loading Map Data",
description: error instanceof Error ? error.message : "Failed to load map data",
variant: "destructive",
});
      
// Fallback to mock data
setMapData({
disasters: [],
volunteers: [],
stats: {
totalDisasters: 0,
activeDisasters: 0,
totalVolunteers: 0,
activeSOS: 0,
}
});
setRecentActivity([]);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchMapData();
}, []);

// Helper functions
const getTimeAgo = (date: string) => {
const now = new Date();
const diffMs = now.getTime() - new Date(date).getTime();
const diffMins = Math.floor(diffMs / (1000 * 60));
const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
if (diffMins < 1) return "Just now";
if (diffMins < 60) return `${diffMins} min ago`;
if (diffHours < 24) return `${diffHours} hours ago`;
return `${Math.floor(diffHours / 24)} days ago`;
};

const getSeverityFromRadius = (radius: number) => {
if (radius >= 10) return 'high';
if (radius >= 5) return 'medium';
return 'low';
};

const getDisasterIcon = (type: string) => {
switch (type.toLowerCase()) {
case 'earthquake': return '🏔️';
case 'flood': return '🌊';
case 'hurricane':
case 'cyclone': return '💨';
case 'wildfire':
case 'fire': return '🔥';
default: return '⚠️';
}
};

if (loading) {
return (
<div className="flex items-center justify-center h-96">
<div className="text-center">
<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
<p className="text-muted-foreground">Loading map data...</p>
</div>
</div>
);
}

const mapLayers = [
{
id: "danger-zones",
label: "Danger Zones",
color: "text-red-600",
count: mapData?.stats.activeDisasters || 0,
active: true
},
{
id: "safe-routes",
label: "Safe Routes",
color: "text-green-600",
count: 45, // Mock - replace with real data
active: true
},
{
id: "shelters",
label: "Shelters",
color: "text-blue-600",
count: 23, // Mock - replace with real data
active: true
},
{
id: "volunteers",
label: "Active Volunteers",
color: "text-orange-600",
count: mapData?.stats.totalVolunteers || 0,
active: false
},
{
id: "sos",
label: "SOS Locations",
color: "text-red-600",
count: mapData?.stats.activeSOS || 0,
active: true
},
];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Interactive GIS Map</h1>
      <p className="text-muted-foreground">Real-time disaster zones, safe routes, and emergency coordination</p>
      </div>
        
      <div className="flex gap-2">
      <Button onClick={fetchMapData} variant="outline">
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh
      </Button>
      <Button>
      <Plus className="h-4 w-4 mr-2" />
      Create Zone
      </Button>
      <Button variant="outline">
      <Navigation className="h-4 w-4 mr-2" />
      Find Route
      </Button>
      </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Live Disaster Map
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4 mr-1" />
                    Layers
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[500px]">
            {/* Map Placeholder - In real implementation, this would be Google Maps/Leaflet */}
            <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
            <Map className="h-16 w-16 text-primary mx-auto opacity-50" />
            <div>
            <h3 className="font-semibold text-lg text-foreground">Interactive Map Integration</h3>
            <p className="text-muted-foreground">Live data from backend API</p>
            <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <p>📍 {mapData?.stats.activeDisasters} Active Disaster Zones</p>
            <p>👥 {mapData?.stats.totalVolunteers} Volunteers Available</p>
            <p>🚨 {mapData?.stats.activeSOS} SOS Requests</p>
            </div>
            </div>
            </div>
            </div>

            {/* Real Disaster Markers */}
            {mapData?.disasters.slice(0, 5).map((disaster, index) => (
            <div
            key={disaster._id}
            className={`absolute w-4 h-4 rounded-full shadow-lg cursor-pointer ${
            disaster.active ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
            }`}
            style={{
            top: `${20 + index * 80}px`,
            left: `${60 + index * 120}px`,
            }}
            title={`${disaster.type} - ${disaster.active ? 'Active' : 'Resolved'}`}
            >
            <div className="absolute -top-8 -left-4 text-lg">
            {getDisasterIcon(disaster.type)}
            </div>
            </div>
            ))}

            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 space-y-2">
            <Button size="sm" variant="secondary">+</Button>
            <Button size="sm" variant="secondary">-</Button>
            <Button size="sm" variant="secondary">
            <Navigation className="h-3 w-3" />
            </Button>
            </div>

            {/* Enhanced Legend */}
            <div className="absolute bottom-4 left-4 bg-card p-3 rounded-lg shadow-lg border">
            <h4 className="text-sm font-medium mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Active Disasters ({mapData?.stats.activeDisasters})</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Routes</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>SOS Alerts ({mapData?.stats.activeSOS})</span>
            </div>
            <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Shelters & Volunteers</span>
            </div>
            </div>
            </div>
            </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* Map Layers */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-4 w-4" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mapLayers.map((layer) => (
                <div key={layer.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      defaultChecked={layer.active}
                      className="rounded border-border"
                    />
                    <div>
                      <p className="text-sm font-medium">{layer.label}</p>
                      <p className={`text-xs ${layer.color}`}>{layer.count} active</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
          <CardHeader className="pb-4">
          <CardTitle className="text-lg">Live Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-3">
          <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Active Disasters</span>
          <Badge variant={mapData?.stats.activeDisasters && mapData.stats.activeDisasters > 0 ? "destructive" : "secondary"}>
          {mapData?.stats.activeDisasters || 0}
          </Badge>
          </div>
          <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Disasters</span>
          <Badge variant="secondary">{mapData?.stats.totalDisasters || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Available Volunteers</span>
          <Badge className="bg-green-500 text-white">{mapData?.stats.totalVolunteers || 0}</Badge>
          </div>
          <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">SOS Requests</span>
          <Badge className="bg-orange-500 text-white">{mapData?.stats.activeSOS || 0}</Badge>
          </div>
          </div>
          </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
          <CardHeader className="pb-4">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
          {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg border">
          <div className={`w-2 h-2 rounded-full mt-2 ${
          activity.severity === 'high' ? 'bg-red-500 animate-pulse' :
          activity.severity === 'resolved' ? 'bg-green-500' :
          'bg-orange-500'
          }`} />
          <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{activity.title}</p>
          <p className="text-xs text-muted-foreground truncate">{activity.location}</p>
          <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          </div>
          ))
          ) : (
          <div className="text-center py-4">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
          )}
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}