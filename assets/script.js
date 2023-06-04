// our variables
var btnSearch = $("#search");
var cityToSearch = $("#city-to-search");
var enterCity =  $("#enter-city");
var cityDisplay = $("#city-display");
var apiKey = "c78deab59c2355453ce985b6f36c6f2d";
var requestedCity;

// localStorage.clear();


//Initialization
function init(){
    cityDisplay.hide();
    cityToSearch.text = "";
    requestedCity = "";
    retrieveCityHistory()
}


// Event Listener for search button
 function setEventListeners(){
    btnSearch.on("click", function(){
        cityWeather();   
      })
    }


// 
async function cityWeather(){ 
    requestedCity = cityToSearch.val();
    requestedCity = capitalizeFirstLetter(requestedCity);

    // checking if NO city was entered
    if (requestedCity === null || requestedCity === ""){
        enterCity.show();
        setTimeout(() => {
            enterCity.hide();
        }, 4000);
    }else{
        saveCityHistory();

        // getting current weather info
        // waiting for API call to finalize
        await retrieveCurrentWeather().then((resp) => { 
            return resp.json();
        })
        .then((data) => {        
        console.log(data.weather[0].description);
        })
    }
}
    
 async function retrieveCurrentWeather(){
    const apiCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + requestedCity + "&appid=" + apiKey ;
    const getCurrentWeather = fetch(apiCurrentWeather);
    return(getCurrentWeather);
 }


 async function retrieve5DaysWeather(){
    const api5DaysWeather = "https://api.openweathermap.org/data/2.5/forecast?q=" + requestedCity + "&appid=" + apiKey ;
    // const api5DaysWeather = "https://api.github.com/repos/IBM/clai/issues?per_page=5";
    const get5DaysWeather = fetch(api5DaysWeather);
    return(get5DaysWeather);
}

 // Define function to capitalize the first letter of a string
function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// saving requested cities in local storage
function saveCityHistory(){
    if (localStorage.getItem(requestedCity) === null){
        localStorage.setItem(requestedCity, requestedCity);
    }
}


// retrieving city history from local storage
function retrieveCityHistory(){

    if (localStorage.length > 0) {
        cityDisplay.empty()
        for(index = 0; index < localStorage.length; index++){
            var cityKey = localStorage.key(index);
            cityDisplay.append('<div>'+ localStorage.getItem(cityKey)  + '</div>')
        }
        cityDisplay.show();
    }
}


// When document is ready, initialize functions
$(document).ready(function(){
    init();
    setEventListeners();
})