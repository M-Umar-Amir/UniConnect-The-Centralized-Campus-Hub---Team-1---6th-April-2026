import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";
import { ApiError } from "../utils/ApiError.js";

const AUTHOR_FIELDS = "fullName avatarUrl university";


export async function addComment(postId, authorId, content) {
  const post = await Post.findById(postId).select("_id");
  if (!post) throw new ApiError(404, "Post not found");

  const comment = await Comment.create({
    post: postId,
    author: authorId,
    content: content.trim()
  });

  post.commentCount = await Comment.countDocuments({
    post: postId,
    isDeleted: false
  });
  await post.save();

  await comment.populate("author", AUTHOR_FIELDS);
  return comment;
}

export async function getComments(postId, page, limit, skip) {
  const filter = { post: postId, parentComment: null };

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Comment.countDocuments(filter)
  ]);

  return {
    comments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

export async function updateComment(commentId, userId, content) {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (String(comment.author) !== String(userId)) {
    throw new ApiError(403, "You can only edit your own comments");
  }

  comment.content = content.trim();
  comment.isEdited = true;
  await comment.save();

  await comment.populate("author", AUTHOR_FIELDS);
  return comment;
}

export async function softDeleteComment(commentId, userId, userRole) {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const isCommentOwner = String(comment.author) === String(userId);
  const isAdmin = userRole === "admin";

  let isPostOwner = false;
  if (!isCommentOwner && !isAdmin) {
    const post = await Post.findById(comment.post).select("author").lean();
    isPostOwner = post && String(post.author) === String(userId);
  }

  if (!isCommentOwner && !isAdmin && !isPostOwner) {
    throw new ApiError(403, "You do not have permission to delete this comment");
  }

  comment.isDeleted = true;
  await comment.save();

  const post = await Post.findById(comment.post).select("commentCount");
  if (post) {
    post.commentCount = await Comment.countDocuments({
      post: comment.post,
      isDeleted: false
    });
    await post.save();
  }
}


export async function likeComment(commentId, userId) {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  const alreadyLiked = comment.likes.some((id) => String(id) === String(userId));
  if (!alreadyLiked) {
    comment.likes.push(userId);
    comment.likeCount = comment.likes.length;
    await comment.save();
  }

  return { likeCount: comment.likeCount };
}


export async function unlikeComment(commentId, userId) {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  comment.likes = comment.likes.filter((id) => String(id) !== String(userId));
  comment.likeCount = comment.likes.length;
  await comment.save();

  return { likeCount: comment.likeCount };
}

export async function addReply(postId, parentCommentId, authorId, content) {
  const parent = await Comment.findById(parentCommentId).select("post");
  if (!parent) throw new ApiError(404, "Parent comment not found");

  if (String(parent.post) !== String(postId)) {
    throw new ApiError(400, "Parent comment does not belong to this post");
  }

  const reply = await Comment.create({
    post: postId,
    author: authorId,
    content: content.trim(),
    parentComment: parentCommentId
  });


  parent.replyCount = await Comment.countDocuments({
    parentComment: parentCommentId,
    isDeleted: false
  });
  await parent.save();

  const post = await Post.findById(postId).select("commentCount");
  if (post) {
    post.commentCount = await Comment.countDocuments({
      post: postId,
      isDeleted: false
    });
    await post.save();
  }

  await reply.populate("author", AUTHOR_FIELDS);
  return reply;
}


export async function getReplies(commentId, page, limit, skip) {
  const filter = { parentComment: commentId };

  const [replies, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Comment.countDocuments(filter)
  ]);

  return {
    replies,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
