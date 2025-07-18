import express from "express";
import { connectDB } from "./utilies/db.js";
import cors from 'cors';
import UserRouter from "./routes/Userrouter.js";
import ComplaintRouter from "./routes/Complaintrouter.js";
import feedbackrouter from "./routes/Feedbackrouter.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routers
app.use("/user", UserRouter);
app.use("/complaint", ComplaintRouter);
app.use("/feedback", feedbackrouter);

// Port and Server start
const port = process.env.PORT || 5002;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
