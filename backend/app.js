import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import feedbackRoutes from "./routes/FeedbackRoutes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


app.use("/feedback", feedbackRoutes);


app.get("/", (req, res) => {
    res.send("Student Feedback Manager API is running!");
});


const PORT = process.env.PORT || 3000;


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });