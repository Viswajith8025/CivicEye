/**
 * Sync geo Point field from coordinates.lat/lng on existing reports.
 * CONFIRM_MIGRATE=yes node scripts/migrations/002-sync-geo-fields.js
 */
import mongoose from "mongoose";
import "dotenv/config";
import complaint from "../../model/ComplaintSchema.js";
import { coordsToGeoPoint } from "../../utilies/geo.js";

async function run() {
  if (process.env.CONFIRM_MIGRATE !== "yes") {
    console.error("Set CONFIRM_MIGRATE=yes to run.");
    process.exit(1);
  }
  if (!process.env.DB_URL) {
    console.error("DB_URL required.");
    process.exit(1);
  }

  await mongoose.connect(process.env.DB_URL);
  const cursor = complaint.find({
    "coordinates.lat": { $exists: true },
    "coordinates.lng": { $exists: true },
    geo: { $exists: false },
  });

  let updated = 0;
  for await (const doc of cursor) {
    const geo = coordsToGeoPoint(doc.coordinates);
    if (geo) {
      await complaint.updateOne({ _id: doc._id }, { $set: { geo } });
      updated += 1;
    }
  }

  console.log(`Synced geo for ${updated} reports`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
