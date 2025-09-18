import User from "../models/User.js";
import Disaster from "../models/Disaster.js";
import UserLocation from "../models/UserLocation.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, location } = req.body;
    const user = await User.create({ name, email, phone, location });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { email, location } = req.body;
    const user = await User.findOneAndUpdate({ email }, { location }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { email, status } = req.body;
    const user = await User.findOneAndUpdate({ email }, { status }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getNearbyUsers = async (req, res, next) => {
  try {
    const { disasterId } = req.params;
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
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const trackLocation = async (req, res, next) => {
  try {
    const { email, location } = req.body;
    if (!email || !location?.type || !Array.isArray(location?.coordinates)) {
      return res.status(400).json({ message: "email and GeoJSON location are required" });
    }

    // Save historical ping (auto-deletes after 1 day via TTL)
    const ping = await UserLocation.create({ email, location });

    // Also update user's current location
    await User.findOneAndUpdate({ email }, { location }, { new: true });

    res.status(201).json({ success: true, pingId: ping._id });
  } catch (err) {
    next(err);
  }
};
