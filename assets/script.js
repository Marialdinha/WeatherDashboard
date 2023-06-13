// our variables
var btnSearch = $("#search");
var cityToSearch = $("#city-to-search");
var enterCity =  $("#enter-city");
var cityDisplay = $("#city-display");
var currentCityName = $("#curent-city-name");
var curretDate = $("#curent-date");
var curretIcon = $("#curent-icon");
var currentTemp = $("#curent-Temp");
var currentWind = $("#curent-Wind");
var currentHumidity = $("#curent-Humidity");
var allDaysWeather = $("#all-5-days");
var forecast = $("#forecast");
var apiKey = "c78deab59c2355453ce985b6f36c6f2d";
var requestedCity;
var cityKey;
var stausResponse;
var date5Days;


//Initialization
function init(){
    cityDisplay.hide();
    forecast.hide();
    cityToSearch.text = "";
    requestedCity = "";
    stausResponse="";
    allDaysWeather.hide();
    retrieveCityHistory()
}


// Event Listener for search button
 function setEventListeners(){
    btnSearch.on("click", function(){
        cityWeather();   
      })
    }


// Get the weather
async function cityWeather(){ 
    requestedCity =  capitalizeFirstLetter(cityToSearch.val());

    // checking if NO city was entered
    if (requestedCity === null || requestedCity === ""){
        setTimeOutCity("Please, enter a city name")
    }else{

        // getting current weather info
        // waiting for API call to finalize
        await retrieveCurrentWeather().then(() => { 
        }) 

        if (stausResponse  === "successful") { 
            // saving city if weather was retrieved correctly
            saveCityHistory();  
            retrieveCityHistory();     

            // getting current weather info
            // waiting for API call to finalize                             
            await retrieve5DaysWeather().then(() => { 
            }) 
        }
    }    
}


// Give error message in city textbox   
function setTimeOutCity(message){
    btnSearch.prop("disabled",true);
    cityToSearch.val(message);
    setTimeout(() => {
        cityToSearch.val("");
        btnSearch.prop("disabled",false);
    }, 1500);
}


// API call for current weather
async function retrieveCurrentWeather(){
    stausResponse="";
    const apiCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + requestedCity + "&units=imperial&appid=" + apiKey ;
    await fetch(apiCurrentWeather).then(function (response) {
    if (response.ok) {
        stausResponse="successful";
        response.json().then(function (data) {
            console.log(data);
            currentCityName.text(data.name);
            var dateConverted = convertDate(data.dt);
            curretDate.text(dateConverted);
            currentTemp.text(data.main.temp + " F");
            currentWind.text(data.wind.deg +" MPH");
            currentHumidity.text(data.main.humidity + "%"); 
        })
    } else {
        setTimeOutCity("City " + requestedCity + " does not exist")
    }
      });
 }


// API call for 5 days weather
 async function retrieve5DaysWeather(){
    const api5DaysWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + requestedCity + "&units=imperial&appid=" + apiKey ;``
    await fetch(api5DaysWeather).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                allDaysWeather.empty();
                allDaysWeather.show();
                forecast.show();
                console.log(data);
              
            var html = ""    
            var dateConverted = new Date();
            for(index = 0; index < 40; index+=8){
                html += `<section class="weather-card" >`;
                dateConverted = convertDate(data.list[index].dt);
                html += `<p class="weather-card__label">${dateConverted}</p>`;
                html += `<p class="weather-card__item">Max Temp: <spam>${data.list[index].main.temp_max} F</spam></p>`;
                html += `<p class="weather-card__item">Min Temp: ${data.list[index].main.temp_min} F</p>`;
                html += `<p class="weather-card__item">Wind: ${data.list[index].wind.deg} MPH</p>`;
                html += `<p class="weather-card__item">Humidity: ${data.list[index].main.humidity}%</p>`;
                html += `</section>`
            }
            allDaysWeather.append(html);
        })
    }
 })
}


// Converting the "funny" date into a normal date 
function convertDate(dateIn){
    var dateToConvert = new Date(0);
    dateToConvert.setUTCSeconds(dateIn);
    dateToConvert = (dateToConvert.getMonth() +1) + "/" + dateToConvert.getDate()  + "/" + dateToConvert.getFullYear(); 
    return dateToConvert;
}


 // Function to capitalize the first letter of a string
function capitalizeFirstLetter(string){
    string = string.trim();
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


// saving requested cities in local storage
function saveCityHistory(){
    // setting city in local storage
    if (localStorage.getItem(requestedCity) === null){
        // setting limit to hto the number of cities stored 
        if (localStorage.length > 7) {
            // cityKey = localStorage.key(localStorage.length -1);
            cityKey = localStorage.key(0);
            localStorage.removeItem(cityKey); 
        }
        localStorage.setItem(requestedCity, requestedCity);
    }
}


// initialize city's history from local storage
function retrieveCityHistory(){

    cityDisplay.empty();
    cityDisplay.show();

    if (localStorage.length > 0) {
        // initializing buttons with cities from local storage 
        for(index = 0; index < localStorage.length; index++){
        cityKey = localStorage.key(index);
        cityDisplay.append(`<button id="${cityKey}" class="btn">${cityKey}</button><br/>`);
        }

        //add event lsitner to all city buttons
        cityDisplay.each(function(){
            $(this).children("button").on("click",function(event){
            event.preventDefault();
            cityToSearch.val($(this).attr("id"));
            cityWeather();  
         })
      })
    }
}


// When document is ready, initialize functions
$(document).ready(function(){
    init();
    setEventListeners();
})