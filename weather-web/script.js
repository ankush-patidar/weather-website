const container = document.getElementById("box");
const input = document.getElementById("cityInput");
const button = document.getElementById("button");
const loader = document.getElementById("loader");
const apiKey = "b831862e8df944e4bdf122958242109";

// Disable right-click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  setTimeout(()=>{
    
  },3000)
});

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, and other shortcuts
document.addEventListener("keydown", function (e) {
  if (
    e.keyCode == 123 || // F12
    (e.ctrlKey && e.shiftKey && e.keyCode == 73) || // Ctrl+Shift+I
    (e.ctrlKey && e.shiftKey && e.keyCode == 74) || // Ctrl+Shift+J
    (e.ctrlKey && e.keyCode == 85) || // Ctrl+U
    (e.ctrlKey && e.keyCode == 83)
  ) {
    // Ctrl+S
    e.preventDefault();
    
  }
});

// Show loader
function showLoader() {
  loader.removeAttribute("hidden");
}

// Hide loader
function hideLoader() {
  loader.setAttribute("hidden", true);
}

// Fetch weather data
async function fetchWeatherData(city) {
  // Regular expression to match latitude and longitude
  const latLonRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  let url;
  if (latLonRegex.test(city.trim())) {
    // Input is latitude, longitude
    const [latitude, longitude] = city.split(",").map(Number);
    url = `https://api.weatherapi.com/v1/current.json?key=b831862e8df944e4bdf122958242109&q=${latitude},${longitude}&aqi=yes`;
  } else {
    url = ` https://api.weatherapi.com/v1/current.json?key=b831862e8df944e4bdf122958242109&q=${city}&aqi=yes`;
  }

  try {
    showLoader();
    const responce = await fetch(url);
    const allData = await responce.json();

    // console.log(allData);

    if (allData.error) {
      throw new Error(allData.error.message);
    }

    // store data
    const currentInfo = allData.current;

    // Update the container with the fetched data
    container.innerHTML = ` <div class="weather-app margin">
    <div class="weather-header">
      <h2>Current Weather</h2>
      <div>
        <span class="weather-icon"><i class="bi bi-cloud-sun"></i></span>
      </div>
      <h3 class="mt-3">${allData.location.name},${allData.location.country}</h3>
      <p class="temp">${currentInfo.windchill_c}°C <img src=${currentInfo.condition.icon} /> </p>
      <p class="temp-min-max">${allData.location.region}</p>
      <p class="temp-min-max">Local Time : ${allData.location.localtime}</p>
    </div>
    <!-- Weather Details -->
    <div class="details">
      <div class="row">
        <div class="col">
          <h5>Humidity</h5>
          <p>${currentInfo.humidity}%</p>
        </div>
        <div class="col">
          <h5>Wind</h5>
          <p>${currentInfo.wind_kph} km/h</p>
        </div>
        <div class="col">
          <h5>Pressure</h5>
          <p>${currentInfo.pressure_mb} hPa</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h5>Fahrenheit</h5>
          <p>${currentInfo.windchill_f}&deg;F</p>
        </div>
        <div class="col">
          <h5>Condition</h5>
          <p>${currentInfo.condition.text}</p>
        </div>
        <div class="col">
          <h5>Country</h5>
          <p>${allData.location.tz_id}</p>
        </div>
      </div>
    </div>
    </div>`;
    // container.appendChild(div);
  } catch (e) {
    console.log(e);
    // add error message
    container.innerHTML = `<div class="col-12 text-center">
     <p class="text-danger">Error: ${error.message}. Please try again.</p>
  </div>`;
  } finally {
    hideLoader();
  }
}

// Button click event listener
button.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) {
    // console.log(city);
    fetchWeatherData(city);
    input.value = "";
  } else {
    container.innerHTML = `<div class="col-12 text-center align-item-center">
   <p class="text-danger">Please enter a city name.</p>
  </div>`;
  }
});

//  get current location
// success data
function getSuccessData(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  fetchWeatherData(`${latitude},${longitude}`);
}
// failed current location
function getFaildData() {
  container.innerHTML = `<div class="col-12 text-center align-item-center">
   <p class="text-danger">Your Current Location is not found . Please enter a city name.</p>
  </div>`;
}
// get data
(async () => {
  navigator.geolocation.getCurrentPosition(getSuccessData, getFaildData);
})();
