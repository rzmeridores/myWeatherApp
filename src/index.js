const apiKey = "cfdd8988391fb88a399ddd7ecod46tf0";

function formatDate(date) {
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
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
  icon.alt = data.condition.description;

  document.querySelector(".current-temperature-value").textContent = Math.round(
    data.temperature.current
  );

  document.querySelector("#loader").style.display = "none";
  document
    .querySelector(".current-weather")
    .classList.replace("hidden", "visible");
}

function displayForecast(response) {
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  response.data.daily.slice(0, 5).forEach((day) => {
    const date = formatDate(new Date(day.time * 1000)).split(" ")[0];

    forecastContainer.innerHTML += `
      <div class="forecast-item">
        <div class="forecast-grid">
          <div class="forecast-day">
            <h3>${date}</h3>
            <img src="${day.condition.icon_url}" alt="${
      day.condition.description
    }" />
            <p>${day.condition.description}</p>
          </div>
          <div class="forecast-details">
            <p><strong>High:</strong> ${Math.round(
              day.temperature.maximum
            )}°C</p>
            <p><strong>Low:</strong> ${Math.round(
              day.temperature.minimum
            )}°C</p>
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
      </div>
    `;
  });

  forecastContainer.classList.add("loaded");
  document.querySelector("#forecast").classList.replace("hidden", "visible");
}

function searchCity(city) {
  const currentApiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  const forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  document.querySelector("#error-message").classList.add("hidden");

  axios
    .get(currentApiUrl)
    .then((response) => {
      displayWeather(response);
      return axios.get(forecastApiUrl);
    })
    .then(displayForecast)
    .catch(() => {
      showError("City not found. Please try again.");
    });
}

function handleSearch(event) {
  event.preventDefault();
  const city = document.querySelector("#search-input").value.trim();
  if (city) {
    document.querySelector("#loader").style.display = "block";
    document.querySelector(".current-weather").classList.add("hidden");
    document.querySelector("#forecast").classList.add("hidden");
    searchCity(city);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const button = document.querySelector("#toggle-dark-mode");
  button.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#current-date").textContent = formatDate(new Date());
  document
    .querySelector("#search-form")
    .addEventListener("submit", handleSearch);
  document
    .querySelector("#toggle-dark-mode")
    .addEventListener("click", toggleDarkMode);
  searchCity("Brisbane");
});

function showError(message) {
  const errorElement = document.querySelector("#error-message");
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  document.querySelector("#loader").style.display = "none";
  document.querySelector(".current-weather").classList.add("hidden");
  document.querySelector("#forecast").classList.add("hidden");
}
