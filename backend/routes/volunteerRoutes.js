import express from "express";
import { registerVolunteer, updateLocation, assignUsers, getAssignedUsers } from "../controllers/volunteerController.js";
const router = express.Router();

router.post('/register', registerVolunteer);
router.post('/location', updateLocation);
router.post('/assign', assignUsers);
router.get('/tasks/:id', getAssignedUsers);

export default router;
