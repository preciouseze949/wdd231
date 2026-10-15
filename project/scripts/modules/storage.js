const STORAGE_KEY = "mrpee-shoes-favorites";

export function getFavorites() {
    try {
        const savedFavorites = localStorage.getItem(STORAGE_KEY);
        const parsedFavorites = savedFavorites
            ? JSON.parse(savedFavorites)
            : [];

        return Array.isArray(parsedFavorites) ? parsedFavorites : [];
    } catch (error) {
        console.error("Unable to read saved favorites:", error);
        return [];
    }
}

export function saveFavorites(favorites) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        return true;
    } catch (error) {
        console.error("Unable to save favorites:", error);
        return false;
    }
}

export function isFavorite(productId) {
    return getFavorites().includes(productId);
}

export function toggleFavorite(productId) {
    const favorites = getFavorites();
    const alreadyFavorite = favorites.includes(productId);

    const updatedFavorites = alreadyFavorite
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];

    if (saveFavorites(updatedFavorites)) {
        return !alreadyFavorite;
    }

    return alreadyFavorite;
}

export function updateFavoriteCount() {
    const countElement = document.querySelector("#favorite-count");

    if (countElement) {
        countElement.textContent = getFavorites().length;
    }
}