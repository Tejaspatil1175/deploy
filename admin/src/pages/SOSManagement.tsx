import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  MessageSquare,
  Filter,
  Search,
  UserCheck,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function SOSManagement() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const sosRequests = [
    {
      id: "SOS-2024-001",
      name: "Ravi Kumar",
      phone: "+91 98765 43210",
      location: "Dwarka Sector 12, New Delhi",
      coordinates: "28.5921, 77.0460",
      type: "trapped",
      severity: "critical",
      message: "Trapped in building collapse, 3rd floor. Can't move my leg. Water rising.",
      timestamp: "2 minutes ago",
      status: "assigned",
      volunteer: "Team Alpha - 5 min ETA",
      battery: "12%"
    },
    {
      id: "SOS-2024-002", 
      name: "Priya Sharma",
      phone: "+91 99887 76543",
      location: "Rohini Sector 18, Delhi",
      coordinates: "28.7041, 77.1025",
      type: "medical",
      severity: "high", 
      message: "Elderly person having chest pain. Need immediate medical help.",
      timestamp: "7 minutes ago",
      status: "en-route",
      volunteer: "Dr. Mehta - 2 min ETA",
      battery: "45%"
    },
    {
      id: "SOS-2024-003",
      name: "Amit Patel",
      phone: "+91 87654 32109",
      location: "Lajpat Nagar, Delhi",
      coordinates: "28.5676, 77.2436", 
      type: "missing",
      severity: "medium",
      message: "Lost contact with my daughter during evacuation. Last seen near metro station.",
      timestamp: "12 minutes ago",
      status: "pending",
      volunteer: "Unassigned",
      battery: "78%"
    },
    {
      id: "SOS-2024-004",
      name: "Sunita Devi",
      phone: "+91 76543 21098",
      location: "Karol Bagh, Delhi", 
      coordinates: "28.6519, 77.1909",
      type: "safe",
      severity: "low",
      message: "Reached evacuation center safely. Family of 4 needs shelter.",
      timestamp: "25 minutes ago",
      status: "resolved",
      volunteer: "Completed",
      battery: "65%"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-danger text-danger-foreground';
      case 'assigned': return 'bg-warning text-warning-foreground';
      case 'en-route': return 'bg-primary text-primary-foreground';
      case 'resolved': return 'bg-safe text-safe-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-danger" />;
      case 'high': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-primary" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-safe" />;
      default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trapped': return '🏗️';
      case 'medical': return '🏥';
      case 'missing': return '👥';
      case 'safe': return '✅';
      default: return '🆘';
    }
  };

  const filteredRequests = sosRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = search === '' || 
      request.name.toLowerCase().includes(search.toLowerCase()) ||
      request.location.toLowerCase().includes(search.toLowerCase()) ||
      request.id.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SOS Management</h1>
          <p className="text-muted-foreground">Monitor and respond to emergency requests in real-time</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Phone className="h-4 w-4 mr-2" />
            Emergency Broadcast
          </Button>
          <Button variant="outline">
            <UserCheck className="h-4 w-4 mr-2" />
            Deploy Team
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-danger-light">
                <Shield className="h-6 w-6 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-sm text-muted-foreground">Active SOS</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-warning-light">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">En Route</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-safe-light">
                <CheckCircle className="h-6 w-6 text-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold">342</p>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, location, or SOS ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="en-route">En Route</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SOS Requests */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4 flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(request.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{request.name}</h3>
                          <Badge variant="outline" className="text-xs">{request.id}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {request.phone}
                          <span className="ml-2 text-xs">Battery: {request.battery}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(request.severity)}
                      <Badge className={getStatusColor(request.status)} variant="secondary">
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Location and Message */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">{request.location}</p>
                        <p className="text-muted-foreground">Coordinates: {request.coordinates}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-foreground">{request.message}</p>
                    </div>
                  </div>

                  {/* Status and Time */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{request.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className={request.status === 'pending' ? 'text-danger font-medium' : 'text-foreground'}>
                        {request.volunteer}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-48">
                  {request.status === 'pending' && (
                    <>
                      <Button size="sm" className="w-full">
                        <UserCheck className="h-3 w-3 mr-2" />
                        Assign Volunteer
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Phone className="h-3 w-3 mr-2" />
                        Call Victim
                      </Button>
                    </>
                  )}
                  {request.status === 'assigned' && (
                    <>
                      <Button size="sm" variant="outline" className="w-full">
                        <MapPin className="h-3 w-3 mr-2" />
                        Track Volunteer
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Phone className="h-3 w-3 mr-2" />
                        Call Team
                      </Button>
                    </>
                  )}
                  {request.status === 'en-route' && (
                    <>
                      <Button size="sm" variant="outline" className="w-full">
                        <MapPin className="h-3 w-3 mr-2" />
                        Live Location
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <MessageSquare className="h-3 w-3 mr-2" />
                        Update Status
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="ghost" className="w-full">
                    View Details
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