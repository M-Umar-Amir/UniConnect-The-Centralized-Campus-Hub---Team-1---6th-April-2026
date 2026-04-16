import { Startup } from "../models/Startup.js";
import { CollabRequest } from "../models/CollabRequest.js";
import { StartupUpdate } from "../models/StartupUpdate.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "./notificationService.js";

const USER_POPULATE = "fullName avatarUrl university role";

function buildStartupFilters(query = {}) {
  const filter = {};
  if (query.domain) filter.domainTags = query.domain;
  if (query.role) filter.rolesNeeded = query.role;
  if (query.status) filter.status = query.status;
  return filter;
}

export async function createStartup(founderId, data) {
  const startup = await Startup.create({ ...data, founder: founderId });
  await startup.populate("founder", USER_POPULATE);
  return startup;
}

export async function listStartups(page, limit, skip, query = {}) {
  const filter = buildStartupFilters(query);
  const [startups, total] = await Promise.all([
    Startup.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("founder", USER_POPULATE)
      .lean(),
    Startup.countDocuments(filter)
  ]);

  return {
    startups,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

export async function getStartupById(startupId) {
  const startup = await Startup.findById(startupId)
    .populate("founder", USER_POPULATE)
    .populate("team.user", USER_POPULATE);
  if (!startup) throw new ApiError(404, "Startup not found");
  return startup;
}

export async function updateStartup(startupId, founderId, data) {
  const startup = await Startup.findById(startupId);
  if (!startup) throw new ApiError(404, "Startup not found");
  if (String(startup.founder) !== String(founderId)) {
    throw new ApiError(403, "You can only edit your own startup");
  }

  Object.assign(startup, data);
  await startup.save();
  await startup.populate("founder", USER_POPULATE);
  return startup;
}

export async function deleteStartup(startupId, founderId) {
  const startup = await Startup.findById(startupId);
  if (!startup) throw new ApiError(404, "Startup not found");
  if (String(startup.founder) !== String(founderId)) {
    throw new ApiError(403, "You can only delete your own startup");
  }

  await Startup.findByIdAndDelete(startupId);
}

export async function sendCollabRequest(startupId, applicantId, data) {
  const startup = await Startup.findById(startupId);
  if (!startup) throw new ApiError(404, "Startup not found");
  if (String(startup.founder) === String(applicantId)) {
    throw new ApiError(400, "Founder cannot apply to own startup");
  }

  const request = await CollabRequest.findOneAndUpdate(
    { startup: startupId, applicant: applicantId },
    {
      startup: startupId,
      applicant: applicantId,
      role: data.role,
      message: data.message || "",
      status: "pending",
      createdAt: new Date()
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await createNotification({
    recipient: startup.founder,
    actor: applicantId,
    type: "startup_match",
    text: `You received a collaboration request for "${startup.name}"`,
    targetUrl: `/startups/${startupId}`
  });

  return request;
}

export async function listCollabRequests(startupId, founderId, page, limit, skip) {
  const startup = await Startup.findById(startupId);
  if (!startup) throw new ApiError(404, "Startup not found");
  if (String(startup.founder) !== String(founderId)) {
    throw new ApiError(403, "Only founder can view collaboration requests");
  }

  const [requests, total] = await Promise.all([
    CollabRequest.find({ startup: startupId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("applicant", USER_POPULATE)
      .lean(),
    CollabRequest.countDocuments({ startup: startupId })
  ]);

  return {
    requests,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}

export async function reviewCollabRequest(startupId, requestId, founderId, status) {
  const startup = await Startup.findById(startupId);
  if (!startup) throw new ApiError(404, "Startup not found");
  if (String(startup.founder) !== String(founderId)) {
    throw new ApiError(403, "Only founder can review collaboration requests");
  }

  const request = await CollabRequest.findOne({ _id: requestId, startup: startupId });
  if (!request) throw new ApiError(404, "Collaboration request not found");

  request.status = status;
  await request.save();

  if (status === "accepted") {
    const alreadyInTeam = startup.team.some((member) => String(member.user) === String(request.applicant));
    if (!alreadyInTeam) {
      startup.team.push({ user: request.applicant, role: request.role });
      await startup.save();
    }
  }

  await createNotification({
    recipient: request.applicant,
    actor: founderId,
    type: "startup",
    text: `Your request for "${startup.name}" was ${status}`,
    targetUrl: `/startups/${startupId}`
  });

  return request;
}

export async function createStartupUpdate(startupId, founderId, data) {
  const startup = await Startup.findById(startupId);
  if (!startup) throw new ApiError(404, "Startup not found");
  if (String(startup.founder) !== String(founderId)) {
    throw new ApiError(403, "Only founder can post startup updates");
  }

  const update = await StartupUpdate.create({
    startup: startupId,
    content: data.content,
    media: data.media || [],
    postedBy: founderId
  });

  await update.populate("postedBy", USER_POPULATE);
  return update;
}

export async function listStartupUpdates(startupId, page, limit, skip) {
  const [updates, total] = await Promise.all([
    StartupUpdate.find({ startup: startupId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", USER_POPULATE)
      .lean(),
    StartupUpdate.countDocuments({ startup: startupId })
  ]);

  return {
    updates,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
}
