// our variables
var btnSearch = $("#search");
var cityToSearch = $("#city-to-search");
var enterCity =  $("#enter-city");
var cityDisplay = $("#city-display");
var currentCityName = $("#curent-city-name");
var currentTemp = $("#curent-Temp");
var currentWind = $("#curent-Wind");
var currentHumidity = $("#curent-Humidity");
var all5DaysWeather = $("#all-5-days");
var apiKey = "c78deab59c2355453ce985b6f36c6f2d";
var requestedCity;
var cityKey;


//Initialization
function init(){
    cityDisplay.hide();
    cityToSearch.text = "";
    requestedCity = "";
    all5DaysWeather.hide();
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
        setTimeOutCity("Please, enter a city name to be searched")
    }else{

        // getting current weather info
        // waiting for API call to finalize
        await retrieveCurrentWeather().then((response) => { 
            if (response  === "successful") { 
                // saving city if weather was retrieved correctly
                saveCityHistory();  
                retrieveCityHistory();        
            }
        }) 
        saveCityHistory();    // <-- this needs to be removed after response is fixed
        retrieveCityHistory(); // <-- this needs to be removed after response is fixed

        await retrieve5DaysWeather().then((response) => { 
            if (response  === "successful") { 
                // do nothing for now
                   return;
            }
        }) 
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
    const apiCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + requestedCity + "&units=imperial&appid=" + apiKey ;
    await fetch(apiCurrentWeather).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
            currentCityName.text(data.name);
            currentTemp.text(data.main.temp);
            currentWind.text(data.wind.deg);
            currentHumidity.text(data.main.humidity);
            return("successful");
        })
    } else {
        setTimeOutCity("City " + requestedCity + " does not exist")
        return("unsuccessful");
    }
      });
 }



// API call for 5 days weather
 async function retrieve5DaysWeather(){
    const api5DaysWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + requestedCity + "&units=imperial&appid=" + apiKey ;``
    await fetch(api5DaysWeather).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            all5DaysWeather.empty();
            all5DaysWeather.show();
            console.log(data);
         

            
            for(index = 0; index < 5; index++){
                console.log(data[index]);
                all5DaysWeather.append(`<div>`);
                all5DaysWeather.append(`<section class="each-5-days">`);
                all5DaysWeather.append(`<p>Temp:&nbsp${data.list[index].main.temp}</p>`); 
                all5DaysWeather.append(`<o>Wind:&nbsp${data.list[index].wind.deg}</p>`); 
                all5DaysWeather.append(`<p>Humidity:&nbsp${data.list[index].wind.humidity}</p>`); 
                all5DaysWeather.append(`</section>`);
                all5DaysWeather.append(`</div>`);
                }
               
                console.log(all5DaysWeather); 

                return("successful");
            })
        } 
});
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
            cityKey = localStorage.key(localStorage.length -1);
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
        cityDisplay.append(`<button id="${cityKey}" class="btn">${cityKey}</button>\n`);
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