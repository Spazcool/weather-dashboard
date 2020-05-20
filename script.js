$(document).ready(function() {
    let visited = JSON.parse(localStorage.getItem('previousSearches'));
    visited ? loadData(visited[visited.length - 1].term) : loadData();
});

let fiveDay = this.location.pathname.includes('five-day.html');

function displayLocation(location){
    $('#location').text(`${location.city}, ${location.region}, ${location.countryCode}`);
}

function displayPreviousSearches(){
    let searches = localStorage.getItem('previousSearches') ? JSON.parse(localStorage.getItem('previousSearches')) : '';
    if(searches.length){
        $('.previous').remove();
        $('#clear').remove();

        searches.forEach(search => {
            $('.sidePanel').append(`<button class="mdl-navigation__link mdl-button previous" style="padding-bottom: 3em;" data-key=${search.key}>${search.term}</button>`)
        })
        $('.sidePanel').append(`<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" id="clear"">Clear Previous</button>`)
       
        $('button[data-key]').on('click', function(e){
            e.preventDefault();
            let key = $(this).attr('data-key');
            let choice = searches.filter(search => search.key == key)[0].term;
            loadData(choice)
        });

        $('#clear').on('click', ()=> {
           localStorage.removeItem('previousSearches');
           $('.previous').remove();
           $('#clear').remove();
        });
    }  
}

function displayWeather(data){
    let date = moment(data.weather.dt_txt).format('LL');
    let dayOfWeek = moment(data.weather.dt_txt).format('dddd');

// TODO WIND DIRECTION AS A SIMPLE COMPASS?
    let card;
    let color;
    let description = (data.weather.weather[0].description); 
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
        // case RegExp(/80[0-9]/):
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
        case data.weather.wind.deg > 338 && data.weather.wind.deg <= 22:
            direction = 'N';
            break;
        case data.weather.wind.deg <= 67 && data.weather.wind.deg > 22:
            direction = 'NE';
            break;
        case data.weather.wind.deg <= 112 && data.weather.wind.deg > 67:
            direction = 'E';
            break;
        case data.weather.wind.deg <= 157 && data.weather.wind.deg > 112:
            direction = 'SE';
            break;
        case data.weather.wind.deg <= 202 && data.weather.wind.deg > 157:
            direction = 'S';
            break;
        case data.weather.wind.deg <= 247 && data.weather.wind.deg > 202:
            direction = 'SW';
            break;
        case data.weather.wind.deg <= 292 && data.weather.wind.deg > 247:
            direction = 'W';
            break;
        case data.weather.wind.deg <= 338 && data.weather.wind.deg > 292:
            direction = 'NW';
            break;
        default:
            direction = '';
    }

    if(fiveDay){
        card = 
            `<div class="card-event mdl-card mdl-shadow--2dp mdl-cell mdl-cell--2-col mdl-cell--12-col-phone" style="border-radius: 5px">
                <div class="timeBlock mdl-cell mdl-cell--12-col mdl-cell--12-col-phone" style="max-height: 80%;">
                    <h4 style='position: absolute; margin-top: 2px; width: 100%; text-align: right;' title=${data.unit === 'imperial' ? 'Farenheit' : 'Celcius'}>
                        ${Math.floor(data.weather.main.temp)}
                        ${String.fromCharCode(176)}
                    </h4>
                    <div class="iconBlock">
                        <img src='images/weather/${source}' width='100%' />
                    </div>
                </div>
                <div class="mdl-card__actions mdl-card--border center-items">
                    <div class="tempBlock">
                        <h5>${dayOfWeek}, ${date}</h5>
                        <hr/>
                        <ul>
                            <li>${description[0].toUpperCase() + description.slice(1)}</li>
                            <li>Wind: ${data.weather.wind.speed} mph ${direction}</li>
                            <li>Humidity: ${data.weather.main.humidity}%</li>
                        </ul>                        
                    </div>
                </div>
            </div>`
    }else{
        card =
            `<div class="card-event mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-phone">
                <div class="mdl-grid" style=" width: 100%;">
                    <div class="mdl-cell mdl-cell--3-col mdl-cell--12-col-phone"></div>
                    <div class="mdl-cell mdl-cell--6-col mdl-cell--12-col-phone">
                        <div class="timeBlock" style="max-height: 80%; width: 100%;">
                            <h2 style='position: absolute; margin-top: 2px; width: 100%; text-align: right;' title=${data.unit === 'imperial' ? 'Farenheit' : 'Celcius'}>
                                ${Math.floor(data.weather.main.temp)}
                                ${String.fromCharCode(176)}         
                            </h2>
                            <div class="iconBlock">
                                <img src='images/weather/${source}' width='100%' />
                            </div>
                        </div>
                    </div>
                    <div class='mdl-cell mdl-cell--3-col mdl-cell--12-col-phone'>
                        <div class="tempBlock spotlight">
                            <h3>${dayOfWeek}, ${date}</h3>
                            <hr/>
                            <ul>
                                <li>${description[0].toUpperCase() + description.slice(1)}</li>
                                <li>Wind: ${Math.floor(data.weather.wind.speed)} mph ${direction}</li>
                                <li>Humidity: ${data.weather.main.humidity}%</li>
                                <li>UV Index: 
                                    <span id='uvIndex' style='background-color:
                                        #${color};'>   
                                        ${Math.floor(data.uv.value)}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>`
    }

    $('.blocks').append(card) 
}
// TODO GET TIME OF DAY OF SEARCHED CITY TO CHANGE SUN OR MOON
function displayTimeOfDay(){
    let date = new Date();
    let myHour = (date.getUTCHours()) - (date.getTimezoneOffset() / 60);
    // SET SUN OR MOON BEHIND WEATHER
    if (5 <= myHour && myHour <= 18 || fiveDay) {
        $(".timeBlock").append('<img src="images/weather/sun.jpg" width="100%" height="auto"/>');
        $('.card-event').css('background-color', '#00BFFF');
    } else {
        $(".timeBlock").append('<img src="images/weather/moon.png" width="100%" height="auto"/>');
        $(".card-event").css("background-color", "#000");
        // $("body").css("background", "url('images/stars.jpg') no-repeat center center fixed");
// TODO NEW MOON IMAGE AND SET BACKGROUND AS STARS
    }
    // SET DATE IN HEADER
    fiveDay ? '' : $('#date').text(date.toDateString());
}
// TODO BUFFALO RETURNS UNDEFINED CITY NAME, WHY
// TODO IF UNDEFINED DON'T SHOW THAT WORD, SHOW NOTHING
async function loadData(search){
    let weatherKey = 'adda7e0e1754a7e616e6eed694bcdf0e';
    let locationKey = 'ykYwGNDs8r4jibep0lLE9rmnquq5h5l7';
    let unit = 'imperial';
    let location;

    let getLocation = async (search) => {
        if(search){
            // HARDCODED MCDONALDS, AS THE API LIKES TO HAVE THAT EXTRA PARAM IN FRONT OF CITY, ALSO I MIGHT HAVE BEEN HUNGRY
            // HARDCODED TO US, BETTER RESULTS WERE PROVIDED WITH THAT ADDIOTNAL PARAM AND THE EXPECTED USERS WILL ALL HAIL FROM THERE
            return await $.getJSON(`https://api.tomtom.com/search/2/geocode/mcdonalds%2C%20${search}.json?countrySet=US&key=${locationKey}`, 
                (response) => {return response})
                .then((data) => {
                    if(data.results){
                        let obj = {
                            countryCode : data.results[0].address.countryCode,
                            region : data.results[0].address.countrySubdivision,
                            city : data.results[0].address.municipality,
                            lat : data.results[0].position.lat,
                            lon : data.results[0].position.lon
                        }
                        return obj;
                    }
                    // TODO how do error handling? SEARCH FOR aaaaa returns an empty array
                });
        }
        
        return await $.getJSON("https://ipinfo.io?token=5fcea70b36eb66", response => response);
    }

    let getWeather = async () => {
        if(fiveDay){
            return await $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${weatherKey}`, response => response);
        }
        return await $.getJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=${unit}&appid=${weatherKey}`, response => response);
    }

    let getUV = async () => {
        if(this.location.pathname.includes('five-day.html')){
            return {};
        }
        return await $.getJSON(`http://api.openweathermap.org/data/2.5/uvi?lat=${location.lat}&lon=${location.lon}&appid=${weatherKey}`, response => response);
    }

    location = await getLocation(search ? search : '');

    // WEATHER
    let weather = {
        weather : await getWeather(),
        uv : search ? {value : 0} : await getUV(),
        unit : unit
    }
    // RESET VIEW BEFORE LOADING NEW VIEW
    $('.blocks').html('')

    if(fiveDay){
        let days = weather.weather.list.filter((forecast) => {
            // APPROXIMATING 5-DAY FORECAST WITH NOON FORECAST OF EACH DAY
            return forecast.dt_txt.includes('12:00:00') == true;
        })
        
        days.forEach((day => {
            let weather = {
                weather : day,
                uv : {value: 0},
                unit : unit
            }
            displayWeather(weather);
        }))
    }else{
        displayWeather(weather);
    }

    displayTimeOfDay();
    displayLocation(location);
    displayPreviousSearches()
}

function alreadyExists(term){ 
    let list = JSON.parse(localStorage.getItem('previousSearches'));
    let bool = false;
    list.forEach((item) => {
        if(Object.values(item)[1] === term){
            bool = true;
        }
    });
    return bool;
}

function pushToSearchList(term){
    let key = new Date().getTime();
    let saved = localStorage.getItem('previousSearches') ? JSON.parse(localStorage.getItem('previousSearches')) : [];
    if(saved.length){
        if(!alreadyExists(term)){
            if(saved.length > 4){ saved.shift(); } // ONLY STORE FIVE PREVIOUS SEARCHES
            saved.push({key : key, term : term});
            localStorage.setItem('previousSearches', JSON.stringify(saved));
        }
    }else{
        let obj = {key : key, term : term};
        localStorage.setItem('previousSearches', JSON.stringify([obj]))
    }
}

$('#search').on('click', (e) => {
    e.preventDefault();
    let term = $('#cityToSearch');
    if(term.val().length){
        loadData(term.val());
        pushToSearchList(term.val());
        term.val('');
    }
})
                                          
