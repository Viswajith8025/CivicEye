import Category from "../model/CategorySchema.js";
import { getGroupedCategories } from "../utilies/categorySeed.js";

export async function getPublicCategories(_req, res) {
  try {
    const { grouped, flat } = await getGroupedCategories({ activeOnly: true });
    return res.status(200).json({ grouped, categories: flat });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getAdminCategories(_req, res) {
  try {
    const items = await Category.find().sort({ group: 1, sortOrder: 1, name: 1 });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, group, sortOrder } = req.body;
    if (!name?.trim() || !group?.trim()) {
      return res.status(400).json({ message: "Name and group are required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const maxOrder = await Category.findOne({ group: group.trim() }).sort({ sortOrder: -1 });
    const category = await Category.create({
      name: name.trim(),
      group: group.trim(),
      sortOrder: sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1,
    });

    return res.status(201).json({ message: "Category created", category });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { name, group, sortOrder, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name?.trim()) category.name = name.trim();
    if (group?.trim()) category.group = group.trim();
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deactivateCategory(req, res) {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.status(200).json({ message: "Category deactivated", category });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
