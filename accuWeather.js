const locationKey = 228603; // fill into location key
const baseUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`;
const apiKey = process.env.API_KEY; // fill into api key
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"];

let content = `
  <div class="card h-100">
      <div class="card-body">
          <h5 class="card-title">DAY <sup>MONTH MONTH_DAY</sup></h5>
          <img src="IMG_SRC" class="card-img-top" alt="">
          <h4 class="temperature-degree">MAX_T°/ MIN_T°T_UNIT</h4>

          <p class="card-text">ICON_PHRASE</p>
      </div>
      <div class="card-footer">

          <div>
            <img style="width:25px; height:25px" src="rainy.png" class="card-img-top" alt="">
            <small id="rain-proba" class="text-body-secondary">Chance of Rain: RAIN_PROBA %</small><br/>
          </div>

          <div>
            <img style="width:25px; height:25px" src="wind.png" class="card-img-top" alt="">
            <small class="text-body-secondary">Wind Speed: WIND_SPEED WIND_SPEED_UNIT</small>
          </div>
          
      </div>
  </div>
`;

getCityName = () => {
  fetch(
    `http://dataservice.accuweather.com/locations/v1/${locationKey}?apikey=${apiKey}&language=en-us&details=true`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.EnglishName);
    })
    .catch((error) => console.error("Error fetching data:", error));
};
getCityName();

getDailyForecastsStats = () => {
  fetch(`${baseUrl}?apikey=${apiKey}&language=en-us&details=true&metric=true`)
    .then((res) => res.json())
    .then((data) => {
      data.DailyForecasts.map((DF) => {
        const d = new Date(DF.Date);
        const month = months[d.getMonth()];
        console.log(`month: ${month}`);

        const monthDay = d.getDate();
        console.log(`month-day: ${monthDay}`);

        const day = days[d.getDay()];
        console.log(`day: ${day}`);

        const dailyForcastDay = DF.Day;
        const iconPhrase = dailyForcastDay.IconPhrase;
        console.log(`IconPhrase: ${iconPhrase}`);
        let imgSource = "";
        const snowPhrases = [
          "Snowy",
          "snowy",
          "snow",
          "snows",
          "snowstorm",
          "snowflake",
          "snowflakes",
        ];
        const stormPhrases = [
          "Stormy",
          "stormy",
          "storm",
          "storms",
          "tornado",
          "hurricane",
          "tempest",
          "typhoon",
        ];
        const rainPhrases = ["Rainy", "rainy", "rain", "rains", "rainstorm"];
        const cloudPhrases = ["Cloudy", "cloudy", "cloud", "clouds"];
        const sunPhrases = ["Sunny", "sunny", "sun"];
        switch (true) {
          case stringContainsArray(iconPhrase, snowPhrases):
            imgSource = "snowflake.png";
            break;
          case stringContainsArray(iconPhrase, stormPhrases):
            imgSource = "extreme-weather.png";
            break;
          case stringContainsArray(iconPhrase, rainPhrases):
            imgSource = "rainy.png";
            break;
          case stringContainsArray(iconPhrase, cloudPhrases):
            imgSource = "cloudy.png";
            break;
          case stringContainsArray(iconPhrase, sunPhrases):
            imgSource = "sun.png";
            break;
          default:
            imgSource = "rainy.png";
        }

        console.log(`Minimum Temperature: ${DF.Temperature.Minimum.Value}`);
        console.log(`Maximum Temperature: ${DF.Temperature.Maximum.Value}`);
        console.log(`Temperature Unit: ${DF.Temperature.Maximum.Unit}`);

        console.log(`IconPhrase: ${iconPhrase}`);

        const rainProbability = DF.Day.RainProbability;
        if (rainProbability > 0) {
          console.log(`RainProbability: ${rainProbability}`);
        }

        console.log(`Wind: ${dailyForcastDay.Wind.Speed.Value}`);
        console.log(`Wind Unit: ${dailyForcastDay.Wind.Speed.Unit}`);

        // =====================================================================

        let tempoBox = content.replace("DAY", day);
        tempoBox = tempoBox.replace("MONTH", month);
        tempoBox = tempoBox.replace("MONTH_DAY", monthDay);
        tempoBox = tempoBox.replace("IMG_SRC", imgSource);
        tempoBox = tempoBox.replace("MAX_T", DF.Temperature.Maximum.Value);
        tempoBox = tempoBox.replace("MIN_T", DF.Temperature.Minimum.Value);
        tempoBox = tempoBox.replace("T_UNIT", DF.Temperature.Maximum.Unit);
        tempoBox = tempoBox.replace("ICON_PHRASE", iconPhrase);
        tempoBox = tempoBox.replace("RAIN_PROBA", rainProbability);
        tempoBox = tempoBox.replace(
          "WIND_SPEED",
          dailyForcastDay.Wind.Speed.Value
        );
        tempoBox = tempoBox.replace(
          "WIND_SPEED_UNIT",
          dailyForcastDay.Wind.Speed.Unit
        );

        let forcastDay = document.createElement("div");
        forcastDay.className = "col"; // exist in bootstrap docs
        forcastDay.innerHTML = tempoBox;
        document.getElementById("data").appendChild(forcastDay);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
};
getDailyForecastsStats();

function stringContainsArray(inputString, arrayOfStrings) {
  return arrayOfStrings.some(substring => inputString.includes(substring));
}