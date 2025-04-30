const apiKey = "cfdd8988391fb88a399ddd7ecod46tf0";

// Format timestamp into readable day + HH:MM
function formatDate(date) {
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${days[date.getDay()]} ${hours}:${minutes}`;
}

// Render current weather
function displayWeather(response) {
  const data = response.data;

  document.querySelector("#current-city").textContent = data.city;
  document.querySelector("#description").textContent =
    data.condition.description;
  document.querySelector(
    "#humidity"
  ).textContent = `${data.temperature.humidity}%`;
  document.querySelector("#wind").textContent = `${Math.round(
    data.wind.speed
  )} km/h`;

  const icon = document.querySelector("#icon");
  icon.src = data.condition.icon_url;
  icon.alt = data.condition.description || "Weather icon";

  document.querySelector(".current-temperature-value").textContent = Math.round(
    data.temperature.current
  );

  // Show updated weather info
  document.querySelector("#loader").style.display = "none";
  document.querySelector(".current-weather").classList.remove("hidden");
  document.querySelector(".current-weather").classList.add("visible");
}

// Render forecast for next 5 days
function displayForecast(response) {
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  response.data.daily.slice(0, 5).forEach((day) => {
    const forecastElement = document.createElement("div");
    forecastElement.className = "forecast-item";

    forecastElement.innerHTML = `
      <div class="forecast-grid">
        <div class="forecast-day">
          <h3>${formatDate(new Date(day.time * 1000)).split(" ")[0]}</h3>
          <img src="${day.condition.icon_url}" alt="${
      day.condition.description || "Forecast icon"
    }" />
          <p>${day.condition.description}</p>
        </div>
        <div class="forecast-details">
          <p><strong>High:</strong> ${Math.round(day.temperature.maximum)}°C</p>
          <p><strong>Low:</strong> ${Math.round(day.temperature.minimum)}°C</p>
          <p class="icon-row">
            <i class="material-symbols-outlined">air</i>
            <span>${Math.round(day.wind.speed)} km/h</span>
          </p>
          <p class="icon-row">
            <i class="material-symbols-outlined">humidity_high</i>
            <span>${day.temperature.humidity}%</span>
          </p>
        </div>
      </div>
    `;

    forecastContainer.appendChild(forecastElement);
  });

  forecastContainer.classList.add("loaded");
  document.querySelector("#forecast").classList.remove("hidden");
  document.querySelector("#forecast").classList.add("visible");
}

// Fetch weather and forecast data from API
function searchCity(city) {
  const currentApiUrl = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(
    city
  )}&key=${apiKey}&units=metric`;

  const forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${encodeURIComponent(
    city
  )}&key=${apiKey}&units=metric`;

  axios
    .get(currentApiUrl)
    .then(displayWeather)
    .catch(() => alert("Unable to load current weather."));

  axios
    .get(forecastApiUrl)
    .then(displayForecast)
    .catch(() => alert("Unable to load forecast."));
}

// Handle form submit
function handleSearch(event) {
  event.preventDefault();
  const city = document.querySelector("#search-input").value.trim();
  if (city) {
    // Reset views before new search
    document.querySelector("#loader").style.display = "block";
    document.querySelector(".current-weather").classList.add("hidden");
    document.querySelector("#forecast").classList.add("hidden");
    searchCity(city);
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const button = document.querySelector("#toggle-dark-mode");
  button.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
}

// Initial setup on page load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#current-date").textContent = formatDate(new Date());
  document
    .querySelector("#search-form")
    .addEventListener("submit", handleSearch);
  document
    .querySelector("#toggle-dark-mode")
    .addEventListener("click", toggleDarkMode);

  searchCity("Brisbane"); // Default city
});
