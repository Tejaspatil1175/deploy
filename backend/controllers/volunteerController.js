import Volunteer from "../models/Volunteer.js";
import User from "../models/User.js";

export const registerVolunteer = async (req, res, next) => {
  try {
    const { name, email, phone, location } = req.body;
    const volunteer = await Volunteer.create({ name, email, phone, location });
    res.status(201).json(volunteer);
  } catch (err) {
    next(err);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { email, location } = req.body;
    const volunteer = await Volunteer.findOneAndUpdate({ email }, { location }, { new: true });
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    next(err);
  }
};

export const assignUsers = async (req, res, next) => {
  try {
    const { volunteerId, userIds } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { $addToSet: { assignedUsers: { $each: userIds } } },
      { new: true }
    );
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer);
  } catch (err) {
    next(err);
  }
};

export const getAssignedUsers = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('assignedUsers');
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    res.json(volunteer.assignedUsers);
  } catch (err) {
    next(err);
  }
};
