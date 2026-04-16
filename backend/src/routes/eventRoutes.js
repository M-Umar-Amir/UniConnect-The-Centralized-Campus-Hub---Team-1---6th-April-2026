import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  addHighlight,
  cancelEventRegistration,
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  getHighlights,
  rateEvent,
  registerEvent,
  updateEvent
} from "../controllers/eventsController.js";
import {
  validateCreateEvent,
  validateEventHighlight,
  validateEventRating,
  validateEventRegistration,
  validateUpdateEvent
} from "../validators/eventValidator.js";

const router = Router();

router.use(requireAuth);

router.post("/", requireRole("event_manager", "admin"), validate(validateCreateEvent), createEvent);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.put("/:id", requireRole("event_manager", "admin"), validate(validateUpdateEvent), updateEvent);
router.delete("/:id", requireRole("event_manager", "admin"), deleteEvent);
router.post("/:id/register", validate(validateEventRegistration), registerEvent);
router.post("/:id/cancel", cancelEventRegistration);
router.post("/:id/rate", validate(validateEventRating), rateEvent);
router.post(
  "/:id/highlights",
  requireRole("event_manager", "admin"),
  validate(validateEventHighlight),
  addHighlight
);
router.get("/:id/highlights", getHighlights);

export default router;
