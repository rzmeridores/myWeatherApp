const apiKey = "cfdd8988391fb88a399ddd7ecod46tf0";

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let dayIndex = date.getDay();

  if (minutes < 10) minutes = `0${minutes}`;
  if (hours < 10) hours = `0${hours}`;

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${days[dayIndex]} ${hours}:${minutes}`;
}

function displayWeather(response) {
  const data = response.data;

  document.querySelector("#current-city").innerHTML = data.city;
  document.querySelector("#description").innerHTML = data.condition.description;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${data.temperature.humidity}%`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    data.wind.speed
  )} km/h`;
  document.querySelector("#icon").setAttribute("src", data.condition.icon_url);
  document
    .querySelector("#icon")
    .setAttribute("alt", data.condition.description);
  document.querySelector(".current-temperature-value").innerHTML = Math.round(
    data.temperature.current
  );

  // Show weather and hide loader
  document.querySelector("#loader").style.display = "none";
  document.querySelector(".current-weather").classList.remove("hidden");
  document.querySelector(".current-weather").classList.add("visible");
}

function displayForecast(response) {
  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = "";

  response.data.daily.slice(0, 5).forEach((day) => {
    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");

    forecastElement.innerHTML = `
  <div class="forecast-grid">
    <div class="forecast-day">
      <h3>${formatDate(new Date(day.time * 1000)).split(" ")[0]}</h3>
      <img src="${day.condition.icon_url}" alt="${day.condition.description}" />
      <p>${day.condition.description}</p>
    </div>
    <div class="forecast-details">
      <p><strong>High:</strong> ${Math.round(day.temperature.maximum)}°C</p>
      <p><strong>Low:</strong> ${Math.round(day.temperature.minimum)}°C</p>
      <p><i class="fa-solid fa-wind weather-icon"></i>${Math.round(day.wind.speed)} km/h</p>
      <p><i class="fa-solid fa-droplet weather-icon"></i>${day.temperature.humidity}%</p>
    </div>
  </div>
`;


    forecastContainer.appendChild(forecastElement);
  });

  forecastContainer.classList.add("loaded");
  document.querySelector("#forecast").classList.remove("hidden");
  document.querySelector("#forecast").classList.add("visible");
}

function searchCity(city) {
  const currentApiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  const forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(currentApiUrl).then(displayWeather);
  axios.get(forecastApiUrl).then(displayForecast);
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

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#current-date").innerHTML = formatDate(new Date());
  document
    .querySelector("#search-form")
    .addEventListener("submit", handleSearch);
  document
    .querySelector("#toggle-dark-mode")
    .addEventListener("click", toggleDarkMode);
  searchCity("Brisbane");
});
