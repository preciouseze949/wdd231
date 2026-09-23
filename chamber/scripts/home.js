const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#main-navigation");

const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");

const currentTemperature = document.querySelector("#current-temperature");
const currentDescription = document.querySelector("#current-description");
const weatherIcon = document.querySelector("#weather-icon");
const forecastContainer = document.querySelector("#forecast-container");

const spotlightContainer = document.querySelector("#spotlight-container");

// ================================
// MOBILE NAVIGATION
// ================================

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");

    const isOpen = navigation.classList.contains("open");

    menuButton.setAttribute("aria-expanded", isOpen);

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

});

// ================================
// FOOTER DATES
// ================================

currentYear.textContent = new Date().getFullYear();

lastModified.textContent = document.lastModified;

// ================================
// OPENWEATHERMAP SETTINGS
// ================================

// Replace this with your own OpenWeatherMap API key.
const API_KEY = "c024a22cda44df63d442fdfeb6ee8b69";

const WEATHER_URL =
    `https://api.openweathermap.org/data/2.5/weather?lat=7.1&lon=4.84&units=metric&appid=${API_KEY}`;

const FORECAST_URL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=7.1&lon=4.84&units=metric&appid=${API_KEY}`;

// ================================
// CURRENT WEATHER
// ================================

async function getCurrentWeather() {
    try {

        const response = await fetch(WEATHER_URL);

        if (!response.ok) {
            throw new Error(`Weather request failed: ${response.status}`);
        }

        const data = await response.json();

        const temperature = Math.round(data.main.temp);

        currentTemperature.textContent =
            `${temperature}°C`;

        currentDescription.textContent =
            data.weather[0].description;

        const iconCode = data.weather[0].icon;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherIcon.alt =
            data.weather[0].description;

    } catch (error) {

        console.error(
            "Unable to load current weather:",
            error
        );

        currentTemperature.textContent =
            "--°C";

        currentDescription.textContent =
            "Weather information unavailable.";
    }

}

// ================================
// THREE-DAY FORECAST
// ================================

async function getForecast() {

    try {

        const response = await fetch(FORECAST_URL);

        if (!response.ok) {
            throw new Error(`Forecast request failed: ${response.status}`);
        }

        const data = await response.json();

        const dailyForecasts = {};

        data.list.forEach((forecast) => {

            const date = new Date(
                forecast.dt * 1000
            );

            const dateKey =
                date.toISOString().split("T")[0];

            if (!dailyForecasts[dateKey]) {

                dailyForecasts[dateKey] = {
                    date: date,
                    temperatures: [],
                    description:
                        forecast.weather[0].description,
                    icon:
                        forecast.weather[0].icon
                };

            }

            dailyForecasts[dateKey].temperatures.push(
                forecast.main.temp
            );
        });


        const forecastDays =
            Object.values(dailyForecasts)
                .slice(1, 4);


        forecastContainer.innerHTML = "";


        forecastDays.forEach((day) => {

            const averageTemperature =
                day.temperatures.reduce(
                    (total, temperature) =>
                        total + temperature,
                    0
                ) / day.temperatures.length;


            const card =
                document.createElement("article");

            card.classList.add("forecast-card");


            const dayName =
                day.date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );


            const dateText =
                day.date.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric"
                    }
                );


            card.innerHTML = `
            <h4>${dayName}</h4>

            <p class="forecast-date">
                ${dateText}
            </p>

            <img
                src="https://openweathermap.org/img/wn/${day.icon}@2x.png"
                alt="${day.description}"
                width="60"
                height="60"
            >

            <p class="forecast-temperature">
                ${Math.round(averageTemperature)}°C
            </p>

            <p>
                ${day.description}
            </p>
        `;


            forecastContainer.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Unable to load forecast:",
            error
        );

        forecastContainer.innerHTML = `
        <p>
            Forecast information unavailable.
        </p>
    `;
    }
}

// ================================
// MEMBERSHIP LEVEL
// ================================

function getMembershipLevel(level) {

    if (level === 3) {
        return "Gold Member";
    }

    return "Silver Member";

}

// ================================
// RANDOM SPOTLIGHTS
// ================================

function shuffleMembers(members) {

    return [...members].sort(
        () => Math.random() - 0.5
    );

}

function displaySpotlights(members) {

    spotlightContainer.innerHTML = "";

    const eligibleMembers =
        members.filter(
            (member) =>
                member.membershipLevel === 2 ||
                member.membershipLevel === 3
        );

    const shuffledMembers =
        shuffleMembers(eligibleMembers);

    const numberOfSpotlights =
        Math.min(
            3,
            shuffledMembers.length
        );

    const selectedMembers =
        shuffledMembers.slice(
            0,
            numberOfSpotlights
        );

    selectedMembers.forEach((member) => {

        const card =
            document.createElement("article");

        card.classList.add("spotlight-card");

        card.innerHTML = `
        <div class="spotlight-header">

            <span class="membership-badge level-${member.membershipLevel}">
                ${getMembershipLevel(member.membershipLevel)}
            </span>

        </div>

        <div class="spotlight-logo">

            <img
                src="images/${member.image}"
                alt="${member.name} logo"
                loading="lazy"
            >

        </div>

        <div class="spotlight-information">

            <h3>
                ${member.name}
            </h3>

            <p>
                <strong>Phone:</strong>
                <a href="tel:${member.phone}">
                    ${member.phone}
                </a>
            </p>

            <address>
                ${member.address}
            </address>

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

        spotlightContainer.appendChild(card);

    });

}

// ================================
// LOAD MEMBERS
// ================================

async function getSpotlightMembers() {

    try {

        const response =
            await fetch("./data/members.json");

        if (!response.ok) {
            throw new Error(
                `Member request failed: ${response.status}`
            );
        }

        const members =
            await response.json();

        displaySpotlights(members);

    } catch (error) {

        console.error(
            "Unable to load spotlight members:",
            error
        );

        spotlightContainer.innerHTML = `
        <p class="error-message">
            Business spotlights are currently unavailable.
        </p>
    `;
    }

}

// ================================
// START FUNCTIONS
// ================================

getCurrentWeather();

getForecast();

getSpotlightMembers();
