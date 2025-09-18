import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Circle,
  Search,
  Filter,
  Eye,
  Clock,
  Users
} from "lucide-react";

export default function DangerZones() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const dangerZones = [
    {
      id: "DZ-001",
      name: "Yamuna Flood Zone",
      type: "flood",
      severity: "critical",
      radius: "1000m",
      coordinates: "28.6519, 77.2315",
      location: "Yamuna Bank, Delhi",
      affectedPopulation: 15000,
      status: "active",
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-20",
      description: "High flood risk area due to Yamuna river overflow during monsoon season",
      evacuationRoutes: ["Route A-1", "Route A-2"],
      emergencyContacts: ["Fire Station 12", "Police Station Civil Lines"]
    },
    {
      id: "DZ-002", 
      name: "Industrial Fire Risk Zone",
      type: "fire",
      severity: "high",
      radius: "500m",
      coordinates: "28.7041, 77.1025",
      location: "Industrial Area, Rohini",
      affectedPopulation: 8500,
      status: "monitoring",
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-18",
      description: "Chemical plant vicinity with potential fire and explosion hazards",
      evacuationRoutes: ["Route B-1"],
      emergencyContacts: ["Fire Station 15", "Hazmat Team Delta"]
    },
    {
      id: "DZ-003",
      name: "Earthquake Fault Zone",
      type: "earthquake",
      severity: "medium",
      radius: "2000m", 
      coordinates: "28.5676, 77.2436",
      location: "Ridge Area, Central Delhi",
      affectedPopulation: 25000,
      status: "active",
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-19",
      description: "Seismically active area with building collapse risk during earthquakes",
      evacuationRoutes: ["Route C-1", "Route C-2", "Route C-3"],
      emergencyContacts: ["NDRF Team 3", "Medical Emergency Unit"]
    },
    {
      id: "DZ-004",
      name: "Landslide Risk Area",
      type: "landslide",
      severity: "high",
      radius: "750m",
      coordinates: "28.6129, 77.2773",
      location: "Hill Slopes, East Delhi",
      affectedPopulation: 3200,
      status: "inactive",
      createdDate: "2023-12-20",
      lastUpdated: "2024-01-15",
      description: "Steep terrain with loose soil, high landslide probability during heavy rains",
      evacuationRoutes: ["Route D-1"],
      emergencyContacts: ["Earth Sciences Unit", "Rescue Team Bravo"]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger text-danger-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-danger text-danger-foreground';
      case 'monitoring': return 'bg-warning text-warning-foreground';
      case 'inactive': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'earthquake': return '🏗️';
      case 'landslide': return '⛰️';
      default: return '⚠️';
    }
  };

  const filteredZones = dangerZones.filter(zone => {
    const matchesSearch = searchTerm === '' || 
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || zone.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const stats = {
    total: dangerZones.length,
    active: dangerZones.filter(z => z.status === 'active').length,
    monitoring: dangerZones.filter(z => z.status === 'monitoring').length,
    critical: dangerZones.filter(z => z.severity === 'critical').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Danger Zone Management</h1>
          <p className="text-muted-foreground">Create, monitor, and manage high-risk disaster zones</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Danger Zone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Danger Zone</DialogTitle>
                <DialogDescription>
                  Define a new high-risk area for disaster monitoring and response
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zone-name">Zone Name</Label>
                    <Input id="zone-name" placeholder="e.g., River Flood Zone A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zone-type">Disaster Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                        <SelectItem value="landslide">Landslide</SelectItem>
                        <SelectItem value="cyclone">Cyclone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="radius">Risk Radius</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500 meters</SelectItem>
                        <SelectItem value="1000">1000 meters</SelectItem>
                        <SelectItem value="1500">1500 meters</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coordinates">Coordinates</Label>
                  <Input id="coordinates" placeholder="e.g., 28.6139, 77.2090" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location Description</Label>
                  <Input id="location" placeholder="e.g., Near India Gate, Central Delhi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the risk factors and potential impact..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Zone
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View on Map
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Zones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-danger-light">
                <AlertTriangle className="h-6 w-6 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active Zones</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-warning-light">
                <Eye className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.monitoring}</p>
                <p className="text-sm text-muted-foreground">Monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-danger-light">
                <Circle className="h-6 w-6 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search danger zones by name or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="flood">Flood Zones</SelectItem>
                  <SelectItem value="fire">Fire Risk</SelectItem>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="landslide">Landslide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zones List */}
      <div className="grid gap-4">
        {filteredZones.map((zone) => (
          <Card key={zone.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTypeIcon(zone.type)}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-xl">{zone.name}</h3>
                          <Badge variant="outline" className="text-xs">{zone.id}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(zone.severity)} variant="secondary">
                            {zone.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(zone.status)} variant="secondary">
                            {zone.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span>{zone.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Risk Radius:</span>
                        <span>{zone.radius}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Affected Population:</span>
                        <span>{zone.affectedPopulation.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Coordinates:</span>
                        <span className="text-muted-foreground">{zone.coordinates}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Last Updated:</span>
                        <span className="text-muted-foreground">{zone.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">{zone.description}</p>
                  </div>

                  {/* Evacuation Routes */}
                  <div className="space-y-2">
                    <span className="font-medium text-sm">Evacuation Routes:</span>
                    <div className="flex flex-wrap gap-1">
                      {zone.evacuationRoutes.map((route) => (
                        <Badge key={route} variant="outline" className="text-xs">
                          {route}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-2" />
                    View on Map
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit Zone
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Users className="h-3 w-3 mr-2" />
                    Evacuation Plan
                  </Button>
                  <Button size="sm" variant="ghost" className="w-full text-danger hover:text-danger">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Remove Zone
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}