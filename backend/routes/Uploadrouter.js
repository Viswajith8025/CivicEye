import express from "express";
import auth from "../middleware/auth.js";
import { serveUpload } from "../controllers/Uploadcontroller.js";

const UploadRouter = express.Router();

UploadRouter.get("/:filename", auth, serveUpload);

export default UploadRouter;
