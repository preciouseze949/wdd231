import { initializeSite } from "./modules/site.js";
import { updateFavoriteCount } from "./modules/storage.js";

initializeSite();
updateFavoriteCount();

const productInput = document.querySelector("#product-interest");
const queryParameters = new URLSearchParams(window.location.search);
const requestedProduct = queryParameters.get("product");

if (productInput && requestedProduct) {
    productInput.value = requestedProduct.slice(0, 100);
}