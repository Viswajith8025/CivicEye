import mongoose from "mongoose";
import user from "./model/UserSchema.js"; // Adjust path as needed

async function migrateReports() {
  try {
    await mongoose.connect("mongodb://localhost:27017/yourdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const result = await user.updateMany(
      { reports: { $type: "string" } },
      [{ $set: { reports: { $toInt: "$reports" } } }]
    );
    console.log("Migration result:", result);

    // Verify the specific user
    const updatedUser = await user.findById("67d7b8463e80a9d5aeb307dd");
    console.log("User after migration:", updatedUser);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Migration error:", error);
  }
}

migrateReports();