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

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">           
            <div class="forecastDate">${formatForecastDay(forecastDay.dt)}</div>
            <img src="src/images/${forecastDay.weather[0].icon}.png" alt="${
          forecastDay.weather[0].description
        }" class="float-left" id="forecastIcon" > 
            <div>
              <span class="forecastTempMax">${Math.round(
                forecastDay.temp.max
              )}°</span>
              <span class="forecastTempMin">${Math.round(
                forecastDay.temp.min
              )}°</span>
            </div>
          </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

function displayTemp(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#windSpeed");
  let windSpeedUnit = document.querySelector("#windUnit");
  let dateElement = document.querySelector("#date");
  let feelsLike = document.querySelector("#feelsLikeTemp");
  let iconElement = document.querySelector("#mainIcon");
  cityInputElement = response.data.name;
  feelsLikeTemperature = response.data.main.feels_like;
  temperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(temperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  if (units == "metric") {
    windSpeedElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
    windSpeedUnit.innerHTML = "km/h";
  } else if (units == "imperial") {
    windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
    windSpeedUnit.innerHTML = "mph";
  }
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  feelsLike.innerHTML = Math.round(feelsLikeTemperature);
  iconElement.setAttribute(
    "src",
    `src/images/${response.data.weather[0].icon}.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input").value;
  searchCity(searchInputElement);
}

function searchLocation(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemp);
}

function currentLocationWeather(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  units = "metric";
  searchCity(cityInputElement);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  units = "imperial";
  searchCity(cityInputElement);
}

let temperature = null;

let apiKey = "095d2e824ddba0bb0037c48b7b065155";

let units = "imperial";

let feelsLikeTemperature = null;
let cityInputElement = "Austin";

let form = document.querySelector("#searchForm");
form.addEventListener("submit", handleSubmit);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let currentLocationButton = document.querySelector("#locationButton");
currentLocationButton.addEventListener("click", currentLocationWeather);

searchCity("Austin");
