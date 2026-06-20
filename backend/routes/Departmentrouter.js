import express from "express";
import {
  createDepartment,
  deactivateDepartment,
  listActiveDepartments,
  listDepartments,
  updateDepartment,
} from "../controllers/Departmentcontroller.js";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

const DepartmentRouter = express.Router();

DepartmentRouter.get("/", auth, listActiveDepartments);
DepartmentRouter.get("/admin", auth, requireRole("admin"), listDepartments);
DepartmentRouter.post("/", auth, requireRole("admin"), createDepartment);
DepartmentRouter.put("/:id", auth, requireRole("admin"), updateDepartment);
DepartmentRouter.delete("/:id", auth, requireRole("admin"), deactivateDepartment);

export default DepartmentRouter;
