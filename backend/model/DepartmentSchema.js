import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
  contactEmail: { type: String, trim: true },
  reportTypes: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true, index: true },
});

const Department = mongoose.model("department", departmentSchema);
export default Department;
