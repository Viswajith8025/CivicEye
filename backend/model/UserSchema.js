import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  state: { type: String },
  dob: { type: Date },
  idProofType: { type: String },
  idProofNumber: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  reports: { type: Number, default: 0 },
  points: { type: Number, default: 0, index: true },
  achievements: [
    {
      id: String,
      title: String,
      unlockedAt: { type: Date, default: Date.now },
    },
  ],
  deletestate: { type: Boolean, default: false },
});

const user = mongoose.model("user", userschema);
export default user;
