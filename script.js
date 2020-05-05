$(document).ready(function() {

    function displayLocation(location){
        $('#location').text(`${location.city}, ${location.region}, ${location.countryCode}`);
    }

    function displayWeather(data){
        // TODO DISPLAY VALUES AS A ROTATING BANNER AROUND SUN AND WEATHER ICONS
        // TODO WIND DIRECTION AS A SIMPLE COMPASS?
        let source;
        let direction;
        // SELECT WEATHER IMAGE
        switch (data.weather.weather[0].id) {
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
                source = 'extreme.png';
                break;
            //CLEAR SKY OR NON-CODED EVENT
            default:
                // todo friendly image here
                source = '';
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

        $('.iconBlock').append(`<img src='images/weather/${source}' width='100%'/>`);
        $('.tempBlock').append(
            `<div>
                <p>TEMP: 
                    ${Math.floor(data.weather.main.temp)}
                    ${String.fromCharCode(176)}
                    ${data.unit === 'imperial' ? 'F' : 'C'}    
                </p>
                <p>WINDSPEED: ${data.weather.wind.speed} M/h ${direction}</p>
                <p>WIND DIRECTION: ${data.weather.wind.deg}</p>
                <p>HUMIDITY: ${data.weather.main.humidity}%</p>
                <p>UV INDEX: ${Math.floor(data.uv.value)}</p>
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
            $("main").css("background-color", "#00BFFF");
        }
        // SET DATE IN HEADER
        $('#date').text(date.toDateString())
    }

// todo take unit, and location (if comes from search), and length of forcast 1 or 5 day
    async function initialLoad(){
        let key = 'adda7e0e1754a7e616e6eed694bcdf0e';
        let unit = 'imperial';

        let getLocation = async () => {
            return await $.getJSON("http://ip-api.com/json", response => response);
        }

        let getWeather = async () => {
            return await $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${key}`, response => response);
        }

        let getUV = async () => {
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
      
        displayWeather(weather);
        displayLocation(location);
        displayTimeOfDay();
     }
  
    initialLoad()
})

 