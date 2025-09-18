import User from "../models/User.js";
import Disaster from "../models/Disaster.js";

export const sendAlert = async (req, res, next) => {
  try {
    const { disasterId, status, message } = req.body;
    const disaster = await Disaster.findById(disasterId);
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });
    const users = await User.find({
      location: {
        $near: {
          $geometry: disaster.location,
          $maxDistance: disaster.radius,
        },
      },
    });
    // Here you would integrate with SMS/Email/Push notification service
    // For now, just return the users who would receive the alert
    res.json({ message: `Alert sent to ${users.length} users`, users });
  } catch (err) {
    next(err);
  }
};
