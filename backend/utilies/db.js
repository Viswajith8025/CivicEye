import mongoose from "mongoose";
import 'dotenv/config';

const url=process.env.DB_URL;

export async function connectDB() {
    try {
        await mongoose.connect(url)
        console.log("connected to database");
    } catch (error) {
        console.log("error while connecting to database");
    }
}