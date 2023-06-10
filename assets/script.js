// our variables
var btnSearch = $("#search");
var cityToSearch = $("#city-to-search");
var enterCity =  $("#enter-city");
var cityDisplay = $("#city-display");
var currentCityName = $("#curent-city-name");
var currentTemp = $("#curent-Temp");
var currentWind = $("#curent-Wind");
var currentHumidity = $("#curent-Humidity");
var apiKey = "c78deab59c2355453ce985b6f36c6f2d";
var requestedCity;
var cityKey;


//Initialization
function init(){
    cityDisplay.hide();
    cityToSearch.text = "";
    requestedCity = "";
    initializeCityHistory()
}


// Event Listener for search button
 function setEventListeners(){
    btnSearch.on("click", function(){
        cityWeather();   
      })
    }


// 
async function cityWeather(){ 
    requestedCity =  capitalizeFirstLetter(cityToSearch.val());

    // checking if NO city was entered
    if (requestedCity === null || requestedCity === ""){
        cityToSearch.prop("disabled",true);
        cityToSearch.val("Please, enter a city name to be searched");
        setTimeout(() => {
            cityToSearch.val("");
            cityToSearch.prop("disabled",false);
        }, 1000);
    }else{
        // getting current weather info
        // waiting for API call to finalize
        await retrieveCurrentWeather().then((resp) => { 
            return resp.json();
        })
        .then((data) => {      
        currentCityName.text(data.name);
        currentTemp.text(data.main.temp);
        currentWind.text(data.wind.deg);
        currentHumidity.text(data.main.humidity);
       
        // saving city if weather was retrieved correctly
        saveCityHistory();
        initializeCityHistory();
        })

  
        // getting 5 days weather info
        // waiting for API call to finalize
        await retrieve5DaysWeather().then((resp) => { 
            return resp.json();
        })
        .then((data) => {    
        })  
    }
}
    

// API call for current weather
 async function retrieveCurrentWeather(){
    const apiCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + requestedCity + "&units=imperial&appid=" + apiKey ;
    const getCurrentWeather = fetch(apiCurrentWeather);
    return(getCurrentWeather);
 }


// API call for 5 days weather
 async function retrieve5DaysWeather(){
    const api5DaysWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + requestedCity + "&units=imperial&appid=" + apiKey ;``
    const get5DaysWeather = fetch(api5DaysWeather);
    return(get5DaysWeather);
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
        if (localStorage.length > 2) {
            cityKey = localStorage.key(3);
            localStorage.removeItem(cityKey); 
        }
        localStorage.setItem(requestedCity, requestedCity);
}
}


// initialize city's history from local storage
function initializeCityHistory(){

    // initializing buttons with cities from local storage
    console.log(cityDisplay.length);
    console.log(cityDisplay.data);
    console.log(localStorage);

    if (localStorage.length > 0) {
        for(index = cityDisplay.length; index < 1; index--){}
        cityKey = localStorage.key(index);
            cityDisplay.remove(cityKey);
        for(index = 0; index < localStorage.length; index++){
        cityKey = localStorage.key(index);
        cityDisplay.append(`<button id="${cityKey}" class="btn">${cityKey}</button>\n`);
        }
        cityDisplay.show();

        //add event lsitner to all city buttons
        cityDisplay.each(function(){
            $(this).children("button").on("click",function(event){
            event.preventDefault();
            cityToSearch.val($(this).attr("id"));
            cityWeather();  
         })
      })
}


// When document is ready, initialize functions
$(document).ready(function(){
    init();
    setEventListeners();
})