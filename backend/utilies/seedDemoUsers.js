import bcrypt from "bcryptjs";
import user from "../model/UserSchema.js";
import logger from "./logger.js";

const DEMO_USERS = [
  {
    name: "Civic Admin",
    email: "admin@civiceye.local",
    password: "Admin@12345",
    role: "admin",
    age: "30",
    mobile: "9000000001",
  },
  {
    name: "Demo Citizen",
    email: "citizen@civiceye.local",
    password: "Citizen@12345",
    role: "user",
    age: "25",
    mobile: "9000000002",
  },
];

export async function seedDemoUsersIfEnabled() {
  if (process.env.SEED_DEMO_USERS !== "true") return;

  const salt = parseInt(process.env.SALT, 10) || 10;

  for (const demo of DEMO_USERS) {
    const exists = await user.findOne({ email: demo.email.toLowerCase() });
    if (exists) continue;

    const hashed = await bcrypt.hash(demo.password, salt);
    await user.create({
      name: demo.name,
      email: demo.email.toLowerCase(),
      password: hashed,
      role: demo.role,
      age: demo.age,
      mobile: demo.mobile,
      state: "Demo",
      address: "Demo account for local testing",
    });
    logger.info({ email: demo.email, role: demo.role }, "Demo user seeded");
  }
}
