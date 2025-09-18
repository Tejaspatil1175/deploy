import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
AlertTriangle,
Search,
Filter,
Plus,
Eye,
Clock,
MapPin,
Users,
Trash2,
Loader2,
RefreshCw,
Mountain,
Waves,
Wind,
Zap,
Thermometer,
Package,
Shield
} from "lucide-react";

interface Disaster {
_id: string;
type: string;
description: string;
location: {
type: string;
coordinates: [number, number]; // [longitude, latitude]
};
radius: number;
resources: {
food: number;
medikits: number;
water: number;
blankets: number;
};
createdAt: string;
active: boolean;
}

export default function DisasterAlerts() {
const { toast } = useToast();
const { token } = useAuth();
  
const [disasters, setDisasters] = useState<Disaster[]>([]);
const [loading, setLoading] = useState(true);
const [deleting, setDeleting] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [typeFilter, setTypeFilter] = useState("all");
const [activeTab, setActiveTab] = useState("active");

// Fetch disasters from backend
const fetchDisasters = async () => {
try {
setLoading(true);
const apiUrl = import.meta.env.VITE_API_URL || 'https://deploy-4f2g.onrender.com';
      
const response = await fetch(`${apiUrl}/api/disasters`, {
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
});

if (!response.ok) {
throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const data = await response.json();
setDisasters(data);
} catch (error) {
console.error('Fetch disasters error:', error);
toast({
title: "Error Loading Disasters",
description: error instanceof Error ? error.message : "Failed to load disasters",
variant: "destructive",
});
} finally {
setLoading(false);
}
};

// Delete disaster
const handleDelete = async (disasterId: string, disasterType: string) => {
if (!confirm(`Are you sure you want to delete this ${disasterType} disaster? This action cannot be undone.`)) {
return;
}

try {
setDeleting(disasterId);
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
const response = await fetch(`${apiUrl}/api/disasters/${disasterId}`, {
method: 'DELETE',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
});

if (!response.ok) {
throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const result = await response.json();
      
toast({
title: "Disaster Deleted",
description: `${disasterType} disaster has been successfully removed.`,
});

// Refresh the disasters list
fetchDisasters();
} catch (error) {
console.error('Delete disaster error:', error);
toast({
title: "Error Deleting Disaster",
description: error instanceof Error ? error.message : "Failed to delete disaster",
variant: "destructive",
});
} finally {
setDeleting(null);
}
};

useEffect(() => {
fetchDisasters();
}, []);

const getTypeIcon = (type: string) => {
const lowerType = type.toLowerCase();
switch (lowerType) {
case 'flood': return <Waves className="h-5 w-5" />;
case 'earthquake': return <Mountain className="h-5 w-5" />;
case 'hurricane':
case 'cyclone': return <Wind className="h-5 w-5" />;
case 'wildfire':
case 'fire': return <Zap className="h-5 w-5" />;
case 'drought':
case 'heatwave': return <Thermometer className="h-5 w-5" />;
default: return <AlertTriangle className="h-5 w-5" />;
}
};

  const getSeverityLevel = (radius: number) => {
if (radius >= 10) return 'critical';  // 10+ km
if (radius >= 5) return 'high';       // 5+ km
if (radius >= 2) return 'medium';     // 2+ km
return 'low';                         // < 2 km
};

const getSeverityColor = (severity: string) => {
switch (severity) {
case 'critical': return 'bg-red-500 text-white';
case 'high': return 'bg-orange-500 text-white';
case 'medium': return 'bg-yellow-500 text-white';
case 'low': return 'bg-blue-500 text-white';
default: return 'bg-gray-500 text-white';
}
};

const formatCoordinates = (coordinates: [number, number]) => {
const [lng, lat] = coordinates;
return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

  const formatDistance = (kilometers: number) => {
if (kilometers >= 1) {
return `${kilometers} km`;
}
return `${(kilometers * 1000)} m`;
};

const formatDate = (dateString: string) => {
return new Date(dateString).toLocaleString();
};

const getTotalResources = (resources: Disaster['resources']) => {
return Object.values(resources).reduce((sum, count) => sum + count, 0);
};

const filteredDisasters = disasters.filter(disaster => {
const matchesSearch = searchTerm === '' ||
disaster.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
disaster.description.toLowerCase().includes(searchTerm.toLowerCase());
    
const matchesType = typeFilter === 'all' || disaster.type.toLowerCase() === typeFilter.toLowerCase();
    
const matchesTab =
(activeTab === 'active' && disaster.active) ||
(activeTab === 'inactive' && !disaster.active) ||
(activeTab === 'all');
    
return matchesSearch && matchesType && matchesTab;
});

const stats = {
total: disasters.length,
active: disasters.filter(d => d.active).length,
inactive: disasters.filter(d => !d.active).length,
    totalRadius: disasters.reduce((sum, d) => sum + d.radius, 0), // Already in km
};

if (loading) {
return (
<div className="flex items-center justify-center h-96">
<div className="text-center">
<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
<p className="text-muted-foreground">Loading disasters...</p>
</div>
</div>
);
}

  return (
  <div className="space-y-6">
  {/* Page Header */}
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div>
  <h1 className="text-3xl font-bold tracking-tight text-foreground">Disaster Management</h1>
  <p className="text-muted-foreground">Monitor and manage all disaster alerts and emergency responses</p>
  </div>
        
  <div className="flex gap-2">
  <Button onClick={fetchDisasters} variant="outline">
  <RefreshCw className="h-4 w-4 mr-2" />
  Refresh
  </Button>
  </div>
  </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
  <Card>
  <CardContent className="flex items-center p-6">
  <div className="flex items-center gap-4">
  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
  <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
  </div>
  <div>
  <p className="text-2xl font-bold">{stats.total}</p>
  <p className="text-sm text-muted-foreground">Total Disasters</p>
  </div>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardContent className="flex items-center p-6">
  <div className="flex items-center gap-4">
  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
  <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
  </div>
  <div>
  <p className="text-2xl font-bold">{stats.active}</p>
  <p className="text-sm text-muted-foreground">Active Disasters</p>
  </div>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardContent className="flex items-center p-6">
  <div className="flex items-center gap-4">
  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
  </div>
  <div>
  <p className="text-2xl font-bold">{stats.inactive}</p>
  <p className="text-sm text-muted-foreground">Resolved</p>
  </div>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardContent className="flex items-center p-6">
  <div className="flex items-center gap-4">
  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
  <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
  </div>
  <div>
  <p className="text-2xl font-bold">{stats.totalRadius.toFixed(0)}</p>
  <p className="text-sm text-muted-foreground">Total Coverage (km)</p>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>

  {/* Main Content */}
  <Tabs value={activeTab} onValueChange={setActiveTab}>
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <TabsList>
  <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
  <TabsTrigger value="inactive">Resolved ({stats.inactive})</TabsTrigger>
  <TabsTrigger value="all">All Disasters ({stats.total})</TabsTrigger>
  </TabsList>

  {/* Filters */}
  <div className="flex flex-col gap-2 md:flex-row md:items-center">
  <div className="flex items-center gap-2">
  <Search className="h-4 w-4 text-muted-foreground" />
  <Input
  placeholder="Search disasters..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-64"
  />
  </div>
  <div className="flex items-center gap-2">
  <Filter className="h-4 w-4 text-muted-foreground" />
  <Select value={typeFilter} onValueChange={setTypeFilter}>
  <SelectTrigger className="w-40">
  <SelectValue placeholder="Type" />
  </SelectTrigger>
  <SelectContent>
  <SelectItem value="all">All Types</SelectItem>
  <SelectItem value="earthquake">Earthquake</SelectItem>
  <SelectItem value="flood">Flood</SelectItem>
  <SelectItem value="hurricane">Hurricane</SelectItem>
  <SelectItem value="wildfire">Wildfire</SelectItem>
  <SelectItem value="tornado">Tornado</SelectItem>
  <SelectItem value="other">Other</SelectItem>
  </SelectContent>
  </Select>
  </div>
  </div>
  </div>

  <TabsContent value={activeTab} className="space-y-4">
  {filteredDisasters.length === 0 ? (
  <Card>
  <CardContent className="flex flex-col items-center justify-center py-12">
  <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold mb-2">No Disasters Found</h3>
  <p className="text-muted-foreground text-center">
  {searchTerm || typeFilter !== 'all'
  ? "No disasters match your current filters."
  : "No disasters have been reported yet."}
  </p>
  </CardContent>
  </Card>
  ) : (
  <div className="grid gap-4">
  {filteredDisasters.map((disaster) => {
  const severity = getSeverityLevel(disaster.radius);
  const totalResources = getTotalResources(disaster.resources);
                
  return (
  <Card key={disaster._id} className={`overflow-hidden ${severity === 'critical' ? 'ring-2 ring-red-500/30' : ''}`}>
  <CardContent className="p-6">
  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
  <div className="space-y-4 flex-1">
  {/* Header */}
  <div className="flex items-start justify-between">
  <div className="flex items-center gap-3">
  <div className={`p-2 rounded-lg ${
  severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
  severity === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' :
  'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
  }`}>
  {getTypeIcon(disaster.type)}
  </div>
  <div>
  <div className="flex items-center gap-2 mb-1">
  <h3 className="font-semibold text-xl capitalize">{disaster.type} Disaster</h3>
  <Badge variant="outline" className="text-xs">ID: {disaster._id.slice(-6)}</Badge>
  </div>
  <div className="flex items-center gap-2">
  <Badge className={getSeverityColor(severity)} variant="secondary">
  {severity.toUpperCase()}
  </Badge>
  <Badge className={disaster.active ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'} variant="secondary">
  {disaster.active ? 'ACTIVE' : 'RESOLVED'}
  </Badge>
  </div>
  </div>
  </div>
  </div>

  {/* Alert Details */}
  <div className="space-y-3">
  <p className="text-sm bg-muted/50 p-3 rounded-lg">{disaster.description}</p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
  <div className="space-y-2">
  <div className="flex items-center gap-2">
  <MapPin className="h-4 w-4 text-muted-foreground" />
  <span className="font-medium">Location:</span>
  <span className="text-muted-foreground">{formatCoordinates(disaster.location.coordinates)}</span>
  </div>
  <div className="flex items-center gap-2">
  <Clock className="h-4 w-4 text-muted-foreground" />
  <span className="font-medium">Created:</span>
  <span>{formatDate(disaster.createdAt)}</span>
  </div>
  <div className="flex items-center gap-2">
  <span className="font-medium">Affected Radius:</span>
  <span className="text-red-600 font-semibold">{formatDistance(disaster.radius)}</span>
  </div>
  </div>
  <div className="space-y-2">
  <div className="flex items-center gap-2">
  <Package className="h-4 w-4 text-muted-foreground" />
  <span className="font-medium">Total Resources:</span>
  <span>{totalResources} items</span>
  </div>
  </div>
  </div>

  {/* Resource Details */}
  <div className="space-y-2">
  <span className="font-medium text-sm">Resource Allocation:</span>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
  {Object.entries(disaster.resources).map(([type, count]) => (
  <div key={type} className="bg-muted/30 p-2 rounded text-xs">
  <p className="font-medium capitalize">{type}</p>
  <p className="text-muted-foreground">{count} units</p>
  </div>
  ))}
  </div>
  </div>
  </div>
  </div>

  {/* Actions */}
  <div className="flex flex-col gap-2 lg:w-48">
  <Button size="sm" variant="outline" className="w-full">
  <Eye className="h-3 w-3 mr-2" />
  View on Map
  </Button>
  <Button
  size="sm"
  variant="outline"
  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
  onClick={() => handleDelete(disaster._id, disaster.type)}
  disabled={deleting === disaster._id}
  >
  {deleting === disaster._id ? (
  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
  ) : (
  <Trash2 className="h-3 w-3 mr-2" />
  )}
  {deleting === disaster._id ? 'Deleting...' : 'Delete'}
  </Button>
  </div>
  </div>
  </CardContent>
  </Card>
  );
  })}
  </div>
  )}
  </TabsContent>
  </Tabs>
  </div>
  );
  }