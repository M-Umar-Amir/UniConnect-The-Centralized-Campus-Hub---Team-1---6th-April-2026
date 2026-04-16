import express from "express";
import {
  getAllEvents,
  deleteEvent,
} from "../controllers/admineventController.js";

const router = express.Router();

// Get all events
router.get("/events", getAllEvents);

// Delete event by ID
router.delete("/events/:id", deleteEvent);

export default router;