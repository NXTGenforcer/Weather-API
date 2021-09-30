var userInput = "";
var apiKey = "1fa8f8c718d4c529efbc4c2173fb3060";
var baseURL = "https://api.openweathermap.org/data/2.5/weather?q="; //{city name}&appid={API key}
var city = "Nashville";
var requestUrl = baseURL + userInput + "&appid=" + apiKey;

$(document).ready(function () {
  $(".btn").on("click", function (event) {
    event.preventDefault();
    userInput = $(".form-control").val();
    console.log(userInput);
    localStorage.setItem("Search", JSON.stringify(userInput));
    if (!userInput) {
      alert("Must input a city's name to continue");
    }
    // // else {
    //   location.replace("results.html");
    // }
    var requestUrl = baseURL + userInput + "&appid=" + apiKey;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  });
});
