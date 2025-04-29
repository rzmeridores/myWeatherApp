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
}

function searchCity(city) {
  const apiKey = "cfdd8988391fb88a399ddd7ecod46tf0";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSearch(event) {
  event.preventDefault();
  const city = document.querySelector("#search-input").value.trim();
  if (city) searchCity(city);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const button = document.querySelector("#toggle-dark-mode");
  button.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
}

// Event Listeners
document.querySelector("#search-form").addEventListener("submit", handleSearch);
document
  .querySelector("#toggle-dark-mode")
  .addEventListener("click", toggleDarkMode);

// Initial Setup
document.querySelector("#current-date").innerHTML = formatDate(new Date());
searchCity("Brisbane"); // Default city
