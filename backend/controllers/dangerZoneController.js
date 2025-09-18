import User from "../models/User.js";
import Disaster from "../models/Disaster.js";
import Volunteer from "../models/Volunteer.js";
import UserLocation from "../models/UserLocation.js";
import Admin from "../models/Admin.js";

// Delete all disasters
export const deleteAllDisasters = async (req, res, next) => {
  try {
    const result = await Disaster.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} disasters`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

// Delete all users (except current admin)
export const deleteAllUsers = async (req, res, next) => {
  try {
    const result = await User.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} users`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

// Delete all volunteers
export const deleteAllVolunteers = async (req, res, next) => {
  try {
    const result = await Volunteer.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} volunteers`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

// Delete all user locations
export const deleteAllUserLocations = async (req, res, next) => {
  try {
    const result = await UserLocation.deleteMany({});
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} user locations`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    next(err);
  }
};

// Reset entire system (except current admin)
export const resetSystem = async (req, res, next) => {
  try {
    const disasters = await Disaster.deleteMany({});
    const users = await User.deleteMany({});
    const volunteers = await Volunteer.deleteMany({});
    const locations = await UserLocation.deleteMany({});

    res.json({
      success: true,
      message: "System reset completed",
      deletedCounts: {
        disasters: disasters.deletedCount,
        users: users.deletedCount,
        volunteers: volunteers.deletedCount,
        locations: locations.deletedCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get system statistics before dangerous operations
export const getSystemStats = async (req, res, next) => {
  try {
    const [disasterCount, userCount, volunteerCount, locationCount, adminCount] = await Promise.all([
      Disaster.countDocuments(),
      User.countDocuments(),
      Volunteer.countDocuments(),
      UserLocation.countDocuments(),
      Admin.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        disasters: disasterCount,
        users: userCount,
        volunteers: volunteerCount,
        locations: locationCount,
        admins: adminCount,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};

// Export all data for backup
export const exportAllData = async (req, res, next) => {
  try {
    const [disasters, users, volunteers, locations] = await Promise.all([
      Disaster.find({}).lean(),
      User.find({}).select('-password').lean(),
      Volunteer.find({}).lean(),
      UserLocation.find({}).lean()
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      data: {
        disasters,
        users,
        volunteers,
        locations
      },
      counts: {
        disasters: disasters.length,
        users: users.length,
        volunteers: volunteers.length,
        locations: locations.length
      }
    };

    res.json({
      success: true,
      message: "Data exported successfully",
      exportData
    });
  } catch (err) {
    next(err);
  }
};

// Delete specific collection by type
export const deleteCollection = async (req, res, next) => {
  try {
    const { collectionType } = req.params;
    let result;
    let message;

    switch (collectionType) {
      case 'disasters':
        result = await Disaster.deleteMany({});
        message = `Deleted ${result.deletedCount} disasters`;
        break;
      case 'users':
        result = await User.deleteMany({});
        message = `Deleted ${result.deletedCount} users`;
        break;
      case 'volunteers':
        result = await Volunteer.deleteMany({});
        message = `Deleted ${result.deletedCount} volunteers`;
        break;
      case 'locations':
        result = await UserLocation.deleteMany({});
        message = `Deleted ${result.deletedCount} user locations`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid collection type. Use: disasters, users, volunteers, or locations"
        });
    }

    res.json({
      success: true,
      message,
      deletedCount: result.deletedCount,
      collectionType
    });
  } catch (err) {
    next(err);
  }
};
