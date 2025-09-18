import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Route, 
  Navigation, 
  MapPin, 
  Clock, 
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Flag
} from "lucide-react";

export default function SafeRoutes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("routes");

  const safeRoutes = [
    {
      id: "SR-001",
      name: "Central Delhi to IGI Airport",
      startPoint: "Connaught Place",
      endPoint: "IGI Airport Terminal 3",
      distance: "18.2 km",
      estimatedTime: "35 minutes",
      status: "verified",
      safetyRating: 4.8,
      lastVerified: "2024-01-20",
      hazards: ["Construction Zone at Km 12"],
      alternativeRoutes: 3,
      usageCount: 1250,
      feedback: {
        positive: 145,
        negative: 12,
        total: 157
      }
    },
    {
      id: "SR-002",
      name: "Dwarka to Gurgaon",
      startPoint: "Dwarka Sector 21",
      endPoint: "Cyber City, Gurgaon",
      distance: "22.4 km",
      estimatedTime: "42 minutes",
      status: "needs-update",
      safetyRating: 4.2,
      lastVerified: "2024-01-15",
      hazards: ["Flood risk at Najafgarh", "Heavy traffic zone"],
      alternativeRoutes: 2,
      usageCount: 890,
      feedback: {
        positive: 89,
        negative: 23,
        total: 112
      }
    },
    {
      id: "SR-003",
      name: "Red Fort to Lotus Temple",
      startPoint: "Red Fort Main Gate",
      endPoint: "Lotus Temple",
      distance: "15.8 km",
      estimatedTime: "28 minutes",
      status: "verified",
      safetyRating: 4.6,
      lastVerified: "2024-01-19",
      hazards: [],
      alternativeRoutes: 4,
      usageCount: 2100,
      feedback: {
        positive: 198,
        negative: 15,
        total: 213
      }
    }
  ];

  const userFeedback = [
    {
      id: "FB-001",
      routeId: "SR-001",
      routeName: "Central Delhi to IGI Airport",
      userName: "Ravi Kumar",
      userType: "commuter",
      feedbackType: "unsafe-spot",
      location: "Near Mahipalpur Flyover",
      coordinates: "28.5403, 77.1294",
      message: "Waterlogging during rain makes this stretch very dangerous. Vehicles get stuck.",
      timestamp: "2024-01-20 14:30",
      status: "pending",
      severity: "high",
      images: ["waterlog1.jpg", "waterlog2.jpg"],
      adminResponse: null
    },
    {
      id: "FB-002", 
      routeId: "SR-002",
      routeName: "Dwarka to Gurgaon",
      userName: "Priya Sharma",
      userType: "volunteer",
      feedbackType: "suggestion",
      location: "Palam Road Junction",
      coordinates: "28.5562, 77.0840",
      message: "Alternative route via NH-8 service road is much safer during peak hours.",
      timestamp: "2024-01-19 16:45",
      status: "approved",
      severity: "medium",
      images: [],
      adminResponse: "Thank you for the suggestion. Route updated with alternative path."
    },
    {
      id: "FB-003",
      routeId: "SR-003", 
      routeName: "Red Fort to Lotus Temple",
      userName: "Amit Singh",
      userType: "emergency-responder",
      feedbackType: "hazard-report",
      location: "Mathura Road Underpass",
      coordinates: "28.5735, 77.2718",
      message: "Construction debris blocking emergency vehicle access. Immediate clearance needed.",
      timestamp: "2024-01-20 09:15",
      status: "in-progress",
      severity: "critical",
      images: ["debris1.jpg"],
      adminResponse: "Forwarded to PWD. Expected clearance by evening."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-safe text-safe-foreground';
      case 'needs-update': return 'bg-warning text-warning-foreground';
      case 'blocked': return 'bg-danger text-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getFeedbackStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-safe text-safe-foreground';
      case 'rejected': return 'bg-danger text-danger-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-safe';
      default: return 'text-muted-foreground';
    }
  };

  const filteredRoutes = safeRoutes.filter(route => {
    const matchesSearch = searchTerm === '' || 
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.endPoint.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredFeedback = userFeedback.filter(feedback => {
    const matchesSearch = searchTerm === '' || 
      feedback.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Safe Route Management</h1>
          <p className="text-muted-foreground">Monitor safe evacuation routes and manage user feedback</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Route
          </Button>
          <Button variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Route Optimizer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-safe-light">
                <Route className="h-6 w-6 text-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold">{safeRoutes.length}</p>
                <p className="text-sm text-muted-foreground">Safe Routes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {safeRoutes.filter(r => r.status === 'verified').length}
                </p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-warning-light">
                <MessageSquare className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userFeedback.length}</p>
                <p className="text-sm text-muted-foreground">User Feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-danger-light">
                <Flag className="h-6 w-6 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {userFeedback.filter(f => f.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="routes">Safe Routes</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
        </TabsList>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search routes by name or location..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Routes</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="needs-update">Needs Update</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Routes List */}
          <div className="grid gap-4">
            {filteredRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-xl">{route.name}</h3>
                            <Badge variant="outline" className="text-xs">{route.id}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(route.status)} variant="secondary">
                              {route.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <span>⭐ {route.safetyRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Route Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-safe" />
                            <span className="font-medium">From:</span>
                            <span>{route.startPoint}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-danger" />
                            <span className="font-medium">To:</span>
                            <span>{route.endPoint}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Route className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Distance:</span>
                            <span>{route.distance}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Est. Time:</span>
                            <span>{route.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Usage Count:</span>
                            <span>{route.usageCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Alternatives:</span>
                            <span>{route.alternativeRoutes} routes</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Last Verified:</span>
                            <span className="text-muted-foreground">{route.lastVerified}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <ThumbsUp className="h-4 w-4 text-safe" />
                            <span>{route.feedback.positive}</span>
                            <ThumbsDown className="h-4 w-4 text-danger ml-2" />
                            <span>{route.feedback.negative}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hazards */}
                      {route.hazards.length > 0 && (
                        <div className="space-y-2">
                          <span className="font-medium text-sm text-warning">Known Hazards:</span>
                          <div className="flex flex-wrap gap-2">
                            {route.hazards.map((hazard, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-warning text-warning">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {hazard}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button size="sm" className="w-full">
                        <Navigation className="h-3 w-3 mr-2" />
                        View on Map
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Update Route
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <MessageSquare className="h-3 w-3 mr-2" />
                        View Feedback
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Generate Alternatives
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {/* Feedback Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search feedback by route, user, or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="grid gap-4">
            {filteredFeedback.map((feedback) => (
              <Card key={feedback.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{feedback.routeName}</h3>
                            <Badge variant="outline" className="text-xs">{feedback.id}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getFeedbackStatusColor(feedback.status)} variant="secondary">
                              {feedback.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <span className={`text-sm font-medium ${getSeverityColor(feedback.severity)}`}>
                              {feedback.severity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback Details */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Reporter:</span> {feedback.userName}
                            <span className="text-muted-foreground ml-2">({feedback.userType})</span>
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {feedback.feedbackType.replace('-', ' ')}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">Location:</span> {feedback.location}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {feedback.timestamp}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="font-medium text-sm">Message:</span>
                          <p className="text-sm bg-muted p-3 rounded-lg">{feedback.message}</p>
                        </div>

                        {feedback.adminResponse && (
                          <div className="space-y-2">
                            <span className="font-medium text-sm">Admin Response:</span>
                            <p className="text-sm bg-primary/10 p-3 rounded-lg">{feedback.adminResponse}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {feedback.status === 'pending' && (
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
                      <Button size="sm" variant="outline" className="w-full">
                        <MapPin className="h-3 w-3 mr-2" />
                        View Location
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <MessageSquare className="h-3 w-3 mr-2" />
                        Respond
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