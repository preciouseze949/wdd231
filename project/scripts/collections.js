import { initializeSite } from "./modules/site.js";
import {
    getFavorites,
    isFavorite,
    toggleFavorite,
    updateFavoriteCount
} from "./modules/storage.js";

initializeSite();
updateFavoriteCount();

const productsContainer = document.querySelector("#all-products");
const favoritesContainer = document.querySelector("#favorite-products");
const searchInput = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const sortSelect = document.querySelector("#sort-products");
const productCount = document.querySelector("#product-count");
const productDialog = document.querySelector("#product-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = document.querySelector("#dialog-close");

let products = [];

function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function createProductCard(product) {
    const article = createElement("article", "product-card");
    const imageWrap = createElement("div", "product-image-wrap");

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = `${product.name} footwear`;
    image.loading = "lazy";
    image.width = 800;
    image.height = 900;

    const tag = createElement("span", "product-tag", product.tag);

    const favoriteButton = createElement(
        "button",
        "favorite-button",
        isFavorite(product.id) ? "♥" : "♡"
    );

    favoriteButton.type = "button";
    favoriteButton.setAttribute("aria-pressed", String(isFavorite(product.id)));
    favoriteButton.setAttribute(
        "aria-label",
        `${isFavorite(product.id) ? "Remove" : "Add"} ${product.name} ${
            isFavorite(product.id) ? "from" : "to"
        } favorites`
    );

    if (isFavorite(product.id)) {
        favoriteButton.classList.add("is-favorite");
    }

    favoriteButton.addEventListener("click", () => {
        const nowFavorite = toggleFavorite(product.id);
        updateFavoriteCount();
        renderProducts();
        renderFavorites();

        // Keep the button's state accurate if the card remains visible.
        favoriteButton.setAttribute("aria-pressed", String(nowFavorite));
    });

    imageWrap.append(image, tag, favoriteButton);

    const copy = createElement("div", "product-card-copy");
    copy.append(
        createElement("h3", "", product.name),
        createElement("p", "product-material", `${product.material} · ${product.color}`),
        createElement("p", "product-description-short", product.description)
    );

    const bottom = createElement("div", "product-card-bottom");
    bottom.append(
        createElement("span", "product-price", formatPrice(product.price))
    );

    const detailsButton = createElement("button", "product-link", "View details →");
    detailsButton.type = "button";
    detailsButton.addEventListener("click", () => showProductDetails(product));

    bottom.append(detailsButton);
    copy.append(bottom);
    article.append(imageWrap, copy);

    return article;
}

function showProductDetails(product) {
    dialogContent.replaceChildren();

    const heading = createElement("h2", "", product.name);
    heading.id = "dialog-product-name";

    const image = document.createElement("img");
    image.className = "dialog-product-image";
    image.src = product.image;
    image.alt = product.name;
    image.width = 800;
    image.height = 900;

    const price = createElement("p", "product-price", formatPrice(product.price));
    const description = createElement(
        "p",
        "dialog-product-description",
        product.description
    );

    const details = createElement("p", "", `Category: ${product.category}`);
    const material = createElement("p", "", `Material: ${product.material}`);
    const colour = createElement("p", "", `Colour: ${product.color}`);

    const contactLink = createElement("a", "button button-dark", "Ask about this shoe");
    contactLink.href = `contact.html?product=${encodeURIComponent(product.name)}`;

    dialogContent.append(
        heading,
        image,
        price,
        description,
        details,
        material,
        colour,
        contactLink
    );

    if (typeof productDialog.showModal === "function") {
        productDialog.showModal();
    } else {
        alert(`${product.name}\n${product.description}\n${formatPrice(product.price)}`);
    }
}

function renderProducts() {
    if (!productsContainer) {
        return;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortMode = sortSelect.value;

    let filteredProducts = products.filter((product) => {
        const searchableText = [
            product.name,
            product.category,
            product.material,
            product.color,
            product.description
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);
        const matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (sortMode === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortMode === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortMode === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        filteredProducts.sort(
            (a, b) => Number(b.featured) - Number(a.featured)
        );
    }

    productsContainer.replaceChildren();

    if (filteredProducts.length === 0) {
        productsContainer.append(
            createElement("p", "empty-state", "No products match your search.")
        );
    } else {
        filteredProducts.forEach((product) => {
            productsContainer.append(createProductCard(product));
        });
    }

    productCount.textContent =
        `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`;

    productsContainer.setAttribute("aria-busy", "false");
}

function renderFavorites() {
    if (!favoritesContainer) {
        return;
    }

    favoritesContainer.replaceChildren();

    const favoriteIds = getFavorites();
    const favoriteProducts = products.filter((product) =>
        favoriteIds.includes(product.id)
    );

    if (favoriteProducts.length === 0) {
        favoritesContainer.append(
            createElement(
                "p",
                "empty-state",
                "You have not saved any favourites yet. Select a heart on a product to save it."
            )
        );
        return;
    }

    favoriteProducts.forEach((product) => {
        favoritesContainer.append(createProductCard(product));
    });
}

function populateCategories() {
    const categories = [...new Set(products.map((product) => product.category))]
        .sort();

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.append(option);
    });
}

async function loadProducts() {
    try {
        const response = await fetch("data/shoes.json");

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        products = await response.json();

        populateCategories();
        renderProducts();
        renderFavorites();
    } catch (error) {
        console.error("Could not load the catalogue:", error);

        productsContainer.replaceChildren(
            createElement(
                "p",
                "empty-state",
                "We could not load the catalogue. Please try again later."
            )
        );

        favoritesContainer.replaceChildren(
            createElement(
                "p",
                "empty-state",
                "Your favourites cannot be displayed right now."
            )
        );
    }
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

dialogClose.addEventListener("click", () => {
    productDialog.close();
});

productDialog.addEventListener("click", (event) => {
    if (event.target === productDialog) {
        productDialog.close();
    }
});

loadProducts();