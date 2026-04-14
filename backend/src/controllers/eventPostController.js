import { validateObjectId, parsePagination } from "../validators/commonValidator.js";
import * as postService from "../services/postService.js";

/** GET /api/events/:eventId/posts */
export async function getEventPosts(req, res, next) {
  try {
    validateObjectId(req.params.eventId, "event ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getEventPosts(
      req.params.eventId,
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

/** GET /api/events/:eventId/highlights */
export async function getEventHighlights(req, res, next) {
  try {
    validateObjectId(req.params.eventId, "event ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await postService.getEventHighlights(
      req.params.eventId,
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

/** POST /api/events/:eventId/highlights */
export async function createEventHighlight(req, res, next) {
  try {
    validateObjectId(req.params.eventId, "event ID");
    const post = await postService.createEventHighlight(
      req.user._id,
      req.params.eventId,
      req.body
    );
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
}
