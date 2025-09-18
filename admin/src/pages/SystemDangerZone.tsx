import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, 
  Trash2, 
  Download, 
  BarChart3, 
  AlertTriangle, 
  Users, 
  MapPin, 
  UserX, 
  Database,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface SystemStats {
  disasters: number;
  users: number;
  volunteers: number;
  locations: number;
  admins: number;
  lastUpdated: string;
}

export default function SystemDangerZone() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    action: '',
    title: '',
    description: '',
    onConfirm: () => {}
  });
  
  const { toast } = useToast();
  const { token } = useAuth();

  // API base URL - adjust according to your backend
  const API_BASE = import.meta.env.VITE_API_URL || 'https://deploy-4f2g.onrender.com';

  // Fetch system statistics
  const fetchStats = async () => {
    try {
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to access danger zone operations",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${API_BASE}/api/danger-zone/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system statistics');
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system statistics",
        variant: "destructive"
      });
    }
  };

  // Export system data
  const exportData = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to access danger zone operations",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${API_BASE}/api/danger-zone/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const data = await response.json();
      if (data.success) {
        // Create downloadable file
        const blob = new Blob([JSON.stringify(data.exportData, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `system-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Export Successful",
          description: `Data exported successfully. Total records: ${data.exportData.counts.disasters + data.exportData.counts.users + data.exportData.counts.volunteers + data.exportData.counts.locations}`,
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export system data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete collection
  const deleteCollection = async (collectionType: string) => {
    setLoading(true);
    try {
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to access danger zone operations",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${API_BASE}/api/danger-zone/collection/${collectionType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${collectionType}`);
      }

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Deletion Successful",
          description: data.message,
        });
        // Refresh stats
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: "Deletion Failed",
        description: `Failed to delete ${collectionType}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  // Reset entire system
  const resetSystem = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to access danger zone operations",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${API_BASE}/api/danger-zone/reset`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset system');
      }

      const data = await response.json();
      if (data.success) {
        toast({
          title: "System Reset Complete",
          description: `System has been reset. Deleted: ${Object.values(data.deletedCounts).reduce((a: any, b: any) => a + b, 0)} total records`,
        });
        // Refresh stats
        fetchStats();
      }
    } catch (error) {
      console.error('Error resetting system:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset system",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const confirmAction = (action: string, title: string, description: string, onConfirm: () => void) => {
    setConfirmDialog({
      open: true,
      action,
      title,
      description,
      onConfirm
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dangerousOperations = [
    {
      id: 'delete-disasters',
      name: 'Delete All Disasters',
      description: 'Permanently remove all disaster records from the system',
      icon: <AlertTriangle className="h-5 w-5" />,
      severity: 'high',
      count: stats?.disasters || 0,
      action: () => confirmAction(
        'delete-disasters',
        'Delete All Disasters',
        `This will permanently delete ${stats?.disasters || 0} disaster records. This action cannot be undone.`,
        () => deleteCollection('disasters')
      )
    },
    {
      id: 'delete-users',
      name: 'Delete All Users',
      description: 'Remove all user accounts and associated data',
      icon: <Users className="h-5 w-5" />,
      severity: 'critical',
      count: stats?.users || 0,
      action: () => confirmAction(
        'delete-users',
        'Delete All Users',
        `This will permanently delete ${stats?.users || 0} user accounts and all associated data. This action cannot be undone.`,
        () => deleteCollection('users')
      )
    },
    {
      id: 'delete-volunteers',
      name: 'Delete All Volunteers',
      description: 'Remove all volunteer registrations and data',
      icon: <UserX className="h-5 w-5" />,
      severity: 'high',
      count: stats?.volunteers || 0,
      action: () => confirmAction(
        'delete-volunteers',
        'Delete All Volunteers',
        `This will permanently delete ${stats?.volunteers || 0} volunteer records. This action cannot be undone.`,
        () => deleteCollection('volunteers')
      )
    },
    {
      id: 'delete-locations',
      name: 'Delete All Locations',
      description: 'Remove all user location tracking data',
      icon: <MapPin className="h-5 w-5" />,
      severity: 'medium',
      count: stats?.locations || 0,
      action: () => confirmAction(
        'delete-locations',
        'Delete All Location Data',
        `This will permanently delete ${stats?.locations || 0} location records. This action cannot be undone.`,
        () => deleteCollection('locations')
      )
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-red-600" />
            System Danger Zone
          </h1>
          <p className="text-muted-foreground">Critical administrative operations - Use with extreme caution</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
          <Button 
            variant="outline" 
            onClick={exportData}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Warning Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Warning:</strong> All operations in this section are irreversible and can cause permanent data loss. 
          Always export data before performing any destructive operations.
        </AlertDescription>
      </Alert>

      {/* System Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Current System Statistics
          </CardTitle>
          <CardDescription>
            Overview of system data before performing dangerous operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.disasters}</div>
                <div className="text-sm text-muted-foreground">Disasters</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.volunteers}</div>
                <div className="text-sm text-muted-foreground">Volunteers</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.locations}</div>
                <div className="text-sm text-muted-foreground">Locations</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{stats.admins}</div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Loading system statistics...
            </div>
          )}
          {stats && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Last updated: {new Date(stats.lastUpdated).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dangerous Operations */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold text-foreground">Dangerous Operations</h2>
        
        {dangerousOperations.map((operation) => (
          <Card key={operation.id} className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-red-100 text-red-600">
                    {operation.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{operation.name}</h3>
                      <Badge className={getSeverityColor(operation.severity)} variant="outline">
                        {operation.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{operation.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="h-4 w-4" />
                      <span>{operation.count} records will be affected</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={operation.action}
                  disabled={loading || operation.count === 0}
                  className="md:w-auto w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* System Reset - Most Dangerous */}
        <Card className="border-l-4 border-l-red-600 bg-red-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-red-200 text-red-700">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Complete System Reset</h3>
                    <Badge className="bg-red-200 text-red-800 border-red-300" variant="outline">
                      NUCLEAR OPTION
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Reset the entire system by deleting ALL data except admin accounts
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4" />
                    <span>
                      {stats ? (stats.disasters + stats.users + stats.volunteers + stats.locations) : 0} total records will be deleted
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => confirmAction(
                  'reset-system',
                  'Complete System Reset',
                  `This will permanently delete ALL system data except admin accounts. Total records to be deleted: ${stats ? (stats.disasters + stats.users + stats.volunteers + stats.locations) : 0}. This action cannot be undone.`,
                  resetSystem
                )}
                disabled={loading || !stats}
                className="md:w-auto w-full"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                RESET SYSTEM
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {confirmDialog.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                This action is permanent and cannot be undone. Make sure you have exported the data if needed.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDialog.onConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Deletion"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
