import { Router } from "express";
import {
  listNotifications,
  markAllRead,
  markNotificationRead,
  recentNotifications
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listNotifications);
router.get("/recent", recentNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:notificationId/read", markNotificationRead);

export default router;
