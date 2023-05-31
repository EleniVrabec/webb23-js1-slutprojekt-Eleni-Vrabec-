// ================= select elements =====================================//
const form = document.querySelector("#city");
const nameH1 = document.querySelector(".city-name");
const tempH1 = document.querySelector(".temp");
const iconImg = document.querySelector(".weather-icon");
const descriptionMainP = document.querySelector(".explain");
const descriptionLongP = document.querySelector(".full-desc");
const windSpeedP = document.querySelector(".wind-speed");
const humidityP = document.querySelector(".humidity");
const realFeelP = document.querySelector(".feels-like");
const errorMessP = document.querySelector(".error .error-mess");
const containerDiv = document.getElementById("container");
let currentWeatherData;

// =================seting default city when page loads ====================//
window.addEventListener("load", setAndDisplayDefaultCity)
 function setAndDisplayDefaultCity() {
    const defaultCity = {
      nameH1: "Malmö",
      lat: 55.6052931,
      lon: 13.0001566
    };
    
    //call this functions with default city coordinates
    fetchWeatherData(defaultCity.lat, defaultCity.lon);
    fetchProlongedForecast(defaultCity.lat, defaultCity.lon);
  };
  
// =============================== my api key =================================//
const API_KEY = `485fd195d0049a02313a0a5d8f01cf6b`;
// ============================================================================//

//======================= a function that searches and displaies city ===============//

form.addEventListener("submit", searchCity)

function searchCity(event){
    event.preventDefault();
    const inputSearchCity = document.querySelector(".write-city");
    const city = inputSearchCity.value;
    const limit = 1;
    console.log(inputSearchCity.value);
    form.reset();

    //url for the API request to fetch geographical data of city
    const cityUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_KEY}`;

    console.log(cityUrl);
    fetch(cityUrl)
    .then(response => response.json())
    .then(data => {
        
        if(data.length > 0){
            const lat = data[0].lat;
            const lon = data[0].lon;
            console.log(lat, lon);

            //if city is found call this functions and pass the coordinates as arguments
            fetchWeatherData(lat, lon);
            fetchProlongedForecast(lat, lon, hours);
           
           
        }else{
            throw new Error("City not Found, Try again");
            console.log("City not found");
        }
    })
    .catch(error => {
        console.log("Error", error.message);
        errorMessP.innerText = error.message;
        
        setTimeout(function(){
            restart();
        }, 3000);
        
        

    });
    form.reset();

}

// restart the error message
function restart(){
    errorMessP.innerText = ""; 

}

// ============================= fetching the current weather data from a given latitude and longitude ==========================================================//


function fetchWeatherData(lat, lon){
    // URL for retrieving weather data using the provided latitude and longitude.
    const fetcUrlCoor = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log(fetcUrlCoor);
    fetch(fetcUrlCoor)
    .then(response => response.json())
    .then(data => {
        currentWeatherData = data;
        console.log("Weather data:", currentWeatherData);
        nameH1.innerText = currentWeatherData.name;
        nameH1.style.color="white";
        tempH1.innerText =Math.round(currentWeatherData.main.temp) + " °C";
        tempH1.style.color="orange";
        descriptionMainP.innerText = currentWeatherData.weather[0].main;
        descriptionMainP.style.color="white";
        descriptionLongP.innerText = currentWeatherData.weather[0].description;
        descriptionLongP.style.color="white"
        console.log(data.weather[0].description);
        windSpeedP.innerText = "Wind / " + currentWeatherData.wind.speed + " " + "m/s";
        windSpeedP.style.color = "white";
        humidityP.innerText = "Humidity / " + currentWeatherData.main.humidity;
        humidityP.style.color = "white";
        realFeelP.innerText = "Real Feel / " + currentWeatherData.main.feels_like;
        realFeelP.style.color = "white";
        
        const icon = currentWeatherData.weather[0].icon;
        const iconURl = ` https://openweathermap.org/img/wn/${icon}@2x.png`;
        iconImg.src = iconURl;
        iconImg.style.width = "200px";
        iconImg.style.height = "200px";
        console.log(iconURl);

        // set background color based on the weather data
        setContainerBackgroundColor();
        
    })
    .catch(error => {
        console.log("Error", error);
        errorMessP.innerText = error.message;
    });

}   
// function to set background color based on the weather data
function setContainerBackgroundColor() {
    const temperature = parseFloat(tempH1.innerText);
    
    if (containerDiv) {
      if (temperature > 20 && temperature < 30) {
        containerDiv.style.backgroundColor = "hsla(185, 47%, 45%, 0.8)";
        containerDiv.style.backdropFilter = "blur(10px)";
        containerDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
      } else if (temperature >= 30) {
        containerDiv.style.backgroundColor = "hsla(10, 70%, 70%, 0.8)";
        containerDiv.style.backdropFilter = "blur(10px)";
        containerDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
      } else if (temperature <= 0) {
        containerDiv.style.backgroundColor = "hsla(210, 50%, 80%, 0.8)";
        containerDiv.style.backdropFilter = "blur(10px)";
        containerDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
      } else {
        containerDiv.style.backgroundColor = "hsla(240, 10%, 10%, 0.8)";
        
        containerDiv.style.backdropFilter = "blur(5px)";
        containerDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
      }
    }
  }
  

/* ===================================================================================================================================================================== */

//============== retrieve prolonged weather forecast by lat, lon, hours =============//
const weatherForecastForm = document.querySelector("#weather-forcast") ;
weatherForecastForm.addEventListener("submit",  handleWeatherForecastSubmission)

function handleWeatherForecastSubmission(event){
    event.preventDefault();
    const hours = document.getElementById("hours").value;
    //convert a value from html element to integer 
    const selectedHours = parseInt(hours/3); 
    console.log("Input hours:", hours);
    console.log("Parsed hours:", selectedHours);
    const forecastInterval = Math.ceil(selectedHours); 

    fetchProlongedForecast(currentWeatherData.coord.lat, currentWeatherData.coord.lon, selectedHours, forecastInterval);
}

// =================== function for fetching the prolonged forecast data
function fetchProlongedForecast(lat, lon, hours, forecastInterval){
    
    const apiURl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&cnt=${hours}&units=metric`
    console.log("API URL: " + apiURl);

    fetch(apiURl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        // calling the function and passing the data and hours as arguments
        displayWeatherForecast(data, hours); 
    })
    .catch(function(error){
        console.log("Ett fel inträffades" + error);
    })
    form.reset();
}

// ======================== display the prolonged data =======================
function displayWeatherForecast(data, hours){
    const forecastDiv = document.getElementById("weatherForecast");
    forecastDiv.innerHTML = "";
    
    for(let i = 0; i < hours; i ++){
        let forecast = data.list[i];
        let forecastTime = forecast.dt_txt;
        let forecastIcon = forecast.weather[0].icon;
        let forcastTemperature = forecast.main.temp;

        let forecastItem = document.createElement("p");
        let weatherIcon = document.createElement("img");
        forecastItem.innerHTML = `${forecastTime}: ${forcastTemperature}&deg;C`;
        console.log(forecastItem);

        const iconURL = `https://openweathermap.org/img/wn/${forecastIcon}.png`;
        weatherIcon.src = iconURL;
        weatherIcon.style.width="100px";
        weatherIcon.style.height="100px";
        forecastItem.prepend(weatherIcon);
        forecastDiv.appendChild(forecastItem);
        forecastItem.style.margin="5px";
        forecastItem.style.borderRadius= "15px"
        forecastItem.style.width = "100px";
        forecastItem.style.float = "left";
        forecastItem.style.border = "1 px solid black";
        forecastItem.style.justifyContent="centar";
        forecastItem.style.padding="5px";
        forecastItem.style.display="collumn";
        forecastItem.style.color="white";
        forecastItem.style.backgroundColor="#536976";
        
    }
}
