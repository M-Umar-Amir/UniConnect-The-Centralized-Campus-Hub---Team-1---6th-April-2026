import { Event } from "../models/Event.js";

/**
 *  GET /events
 */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("society", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

/**
 *Delete event (inappropriate event)

 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Event.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};