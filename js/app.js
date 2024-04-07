// const countryList = document.getElementById("cmbCountry");
// const regionList = document.getElementById("cmbRegion");
const enteredCity = document.getElementById("enteredCity");
const btnGetWeather = document.getElementById("btnGetWeather");
const topic = document.getElementById("topic");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const conditionText = document.getElementById("conditionText");
const feelsLikeTemp = document.getElementById("feelsLikeTemp");
const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");
const countryName = document.getElementById("countryName");
const currentWeatherCard = document.getElementById("currentWeatherCard");
const apiKey = "59a88b830af5455597c165218240304";//weatherapi.com
let list=[];

// fetch("https://restcountries.com/v3.1/all")
// .then((response) => response.json() )
// .then((data) => {
//     data.forEach(element => {
//         list.push(element.name.common);
//         // // list.sort();
//         // // let option = document.createElement("option");
//         // // option.text=element.flag+" "+element.name.common;
//     });
//     list.sort();
//     list.forEach(country => {
//         let option = document.createElement("option");
//         option.text=country;
//         countryList.appendChild(option);
//     })
// })

btnGetWeather.addEventListener("click", eventProcess);

enteredCity.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        eventProcess();
    }
  });

async function eventProcess(){
    let city = enteredCity.value;
    const letter1=city.charAt(0).toUpperCase();
    city = letter1+city.slice(1);
    if(city){
        try {
            const weatherData= await getWeatherData(city);
            console.log(weatherData);
            topic.innerHTML = weatherData.location.name;
            countryName.innerHTML = weatherData.location.country;
            temperature.innerHTML = weatherData.current.temp_c+" &deg;C";
            weatherIcon.src = weatherData.current.condition.icon;
            conditionText.innerHTML = weatherData.current.condition.text;
            feelsLikeTemp.innerHTML = weatherData.current.feelslike_c+" &deg;C";
            humidityValue.innerHTML = weatherData.current.humidity+" %";
            windValue.innerHTML = weatherData.current.wind_kph+" km/h";
            
            topic.style.display = "flex";
            countryName.style.display = "flex";
            currentWeatherCard.style.display = "flex";
            
            displayForecast(weatherData);
            
        } catch (error) {
            console.error(error);
            showError("Cannot access weather data");
            
        
        }

    }else{
        showError("Enter a City Name");
    }
}

function displayForecast(weatherData){
    let forecastArray = weatherData.forecast.forecastday;
    console.log(forecastArray)
    for (let i = 0; i < forecastArray.length; i++) {
        let element = forecastArray[i];
        document.getElementById(`date${i}`).innerHTML = element.date;
        document.getElementById(`temp${i}`).innerHTML = element.day.avgtemp_c+" &deg;C";
        document.getElementById(`weatherIcon${i}`).src = element.day.condition.icon;
        document.getElementById(`cndTxt${i}`).innerHTML = element.day.condition.text;
    }
    document.getElementById("forecast").style.display = "flex";
}


function showError(messege){
    topic.textContent=messege;
    topic.style.display = "flex";
    countryName.style.display = "none";
    currentWeatherCard.style.display = "none";
}

async function getWeatherData(city){
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;
    const response = await fetch(apiUrl);
    
    if(!response.ok){
        showError("Enter Valid City");
    }
    return await response.json();
}

