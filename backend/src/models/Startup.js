import mongoose from "mongoose";

export const STARTUP_STATUS = ["draft", "published", "closed"];

const startupTeamSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true, trim: true, maxlength: 120 }
  },
  { _id: false }
);

const startupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    tagline: { type: String, default: "", trim: true, maxlength: 100 },
    logo: { type: String, default: "" },
    problemStatement: { type: String, default: "", trim: true },
    solution: { type: String, default: "", trim: true },
    businessModel: { type: String, default: "", trim: true },
    targetAudience: { type: String, default: "", trim: true },
    domainTags: [{ type: String, trim: true, maxlength: 60 }],
    rolesNeeded: [{ type: String, trim: true, maxlength: 80 }],
    status: { type: String, enum: STARTUP_STATUS, default: "draft", index: true },
    founder: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    team: { type: [startupTeamSchema], default: [] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

startupSchema.index({ name: "text", tagline: "text" });
startupSchema.index({ domainTags: 1 });

export const Startup = mongoose.model("Startup", startupSchema);
