
// Trigger search action

$(".search-button").click(function(){
    $(".city-name").remove();
    cleanData()
    $(".container").attr("id", "");
    let countryName = document.getElementById("city-name").value;
    fetchCountryCode(countryName)
    // fetchWeather(cityName)
    
});
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        let countryName = document.getElementById("city-name").value;
        fetchCountryCode(countryName)

    }
});


async function fetchCountryCode(country) {
    try {
        const resCodes = await fetch('http://api.geonames.org/searchJSON?username=abbra&cities1000&q=' + country)
    let codes = await resCodes.json();
    let country2Dig = codes.geonames[0].countryCode
    fetchCities(country2Dig)
    } catch(error) {
        alert("Country not found");
        }
}
async function fetchCities(code) {
    let cityList = []
    try {
        const resCity = await fetch('http://api.geonames.org/searchJSON?username=abbra&cities1000&country=' + code)
    let cities = await resCity.json();
    for (let i = 0; i < 100; i++) {
        let cityFilter = cities.geonames[i].fclName
        if (cityFilter.includes("city")) {
            cityList.push(cities.geonames[i].name)
            let cityName = cities.geonames[i].name
            $("#autocomplete-cities").append("<button class='city-name' id=" + cityName.replace(/\s+/g, '-') + ">" + cityName + "</button><hr>");
        }
    }
    $(".city-name").click(function(){
        $("hr").remove();
        let chosenCity = $(this).html();
        $(".city-name").remove();
        fetchWeather(chosenCity)
    });
    }  catch(error) {
        alert("Country not found");
    }  
} 
// getting weather information
async function fetchWeather(city) {
    $("hr").remove();
    try {
        const resWeather = await fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&appid=317b20a3a5f68a8b4015c5d262d33152&q=' + city)
        let data = await resWeather.json();  
    let weatherIcon = data.weather[0].icon
    let weatherDescription = data.weather[0].description
    $('img').attr('src', "https://openweathermap.org/img/wn/" + weatherIcon + "@4x.png");
    $('img').attr('alt', weatherDescription);
    $('img').attr("id", "weather");
    let dateToday = new Date(data.dt * 1000).toLocaleDateString("en-GB")
    let currentTime = new Date((data.dt + data.timezone -7200) * 1000).toLocaleTimeString(
        'en-US', {
            hour12: false,
            hour: '2-digit', 
            minute: '2-digit'
      })
    let sunrise = new Date((data.sys.sunrise + data.timezone -7200) * 1000).toLocaleTimeString(
        'en-US', {
            hour12: false,
            hour: '2-digit', 
            minute: '2-digit'
      })
    let sunset = new Date((data.sys.sunset + data.timezone -7200) * 1000).toLocaleTimeString(
        'en-US', {
            hour12: false,
            hour: '2-digit', 
            minute: '2-digit'
    })
    if (currentTime > sunrise && currentTime < sunset) {
        if (weatherIcon[1] > 3 || weatherIcon[0] > 0) {
            $(".container").attr("id", "winter-day");
        } else {
            $(".container").attr("id", "day");
        }   
    }   else {
        if (weatherIcon[1] > 3 || weatherIcon[0] > 0) {
            $(".container").attr("id", "winter-night");
        } else {
            $(".container").attr("id", "night");
        }      
    }



    $(".city").html(city + ", " + data.sys.country);
    $(".time").html(currentTime);
    $(".date").html(dateToday);
    $("h1").html(Math.round(data.main.temp) + "°");
    $(".description").html(data.weather[0].main);
    $(".min-max").html("↑" + Math.round(data.main.temp_max) + "°" + "   ↓" + Math.round(data.main.temp_min) + "°");
    $(".sun").html("🔆 " + sunrise + "<br/>🌙 " + sunset);
    $(".humidity").html("💧 " + data.main.humidity + "%");
    $(".feels-like").html("🌡️ " + Math.round(data.main.feels_like) + "°");
    } catch(error) {
    alert("City not found");
    }
}

function cleanData() {
    $(".city").html("");
    $(".time").html("");
    $(".date").html("");
    $("h1").html("");
    $(".description").html("");
    $(".min-max").html("");
    $(".sun").html("");
    $(".humidity").html("");
    $(".feels-like").html("");
    $('img').attr('src', "");
    $('img').attr('alt', "");
    $('img').attr("id", "");
}
