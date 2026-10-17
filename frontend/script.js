const API_URL = "http://localhost:3000/feedback";

const feedbackForm = document.querySelector("#feedbackForm");
const studentName = document.querySelector("#studentName");
const course = document.querySelector("#course");
const feedback = document.querySelector("#feedback");
const rating = document.querySelector("#rating");
const statusMessage = document.querySelector("#statusMessage");


feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const feedbackData = {
        studentName: studentName.value.trim(),
        course: course.value.trim(),
        feedback: feedback.value.trim(),
        rating: Number(rating.value)
    };

    statusMessage.textContent = "Submitting feedback...";

    const submitButton = feedbackForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Could not submit feedback."
            );
        }

        statusMessage.textContent =
            "Feedback submitted successfully!";

        feedbackForm.reset();



    } catch (error) {
        statusMessage.textContent = error.message;
        console.error("Submission error:", error);
    } finally {
        submitButton.disabled = false;
    }
});