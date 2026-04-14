import { Bookmark } from "../models/Bookmark.js";
import { Post } from "../models/Post.js";
import { ApiError } from "../utils/ApiError.js";

const AUTHOR_FIELDS = "fullName avatarUrl university";

export async function addBookmark(userId, postId) {
  const post = await Post.findById(postId).select("_id");
  if (!post) throw new ApiError(404, "Post not found");

  try {
    await Bookmark.create({ user: userId, post: postId });
  } catch (err) {
    // E11000 duplicate key = already bookmarked → idempotent
    if (err.code !== 11000) throw err;
  }
}

export async function removeBookmark(userId, postId) {
  const result = await Bookmark.deleteOne({ user: userId, post: postId });
  if (result.deletedCount === 0) {
    throw new ApiError(404, "Bookmark not found");
  }
}

export async function getUserBookmarks(userId, page, limit, skip) {
  const filter = { user: userId };

  const [bookmarks, total] = await Promise.all([
    Bookmark.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "post",
        match: { isDeleted: false },
        populate: { path: "author", select: AUTHOR_FIELDS }
      })
      .lean(),
    Bookmark.countDocuments(filter)
  ]);

  const posts = bookmarks
    .map((b) => b.post)
    .filter(Boolean);

  return {
    posts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
