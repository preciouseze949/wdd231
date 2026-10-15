import { initializeSite } from "./modules/site.js";
import {
    isFavorite,
    toggleFavorite,
    updateFavoriteCount
} from "./modules/storage.js";

initializeSite();
updateFavoriteCount();

const featuredContainer = document.querySelector("#featured-products");

function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);
}

function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = `${product.name} footwear`;
    image.loading = "lazy";
    image.width = 800;
    image.height = 900;

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = product.tag;

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "favorite-button";
    favoriteButton.type = "button";
    favoriteButton.setAttribute(
        "aria-pressed",
        String(isFavorite(product.id))
    );
    favoriteButton.setAttribute(
        "aria-label",
        `${isFavorite(product.id) ? "Remove" : "Add"} ${product.name} ${
            isFavorite(product.id) ? "from" : "to"
        } favorites`
    );
    favoriteButton.textContent = isFavorite(product.id) ? "♥" : "♡";

    if (isFavorite(product.id)) {
        favoriteButton.classList.add("is-favorite");
    }

    favoriteButton.addEventListener("click", () => {
        const nowFavorite = toggleFavorite(product.id);

        favoriteButton.textContent = nowFavorite ? "♥" : "♡";
        favoriteButton.classList.toggle("is-favorite", nowFavorite);
        favoriteButton.setAttribute("aria-pressed", String(nowFavorite));
        favoriteButton.setAttribute(
            "aria-label",
            `${nowFavorite ? "Remove" : "Add"} ${product.name} ${
                nowFavorite ? "from" : "to"
            } favorites`
        );

        updateFavoriteCount();
    });

    imageWrap.append(image, tag, favoriteButton);

    const copy = document.createElement("div");
    copy.className = "product-card-copy";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const material = document.createElement("p");
    material.className = "product-material";
    material.textContent = `${product.material} · ${product.color}`;

    const description = document.createElement("p");
    description.className = "product-description-short";
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-card-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const link = document.createElement("a");
    link.className = "product-link";
    link.href = "collections.html";
    link.textContent = "View collection →";

    bottom.append(price, link);
    copy.append(title, material, description, bottom);
    article.append(imageWrap, copy);

    return article;
}

async function loadFeaturedProducts() {
    if (!featuredContainer) {
        return;
    }

    try {
        const response = await fetch("data/shoes.json");

        if (!response.ok) {
            throw new Error(`Product request failed: ${response.status}`);
        }

        const products = await response.json();
        const featuredProducts = products
            .filter((product) => product.featured)
            .slice(0, 3);

        featuredContainer.replaceChildren();

        if (featuredProducts.length === 0) {
            featuredContainer.textContent =
                "Our featured collection is being updated. Please check again soon.";
            return;
        }

        featuredProducts.forEach((product) => {
            featuredContainer.appendChild(createProductCard(product));
        });
    } catch (error) {
        console.error("Could not load featured products:", error);

        featuredContainer.textContent =
            "We could not load the products. Please try again later.";
    } finally {
        featuredContainer.setAttribute("aria-busy", "false");
    }
}

loadFeaturedProducts();