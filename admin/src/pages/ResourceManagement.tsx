import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Truck, 
  MapPin, 
  AlertTriangle, 
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Users,
  BarChart3
} from "lucide-react";

export default function ResourceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("inventory");

  const resources = [
    {
      id: "RES-001",
      name: "Emergency Food Supplies",
      category: "food",
      totalStock: 5000,
      availableStock: 3200,
      allocatedStock: 1800,
      unit: "meal packs",
      location: "Central Warehouse Delhi",
      expiryDate: "2024-06-15",
      criticalLevel: 1000,
      supplier: "Food Corp India",
      lastRestocked: "2024-01-18",
      cost: 450000
    },
    {
      id: "RES-002",
      name: "Drinking Water Bottles",
      category: "water", 
      totalStock: 10000,
      availableStock: 2500,
      allocatedStock: 7500,
      unit: "bottles (1L)",
      location: "Multiple Warehouses",
      expiryDate: "2024-12-31",
      criticalLevel: 2000,
      supplier: "Aquafina Supplies",
      lastRestocked: "2024-01-20",
      cost: 150000
    },
    {
      id: "RES-003",
      name: "Medical First Aid Kits",
      category: "medical",
      totalStock: 800,
      availableStock: 650,
      allocatedStock: 150,
      unit: "kits",
      location: "Medical Depot Rohini",
      expiryDate: "2025-03-30",
      criticalLevel: 100,
      supplier: "MedSupply Ltd",
      lastRestocked: "2024-01-15",
      cost: 320000
    },
    {
      id: "RES-004",
      name: "Emergency Blankets",
      category: "shelter",
      totalStock: 2000,
      availableStock: 1200,
      allocatedStock: 800,
      unit: "pieces",
      location: "Relief Center Dwarka",
      expiryDate: null,
      criticalLevel: 300,
      supplier: "Textile Industries",
      lastRestocked: "2024-01-12",
      cost: 200000
    },
    {
      id: "RES-005",
      name: "Portable Generators",
      category: "equipment",
      totalStock: 50,
      availableStock: 15,
      allocatedStock: 35,
      unit: "units",
      location: "Equipment Depot CP",
      expiryDate: null,
      criticalLevel: 10,
      supplier: "Power Solutions Inc",
      lastRestocked: "2024-01-08",
      cost: 2500000
    }
  ];

  const allocations = [
    {
      id: "ALLOC-001",
      resourceId: "RES-001",
      resourceName: "Emergency Food Supplies",
      quantity: 500,
      unit: "meal packs",
      destination: "Flood Relief Camp - Yamuna Bank",
      coordinates: "28.6519, 77.2315",
      requestedBy: "Camp Coordinator - Ravi Kumar",
      priority: "high",
      status: "approved",
      requestDate: "2024-01-20",
      deliveryDate: "2024-01-21",
      assignedVehicle: "TR-001",
      estimatedArrival: "14:30"
    },
    {
      id: "ALLOC-002",
      resourceId: "RES-002", 
      resourceName: "Drinking Water Bottles",
      quantity: 1000,
      unit: "bottles",
      destination: "Evacuation Center - Rohini Sector 15",
      coordinates: "28.7041, 77.1025",
      requestedBy: "Medical Officer - Dr. Priya Sharma",
      priority: "critical",
      status: "in-transit",
      requestDate: "2024-01-20",
      deliveryDate: "2024-01-20",
      assignedVehicle: "TR-003",
      estimatedArrival: "16:45"
    },
    {
      id: "ALLOC-003",
      resourceId: "RES-003",
      resourceName: "Medical First Aid Kits", 
      quantity: 25,
      unit: "kits",
      destination: "Emergency Response Team Base",
      coordinates: "28.5676, 77.2436",
      requestedBy: "Team Lead - Amit Singh",
      priority: "medium",
      status: "pending",
      requestDate: "2024-01-20",
      deliveryDate: "2024-01-21",
      assignedVehicle: null,
      estimatedArrival: null
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return '🍽️';
      case 'water': return '💧';
      case 'medical': return '🏥';
      case 'shelter': return '🏠';
      case 'equipment': return '🔧';
      default: return '📦';
    }
  };

  const getStockLevel = (available: number, total: number, critical: number) => {
    const percentage = (available / total) * 100;
    if (available <= critical) return { level: 'critical', color: 'bg-danger', percentage };
    if (percentage <= 30) return { level: 'low', color: 'bg-warning', percentage };
    if (percentage <= 60) return { level: 'medium', color: 'bg-primary', percentage };
    return { level: 'good', color: 'bg-safe', percentage };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-danger text-danger-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-safe text-safe-foreground';
      case 'in-transit': return 'bg-primary text-primary-foreground';
      case 'delivered': return 'bg-safe text-safe-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-danger text-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalResources: resources.length,
    criticalStock: resources.filter(r => r.availableStock <= r.criticalLevel).length,
    activeAllocations: allocations.filter(a => a.status === 'approved' || a.status === 'in-transit').length,
    totalValue: resources.reduce((sum, r) => sum + r.cost, 0)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Resource Management</h1>
          <p className="text-muted-foreground">Track, allocate, and manage disaster relief resources</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            New Allocation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalResources}</p>
                <p className="text-sm text-muted-foreground">Resource Types</p>
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
                <p className="text-2xl font-bold">{stats.criticalStock}</p>
                <p className="text-sm text-muted-foreground">Critical Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeAllocations}</p>
                <p className="text-sm text-muted-foreground">Active Deliveries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-safe-light">
                <BarChart3 className="h-6 w-6 text-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(stats.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Resource Inventory</TabsTrigger>
          <TabsTrigger value="allocations">Active Allocations</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search resources by name or location..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="food">Food Supplies</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="shelter">Shelter</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Grid */}
          <div className="grid gap-4">
            {filteredResources.map((resource) => {
              const stockLevel = getStockLevel(resource.availableStock, resource.totalStock, resource.criticalLevel);
              
              return (
                <Card key={resource.id} className={`overflow-hidden ${stockLevel.level === 'critical' ? 'ring-2 ring-danger/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4 flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{getCategoryIcon(resource.category)}</span>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-xl">{resource.name}</h3>
                                <Badge variant="outline" className="text-xs">{resource.id}</Badge>
                              </div>
                              <Badge variant="outline" className="text-xs capitalize">{resource.category}</Badge>
                            </div>
                          </div>
                          {stockLevel.level === 'critical' && (
                            <div className="flex items-center gap-1 text-danger">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">Critical Stock</span>
                            </div>
                          )}
                        </div>

                        {/* Stock Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Available Stock: <strong>{resource.availableStock.toLocaleString()} {resource.unit}</strong></span>
                            <span className="text-muted-foreground">
                              {resource.allocatedStock.toLocaleString()} allocated
                            </span>
                          </div>
                          <Progress value={stockLevel.percentage} className={`h-3 ${stockLevel.color}`} />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Critical: {resource.criticalLevel}</span>
                            <span>Total: {resource.totalStock.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Location:</span>
                              <span>{resource.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Supplier:</span>
                              <span>{resource.supplier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Last Restocked:</span>
                              <span>{resource.lastRestocked}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Value:</span>
                              <span>₹{resource.cost.toLocaleString()}</span>
                            </div>
                            {resource.expiryDate && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Expiry:</span>
                                <span>{resource.expiryDate}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Per Unit Cost:</span>
                              <span>₹{Math.round(resource.cost / resource.totalStock)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button size="sm" className="w-full">
                          <ArrowRight className="h-3 w-3 mr-2" />
                          Allocate
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Plus className="h-3 w-3 mr-2" />
                          Restock
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <MapPin className="h-3 w-3 mr-2" />
                          Track Location
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <BarChart3 className="h-3 w-3 mr-2" />
                          Usage History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Allocations Tab */}
        <TabsContent value="allocations" className="space-y-4">
          {/* Allocations List */}
          <div className="grid gap-4">
            {allocations.map((allocation) => (
              <Card key={allocation.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{allocation.resourceName}</h3>
                            <Badge variant="outline" className="text-xs">{allocation.id}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(allocation.priority)} variant="secondary">
                              {allocation.priority.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(allocation.status)} variant="secondary">
                              {allocation.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Allocation Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Quantity:</span>
                            <span>{allocation.quantity} {allocation.unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Destination:</span>
                            <span>{allocation.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Requested by:</span>
                            <span>{allocation.requestedBy}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Delivery Date:</span>
                            <span>{allocation.deliveryDate}</span>
                          </div>
                          {allocation.assignedVehicle && (
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Vehicle:</span>
                              <span>{allocation.assignedVehicle}</span>
                            </div>
                          )}
                          {allocation.estimatedArrival && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">ETA:</span>
                              <span>{allocation.estimatedArrival}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {allocation.status === 'pending' && (
                        <>
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <XCircle className="h-3 w-3 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {allocation.status === 'approved' && (
                        <Button size="sm" className="w-full">
                          <Truck className="h-3 w-3 mr-2" />
                          Assign Vehicle
                        </Button>
                      )}
                      {allocation.status === 'in-transit' && (
                        <Button size="sm" variant="outline" className="w-full">
                          <MapPin className="h-3 w-3 mr-2" />
                          Track Delivery
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}