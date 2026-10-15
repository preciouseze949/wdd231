import { initializeSite } from "./modules/site.js";

initializeSite();

const messageContainer = document.querySelector("#form-result-message");
const detailsContainer = document.querySelector("#form-result-details");

const parameters = new URLSearchParams(window.location.search);

const fields = [
    ["name", "Full name"],
    ["email", "Email address"],
    ["phone", "Phone number"],
    ["enquiry", "Enquiry type"],
    ["product", "Product or style"],
    ["message", "Message"]
];

function addResult(label, value) {
    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = value || "Not provided";

    detailsContainer.append(term, description);
}

const name = (parameters.get("name") || "").trim();
const email = (parameters.get("email") || "").trim();
const enquiry = (parameters.get("enquiry") || "").trim();
const message = (parameters.get("message") || "").trim();
const agreement = parameters.get("agreement") === "yes";

if (!parameters.has("name")) {
    messageContainer.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "No enquiry was submitted";

    const paragraph = document.createElement("p");
    paragraph.textContent =
        "Use the contact form to submit a demonstration enquiry.";

    messageContainer.append(heading, paragraph);
} else if (!name || !email || !enquiry || message.length < 10 || !agreement) {
    messageContainer.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "The submission is incomplete";

    const paragraph = document.createElement("p");
    paragraph.textContent =
        "Some required information is missing or invalid. Please return to the contact form and check your answers.";

    messageContainer.append(heading, paragraph);
} else {
    messageContainer.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Thank you for your enquiry";

    const paragraph = document.createElement("p");
    paragraph.className = "form-success";
    paragraph.textContent =
        "Your demonstration form was received by this page. No email was sent and no enquiry was stored on a server.";

    messageContainer.append(heading, paragraph);

    detailsContainer.className = "form-result";

    fields.forEach(([key, label]) => {
        if (key === "email") {
            const value = (parameters.get(key) || "").trim();

            if (value.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                addResult(label, "Invalid email format");
            } else {
                addResult(label, value);
            }

            return;
        }

        let value = (parameters.get(key) || "").trim();

        if (key === "name") {
            value = value.slice(0, 80);
        }

        if (key === "phone") {
            value = value.slice(0, 30);
        }

        if (key === "product") {
            value = value.slice(0, 100);
        }

        if (key === "message") {
            value = value.slice(0, 1000);
        }

        addResult(label, value);
    });
}