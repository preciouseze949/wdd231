
import { places } from "../data/places.mjs";

const discoverGrid = document.querySelector("#discover-grid");
const visitMessage = document.querySelector("#visit-message");

function displayVisitMessage() {
    const storageKey = "ondoDiscoverLastVisit";
    const now = Date.now();

    try {
        const previousVisit = localStorage.getItem(storageKey);

        if (!previousVisit) {
            visitMessage.textContent =
                "Welcome! Let us know if you have any questions.";
        } else {
            const elapsed = now - Number(previousVisit);
            const oneDay = 24 * 60 * 60 * 1000;

            if (!Number.isFinite(Number(previousVisit)) || Number(previousVisit) <= 0) {
                visitMessage.textContent =
                    "Welcome! Let us know if you have any questions.";
            } else if (elapsed < oneDay) {
                visitMessage.textContent = "Back so soon! Awesome!";
            } else {
                const days = Math.floor(elapsed / oneDay);
                const unit = days === 1 ? "day" : "days";

                visitMessage.textContent =
                    `You last visited ${days} ${unit} ago.`;
            }
        }

        localStorage.setItem(storageKey, String(now));
    } catch (error) {
        visitMessage.textContent =
            "Welcome! Explore places of interest across Ondo State.";
    }
}

function createPlaceCard(place, index) {
    const article = document.createElement("article");
    article.className = "place-card";
    article.style.setProperty("--card-index", index + 1);

    const heading = document.createElement("h2");
    heading.textContent = place.name;

    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = place.image;
    image.alt = place.alt;
    image.width = 300;
    image.height = 200;
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {
        image.alt = `${place.name} image unavailable`;
        image.classList.add("image-unavailable");
    });

    figure.append(image);

    const category = document.createElement("p");
    category.className = "place-category";
    category.textContent = place.category;

    const address = document.createElement("address");
    address.textContent = place.address;

    const description = document.createElement("p");
    description.className = "place-description";
    description.textContent = place.description;

    const moreInfo = document.createElement("p");
    moreInfo.className = "place-more";
    moreInfo.textContent = place.more;
    moreInfo.hidden = true;

    const button = document.createElement("button");
    button.className = "learn-more-button";
    button.type = "button";
    button.textContent = "Learn More";
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", String(!isExpanded));
        moreInfo.hidden = isExpanded;
        button.textContent = isExpanded ? "Learn More" : "Show Less";
    });

    article.append(
        heading,
        figure,
        category,
        address,
        description,
        moreInfo,
        button
    );

    return article;
}

function renderPlaces() {
    if (!discoverGrid) return;

    const fragment = document.createDocumentFragment();

    places.forEach((place, index) => {
        fragment.appendChild(createPlaceCard(place, index));
    });

    discoverGrid.replaceChildren(fragment);
}

function updateFooter() {
    const year = document.querySelector("#current-year");
    const modified = document.querySelector("#last-modified");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (modified) {
        modified.textContent = document.lastModified;
    }
}

displayVisitMessage();
renderPlaces();
updateFooter();