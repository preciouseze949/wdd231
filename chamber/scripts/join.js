const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#main-navigation");

// ========================================
// MOBILE NAVIGATION
// ========================================

if (menuButton && navigation) {


menuButton.addEventListener("click", () => {

    navigation.classList.toggle("open");

    const isOpen =
        navigation.classList.contains("open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

});


}

// ========================================
// FOOTER
// ========================================

const currentYear =
document.querySelector("#current-year");

const lastModified =
document.querySelector("#last-modified");

if (currentYear) {
currentYear.textContent =
new Date().getFullYear();
}

if (lastModified) {
lastModified.textContent =
document.lastModified;
}

// ========================================
// FORM TIMESTAMP
// ========================================

const timestampField =
document.querySelector("#timestamp");

if (timestampField) {


timestampField.value =
    new Date().toISOString();


}

// ========================================
// MEMBERSHIP MODALS
// ========================================

const modalButtons =
document.querySelectorAll("[data-modal]");

const closeButtons =
document.querySelectorAll(".modal-close");

modalButtons.forEach((button) => {


button.addEventListener("click", () => {

    const modalId =
        button.getAttribute("data-modal");

    const modal =
        document.querySelector(`#${modalId}`);

    if (modal) {
        modal.showModal();
    }

});


});

closeButtons.forEach((button) => {


button.addEventListener("click", () => {

    const modal =
        button.closest("dialog");

    if (modal) {
        modal.close();
    }

});


});

// ========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ========================================

const dialogs =
document.querySelectorAll("dialog");

dialogs.forEach((modal) => {


modal.addEventListener("click", (event) => {

    const rectangle =
        modal.getBoundingClientRect();

    const clickedInside =
        event.clientX >= rectangle.left &&
        event.clientX <= rectangle.right &&
        event.clientY >= rectangle.top &&
        event.clientY <= rectangle.bottom;

    if (!clickedInside) {
        modal.close();
    }

});


});

// ========================================
// THANK YOU PAGE
// ========================================

const urlParams =
new URLSearchParams(window.location.search);

const displayFirstName =
document.querySelector("#display-first-name");

const displayLastName =
document.querySelector("#display-last-name");

const displayEmail =
document.querySelector("#display-email");

const displayPhone =
document.querySelector("#display-phone");

const displayOrganization =
document.querySelector("#display-organization");

const displayTimestamp =
document.querySelector("#display-timestamp");

if (displayFirstName) {


displayFirstName.textContent =
    urlParams.get("firstName") || "Not provided";


}

if (displayLastName) {


displayLastName.textContent =
    urlParams.get("lastName") || "Not provided";


}

if (displayEmail) {


displayEmail.textContent =
    urlParams.get("email") || "Not provided";


}

if (displayPhone) {


displayPhone.textContent =
    urlParams.get("phone") || "Not provided";


}

if (displayOrganization) {


displayOrganization.textContent =
    urlParams.get("organization") || "Not provided";


}

if (displayTimestamp) {


const timestamp =
    urlParams.get("timestamp");

if (timestamp) {

    const date =
        new Date(timestamp);

    displayTimestamp.textContent =
        date.toLocaleString(
            "en-NG",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

} else {

    displayTimestamp.textContent =
        "Not available";

}


}
