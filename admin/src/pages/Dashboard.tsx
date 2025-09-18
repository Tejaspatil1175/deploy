import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
Users,
Shield,
MapPin,
Package,
AlertTriangle,
TrendingUp,
Activity,
Phone,
MapIcon,
Clock,
Loader2,
RefreshCw
} from "lucide-react";

interface DashboardData {
metrics: {
activeSOS: number;
availableVolunteers: number;
dangerZones: number;
resourceSupplies: number;
};
recentAlerts: Array<{
id: string;
type: string;
location: string;
time: string;
severity: string;
affected: string;
}>;
activeSOS: Array<{
id: string;
location: string;
type: string;
time: string;
volunteer: string;
}>;
}

export default function Dashboard() {
const { toast } = useToast();
const { token } = useAuth();
  
const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
const [loading, setLoading] = useState(true);

// Fetch dashboard data from backend
const fetchDashboardData = async () => {
try {
setLoading(true);
const apiUrl = import.meta.env.VITE_API_URL || 'https://deploy-4f2g.onrender.com';
      
const response = await fetch(`${apiUrl}/api/dashboard/stats`, {
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
});

if (!response.ok) {
throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

const data = await response.json();
setDashboardData(data);
} catch (error) {
console.error('Fetch dashboard data error:', error);
toast({
title: "Error Loading Dashboard",
description: error instanceof Error ? error.message : "Failed to load dashboard data",
variant: "destructive",
});
      
// Fallback to mock data if API fails
setDashboardData({
metrics: {
activeSOS: 127,
availableVolunteers: 2340,
dangerZones: 18,
resourceSupplies: 85
},
recentAlerts: [
{
id: "1",
type: "Flood Warning",
location: "Sector 15, Delhi",
time: "2 minutes ago",
severity: "high",
affected: "~5000 residents"
}
],
activeSOS: [
{
id: "SOS-001",
location: "Dwarka Sector 12",
type: "Trapped",
time: "3 min ago",
volunteer: "Assigned"
}
]
});
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchDashboardData();
}, []);

if (loading) {
return (
<div className="flex items-center justify-center h-96">
<div className="text-center">
<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
<p className="text-muted-foreground">Loading dashboard...</p>
</div>
</div>
);
}

if (!dashboardData) {
return (
<div className="flex items-center justify-center h-96">
<div className="text-center">
<AlertTriangle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
<p className="text-muted-foreground">Unable to load dashboard data</p>
<Button onClick={fetchDashboardData} variant="outline" className="mt-4">
<RefreshCw className="h-4 w-4 mr-2" />
Retry
</Button>
</div>
</div>
);
}

const metrics = [
{
title: "Active SOS Requests",
value: dashboardData.metrics.activeSOS.toString(),
change: "+12 in last hour",
icon: Shield,
variant: "danger" as const,
urgent: true
},
{
title: "Available Volunteers",
value: dashboardData.metrics.availableVolunteers.toLocaleString(),
change: "89% deployment rate",
icon: Users,
variant: "safe" as const
},
{
title: "Danger Zones",
value: dashboardData.metrics.dangerZones.toString(),
change: "Active disaster areas",
icon: MapPin,
variant: "warning" as const
},
{
title: "Resource Supplies",
value: `${dashboardData.metrics.resourceSupplies}%`,
change: "Food, Water, Medical supplies",
icon: Package,
variant: "primary" as const
}
];

  return (
  <div className="space-y-8">
  {/* Page Header */}
  <div className="flex flex-col gap-2">
  <div className="flex items-center justify-between">
  <div>
  <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center Dashboard</h1>
  <p className="text-muted-foreground">Real-time disaster management overview and emergency coordination</p>
  </div>
  <Button onClick={fetchDashboardData} variant="outline" size="sm">
  <RefreshCw className="h-4 w-4 mr-2" />
  Refresh
  </Button>
  </div>
  </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className={`relative overflow-hidden ${metric.urgent ? 'ring-2 ring-danger/20 shadow-lg' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${
                metric.variant === 'danger' ? 'bg-danger-light text-danger' :
                metric.variant === 'safe' ? 'bg-safe-light text-safe' :
                metric.variant === 'warning' ? 'bg-warning-light text-warning' :
                'bg-accent text-primary'
              }`}>
                <metric.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
              {metric.urgent && (
                <div className="absolute top-2 right-2">
                  <div className="h-2 w-2 bg-danger rounded-full animate-pulse"></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Disaster Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Disaster Alerts
            </CardTitle>
            <CardDescription>Live updates from NDMA, IMD and monitoring systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          {dashboardData.recentAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
          <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
          <Badge
          variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
          className="text-xs"
          >
          {alert.type}
          </Badge>
          <span className="text-xs text-muted-foreground">{alert.time}</span>
          </div>
          <p className="font-medium text-sm">{alert.location}</p>
          <p className="text-xs text-muted-foreground">{alert.affected}</p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 ml-2">
          <Phone className="h-3 w-3 mr-1" />
          Deploy
          </Button>
          </div>
          ))}
            <Button variant="outline" className="w-full">View All Alerts</Button>
          </CardContent>
        </Card>

        {/* Active SOS Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-danger" />
              Active SOS Requests
            </CardTitle>
            <CardDescription>Real-time emergency requests requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          {dashboardData.activeSOS.map((sos) => (
          <div key={sos.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{sos.id}</span>
          <Badge variant="outline" className="text-xs">{sos.type}</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapIcon className="h-3 w-3" />
          {sos.location}
          </div>
          <div className="flex items-center gap-2 text-xs">
          <Clock className="h-3 w-3" />
          {sos.time}
          <span className={`font-medium ${
          sos.volunteer === 'Assigned' ? 'text-safe' :
          sos.volunteer === 'En Route' ? 'text-warning' :
          'text-danger'
          }`}>
          • {sos.volunteer}
          </span>
          </div>
          </div>
          <Button size="sm" className="shrink-0 ml-2">
          Respond
          </Button>
          </div>
          ))}
            <Button variant="outline" className="w-full">View All SOS Requests</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Emergency response and management shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button className="h-20 flex-col gap-2">
              <MapPin className="h-6 w-6" />
              Create Danger Zone
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Deploy Volunteers
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="h-6 w-6" />
              Manage Resources
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertTriangle className="h-6 w-6" />
              Broadcast Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}