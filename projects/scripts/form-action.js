const submissionMessage = document.querySelector("#submission-message");
const submissionDetails = document.querySelector("#submission-details");

const params = new URLSearchParams(window.location.search);

const fields = [
    ["name", "Full name"],
    ["email", "Email address"],
    ["subject", "Subject"],
    ["message", "Message"]
];

const hasSubmission = fields.some(([key]) => params.has(key));

if (!hasSubmission) {
    submissionMessage.textContent =
        "No form information was submitted. Please use the contact form first.";
} else {
    submissionMessage.textContent =
        "The following information was submitted through the contact form.";

    fields.forEach(([key, label]) => {
        const row = document.createElement("div");
        const heading = document.createElement("strong");
        const value = document.createElement("div");

        row.className = "submission-row";
        heading.textContent = label;
        value.textContent = params.get(key) || "Not provided";

        row.append(heading, value);
        submissionDetails.appendChild(row);
    });
}