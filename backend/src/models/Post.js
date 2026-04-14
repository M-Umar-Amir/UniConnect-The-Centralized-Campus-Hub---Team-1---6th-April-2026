import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { _id: true }
);

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    options: {
      type: [pollOptionSchema],
      validate: {
        validator: (opts) => opts.length >= 2 && opts.length <= 6,
        message: "A poll must have between 2 and 6 options"
      }
    },
    expiresAt: { type: Date, default: null }
  },
  { _id: false }
);


const reportEntrySchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      enum: ["spam", "harassment", "misinformation", "inappropriate", "other"]
    },
    details: { type: String, default: "", trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const POST_TYPES = ["text", "image", "poll", "event_highlight"];
const VISIBILITY = ["public", "followers", "private"];

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "A post can have at most 5 images"
      },
      default: []
    },
    postType: {
      type: String,
      enum: POST_TYPES,
      default: "text"
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
      index: true
    },
    poll: {
      type: pollSchema,
      default: null
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    visibility: {
      type: String,
      enum: VISIBILITY,
      default: "public"
    },
    reports: [reportEntrySchema],
    reportCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });

postSchema.index({ likeCount: -1, createdAt: -1 });

postSchema.index({ event: 1, createdAt: -1 });

postSchema.index({ content: "text" });

postSchema.index({ isDeleted: 1 });

postSchema.pre(/^find/, function preFind() {

  if (this.getFilter().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
});

export const Post = mongoose.model("Post", postSchema);
export { POST_TYPES, VISIBILITY };
