import { parsePagination, validateObjectId } from "../validators/commonValidator.js";
import * as eventService from "../services/eventService.js";

export async function createEvent(req, res, next) {
  try {
    const event = await eventService.createEvent(req.user._id, req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
}

export async function getEvents(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await eventService.listEvents(page, limit, skip, req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getEvent(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    const event = await eventService.getEventById(req.params.id);
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
}

export async function updateEvent(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    await eventService.deleteEvent(req.params.id);
    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    next(error);
  }
}

export async function registerEvent(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    const registration = await eventService.registerForEvent(req.params.id, req.user._id, req.body.segment);
    res.status(201).json({ success: true, registration });
  } catch (error) {
    next(error);
  }
}

export async function cancelEventRegistration(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    const registration = await eventService.cancelRegistration(req.params.id, req.user._id);
    res.json({ success: true, registration });
  } catch (error) {
    next(error);
  }
}

export async function rateEvent(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    const rating = await eventService.rateEvent(req.params.id, req.user._id, req.body.rating);
    res.status(201).json({ success: true, rating });
  } catch (error) {
    next(error);
  }
}

export async function addHighlight(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    const highlight = await eventService.addEventHighlight(req.params.id, req.user._id, req.body);
    res.status(201).json({ success: true, highlight });
  } catch (error) {
    next(error);
  }
}

export async function getHighlights(req, res, next) {
  try {
    validateObjectId(req.params.id, "event ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await eventService.getEventHighlights(req.params.id, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
