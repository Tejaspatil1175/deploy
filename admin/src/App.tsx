import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import InteractiveMap from "./pages/InteractiveMap";
import SOSManagement from "./pages/SOSManagement";
import VolunteerManagement from "./pages/VolunteerManagement";
import DangerZones from "./pages/DangerZones";
import SafeRoutes from "./pages/SafeRoutes";
import ResourceManagement from "./pages/ResourceManagement";
import DisasterAlerts from "./pages/DisasterAlerts";
import AIPredictions from "./pages/AIPredictions";
import Recovery from "./pages/Recovery";
import CreateDisaster from "./pages/CreateDisaster";
import SystemDangerZone from "./pages/SystemDangerZone";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Toaster />
<Sonner />
<BrowserRouter>
<AuthProvider>
<Routes>
{/* Public Route */}
<Route path="/login" element={<AdminLogin />} />
            
{/* Protected Routes */}
<Route path="/" element={
<ProtectedRoute>
<DashboardLayout>
<Dashboard />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/map" element={
<ProtectedRoute>
<DashboardLayout>
<InteractiveMap />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/sos" element={
<ProtectedRoute>
<DashboardLayout>
<SOSManagement />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/volunteers" element={
<ProtectedRoute>
<DashboardLayout>
<VolunteerManagement />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/analytics" element={
<ProtectedRoute>
<DashboardLayout>
<div className="flex items-center justify-center h-96">
<div className="text-center">
<h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
<p className="text-muted-foreground mt-2">Coming soon - Real-time analytics and reporting</p>
</div>
</div>
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/danger-zones" element={
<ProtectedRoute>
<DashboardLayout>
<DangerZones />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/safe-routes" element={
<ProtectedRoute>
<DashboardLayout>
<SafeRoutes />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/resources" element={
<ProtectedRoute>
<DashboardLayout>
<ResourceManagement />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/alerts" element={
<ProtectedRoute>
<DashboardLayout>
<DisasterAlerts />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/predictions" element={
<ProtectedRoute>
<DashboardLayout>
<AIPredictions />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/recovery" element={
<ProtectedRoute>
<DashboardLayout>
<Recovery />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/create-disaster" element={
<ProtectedRoute>
<DashboardLayout>
<CreateDisaster />
</DashboardLayout>
</ProtectedRoute>
} />
<Route path="/system-danger-zone" element={
<ProtectedRoute>
<DashboardLayout>
<SystemDangerZone />
</DashboardLayout>
</ProtectedRoute>
} />
{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
<Route path="*" element={<NotFound />} />
</Routes>
</AuthProvider>
</BrowserRouter>
</TooltipProvider>
</QueryClientProvider>
);

export default App;
