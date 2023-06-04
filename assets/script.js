// our variables
var btnSearch = $("#search");
var cityToSearch = $("#city-to-search");
var apiKey = "c78deab59c2355453ce985b6f36c6f2d";
var requestedCity;


//Initialization
function init(){
    $("#enter-city").hide();
    cityToSearch.text = "";
    requestedCity = "";
}


// Event Listener for search button
 function setEventListeners(){
    btnSearch.on("click", function(){
        
    requestedCity = cityToSearch.val();
    // checking if NO city was entered
    if (requestedCity === null || requestedCity === ""){
        $("#enter-city").show();
        setTimeout(() => {
            $("#enter-city").hide();
        }, 4000);
    }else{
        retrieveWeather();
    }    
      })
}


async function retrieveWeather(){
        const apiCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?q={" + requestedCity + "}&appid={" + apiKey + "}";
        const api5DaysWeather = "https://api.openweathermap.org/data/2.5/forecast?q={" + requestedCity + "}&appid={" + apiKey + "}";
        console.log(api5DaysWeather);
        console.log(apiCurrentWeather);
        const getCurrentWeather = fetch(apiCurrentWeather);
    
}


// When document is ready, initialize functions
$(document).ready(function(){
    init();
    setEventListeners();
})


//  creatin HTML dinamically
// let html ="";
// for(index = 0; index < highscores.length; index++){
//     html += '<div> '+ highscores[index].name + " scored: " + highscores[index].score + '</div>'
// }
// highScore.innerHTML= html;
// highScore.style.display = "initial";



// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={APIKey} // <-- 5 days

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={APIKey} // <-- current 

