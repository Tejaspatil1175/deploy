import Disaster from "../models/Disaster.js";

export const createDisaster = async (req, res, next) => {
  try {
    const { type, description, location, radius } = req.body;
    const disaster = await Disaster.create({ type, description, location, radius });
    res.status(201).json(disaster);
  } catch (err) {
    next(err);
  }
};

export const getAllActiveDisasters = async (req, res, next) => {
  try {
    const disasters = await Disaster.find({ active: true });
    res.json(disasters);
  } catch (err) {
    next(err);
  }
};

export const getDisasterById = async (req, res, next) => {
  try {
    const disaster = await Disaster.findById(req.params.id);
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });
    res.json(disaster);
  } catch (err) {
    next(err);
  }
};

export const deleteDisaster = async (req, res, next) => {
  try {
    const disaster = await Disaster.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!disaster) return res.status(404).json({ message: 'Disaster not found' });
    res.json({ message: 'Disaster ended/removed', disaster });
  } catch (err) {
    next(err);
  }
};
