import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import {
  validateCreatePost,
  validateUpdatePost,
  validateReportPost
} from "../validators/postValidator.js";
import {
  validateCreateComment,
  validateUpdateComment
} from "../validators/commentValidator.js";
import {
  createPost,
  getFeed,
  getTrending,
  getExplore,
  getMyPosts,
  getBookmarks,
  getReportedPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  reportPost,
  pinPost,
  unpinPost,
  bookmarkPost,
  removeBookmark,
  likePost,
  unlikePost,
  getPostLikes
} from "../controllers/postController.js";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  addReply,
  getReplies
} from "../controllers/commentController.js";

const router = Router();

/* ------------------------------------------------------------------ */
/*  Rate limiters (scoped per action type)                             */
/* ------------------------------------------------------------------ */
const postCreateLimiter = rateLimiter({ windowMs: 60_000, max: 10, message: "Post creation rate limit exceeded" });
const commentLimiter = rateLimiter({ windowMs: 60_000, max: 30, message: "Comment rate limit exceeded" });
const likeLimiter = rateLimiter({ windowMs: 60_000, max: 60, message: "Like rate limit exceeded" });

/* ------------------------------------------------------------------ */
/*  All routes require authentication                                  */
/* ------------------------------------------------------------------ */
router.use(requireAuth);

/* ================================================================== */
/*  Post collection routes (order matters — static before :param)      */
/* ================================================================== */
router.get("/trending", getTrending);
router.get("/explore", getExplore);
router.get("/me", getMyPosts);
router.get("/bookmarks", getBookmarks);
router.get("/reported", requireRole("admin"), getReportedPosts);
router.get("/user/:userId", getUserPosts);

// Feed (default GET /api/posts)
router.get("/", getFeed);
router.post("/", postCreateLimiter, validate(validateCreatePost), createPost);

/* ================================================================== */
/*  Single post routes                                                 */
/* ================================================================== */
router.get("/:postId", getPostById);
router.patch("/:postId", validate(validateUpdatePost), updatePost);
router.delete("/:postId", deletePost);

/* ================================================================== */
/*  Post actions                                                       */
/* ================================================================== */
router.post("/:postId/report", validate(validateReportPost), reportPost);
router.post("/:postId/pin", pinPost);
router.delete("/:postId/pin", unpinPost);
router.post("/:postId/bookmark", bookmarkPost);
router.delete("/:postId/bookmark", removeBookmark);

/* ================================================================== */
/*  Post likes                                                         */
/* ================================================================== */
router.post("/:postId/likes", likeLimiter, likePost);
router.delete("/:postId/likes", unlikePost);
router.get("/:postId/likes", getPostLikes);

/* ================================================================== */
/*  Comments                                                           */
/* ================================================================== */
router.post("/:postId/comments", commentLimiter, validate(validateCreateComment), addComment);
router.get("/:postId/comments", getComments);
router.patch("/:postId/comments/:commentId", validate(validateUpdateComment), updateComment);
router.delete("/:postId/comments/:commentId", deleteComment);

/* ================================================================== */
/*  Comment likes                                                      */
/* ================================================================== */
router.post("/:postId/comments/:commentId/likes", likeLimiter, likeComment);
router.delete("/:postId/comments/:commentId/likes", unlikeComment);

/* ================================================================== */
/*  Comment replies                                                    */
/* ================================================================== */
router.post(
  "/:postId/comments/:commentId/replies",
  commentLimiter,
  validate(validateCreateComment),
  addReply
);
router.get("/:postId/comments/:commentId/replies", getReplies);

export default router;
