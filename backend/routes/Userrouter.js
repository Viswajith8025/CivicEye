import express from "express";
import { deleteUser, getAllUsers, getUserById, login, register, updateuserprofile, viewuser, viewUserProfile } from "../controllers/Usercontroller.js";
import auth from "../middleware/auth.js";

const UserRouter = express.Router()

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.put("/profile/update", auth, updateuserprofile);
UserRouter.get("/profile/:id", auth, viewUserProfile);  
UserRouter.get("/viewuser/:id", viewuser);  
UserRouter.get("/allusers", auth, getAllUsers);
UserRouter.get("/details/:id", auth, getUserById);
UserRouter.put("/deleted/:id", auth, deleteUser);



export default UserRouter;