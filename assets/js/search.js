var userInput = "";
var apiKey = "1fa8f8c718d4c529efbc4c2173fb3060";
var baseURL = "https://api.openweathermap.org/data/2.5/weather?q="; //{city name}&appid={API key}
var requestUrl = baseURL + userInput + "&appid=" + apiKey;
var userSearch;
var now = moment();
var todayDate = now.format("YYYY-MM-DD");
var fifthDay = now.add(6, "days").format("YYYY-MM-DD");
var searchArray = JSON.parse(localStorage.getItem("search")) || [];

$(document).ready(function () {
  $(".searchcity").on("click", function (event) {
    event.preventDefault();
    if (!searchArray.includes($(".form-control").val())) {
      searchArray.push($(".form-control").val());
    }
    localStorage.setItem("search", JSON.stringify(searchArray));
    userSearch = JSON.parse(localStorage.getItem("search"));
    if (!$(".form-control").val()) {
      alert("Must input a city's name to continue");
    } else {
      clear();
      render(userSearch);
    }
  });
  for (let i = 0; i < searchArray.length; i++) {
    btnRender(searchArray[i]);
  }
});
function render(search) {
  requestUrl = baseURL + search + "&appid=" + apiKey;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var temp = (data.current.temp - 273.15) * 1.8 + 32;
          var F = Math.trunc(temp);
          var wind = data.current.wind_speed;
          var humid = data.current.humidity;
          var UVI = data.current.uvi;
          var today = $(".daily");
          var searchList = $(".prevCities");
          var fiveDay = $(".forecast-cards");
          var list = $(".list-group");
          var bigCard = `
              <div class="card city-day border-dark">
                ${search}(${todayDate})
                <img src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png">
                
                  Temp: ${F}
                  Wind: ${wind}
                  Humidity: ${humid}
                  UV Index: ${UVI}
              </div>`;
          data.daily.forEach((day) => {
            var currentDay = moment.unix(day.dt).format("YYYY-MM-DD");
            if (moment(currentDay).isBetween(todayDate, fifthDay)) {
              var dayTemp = (day.temp.day - 273.15) * 1.8 + 32;
              var dayF = Math.trunc(dayTemp);
              console.log(dayF, dayTemp);
              var card = `
                  <div class="card per-day"> 
                  ${currentDay}
                  <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png">
                    Temp:${dayF} F
                    Wind:${day.wind_gust} MPH 
                    Humidity:${day.humidity} %
                  </div>`;
              fiveDay.append(card);
            }
          });
          if (!searchArray.includes(search)) {
            var prevSearch = btnRender(search);
            searchList.append(prevSearch);
          }
          today.append(bigCard);
        });
    });
}

function btnRender(search) {
  return ` <div class="col">
  <button class="btn prevBtn" type="submit" id="prevBtn" onclick="newSearch('${search}')">${search}</button>
          </div>`;
}

function newSearch(city) {
  clear();
  render(city);
}

function clear() {
  $(".daily").empty();
  $(".forecast-cards").empty();
  $("list-group list-group-flush").empty();
}
