import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Please login to access this resource" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid" });
  }
};

export const protectAdmin = async (req, res, next) => {
try {
const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

if (!token) {
return res.status(401).json({ message: "Not authorized, no token" });
}

const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
// Check if it's an admin token
if (decoded?.role !== "admin") {
return res.status(403).json({ message: "Admin access only" });
}

// Use userId instead of id to match the token structure
const adminId = decoded.userId || decoded.id;
    
// Verify admin exists in database
const admin = await Admin.findById(adminId);
if (!admin) {
return res.status(403).json({ message: "Admin not found" });
}

req.admin = admin;
req.user = decoded; // Also set req.user for consistency
next();
} catch (error) {
console.error("Admin auth error:", error);
return res.status(401).json({ message: "Not authorized" });
}
};