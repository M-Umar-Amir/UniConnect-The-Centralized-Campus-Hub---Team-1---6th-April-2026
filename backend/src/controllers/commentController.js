import { validateObjectId, parsePagination } from "../validators/commonValidator.js";
import * as commentService from "../services/commentService.js";

/* ================================================================== */
/*  Comments                                                           */
/* ================================================================== */

/** POST /api/posts/:postId/comments */
export async function addComment(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const comment = await commentService.addComment(
      req.params.postId,
      req.user._id,
      req.body.content
    );
    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/:postId/comments */
export async function getComments(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await commentService.getComments(req.params.postId, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** PATCH /api/posts/:postId/comments/:commentId */
export async function updateComment(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    validateObjectId(req.params.commentId, "comment ID");
    const comment = await commentService.updateComment(
      req.params.commentId,
      req.user._id,
      req.body.content
    );
    res.json({ success: true, comment });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:postId/comments/:commentId */
export async function deleteComment(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    validateObjectId(req.params.commentId, "comment ID");
    await commentService.softDeleteComment(
      req.params.commentId,
      req.user._id,
      req.user.role
    );
    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
}

/* ================================================================== */
/*  Comment Likes                                                      */
/* ================================================================== */

/** POST /api/posts/:postId/comments/:commentId/likes */
export async function likeComment(req, res, next) {
  try {
    validateObjectId(req.params.commentId, "comment ID");
    const result = await commentService.likeComment(req.params.commentId, req.user._id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:postId/comments/:commentId/likes */
export async function unlikeComment(req, res, next) {
  try {
    validateObjectId(req.params.commentId, "comment ID");
    const result = await commentService.unlikeComment(req.params.commentId, req.user._id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/* ================================================================== */
/*  Replies (threaded comments)                                        */
/* ================================================================== */

/** POST /api/posts/:postId/comments/:commentId/replies */
export async function addReply(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    validateObjectId(req.params.commentId, "comment ID");
    const reply = await commentService.addReply(
      req.params.postId,
      req.params.commentId,
      req.user._id,
      req.body.content
    );
    res.status(201).json({ success: true, comment: reply });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/:postId/comments/:commentId/replies */
export async function getReplies(req, res, next) {
  try {
    validateObjectId(req.params.commentId, "comment ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await commentService.getReplies(req.params.commentId, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
