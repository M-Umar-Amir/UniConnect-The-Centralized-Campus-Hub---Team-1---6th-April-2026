import { parsePagination, validateObjectId } from "../validators/commonValidator.js";
import * as startupService from "../services/startupService.js";

export async function createStartup(req, res, next) {
  try {
    const startup = await startupService.createStartup(req.user._id, req.body);
    res.status(201).json({ success: true, startup });
  } catch (error) {
    next(error);
  }
}

export async function getStartups(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const result = await startupService.listStartups(page, limit, skip, req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getStartup(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    const startup = await startupService.getStartupById(req.params.id);
    res.json({ success: true, startup });
  } catch (error) {
    next(error);
  }
}

export async function updateStartup(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    const startup = await startupService.updateStartup(req.params.id, req.user._id, req.body);
    res.json({ success: true, startup });
  } catch (error) {
    next(error);
  }
}

export async function deleteStartup(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    await startupService.deleteStartup(req.params.id, req.user._id);
    res.json({ success: true, message: "Startup deleted" });
  } catch (error) {
    next(error);
  }
}

export async function sendCollabRequest(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    const request = await startupService.sendCollabRequest(req.params.id, req.user._id, req.body);
    res.status(201).json({ success: true, request });
  } catch (error) {
    next(error);
  }
}

export async function listCollabRequests(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await startupService.listCollabRequests(req.params.id, req.user._id, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function reviewCollabRequest(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    validateObjectId(req.params.requestId, "request ID");
    const request = await startupService.reviewCollabRequest(
      req.params.id,
      req.params.requestId,
      req.user._id,
      req.body.status
    );
    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
}

export async function createStartupUpdate(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    const update = await startupService.createStartupUpdate(req.params.id, req.user._id, req.body);
    res.status(201).json({ success: true, update });
  } catch (error) {
    next(error);
  }
}

export async function getStartupUpdates(req, res, next) {
  try {
    validateObjectId(req.params.id, "startup ID");
    const { page, limit, skip } = parsePagination(req.query);
    const result = await startupService.listStartupUpdates(req.params.id, page, limit, skip);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
