import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck
} from "lucide-react";

export default function VolunteerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const volunteers = [
    {
      id: "VOL-001",
      name: "Dr. Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      specialization: "Medical",
      location: "Dwarka, Delhi",
      status: "available",
      rating: 4.8,
      completedMissions: 45,
      currentAssignment: null,
      joinedDate: "2023-03-15"
    },
    {
      id: "VOL-002",
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya.sharma@email.com", 
      specialization: "Rescue Operations",
      location: "Rohini, Delhi",
      status: "busy",
      rating: 4.9,
      completedMissions: 67,
      currentAssignment: "SOS-2024-001",
      joinedDate: "2022-11-20"
    },
    {
      id: "VOL-003",
      name: "Amit Patel",
      phone: "+91 76543 21098",
      email: "amit.patel@email.com",
      specialization: "Communication",
      location: "Lajpat Nagar, Delhi", 
      status: "available",
      rating: 4.6,
      completedMissions: 32,
      currentAssignment: null,
      joinedDate: "2023-07-08"
    },
    {
      id: "VOL-004",
      name: "Sunita Devi",
      phone: "+91 65432 10987",
      email: "sunita.devi@email.com",
      specialization: "First Aid",
      location: "Karol Bagh, Delhi",
      status: "training",
      rating: 4.7,
      completedMissions: 23,
      currentAssignment: "Training Program",
      joinedDate: "2024-01-12"
    },
    {
      id: "VOL-005",
      name: "Mohammad Ali",
      phone: "+91 54321 09876",
      email: "mohammad.ali@email.com",
      specialization: "Logistics",
      location: "Chandni Chowk, Delhi",
      status: "available",
      rating: 4.5,
      completedMissions: 38,
      currentAssignment: null,
      joinedDate: "2023-05-22"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-safe text-safe-foreground';
      case 'busy': return 'bg-warning text-warning-foreground';
      case 'training': return 'bg-primary text-primary-foreground';
      case 'offline': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-3 w-3" />;
      case 'busy': return <AlertCircle className="h-3 w-3" />;
      case 'training': return <Clock className="h-3 w-3" />;
      case 'offline': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = searchTerm === '' || 
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: volunteers.length,
    available: volunteers.filter(v => v.status === 'available').length,
    busy: volunteers.filter(v => v.status === 'busy').length,
    training: volunteers.filter(v => v.status === 'training').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Volunteer Management</h1>
          <p className="text-muted-foreground">Coordinate and manage disaster response volunteers</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Register Volunteer
          </Button>
          <Button variant="outline">
            <UserCheck className="h-4 w-4 mr-2" />
            Bulk Assignment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Volunteers</p>
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
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-warning-light">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.busy}</p>
                <p className="text-sm text-muted-foreground">On Mission</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.training}</p>
                <p className="text-sm text-muted-foreground">In Training</p>
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
                placeholder="Search volunteers by name, specialization, or location..." 
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
                  <SelectItem value="all">All Volunteers</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">On Mission</SelectItem>
                  <SelectItem value="training">In Training</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Directory</CardTitle>
          <CardDescription>Complete list of registered volunteers with their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Missions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVolunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{volunteer.name}</p>
                      <p className="text-sm text-muted-foreground">{volunteer.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {volunteer.phone}
                      </div>
                      <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{volunteer.specialization}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {volunteer.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(volunteer.status)} variant="secondary">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(volunteer.status)}
                        {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                      </div>
                    </Badge>
                    {volunteer.currentAssignment && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {volunteer.currentAssignment}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">⭐ {volunteer.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{volunteer.completedMissions}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {volunteer.status === 'available' ? (
                        <Button size="sm">Assign</Button>
                      ) : volunteer.status === 'busy' ? (
                        <Button size="sm" variant="outline">Track</Button>
                      ) : (
                        <Button size="sm" variant="outline">View</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}