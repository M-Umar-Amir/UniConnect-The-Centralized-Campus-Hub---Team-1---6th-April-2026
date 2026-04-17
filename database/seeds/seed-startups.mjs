import "dotenv/config";
import mongoose from "mongoose";
import { Startup } from "../../backend/src/models/Startup.js";
import { User } from "../../backend/src/models/User.js";

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const founder = await User.findOne({ role: "founder" }).select("_id");
  const fallbackUser = founder || (await User.findOne().select("_id"));

  if (!fallbackUser) {
    throw new Error("No users found. Seed users first.");
  }

  const seeds = [
    {
      name: "StudySphere",
      tagline: "Find project teammates instantly",
      problemStatement: "Students struggle to find teammates with matching skills.",
      solution: "Skill-based matching and in-app collaboration requests.",
      businessModel: "Campus subscriptions + premium placement.",
      targetAudience: "University students and societies.",
      domainTags: ["edtech", "collaboration"],
      rolesNeeded: ["Frontend Developer", "UI/UX Designer"],
      status: "published",
      founder: fallbackUser._id
    },
    {
      name: "MessMate",
      tagline: "Smart meal planning for hostels",
      problemStatement: "Hostel students miss meals and waste subscriptions.",
      solution: "Meal reminders and predictive food demand insights.",
      businessModel: "SaaS for campus mess providers.",
      targetAudience: "Hostel residents and mess operators.",
      domainTags: ["foodtech", "saas"],
      rolesNeeded: ["Backend Developer", "Data Analyst"],
      status: "draft",
      founder: fallbackUser._id
    }
  ];

  for (const item of seeds) {
    await Startup.updateOne({ name: item.name }, { $set: item }, { upsert: true });
  }

  console.log("Startups seeded successfully");
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error("Failed seeding startups", error);
  await mongoose.disconnect();
  process.exit(1);
});
