const membersContainer = document.querySelector("#members-container");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#main-navigation");


// ----------------------------------------------------
// NAVIGATION
// ----------------------------------------------------

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});


// ----------------------------------------------------
// MEMBERSHIP LEVEL
// ----------------------------------------------------

function getMembershipLevel(level) {

    if (level === 3) {
        return "Gold Member";
    }

    if (level === 2) {
        return "Silver Member";
    }

    return "Member";
}


// ----------------------------------------------------
// DISPLAY MEMBERS
// ----------------------------------------------------

function displayMembers(members) {

    membersContainer.innerHTML = "";

    members.forEach((member) => {

        const card = document.createElement("article");

        card.classList.add("member-card");

        card.innerHTML = `
            <div class="member-image">
                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    loading="lazy"
                >
            </div>

            <div class="member-information">

                <span class="membership-badge level-${member.membershipLevel}">
                    ${getMembershipLevel(member.membershipLevel)}
                </span>

                <p class="member-industry">
                    ${member.industry}
                </p>

                <h3>${member.name}</h3>

                <address>
                    ${member.address}
                </address>

                <p class="member-phone">
                    <strong>Phone:</strong>
                    <a href="tel:${member.phone}">
                        ${member.phone}
                    </a>
                </p>

                <p class="member-description">
                    ${member.description}
                </p>

                <a
                    class="website-link"
                    href="${member.website}"
                    target="_blank"
                    rel="noopener"
                >
                    Visit Website
                </a>

            </div>
        `;

        membersContainer.appendChild(card);
    });
}


// ----------------------------------------------------
// FETCH MEMBERS FROM JSON
// ----------------------------------------------------

async function getMembers() {

    try {

        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const members = await response.json();

        displayMembers(members);

    } catch (error) {

        console.error("Unable to load member data:", error);

        membersContainer.innerHTML = `
            <div class="error-message">
                <h2>Directory Unavailable</h2>
                <p>
                    We were unable to load the business directory.
                    Please try again later.
                </p>
            </div>
        `;
    }
}


// ----------------------------------------------------
// GRID VIEW
// ----------------------------------------------------

gridButton.addEventListener("click", () => {

    membersContainer.classList.add("members-grid");
    membersContainer.classList.remove("members-list");

    gridButton.classList.add("active");
    listButton.classList.remove("active");

});


// ----------------------------------------------------
// LIST VIEW
// ----------------------------------------------------

listButton.addEventListener("click", () => {

    membersContainer.classList.add("members-list");
    membersContainer.classList.remove("members-grid");

    listButton.classList.add("active");
    gridButton.classList.remove("active");

});


// ----------------------------------------------------
// COPYRIGHT YEAR
// ----------------------------------------------------

const currentYear = document.querySelector("#current-year");

currentYear.textContent = new Date().getFullYear();


// ----------------------------------------------------
// LAST MODIFIED DATE
// ----------------------------------------------------

const lastModified = document.querySelector("#last-modified");

lastModified.textContent = document.lastModified;


// ----------------------------------------------------
// START APPLICATION
// ----------------------------------------------------

getMembers();