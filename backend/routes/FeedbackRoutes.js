import express from "express";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";

const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const savedFeedback = await Feedback.create(req.body);
        res.status(201).json(savedFeedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const feedbackList = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbackList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete("/all", async (req, res) => {
    try {
        await Feedback.deleteMany({});
        res.json({ message: "All feedback deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid feedback ID." });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedFeedback) {
            return res.status(404).json({ error: "Feedback not found." });
        }

        res.json(updatedFeedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid feedback ID." });
        }

        const deletedFeedback = await Feedback.findByIdAndDelete(
            req.params.id
        );

        if (!deletedFeedback) {
            return res.status(404).json({ error: "Feedback not found." });
        }

        res.json({ message: "Feedback deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;