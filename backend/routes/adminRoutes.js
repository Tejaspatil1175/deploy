import express from "express";
import { registerAdmin, loginAdmin, createDisaster, updateResources } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/disasters", protectAdmin, createDisaster);
router.put("/disasters/resources", protectAdmin, updateResources);

export default router;
