import { Router } from "express";
import {
  followUser,
  saveEvent,
  unfollowUser,
  unsaveEvent,
  updateNotificationSettings,
  updateOwnProfile,
  updatePrivacySettings
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.patch("/me/profile", updateOwnProfile);
router.patch("/me/notifications", updateNotificationSettings);
router.patch("/me/privacy", updatePrivacySettings);
router.post("/:userId/follow", followUser);
router.delete("/:userId/follow", unfollowUser);
router.post("/me/saved-events/:eventId", saveEvent);
router.delete("/me/saved-events/:eventId", unsaveEvent);

export default router;
