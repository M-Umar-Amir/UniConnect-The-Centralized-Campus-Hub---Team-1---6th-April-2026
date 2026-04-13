import { Router } from "express";
import {
  changePassword,
  login,
  logoutOtherDevices,
  me,
  register,
  requestEmailChange,
  verifyEmailChange
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.patch("/change-password", requireAuth, changePassword);
router.post("/change-email/request", requireAuth, requestEmailChange);
router.post("/change-email/verify", requireAuth, verifyEmailChange);
router.post("/logout-others", requireAuth, logoutOtherDevices);

export default router;
