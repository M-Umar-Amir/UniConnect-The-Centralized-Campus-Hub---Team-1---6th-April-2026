import { validateObjectId, parsePagination } from "../validators/commonValidator.js";
import * as postService from "../services/postService.js";
import * as bookmarkService from "../services/bookmarkService.js";


export async function createPost(req, res, next) {
  try {
    const post = await postService.createPost(req.user._id, req.body);
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts  (personalised feed) */
export async function getFeed(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getFeedPosts(req.user._id, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/trending */
export async function getTrending(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getTrendingPosts(req.user._id, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/explore */
export async function getExplore(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getExplorePosts(req.user._id, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/me */
export async function getMyPosts(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getUserPosts(
      req.user._id,
      req.user._id,
      page,
      limit,
      skip
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/bookmarks */
export async function getBookmarks(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await bookmarkService.getUserBookmarks(req.user._id, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/reported  (admin only) */
export async function getReportedPosts(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getReportedPosts(page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/user/:userId */
export async function getUserPosts(req, res, next) {
  try {
    validateObjectId(req.params.userId, "user ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getUserPosts(
      req.params.userId,
      req.user._id,
      page,
      limit,
      skip
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/:postId */
export async function getPostById(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const post = await postService.getPostById(req.params.postId, req.user._id);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
}

/** PATCH /api/posts/:postId */
export async function updatePost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const post = await postService.updatePost(req.params.postId, req.user._id, req.body);
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:postId */
export async function deletePost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    await postService.softDeletePost(req.params.postId, req.user._id, req.user.role);
    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    next(error);
  }
}

/* ================================================================== */
/*  REPORT                                                             */
/* ================================================================== */

/** POST /api/posts/:postId/report */
export async function reportPost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const { reason, details } = req.body;
    await postService.reportPost(req.params.postId, req.user._id, reason, details);
    res.json({ success: true, message: "Post reported" });
  } catch (error) {
    next(error);
  }
}


/** POST /api/posts/:postId/pin */
export async function pinPost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    await postService.pinPost(req.params.postId, req.user._id);
    res.json({ success: true, message: "Post pinned" });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:postId/pin */
export async function unpinPost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    await postService.unpinPost(req.params.postId, req.user._id);
    res.json({ success: true, message: "Post unpinned" });
  } catch (error) {
    next(error);
  }
}


/** POST /api/posts/:postId/bookmark */
export async function bookmarkPost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    await bookmarkService.addBookmark(req.user._id, req.params.postId);
    res.json({ success: true, message: "Post bookmarked" });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:postId/bookmark */
export async function removeBookmark(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    await bookmarkService.removeBookmark(req.user._id, req.params.postId);
    res.json({ success: true, message: "Bookmark removed" });
  } catch (error) {
    next(error);
  }
}


/** POST /api/posts/:postId/likes */
export async function likePost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const result = await postService.likePost(req.params.postId, req.user._id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/posts/:postId/likes */
export async function unlikePost(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const result = await postService.unlikePost(req.params.postId, req.user._id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

/** GET /api/posts/:postId/likes */
export async function getPostLikes(req, res, next) {
  try {
    validateObjectId(req.params.postId, "post ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getPostLikes(req.params.postId, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
