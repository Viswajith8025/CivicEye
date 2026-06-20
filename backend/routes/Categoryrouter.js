import express from "express";
import {
  createCategory,
  deactivateCategory,
  getAdminCategories,
  getPublicCategories,
  updateCategory,
} from "../controllers/Categorycontroller.js";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const CategoryRouter = express.Router();

CategoryRouter.get("/", getPublicCategories);
CategoryRouter.get("/admin", auth, requireRole("admin"), getAdminCategories);
CategoryRouter.post("/", auth, requireRole("admin"), createCategory);
CategoryRouter.put("/:id", auth, requireRole("admin"), updateCategory);
CategoryRouter.delete("/:id", auth, requireRole("admin"), deactivateCategory);

export default CategoryRouter;
