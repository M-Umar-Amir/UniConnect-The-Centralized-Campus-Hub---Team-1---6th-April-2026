import express from "express";
import {
  getAllUsers,
  deleteUser,
  blockUser,
  unblockUser
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);
router.patch("/block/:id", blockUser);
router.patch("/unblock/:id", unblockUser);

export default router;
