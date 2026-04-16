import mongoose from "mongoose";

export const EVENT_TYPES = ["Workshop", "Seminar", "Competition", "Social", "Other"];
export const EVENT_STATUS = ["draft", "published", "past"];

const segmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    capacity: { type: Number, min: 1, default: 1 },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    shortDescription: { type: String, required: true, trim: true, maxlength: 280 },
    fullDescription: { type: String, default: "", trim: true },
    eventType: { type: String, enum: EVENT_TYPES, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    venue: { type: String, required: true, trim: true, maxlength: 200 },
    isOnline: { type: Boolean, default: false },
    coverImage: { type: String, default: "" },
    tags: [{ type: String, trim: true, maxlength: 60 }],
    capacity: { type: Number, min: 1, default: 1 },
    registrationDeadline: { type: Date, default: null },
    waitlistEnabled: { type: Boolean, default: false },
    registrationRequired: { type: Boolean, default: true },
    status: { type: String, enum: EVENT_STATUS, default: "draft", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", default: null, index: true },
    segments: { type: [segmentSchema], default: [] },
    media: { type: [String], default: [] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, startDate: -1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ title: "text", shortDescription: "text" });

export const Event = mongoose.model("Event", eventSchema);
