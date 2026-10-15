// Shared functions used throughout the Mrpee Shoes website.

export function setCurrentYear() {
    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

export function setupNavigation() {
    const menuButton = document.querySelector("#menu-toggle");
    const navigation = document.querySelector("#primary-nav");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        }
    });
}

export function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("#primary-nav a").forEach((link) => {
        const linkPage = new URL(link.href, window.location.href)
            .pathname.split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}

export function initializeSite() {
    setCurrentYear();
    setupNavigation();
    setActiveNavigation();
}