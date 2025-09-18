import Disaster from "../models/Disaster.js";
import Volunteer from "../models/Volunteer.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    // Get disaster statistics
    const totalDisasters = await Disaster.countDocuments();
    const activeDisasters = await Disaster.countDocuments({ active: true });
    const recentDisasters = await Disaster.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('type description location radius createdAt');

    // Get volunteer statistics  
    const totalVolunteers = await Volunteer.countDocuments();
    const availableVolunteers = await Volunteer.countDocuments({ 
      assignedUsers: { $exists: true, $not: { $size: 0 } } 
    });

    // Get user statistics (for SOS simulation)
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 
      status: { $in: ['safe', 'needs_help'] } 
    });

    // Calculate resource statistics based on disasters
    const disastersWithResources = await Disaster.find({ active: true }).select('resources');
    const totalResources = disastersWithResources.reduce((acc, disaster) => {
      acc.food += disaster.resources?.food || 0;
      acc.medikits += disaster.resources?.medikits || 0;
      acc.water += disaster.resources?.water || 0;
      acc.blankets += disaster.resources?.blankets || 0;
      return acc;
    }, { food: 0, medikits: 0, water: 0, blankets: 0 });

    const totalResourceCount = Object.values(totalResources).reduce((sum, count) => sum + count, 0);

    // Format recent disasters for dashboard
    const formattedDisasters = recentDisasters.map(disaster => ({
      id: disaster._id,
      type: `${disaster.type} Alert`,
      location: `${disaster.location.coordinates[1].toFixed(4)}, ${disaster.location.coordinates[0].toFixed(4)}`,
      time: getTimeAgo(disaster.createdAt),
      severity: getSeverityFromRadius(disaster.radius),
      affected: `~${Math.round(disaster.radius * 100)} residents` // Rough estimate based on radius
    }));

    // Generate mock SOS data (you can replace this with real SOS model data)
    const mockSOSRequests = [
      {
        id: "SOS-001",
        location: "Emergency Location A",
        type: "Medical Emergency",
        time: "3 min ago",
        volunteer: "Assigned"
      },
      {
        id: "SOS-002", 
        location: "Emergency Location B",
        type: "Trapped",
        time: "7 min ago",
        volunteer: "En Route"
      },
      {
        id: "SOS-003",
        location: "Emergency Location C",
        type: "Missing Person",
        time: "12 min ago", 
        volunteer: "Pending"
      }
    ];

    const dashboardData = {
      metrics: {
        activeSOS: 127, // Mock data - replace with real SOS count
        availableVolunteers: totalVolunteers,
        dangerZones: activeDisasters,
        resourceSupplies: Math.min(100, Math.round((totalResourceCount / Math.max(activeDisasters * 100, 1)) * 100))
      },
      recentAlerts: formattedDisasters,
      activeSOS: mockSOSRequests,
      statistics: {
        totalDisasters,
        activeDisasters,
        totalVolunteers,
        availableVolunteers,
        totalUsers,
        activeUsers,
        totalResources,
        totalResourceCount
      }
    };

    res.json(dashboardData);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    next(error);
  }
};

// Helper functions
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${Math.floor(diffHours / 24)} days ago`;
}

function getSeverityFromRadius(radius) {
  if (radius >= 10) return 'high';
  if (radius >= 5) return 'medium';
  return 'low';
}
