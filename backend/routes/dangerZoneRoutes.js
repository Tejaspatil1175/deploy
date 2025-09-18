import express from "express";
import {
  deleteAllDisasters,
  deleteAllUsers,
  deleteAllVolunteers,
  deleteAllUserLocations,
  resetSystem,
  getSystemStats,
  exportAllData,
  deleteCollection
} from "../controllers/dangerZoneController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require admin authenti mens to zo disater create karel
router.use(protectAdmin);

// Get system statistics for visualizalion te chart shathi stats 
router.get("/stats", getSystemStats);

// Export all data for backup zar data localy save karycha hia tar  export karun gye
router.get("/export", exportAllData);

// Delete specific collections admin purn delete kary shakto 
router.delete("/disasters", deleteAllDisasters);
router.delete("/users", deleteAllUsers);
router.delete("/volunteers", deleteAllVolunteers);
router.delete("/locations", deleteAllUserLocations);

// Delete collection by type (alternative endpoint)
router.delete("/collection/:collectionType", deleteCollection);

// Reset entire system purne delete karycha hia tar
router.delete("/reset", resetSystem);

export default router;
