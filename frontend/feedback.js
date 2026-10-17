const API_URL = "https://phase6-odx8.onrender.com/feedback";

const feedbackList = document.querySelector("#feedbackList");
const loadButton = document.querySelector("#loadFeedback");
const clearAllButton = document.querySelector("#clearAllFeedback");


async function fetchFeedback() {
    feedbackList.textContent = "Loading feedback...";
    loadButton.disabled = true;
    clearAllButton.disabled = true;

    try {
        const response = await fetch(API_URL);
        const items = await response.json();

        if (!response.ok) {
            throw new Error(items.error || "Could not load feedback.");
        }

        feedbackList.replaceChildren();

        if (items.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-message";
            message.textContent = "No feedback submitted yet.";
            feedbackList.appendChild(message);

            return;
        }

        items.forEach((item) => {
            const card = document.createElement("article");
            card.className = "feedback-card";

            const heading = document.createElement("h3");
            heading.textContent = item.studentName;

            const courseText = document.createElement("p");
            courseText.textContent = `Course: ${item.course}`;

            const feedbackText = document.createElement("p");
            feedbackText.textContent = `Feedback: ${item.feedback}`;

            const ratingText = document.createElement("p");
            ratingText.textContent = `Rating: ${item.rating}/5`;

            
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", async () => {
                const name = prompt("Student name:", item.studentName);
                if (name === null) return;

                const course = prompt("Course name:", item.course);
                if (course === null) return;

                const message = prompt("Feedback:", item.feedback);
                if (message === null) return;

                const ratingInput = prompt("Rating (1-5):", item.rating);
                if (ratingInput === null) return;

                const newRating = Number(ratingInput);

                if (
                    !name.trim() ||
                    !course.trim() ||
                    !message.trim() ||
                    !Number.isInteger(newRating) ||
                    newRating < 1 ||
                    newRating > 5
                ) {
                    alert("Enter all details and a rating from 1 to 5.");
                    return;
                }

                try {
                    const response = await fetch(`${API_URL}/${item._id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            studentName: name.trim(),
                            course: course.trim(),
                            feedback: message.trim(),
                            rating: newRating
                        })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || "Could not edit feedback.");
                    }

                    await fetchFeedback();
                } catch (error) {
                    alert(error.message);
                }
            });

            
            const clearButton = document.createElement("button");
            clearButton.textContent = "Clear";

            clearButton.addEventListener("click", async () => {
                if (!confirm("Delete this feedback entry?")) return;

                try {
                    const response = await fetch(`${API_URL}/${item._id}`, {
                        method: "DELETE"
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || "Could not delete feedback.");
                    }

                    await fetchFeedback();
                } catch (error) {
                    alert(error.message);
                }
            });

            card.append(
                heading,
                courseText,
                feedbackText,
                ratingText,
                editButton,
                clearButton
            );

            feedbackList.appendChild(card);
        });
    } catch (error) {
        feedbackList.textContent = error.message;
        console.error("Loading error:", error);
    } finally {
        loadButton.disabled = false;
        clearAllButton.disabled = false;
    }
}


clearAllButton.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete ALL feedback?")) {
        return;
    }

    clearAllButton.disabled = true;

    try {
        const response = await fetch(`${API_URL}/all`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not clear all feedback.");
        }

        await fetchFeedback();
    } catch (error) {
        alert(error.message);
    } finally {
        clearAllButton.disabled = false;
    }
});


loadButton.addEventListener("click", fetchFeedback);


fetchFeedback();
