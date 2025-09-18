import Admin from "../models/Admin.js";
import Disaster from "../models/Disaster.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log("Admin registration attempt:", { name, email, passwordLength: password?.length });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");
    
    const admin = await Admin.create({ name, email, password: hashedPassword });
    console.log("Admin created:", { id: admin._id, email: admin.email, hasPassword: !!admin.password });
    
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
try {
const { email, password } = req.body;
console.log("Admin login attempt:", { email });
    
const admin = await Admin.findOne({ email });
if (!admin) {
console.log("Admin not found:", email);
return res.status(401).json({
success: false,
message: "Invalid credentials"
});
}
    
const isMatch = await bcrypt.compare(password, admin.password);
if (!isMatch) {
console.log("Password mismatch for admin:", email);
return res.status(401).json({
success: false,
message: "Invalid credentials"
});
}
    
const token = jwt.sign(
{ userId: admin._id, role: "admin" },
process.env.JWT_SECRET_KEY,
{ expiresIn: process.env.JWT_EXPIRES || "7d" }
);
    
console.log("Admin login successful:", { id: admin._id, email: admin.email });
    
res.json({
success: true,
message: "Admin login successful",
token,
admin: {
id: admin._id,
name: admin.name,
email: admin.email
}
});
} catch (err) {
console.error("Admin login error:", err);
next(err);
}
};

export const createDisaster = async (req, res, next) => {
  try {
    const { type, description, location, radius, resources } = req.body;
    const disaster = await Disaster.create({ type, description, location, radius, resources });
    res.status(201).json(disaster);
  } catch (err) {
    next(err);
  }
};

export const updateResources = async (req, res, next) => {
  try {
    const { disasterId, resources } = req.body;
    const disaster = await Disaster.findByIdAndUpdate(disasterId, { resources }, { new: true });
    if (!disaster) return res.status(404).json({ message: "Disaster not found" });
    res.json(disaster);
  } catch (err) {
    next(err);
  }
};
