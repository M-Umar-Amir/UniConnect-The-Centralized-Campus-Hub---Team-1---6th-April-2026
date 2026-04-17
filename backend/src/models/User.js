import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const roleValues = ["student", "founder", "admin", "event_manager"];

const notificationSettingsSchema = new mongoose.Schema(
  {
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    replies: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    eventRegistration: { type: Boolean, default: true },
    eventUpdates: { type: Boolean, default: true },
    startupMatch: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true }
  },
  { _id: false }
);

const privacySettingsSchema = new mongoose.Schema(
  {
    showEventsAttended: { type: Boolean, default: true },
    showStartupInvolvement: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
    allowMentionsFrom: {
      type: String,
      enum: ["everyone", "followers", "none"],
      default: "everyone"
    },
    showOnlineStatus: { type: Boolean, default: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roleValues, default: "student" },
    university: { type: String, default: "", trim: true, maxlength: 180 },
    bio: { type: String, default: "", maxlength: 400 },
    avatarUrl: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    interests: [{ type: String, trim: true }],
    links: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      website: { type: String, default: "" }
    },
    isVerified: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    isBlocked: { type: Boolean, default: false },
    notificationSettings: { type: notificationSettingsSchema, default: () => ({}) },
    privacySettings: { type: privacySettingsSchema, default: () => ({}) }
  },
  { timestamps: true }
);

userSchema.index({ fullName: "text", university: "text", interests: "text" });

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.setPassword = async function setPassword(password) {
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(password, salt);
};

export const User = mongoose.model("User", userSchema);
