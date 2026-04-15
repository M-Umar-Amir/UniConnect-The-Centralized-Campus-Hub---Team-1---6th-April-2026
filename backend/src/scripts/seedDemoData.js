import { connectDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { resolveNotificationTarget } from "../utils/notificationTargets.js";

const demoUsers = [
  {
    fullName: "Amina Khan",
    email: "amina.khan@uniconnect.test",
    password: "password123",
    role: "student",
    university: "University of Central Punjab"
  },
  {
    fullName: "Zain Abbas",
    email: "zain.abbas@uniconnect.test",
    password: "password123",
    role: "founder",
    university: "Lahore University of Management Sciences"
  }
];

const demoNotifications = [
  {
    type: "like",
    text: "Zain liked your startup pitch.",
    targetUrl: "/startups/demo-pitch",
    referenceThumbnail: "https://placehold.co/120x80",
    isRead: false
  },
  {
    type: "event",
    text: "Your event registration was confirmed.",
    targetUrl: "/events/demo-hackathon",
    referenceThumbnail: "https://placehold.co/120x80",
    isRead: false
  },
  {
    type: "announcement",
    text: "Platform maintenance is scheduled for tonight.",
    targetUrl: "/notifications",
    referenceThumbnail: "",
    isRead: true
  }
];

async function upsertDemoUsers() {
  const users = [];

  for (const demoUser of demoUsers) {
    let user = await User.findOne({ email: demoUser.email });
    if (!user) {
      user = new User({
        fullName: demoUser.fullName,
        email: demoUser.email,
        role: demoUser.role,
        university: demoUser.university
      });
      await user.setPassword(demoUser.password);
      await user.save();
    }

    users.push(user);
  }

  return users;
}

async function seedDemoNotifications(users) {
  const [student, founder] = users;

  const existing = await Notification.countDocuments({ recipient: student._id });
  if (existing > 0) {
    return;
  }

  await Notification.insertMany(
    demoNotifications.map((notification, index) => ({
      recipient: student._id,
      actor: founder._id,
      ...notification,
      targetUrl: resolveNotificationTarget(notification),
      createdAt: new Date(Date.now() - index * 60 * 60 * 1000),
      updatedAt: new Date()
    }))
  );
}

async function main() {
  await connectDatabase(env.mongoUri);
  const users = await upsertDemoUsers();
  await seedDemoNotifications(users);
  console.log("Demo data seeded successfully");
  process.exit(0);
}

main().catch((error) => {
  console.error("Failed to seed demo data", error);
  process.exit(1);
});
