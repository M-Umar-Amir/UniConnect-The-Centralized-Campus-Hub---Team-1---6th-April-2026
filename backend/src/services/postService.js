import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

/* ------------------------------------------------------------------ */
/*  Author population fields (reused across queries)                   */
/* ------------------------------------------------------------------ */
const AUTHOR_FIELDS = "fullName avatarUrl university";

/**
 * Adds an `isLikedByMe` flag and strips the raw likes array
 * from a post document (or plain object).
 */
function enrichPost(postObj, currentUserId) {
  const obj = postObj.toObject ? postObj.toObject() : { ...postObj };
  obj.isLikedByMe = (obj.likes || []).some(
    (id) => String(id) === String(currentUserId)
  );
  delete obj.likes; // Don't leak the full array to the client
  return obj;
}

/* ================================================================== */
/*  Service functions                                                  */
/* ================================================================== */

/**
 * Create a new post.
 */
export async function createPost(authorId, data) {
  const post = new Post({
    author: authorId,
    content: data.content || "",
    images: data.images || [],
    postType: data.postType || "text",
    event: data.event || null,
    poll: data.postType === "poll" ? data.poll : null,
    visibility: data.visibility || "public"
  });

  await post.save();
  await post.populate("author", AUTHOR_FIELDS);

  return enrichPost(post, authorId);
}

/**
 * Personalised feed — posts from followed users + own posts.
 */
export async function getFeedPosts(userId, page, limit, skip) {
  const user = await User.findById(userId).select("following").lean();
  const feedAuthors = [...(user?.following || []), userId];

  const [posts, total] = await Promise.all([
    Post.find({ author: { $in: feedAuthors }, visibility: { $ne: "private" } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments({ author: { $in: feedAuthors }, visibility: { $ne: "private" } })
  ]);

  return {
    posts: posts.map((p) => enrichPost(p, userId)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/**
 * Trending posts — highest likeCount in the last 7 days.
 */
export async function getTrendingPosts(userId, page, limit, skip) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const filter = {
    createdAt: { $gte: sevenDaysAgo },
    visibility: "public"
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ likeCount: -1, commentCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter)
  ]);

  return {
    posts: posts.map((p) => enrichPost(p, userId)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/**
 * Explore / discover — public posts from everyone, excluding own.
 */
export async function getExplorePosts(userId, page, limit, skip) {
  const filter = {
    author: { $ne: userId },
    visibility: "public"
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter)
  ]);

  return {
    posts: posts.map((p) => enrichPost(p, userId)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/**
 * Single post by ID.
 */
export async function getPostById(postId, currentUserId) {
  const post = await Post.findById(postId)
    .populate("author", AUTHOR_FIELDS)
    .lean();

  if (!post) throw new ApiError(404, "Post not found");

  return enrichPost(post, currentUserId);
}

/**
 * Update own post. Only content, images, and visibility may change.
 */
export async function updatePost(postId, userId, data) {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (String(post.author) !== String(userId)) {
    throw new ApiError(403, "You can only edit your own posts");
  }

  if (data.content !== undefined) post.content = data.content;
  if (data.images !== undefined) post.images = data.images;
  if (data.visibility !== undefined) post.visibility = data.visibility;

  await post.save();
  await post.populate("author", AUTHOR_FIELDS);

  return enrichPost(post, userId);
}

/**
 * Soft-delete a post. Owner or admin may delete.
 */
export async function softDeletePost(postId, userId, userRole) {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const isOwner = String(post.author) === String(userId);
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have permission to delete this post");
  }

  post.isDeleted = true;
  await post.save();
}

/**
 * Posts by a specific user (profile page).
 */
export async function getUserPosts(targetUserId, currentUserId, page, limit, skip) {
  const isSelf = String(targetUserId) === String(currentUserId);

  const filter = { author: targetUserId };
  if (!isSelf) {
    filter.visibility = "public";
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter)
  ]);

  return {
    posts: posts.map((p) => enrichPost(p, currentUserId)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/**
 * Report a post.
 */
export async function reportPost(postId, reporterId, reason, details = "") {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (String(post.author) === String(reporterId)) {
    throw new ApiError(400, "You cannot report your own post");
  }

  const alreadyReported = post.reports.some(
    (r) => String(r.reporter) === String(reporterId)
  );
  if (alreadyReported) {
    throw new ApiError(409, "You have already reported this post");
  }

  post.reports.push({ reporter: reporterId, reason, details });
  post.reportCount = post.reports.length;
  await post.save();
}

/**
 * Get all reported posts (admin).
 */
export async function getReportedPosts(page, limit, skip) {
  const filter = { reportCount: { $gt: 0 } };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ reportCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter)
  ]);

  return {
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/**
 * Pin a post to your profile (max 1 pinned at a time).
 */
export async function pinPost(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (String(post.author) !== String(userId)) {
    throw new ApiError(403, "You can only pin your own posts");
  }

  // Unpin any existing pinned post
  await Post.updateMany(
    { author: userId, isPinned: true },
    { $set: { isPinned: false } }
  );

  post.isPinned = true;
  await post.save();
}

/**
 * Unpin a post from your profile.
 */
export async function unpinPost(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (String(post.author) !== String(userId)) {
    throw new ApiError(403, "You can only unpin your own posts");
  }

  post.isPinned = false;
  await post.save();
}

/* ------------------------------------------------------------------ */
/*  Likes                                                              */
/* ------------------------------------------------------------------ */

/**
 * Like a post (idempotent).
 */
export async function likePost(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const alreadyLiked = post.likes.some((id) => String(id) === String(userId));
  if (!alreadyLiked) {
    post.likes.push(userId);
    post.likeCount = post.likes.length;
    await post.save();
  }

  return { likeCount: post.likeCount };
}

/**
 * Unlike a post.
 */
export async function unlikePost(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  post.likes = post.likes.filter((id) => String(id) !== String(userId));
  post.likeCount = post.likes.length;
  await post.save();

  return { likeCount: post.likeCount };
}

/**
 * Get users who liked a post (paginated).
 */
export async function getPostLikes(postId, page, limit, skip) {
  const post = await Post.findById(postId)
    .select("likes")
    .lean();

  if (!post) throw new ApiError(404, "Post not found");

  const total = post.likes.length;
  const pagedIds = post.likes.slice(skip, skip + limit);

  const users = await User.find({ _id: { $in: pagedIds } })
    .select("fullName avatarUrl university")
    .lean();

  return {
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/* ------------------------------------------------------------------ */
/*  Event-related queries                                              */
/* ------------------------------------------------------------------ */

/**
 * Posts linked to an event.
 */
export async function getEventPosts(eventId, currentUserId, page, limit, skip) {
  const filter = { event: eventId, visibility: "public" };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter)
  ]);

  return {
    posts: posts.map((p) => enrichPost(p, currentUserId)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/**
 * Event highlight posts only.
 */
export async function getEventHighlights(eventId, currentUserId, page, limit, skip) {
  const filter = { event: eventId, postType: "event_highlight", visibility: "public" };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Post.countDocuments(filter)
  ]);

  return {
    posts: posts.map((p) => enrichPost(p, currentUserId)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

/**
 * Create a post as an event highlight.
 */
export async function createEventHighlight(authorId, eventId, data) {
  return createPost(authorId, {
    ...data,
    postType: "event_highlight",
    event: eventId
  });
}
