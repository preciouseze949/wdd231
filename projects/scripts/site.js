import { loadProducts, formatPrice, createProductCard } from "./collections.js";

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const currentYear = document.querySelector("#current-year");
const videoLink = document.querySelector("#video-link");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuToggle.textContent = isOpen ? "×" : "☰";
    });
}

if (videoLink) {
    videoLink.addEventListener("click", (event) => {
        event.preventDefault();
        alert("Replace the video link in site.js with your published project demonstration URL.");
    });
}

function showProductDialog(product) {
    const dialog = document.querySelector("#product-dialog");
    const dialogContent = document.querySelector("#dialog-content");
    const dialogClose = document.querySelector("#dialog-close");

    if (!dialog || !dialogContent || !dialogClose) {
        return;
    }

    dialogContent.innerHTML = `
        <img
            class="dialog-product-image"
            src="${product.image}"
            alt="${product.name}"
        >
        <p class="eyebrow">${product.category}</p>
        <h2 id="dialog-title">${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>Price:</strong> ${formatPrice(product.price)}</p>
        <p><strong>Material:</strong> ${product.material}</p>
        <p><strong>Colour:</strong> ${product.color}</p>
    `;

    if (!dialog.open) {
        dialog.showModal();
    }

    dialogClose.onclick = () => dialog.close();
}

async function displayFeaturedProducts() {
    const container = document.querySelector("#featured-products");

    if (!container) {
        return;
    }

    try {
        const products = await loadProducts();
        const featuredProducts = products.slice(0, 3);

        container.innerHTML = featuredProducts
            .map((product) => createProductCard(product))
            .join("");

        container.querySelectorAll(".product-details-button").forEach((button) => {
            button.addEventListener("click", () => {
                const product = featuredProducts.find(
                    (item) => item.id === Number(button.dataset.productId)
                );

                if (product) {
                    showProductDialog(product);
                }
            });
        });
    } catch (error) {
        console.error("Unable to display featured products:", error);
        container.innerHTML = `
            <p class="error-message">
                We couldn't load the footwear collection. Please try again later.
            </p>
        `;
    }
}

displayFeaturedProducts();