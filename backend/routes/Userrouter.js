import express from "express";
import {
  deleteUser,
  getAllUsers,
  getLeaderboard,
  getUserById,
  login,
  register,
  updateuserprofile,
  viewUserProfile,
} from "../controllers/Usercontroller.js";
import {
  exportMyData,
  forgotPassword,
  requestAccountDeletion,
  resetPassword,
} from "../controllers/Authcontroller.js";
import auth from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { loginLimiter, registerLimiter, forgotPasswordLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/schemas.js";

const UserRouter = express.Router();

UserRouter.post("/register", registerLimiter, validate(registerSchema), register);
UserRouter.post("/login", loginLimiter, validate(loginSchema), login);
UserRouter.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
UserRouter.post("/reset-password", forgotPasswordLimiter, validate(resetPasswordSchema), resetPassword);
UserRouter.get("/leaderboard", auth, getLeaderboard);
UserRouter.put("/profile/update", auth, updateuserprofile);
UserRouter.get("/profile", auth, viewUserProfile);
UserRouter.get("/export", auth, exportMyData);
UserRouter.post("/request-deletion", auth, requestAccountDeletion);
UserRouter.get("/allusers", auth, requireRole("admin"), getAllUsers);
UserRouter.get("/details/:id", auth, requireRole("admin"), getUserById);
UserRouter.put("/deleted/:id", auth, requireRole("admin"), deleteUser);

export default UserRouter;
