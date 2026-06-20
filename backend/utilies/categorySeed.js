import Category from "../model/CategorySchema.js";
import { REPORT_CATEGORIES } from "../constants/categories.js";
import logger from "./logger.js";

export async function seedCategoriesIfEmpty() {
  const count = await Category.countDocuments();
  if (count > 0) return;

  const docs = [];
  let order = 0;
  for (const { group, items } of REPORT_CATEGORIES) {
    for (const name of items) {
      docs.push({ name, group, sortOrder: order++, isActive: true });
    }
  }

  await Category.insertMany(docs, { ordered: false }).catch(() => {});
  logger.info({ count: docs.length }, "Seeded default report categories");
}

export async function getGroupedCategories({ activeOnly = true } = {}) {
  const filter = activeOnly ? { isActive: true } : {};
  const items = await Category.find(filter).sort({ group: 1, sortOrder: 1, name: 1 });

  if (items.length === 0) {
    return {
      grouped: REPORT_CATEGORIES,
      flat: REPORT_CATEGORIES.flatMap((c) => c.items),
    };
  }

  const groupMap = new Map();
  for (const cat of items) {
    if (!groupMap.has(cat.group)) groupMap.set(cat.group, []);
    groupMap.get(cat.group).push(cat.name);
  }

  const grouped = [...groupMap.entries()].map(([group, groupItems]) => ({
    group,
    items: groupItems,
  }));

  return { grouped, flat: items.map((c) => c.name) };
}
