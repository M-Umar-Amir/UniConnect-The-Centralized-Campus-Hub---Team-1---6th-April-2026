import { Event } from "../models/Event.js";
import { Registration } from "../models/Registration.js";
import { EventRating } from "../models/EventRating.js";
import { EventHighlight } from "../models/EventHighlight.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "./notificationService.js";

const EVENT_POPULATE = "fullName avatarUrl university role";

function buildEventFilters(query = {}) {
  const filter = {};
  if (query.tag) filter.tags = query.tag;
  if (query.society) filter.society = query.society;
  if (query.type) filter.eventType = query.type;
  if (query.status) filter.status = query.status;
  if (query.date) {
    const day = new Date(query.date);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.startDate = { $gte: day, $lt: nextDay };
  }
  return filter;
}

export async function createEvent(createdBy, data) {
  const event = await Event.create({ ...data, createdBy });
  await event.populate("createdBy", EVENT_POPULATE);
  return event;
}

export async function listEvents(page, limit, skip, query = {}) {
  const filter = buildEventFilters(query);
  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort({ startDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", EVENT_POPULATE)
      .lean(),
    Event.countDocuments(filter)
  ]);

  return {
    events,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

export async function getEventById(eventId) {
  const event = await Event.findById(eventId).populate("createdBy", EVENT_POPULATE);
  if (!event) throw new ApiError(404, "Event not found");
  return event;
}

export async function updateEvent(eventId, data) {
  const event = await Event.findByIdAndUpdate(eventId, data, { new: true, runValidators: true })
    .populate("createdBy", EVENT_POPULATE);
  if (!event) throw new ApiError(404, "Event not found");
  return event;
}

export async function deleteEvent(eventId) {
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) throw new ApiError(404, "Event not found");
}

export async function registerForEvent(eventId, userId, segment = null) {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found");

  if (!event.registrationRequired) {
    throw new ApiError(400, "Registration is not required for this event");
  }

  if (event.registrationDeadline && new Date() > event.registrationDeadline) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  const existing = await Registration.findOne({ event: eventId, user: userId });
  if (existing && existing.status !== "cancelled") {
    throw new ApiError(409, "You are already registered for this event");
  }

  const activeCount = await Registration.countDocuments({
    event: eventId,
    status: { $in: ["registered", "waitlisted"] }
  });

  let status = "registered";
  let waitlistPosition = null;

  if (activeCount >= event.capacity) {
    if (!event.waitlistEnabled) {
      throw new ApiError(400, "Event capacity is full");
    }
    status = "waitlisted";
    waitlistPosition = await Registration.countDocuments({ event: eventId, status: "waitlisted" }) + 1;
  }

  const registration = existing
    ? await Registration.findByIdAndUpdate(
      existing._id,
      { status, waitlistPosition, segment, registeredAt: new Date() },
      { new: true }
    )
    : await Registration.create({ event: eventId, user: userId, status, waitlistPosition, segment });

  if (String(event.createdBy) !== String(userId)) {
    await createNotification({
      recipient: event.createdBy,
      actor: userId,
      type: "event_reg",
      text: `${status === "waitlisted" ? "A user joined waitlist for" : "A user registered for"} ${event.title}`,
      targetUrl: `/events/${eventId}`
    });
  }

  return registration;
}

export async function cancelRegistration(eventId, userId) {
  const registration = await Registration.findOne({ event: eventId, user: userId });
  if (!registration || registration.status === "cancelled") {
    throw new ApiError(404, "Registration not found");
  }

  registration.status = "cancelled";
  registration.waitlistPosition = null;
  await registration.save();

  return registration;
}

export async function rateEvent(eventId, userId, rating) {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found");

  if (event.endDate > new Date()) {
    throw new ApiError(400, "You can rate this event only after it ends");
  }

  const registration = await Registration.findOne({ event: eventId, user: userId, status: "registered" });
  if (!registration) {
    throw new ApiError(403, "Only registered attendees can rate this event");
  }

  const eventRating = await EventRating.findOneAndUpdate(
    { event: eventId, user: userId },
    { rating, createdAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (String(event.createdBy) !== String(userId)) {
    await createNotification({
      recipient: event.createdBy,
      actor: userId,
      type: "event",
      text: `Your event "${event.title}" received a new rating`,
      targetUrl: `/events/${eventId}`
    });
  }

  return eventRating;
}

export async function addEventHighlight(eventId, userId, data) {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found");

  const highlight = await EventHighlight.create({
    event: eventId,
    caption: data.caption,
    media: data.media || [],
    postedBy: userId
  });

  await highlight.populate("postedBy", EVENT_POPULATE);
  return highlight;
}

export async function getEventHighlights(eventId, page, limit, skip) {
  const [highlights, total] = await Promise.all([
    EventHighlight.find({ event: eventId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", EVENT_POPULATE)
      .lean(),
    EventHighlight.countDocuments({ event: eventId })
  ]);

  return {
    highlights,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
