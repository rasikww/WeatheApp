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
let dayNum = 1;

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
            displayCurrent(weatherData);
            displayForecast(weatherData);
            while (dayNum<=7) {
                const historyData= await getHistoryData(city,dayNum);
                displayHistory(historyData,dayNum);
                dayNum++;
            }
            
        } catch (error) {
            console.error(error);
            showError("Cannot access weather data");
            
        
        }

    }else{
        showError("Enter a City Name");
    }
}
function displayCurrent(weatherData){
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
}

function displayForecast(weatherData){
    let forecastArray = weatherData.forecast.forecastday;
    for (let i = 0; i < forecastArray.length; i++) {
        let element = forecastArray[i];
        document.getElementById(`date${i}`).innerHTML = (element.date+"").substring(5);
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

function displayHistory(historyData,dayNum){
    const date = document.getElementById(`history-date${dayNum}`);
    const maxTemp = document.getElementById(`history-max-temp${dayNum}`);
    const minTemp = document.getElementById(`history-min-temp${dayNum}`);
    const avgTemp = document.getElementById(`history-avg-temp${dayNum}`);
    const icon = document.getElementById(`history-icon${dayNum}`);
    const condition = document.getElementById(`history-cndTxt${dayNum}`);
    const maxWind = document.getElementById(`history-max-wind${dayNum}`);
    const precipitation = document.getElementById(`history-total-precip${dayNum}`);
    const snow = document.getElementById(`history-total-snow${dayNum}`);
    const humidity = document.getElementById(`history-avg-humidity${dayNum}`);

    const forecastDay = historyData.forecast.forecastday[0];
    date.innerHTML = forecastDay.date;
    maxTemp.innerHTML = "Max temp : "+ forecastDay.day.maxtemp_c+ " &deg;C";
    minTemp.innerHTML = "Min temp : "+ forecastDay.day.mintemp_c+ " &deg;C";
    avgTemp.innerHTML = "Average temp : "+ forecastDay.day.avgtemp_c+ " &deg;C";
    icon.src = forecastDay.day.condition.icon;
    condition.innerHTML = forecastDay.day.condition.text;
    maxWind.innerHTML = "Min wind : "+ forecastDay.day.maxwind_kph+" km/h";
    precipitation.innerHTML = "Total precipitation : "+ forecastDay.day.totalprecip_mm +" mm";
    snow.innerHTML = "Total snow : "+ forecastDay.day.totalsnow_cm +" mm";
    humidity.innerHTML = "Average Humidity : "+ forecastDay.day.avghumidity +" %";

    document.getElementById("pastWeather").style.display = "block";
}

async function getHistoryData(city,dayNum){
    const historyDay = getDay(dayNum);
    const apiUrl = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${historyDay}`
    const response = await fetch(apiUrl);

    if(!response.ok){
        showError("Enter Valid City");
    }
    return await response.json();
}

function getDay(dayNum){
    let date,month,year;
    const today = new Date().valueOf();
    const day = new Date(today-86400000*dayNum);
    year = day.getFullYear();
    month = day.getMonth()+1;
    date = day.getDate();
    return `${year}-${month}-${date}`;
}