$(document).ready(function() {
    let fiveDay = this.location.pathname.includes('five-day.html');

    function displayLocation(location){
        $('#location').text(`${location.city}, ${location.region}, ${location.countryCode}`);
    }

    function displayWeather(data){
        console.log(data.weather.dt_txt);
        // TODO DISPLAY VALUES AS A ROTATING BANNER AROUND SUN AND WEATHER ICONS
        // TODO WIND DIRECTION AS A SIMPLE COMPASS?
        let color;
        let direction;
        let source;
        // SELECT UV COLOR CODE
        switch(true){
            case data.uv.value < 3:
                color = '299500';
                break;
            case data.uv.value >=3 && data.uv.value < 6:
                color = 'F3E300';
                break;
            case data.uv.value >=6 && data.uv.value < 8:
                color = 'F85900';
                break;
            case data.uv.value >=8 && data.uv.value < 11:
                color = 'D80011';
                break;
            default:
                color = '6B49C8';
        }
        // SELECT WEATHER IMAGE
        switch (data.weather.weather[0].id) {
            // TODO RANGE OF CASES? OR REGEX MATCH
            //THUNDERSTORMS
            case 200: case 201: case 202: case 210: case 211: case 212: case 221: case 230: case 231: case 232:
                source = 'lightning.png';
                break;
            //RAIN & DRIZZLE
            case 300: case 301: case 302: case 310: case 311: case 312: case 313: case 314: case 321: case 500: case 501: case 502: case 503: case 504: case 511: case 520: case 521: case 522: case 531:
                source = 'rain.png';
                break;
            //SNOW
            case 600: case 601: case 602: case 611: case 612: case 615: case 616: case 620: case 621: case 622:
                source = 'snow.png';
                break;
            //ATMOSPHERE
            case 701: case 711: case 721: case 731: case 741: case 751: case 761: case 762: case 771: case 781:
                source = 'darkCloud.png';
                break;
            //CLOUDY
            case 801: case 802: case 803: case 804:
                source = 'cloud.png';
                break;
            //WINDY
            case 905: case 951: case 952: case 953: case 954: case 955: case 956:
                source = 'wind.png';
                break;
            //EXTREME
            case 900: case 901: case 902: case 903: case 904: case 906: case 957: case 958: case 959: case 960: case 961: case 962:
                source = 'tornado.png';
                break;
            //CLEAR SKY OR NON-CODED EVENT
            default:
                source = 'clear.png';
        }
        // SELECT WIND DIRECTION
        switch (true){
            case data.weather.wind.deg > 338 || data.weather.wind.deg <= 22:
                direction = 'N';
                break;
            case data.weather.wind.deg <= 67 || data.weather.wind.deg > 22:
                direction = 'NE';
                break;
            case data.weather.wind.deg <= 112 || data.weather.wind.deg > 67:
                direction = 'E';
                break;
            case data.weather.wind.deg <= 157 || data.weather.wind.deg > 112:
                direction = 'SE';
                break;
            case data.weather.wind.deg <= 202 || data.weather.wind.deg > 157:
                direction = 'S';
                break;
            case data.weather.wind.deg <= 247 || data.weather.wind.deg > 202:
                direction = 'SW';
                break;
            case data.weather.wind.deg <= 292 || data.weather.wind.deg > 247:
                direction = 'W';
                break;
            case data.weather.wind.deg <= 338 || data.weather.wind.deg > 292:
                direction = 'NW';
                break;
            default:
                direction = '';
        }
        // TODO MAIN VIEW WASN'T IN A CARD
        // <div class="tempBlock mdl-cell mdl-cell--4-col" title="Change measurement?"></div>
        // <div class="timeBlock mdl-cell mdl-cell--4-col">
        //     <div class="iconBlock mdl-cell mdl-cell--4-col"></div>
        // </div>

        $('.mdl-grid').append(
            `<div class="card-event mdl-card mdl-shadow--2dp">
                <div class="timeBlock" style="max-height: 80%;">
                    <div class="iconBlock">
                        <img src='images/weather/${source}' width='100%'/>
                    </div>
                </div>
                <div class="mdl-card__actions mdl-card--border">
                    <div class="tempBlock" title="Change measurement?">
                        <p>TEMP: 
                            ${Math.floor(data.weather.main.temp)}
                            ${String.fromCharCode(176)}
                            ${data.unit === 'imperial' ? 'F' : 'C'}    
                        </p>
                        <p>WINDSPEED: ${data.weather.wind.speed} M/h ${direction}</p>
                        <p>HUMIDITY: ${data.weather.main.humidity}%</p>
                        <p>UV INDEX: 
                            <span style='background-color:
                                #${color};'>   
                                ${Math.floor(data.uv.value)}
                            </span>
                        </p>
                        <p>CONDITION: ${data.weather.weather[0].description}</p>
                    </div>
                </div>
            </div>`
        )
    }

    function displayTimeOfDay(){
        let date = new Date();
        let myHour = (date.getUTCHours()) - (date.getTimezoneOffset() / 60);
        // SET SUN OR MOON BEHIND WEATHER
        if (5 <= myHour && myHour <= 18) {
            $(".timeBlock").append('<img src="images/weather/sun.jpg" width="100%" height="auto">');
            $("main").css("background-color", "#00BFFF");

        } else {
            $(".timeBlock").append('<img src="images/weather/moon.png" width="100%" height="auto">');
            $("main").css("background-color", "#000");
            // $("body").css("background", "url('images/stars.jpg') no-repeat center center fixed");
            // TODO NEW MOON IMAGE AND SET BACKGROUND AS STARS

        }
        // SET DATE IN HEADER
        $('#date').text(date.toDateString())
    }

// todo take unit, and location (if comes from search), and length of forcast 1 or 5 day
// todo aws key management to hide my key
    async function initialLoad(){      
        let key = 'adda7e0e1754a7e616e6eed694bcdf0e';
        let unit = 'imperial';
        // let url = ''

        let getLocation = async () => {
            return await $.getJSON("http://ip-api.com/json", response => response);
        }

        let getWeather = async () => {
            if(fiveDay){
                return await $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${key}`, response => response);
            }
            return await $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${key}`, response => response);
        }

        let getUV = async () => {
            if(this.location.pathname.includes('five-day.html')){
                return {};
            }
            return await $.getJSON(`http://api.openweathermap.org/data/2.5/uvi?lat=${location.lat}&lon=${location.lon}&appid=${key}`, response => response);
        }

        // LOCATION
        let location = await getLocation();
        // WEATHER
        let weather = {
            weather : await getWeather(),
            uv : await getUV(),
            unit : unit
        }
        // console.log(weather)
        if(fiveDay){
            let days = weather.weather.list.filter((forecast) => {
                // APPROXIMATING 5-DAY FORECAST WITH NOON FORECAST OF EACH DAY
                return forecast.dt_txt.includes('12:00:00') == true;
            })
           
            days.forEach((day => {
                let weather = {};
                weather.weather = day;
                weather.uv = {value: 0};

                displayWeather(weather);
            }))
        }else{
            displayWeather(weather);
            displayTimeOfDay();
        }
        displayLocation(location);
     }
  
    initialLoad()
})                                           