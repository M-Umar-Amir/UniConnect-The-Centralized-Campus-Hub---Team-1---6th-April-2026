import crypto from "crypto";
import { PendingEmailChange } from "../models/PendingEmailChange.js";

function buildSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createEmailChangeVerification(userId, newEmail) {
  const code = buildSixDigitCode();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");

  await PendingEmailChange.findOneAndUpdate(
    { userId },
    {
      userId,
      newEmail,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Stub transport. Replace with nodemailer/provider integration.
  console.log(`Email verification code for ${newEmail}: ${code}`);
}

export async function verifyEmailChangeCode(userId, code) {
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");

  const record = await PendingEmailChange.findOne({ userId, codeHash });
  if (!record || record.expiresAt < new Date()) {
    return null;
  }

  await record.deleteOne();
  return record.newEmail;
}
