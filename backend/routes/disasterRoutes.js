import express from "express";
import { createDisaster, getAllActiveDisasters, getDisasterById, deleteDisaster } from "../controllers/disasterController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const router = express.Router();


router.post('/', isAuthenticated, createDisaster);
router.get('/', getAllActiveDisasters);
router.get('/:id', getDisasterById);
router.delete('/:id', isAuthenticated, deleteDisaster);

export default router;
