import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createStartup,
  createStartupUpdate,
  deleteStartup,
  getStartup,
  getStartupUpdates,
  getStartups,
  listCollabRequests,
  reviewCollabRequest,
  sendCollabRequest,
  updateStartup
} from "../controllers/startupController.js";
import {
  validateCollabRequest,
  validateCollabReview,
  validateCreateStartup,
  validateStartupUpdate,
  validateUpdateStartup
} from "../validators/startupValidator.js";

const router = Router();

router.use(requireAuth);

router.post("/", requireRole("founder", "admin"), validate(validateCreateStartup), createStartup);
router.get("/", getStartups);
router.get("/:id", getStartup);
router.put("/:id", requireRole("founder", "admin"), validate(validateUpdateStartup), updateStartup);
router.delete("/:id", requireRole("founder", "admin"), deleteStartup);
router.post("/:id/collab-request", validate(validateCollabRequest), sendCollabRequest);
router.get("/:id/collab-requests", requireRole("founder", "admin"), listCollabRequests);
router.patch(
  "/:id/collab-requests/:requestId",
  requireRole("founder", "admin"),
  validate(validateCollabReview),
  reviewCollabRequest
);
router.post(
  "/:id/updates",
  requireRole("founder", "admin"),
  validate(validateStartupUpdate),
  createStartupUpdate
);
router.get("/:id/updates", getStartupUpdates);

export default router;
