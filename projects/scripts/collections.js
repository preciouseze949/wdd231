export async function loadProducts() {
    const response = await fetch("./data/products.json");

    if (!response.ok) {
        throw new Error(`Could not load products: ${response.status}`);
    }

    return response.json();
}

export function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);
}

export function createProductCard(product) {
    return `
        <article class="product-card">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                width="700"
                height="500"
            >

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <p class="product-description">${product.description}</p>
                <p><strong>Material:</strong> ${product.material}</p>
                <p><strong>Colour:</strong> ${product.color}</p>

                <button
                    class="product-details-button"
                    type="button"
                    data-product-id="${product.id}"
                >
                    View Details
                </button>
            </div>
        </article>
    `;
}

function setupDialog(products) {
    const dialog = document.querySelector("#product-dialog");
    const dialogContent = document.querySelector("#dialog-content");
    const dialogClose = document.querySelector("#dialog-close");

    if (!dialog || !dialogContent || !dialogClose) {
        return;
    }

    document.querySelectorAll(".product-details-button").forEach((button) => {
        button.addEventListener("click", () => {
            const product = products.find(
                (item) => item.id === Number(button.dataset.productId)
            );

            if (!product) {
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

            dialog.showModal();
        });
    });

    dialogClose.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}

async function displayCollection() {
    const container = document.querySelector("#product-list");
    const searchInput = document.querySelector("#product-search");
    const categoryFilter = document.querySelector("#category-filter");
    const sortFilter = document.querySelector("#sort-filter");
    const resultsCount = document.querySelector("#results-count");

    if (!container) {
        return;
    }

    try {
        const products = await loadProducts();

        function renderProducts() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const selectedCategory = categoryFilter.value;
            const sortValue = sortFilter.value;

            let filteredProducts = products.filter((product) => {
                const matchesSearch = [
                    product.name,
                    product.category,
                    product.material,
                    product.color,
                    product.description
                ].some((value) => value.toLowerCase().includes(searchTerm));

                const matchesCategory =
                    selectedCategory === "all" ||
                    product.category === selectedCategory;

                return matchesSearch && matchesCategory;
            });

            if (sortValue === "price-low") {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sortValue === "price-high") {
                filteredProducts.sort((a, b) => b.price - a.price);
            } else if (sortValue === "name") {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            }

            container.innerHTML = filteredProducts.length
                ? filteredProducts.map(createProductCard).join("")
                : `<p class="empty-message">No footwear matches your search.</p>`;

            resultsCount.textContent =
                `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`;

            setupDialog(filteredProducts);
        }

        searchInput.addEventListener("input", renderProducts);
        categoryFilter.addEventListener("change", renderProducts);
        sortFilter.addEventListener("change", renderProducts);

        renderProducts();
    } catch (error) {
        console.error("Unable to load collection:", error);
        container.innerHTML = `
            <p class="error-message">
                The collection could not be loaded. Please refresh the page.
            </p>
        `;
    }
}

displayCollection();