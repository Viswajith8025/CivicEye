/**
 * One-off migration: convert string `reports` field to integer.
 * Run manually only:
 *   CONFIRM_MIGRATE=yes node scripts/migrations/001-reports-string-to-int.js
 */
import mongoose from "mongoose";
import "dotenv/config";
import user from "../../model/UserSchema.js";

async function migrateReports() {
  if (process.env.CONFIRM_MIGRATE !== "yes") {
    console.error("Refusing to run. Set CONFIRM_MIGRATE=yes to execute this migration.");
    process.exit(1);
  }

  const url = process.env.DB_URL;
  if (!url) {
    console.error("DB_URL is required.");
    process.exit(1);
  }

  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");

    const result = await user.updateMany(
      { reports: { $type: "string" } },
      [{ $set: { reports: { $toInt: "$reports" } } }]
    );
    console.log("Migration result:", result);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateReports();
