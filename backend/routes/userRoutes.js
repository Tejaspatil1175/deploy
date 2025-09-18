import express from "express";
import { registerUser, updateLocation, updateStatus, getNearbyUsers, trackLocation } from "../controllers/userController.js";
const router = express.Router();


router.post('/register', registerUser);
router.post('/location', updateLocation);
router.post('/track', trackLocation);
router.post('/status', updateStatus);
router.get('/nearby/:disasterId', getNearbyUsers);

export default router;
