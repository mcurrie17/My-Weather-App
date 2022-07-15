function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours() % 12 || 12;
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let amPM = hours >= 12 ? "AM" : "PM";
  let time = `${hours}:${minutes} ${amPM}`;
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return `${day} ${time}`;
}

function displayTemp(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#windSpeed");
  let dateElement = document.querySelector("#date");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
}

function searchCity(city) {
  let apiKey = "095d2e824ddba0bb0037c48b7b065155";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  searchCity(searchInputElement.value);
}

searchCity("Austin");

let form = document.querySelector("#searchForm");
form.addEventListener("submit", handleSubmit);
