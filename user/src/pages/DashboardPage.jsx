import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "../utils/constants";

// New Layout Components
import { AppLayout, PageContainer, SectionHeader, GridContainer } from "../components/ui/Layout";
import { GlassCard, StatusCard, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button, FloatingButton } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { NotificationBadge, StatusDot } from "../components/ui/NotificationBadge";
import { TabBar, ScrollableTabs } from "../components/ui/TabBar";

// Existing Components  
import UserProfile from "../components/UserProfile";
import TrackingControl from "../components/TrackingControl";
import DisastersList from "../components/DisastersList";
import EmergencyContacts from "../components/EmergencyContacts";
import SafetyTips from "../components/SafetyTips";
import Map from "../components/Map";
import ProfileManager from "../components/ProfileManager";
import StatusReporter from "../components/StatusReporter";
import NotificationCenter from "../components/NotificationCenter";
import RouteNavigator from "../components/RouteNavigator";
import ResourceCenter from "../components/ResourceCenter";
import DangerAlert from "../components/DangerAlert";
import CornerAlert from "../components/CornerAlert";
import DisasterAlert from "../components/DisasterAlert";

import { 
  Shield,
  Activity,
  MapPin,
  AlertTriangle,
  Phone,
  User,
  Heart,
  Navigation,
  Zap,
  TrendingUp,
  Clock,
  Users,
  Plus,
  MessageCircle,
  Settings
} from "lucide-react";

const DashboardPage = ({ user, token, onLogout }) => {
  const [status, setStatus] = useState("idle");
  const [coords, setCoords] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [dashboardTab, setDashboardTab] = useState("overview");
  const [updatedUser, setUpdatedUser] = useState(user);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    safetyScore: 85,
    activeAlerts: 3,
    communityMembers: 1247,
    recentUpdates: 5
  });
  const intervalRef = useRef(null);

  // Existing useEffect hooks and functions
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);
  
  useEffect(() => {
    if (user?.location?.coordinates) {
      setCoords({
        latitude: user.location.coordinates[1],
        longitude: user.location.coordinates[0],
      });
    }
    fetchDisasters();
  }, [user]);

  useEffect(() => {
    if (coords) {
      fetchDisasters();
    }
  }, [coords]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDisasters();
    }, 30000);
    return () => clearInterval(interval);
  }, [coords]);

  const fetchDisasters = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/disasters`);
      const data = await res.json();
      
      if (res.ok) {
        const filteredDisasters = filterDisastersByLocation(data, coords);
        setDisasters(filteredDisasters);
        checkDangerZone(filteredDisasters, coords);
      } else {
        console.error("Failed to fetch disasters:", data.message);
        setDisasters([]);
      }
    } catch (error) {
      console.error("Error fetching disasters:", error);
      setDisasters([]);
    }
  };

  const filterDisastersByLocation = (disasters, userCoords) => {
    if (!userCoords || !disasters) return [];
    
    const RADIUS_KM = 50;
    
    return disasters.filter((disaster) => {
      if (!disaster.location?.coordinates) return false;
      
      const [disasterLng, disasterLat] = disaster.location.coordinates;
      const distance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        disasterLat,
        disasterLng
      );
      
      return distance <= RADIUS_KM;
    });
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const checkDangerZone = (disasters, userCoords) => {
    // Implementation for danger zone checking
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDisasters();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
    setIsRefreshing(false);
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  // Dashboard tabs for different sections
  const dashboardTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: stats.activeAlerts },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'community', label: 'Community', icon: Users }
  ];

  // Render different dashboard sections based on active tab
  const renderDashboardContent = () => {
    switch (dashboardTab) {
      case 'overview':
        return <OverviewSection stats={stats} user={updatedUser} disasters={disasters} coords={coords} />;
      case 'alerts':
        return <AlertsSection disasters={disasters} />;
      case 'safety':
        return <SafetySection />;
      case 'community':
        return <CommunitySection stats={stats} />;
      default:
        return <OverviewSection stats={stats} user={updatedUser} disasters={disasters} coords={coords} />;
    }
  };

  // Render different views based on active navigation
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <PageContainer>
            <ScrollableTabs 
              tabs={dashboardTabs}
              activeTab={dashboardTab}
              onTabChange={setDashboardTab}
              className="mb-6"
            />
            {renderDashboardContent()}
          </PageContainer>
        );
      
      case 'map':
        return (
          <div className="h-full">
            <Map disasters={disasters} coords={coords} />
          </div>
        );
      
      case 'alerts':
        return (
          <PageContainer>
            <SectionHeader 
              title="Alert Center"
              subtitle="Manage your notifications and emergency alerts"
            />
            <NotificationCenter />
          </PageContainer>
        );
      
      case 'contacts':
        return (
          <PageContainer>
            <SectionHeader 
              title="Emergency Contacts"
              subtitle="Quick access to emergency services and contacts"
            />
            <EmergencyContacts />
          </PageContainer>
        );
      
      case 'profile':
        return (
          <PageContainer>
            <SectionHeader title="Profile" />
            <ProfileManager 
              user={updatedUser} 
              token={token} 
              onUserUpdate={setUpdatedUser} 
            />
          </PageContainer>
        );
      
      default:
        return (
          <PageContainer>
            <ScrollableTabs 
              tabs={dashboardTabs}
              activeTab={dashboardTab}
              onTabChange={setDashboardTab}
              className="mb-6"
            />
            {renderDashboardContent()}
          </PageContainer>
        );
    }
  };

  return (
    <>
      <AppLayout
        user={updatedUser}
        onLogout={onLogout}
        activeView={activeView}
        onNavigate={handleNavigation}
        showSearch={true}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      >
        {renderContent()}
      </AppLayout>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {activeView === 'dashboard' && (
          <FloatingButton
            icon={Plus}
            onClick={() => console.log("Quick action")}
            variant="primary"
            size="default"
          />
        )}
        
        {activeView === 'map' && (
          <FloatingButton
            icon={Navigation}
            onClick={() => console.log("Get directions")}
            variant="emergency"
            size="default"
          />
        )}
      </AnimatePresence>

      {/* Background Components */}
      <DisasterAlert disasters={disasters} coords={coords} />
      <CornerAlert />
      
      {/* Test Button - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40">
          <Button
            onClick={() => {
              const testDisaster = {
                _id: 'test-123',
                type: 'Earthquake',
                severity: 'High',
                description: 'Severe earthquake detected in your area. Seek immediate shelter.',
                location: {
                  coordinates: coords ? [coords.longitude, coords.latitude] : [77.5946, 12.9716],
                  address: 'Test Location'
                },
                createdAt: new Date().toISOString()
              };
              setDisasters([testDisaster]);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2"
          >
            🚨 Test Alert
          </Button>
        </div>
      )}
    </>
  );
};

// Overview Section Component
const OverviewSection = ({ stats, user, disasters, coords }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-4">
          <StatusDot status="online">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </StatusDot>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Stay safe and stay connected</p>
            <div className="flex items-center space-x-4 mt-3">
              <Badge variant="success" className="flex items-center space-x-1">
                <Shield size={12} />
                <span>Safety Score: {stats.safetyScore}%</span>
              </Badge>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <GridContainer cols={2} gap={4}>
        <StatusCard status="info" className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.activeAlerts}</p>
              <p className="text-gray-600 text-sm">Active Alerts</p>
            </div>
          </div>
        </StatusCard>

        <StatusCard status="success" className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-2xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.communityMembers.toLocaleString()}</p>
              <p className="text-gray-600 text-sm">Community</p>
            </div>
          </div>
        </StatusCard>

        <StatusCard status="warning" className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.safetyScore}%</p>
              <p className="text-gray-600 text-sm">Safety Score</p>
            </div>
          </div>
        </StatusCard>

        <StatusCard status="info" className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.recentUpdates}</p>
              <p className="text-gray-600 text-sm">Updates</p>
            </div>
          </div>
        </StatusCard>
      </GridContainer>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <GridContainer cols={2} gap={3}>
          <Button variant="gradient" className="h-12 justify-start">
            <Phone className="mr-2" size={20} />
            Emergency Call
          </Button>
          <Button variant="outline" className="h-12 justify-start">
            <MapPin className="mr-2" size={20} />
            Share Location
          </Button>
          <Button variant="outline" className="h-12 justify-start">
            <MessageCircle className="mr-2" size={20} />
            Community Chat
          </Button>
          <Button variant="outline" className="h-12 justify-start">
            <Settings className="mr-2" size={20} />
            Safety Settings
          </Button>
        </GridContainer>
      </GlassCard>

      {/* Recent Activity */}
      {disasters.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts in Your Area</h3>
          <div className="space-y-3">
            {disasters.slice(0, 3).map((disaster, index) => (
              <motion.div
                key={disaster._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{disaster.type}</p>
                  <p className="text-sm text-gray-600">{disaster.location?.address || 'Location not specified'}</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  {disaster.severity}
                </Badge>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

// Alerts Section Component
const AlertsSection = ({ disasters }) => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Active Alerts"
        subtitle="Monitor emergency situations in your area"
      />
      <DisastersList disasters={disasters} />
    </div>
  );
};

// Safety Section Component  
const SafetySection = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Safety Center"
        subtitle="Tips and resources to keep you safe"
      />
      <SafetyTips />
      <TrackingControl />
      <ResourceCenter />
    </div>
  );
};

// Community Section Component
const CommunitySection = ({ stats }) => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Community Hub"
        subtitle="Connect with your local safety community"
      />
      
      <GlassCard className="p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {stats.communityMembers.toLocaleString()} Members
          </h3>
          <p className="text-gray-600 mb-6">Strong community keeping everyone safe</p>
          <Button variant="gradient" className="w-full">
            <MessageCircle className="mr-2" size={20} />
            Join Community Chat
          </Button>
        </div>
      </GlassCard>

      <StatusReporter />
    </div>
  );
};

export default DashboardPage;