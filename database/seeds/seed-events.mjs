import "dotenv/config";
import mongoose from "mongoose";
import { Event } from "../../backend/src/models/Event.js";
import { User } from "../../backend/src/models/User.js";

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const eventManager = await User.findOne({ role: "event_manager" }).select("_id");
  const fallbackUser = eventManager || (await User.findOne().select("_id"));

  if (!fallbackUser) {
    throw new Error("No users found. Seed users first.");
  }

  const seeds = [
    {
      title: "Campus Startup Workshop",
      shortDescription: "Hands-on workshop for student founders.",
      fullDescription: "Pitch deck, market validation, and MVP roadmap.",
      eventType: "Workshop",
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      venue: "Innovation Lab",
      isOnline: false,
      tags: ["startup", "workshop"],
      capacity: 80,
      registrationDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      waitlistEnabled: true,
      registrationRequired: true,
      status: "published",
      createdBy: fallbackUser._id
    },
    {
      title: "Tech Society Mixer",
      shortDescription: "Meet peers from different societies.",
      fullDescription: "Networking, collaboration, and team matching.",
      eventType: "Social",
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      venue: "Main Auditorium",
      isOnline: false,
      tags: ["networking", "community"],
      capacity: 200,
      registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      waitlistEnabled: false,
      registrationRequired: true,
      status: "published",
      createdBy: fallbackUser._id
    }
  ];

  for (const item of seeds) {
    await Event.updateOne({ title: item.title }, { $set: item }, { upsert: true });
  }

  console.log("Events seeded successfully");
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Failed seeding events", error);
  await mongoose.disconnect();
  process.exit(1);
});
