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
    const city = enteredCity.value;
    if(city){
        try {
            const weatherData= await getWeatherData(city);
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
            
            
        } catch (error) {
            console.error(error);
            showError("Cannot access weather data");
            
        
        }

    }else{
        showError("Enter a City Name");
    }
}



function showError(messege){
    topic.textContent=messege;
    topic.style.display = "flex";
    countryName.style.display = "none";
    currentWeatherCard.style.display = "none";
}

async function getWeatherData(city){
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
    const response = await fetch(apiUrl);
    
    if(!response.ok){
        showError("Enter Valid City");
    }
    return await response.json();
}


//https://api.weatherapi.com/v1/current.json?key=59a88b830af5455597c165218240304&q=London&aqi=yes
//http://api.geonames.org/searchJSON?country=${Afghanistan}&featureCode=PPLC&maxRows=5&username=${last_samurai}`
//username=last_samurai
//http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=100&appid=85dc2e01820de476ee29dd3a2a5e19c1
//http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=100&appid=e3598f41ac5f35bfa9efa406163907fb