import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { validateCreatePost } from "../validators/postValidator.js";
import {
  getEventPosts,
  getEventHighlights,
  createEventHighlight
} from "../controllers/eventPostController.js";

const router = Router();

const highlightLimiter = rateLimiter({
  windowMs: 60_000,
  max: 10,
  message: "Event highlight creation rate limit exceeded"
});

/* All routes require authentication */
router.use(requireAuth);

/* GET /api/events/:eventId/posts — all posts linked to an event */
router.get("/:eventId/posts", getEventPosts);

/* GET /api/events/:eventId/highlights — event highlight posts only */
router.get("/:eventId/highlights", getEventHighlights);

/* POST /api/events/:eventId/highlights — create event highlight (restricted) */
router.post(
  "/:eventId/highlights",
  requireRole("event_manager", "admin"),
  highlightLimiter,
  validate(validateCreatePost),
  createEventHighlight
);

export default router;
