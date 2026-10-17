import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    rating: {
        
        
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;