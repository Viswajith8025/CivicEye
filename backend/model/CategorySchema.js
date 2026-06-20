import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  group: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 0 },
});

categorySchema.index({ group: 1, sortOrder: 1 });

const Category = mongoose.model("category", categorySchema);
export default Category;
