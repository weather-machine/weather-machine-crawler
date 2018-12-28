// @ts-ignore
var http = require('http');
// @ts-ignore
var https = require('https');
// @ts-ignore
var request = require('request');
// @ts-ignore
var _ = require('lodash');
// @ts-ignore
var log4js = require('log4js');
log4js.configure({
    appenders: { info: { type: 'file', filename: 'crawler.log' } },
    categories: { default: { appenders: ['info'], level: 'info' } }
});
var logger = log4js.getLogger('cheese');
var minutes = 60000;
var config = {
    ip: '127.0.0.1',
    port: 1337,
    intervalDuration: 60 * minutes,
    backendCallsDelay: 50,
    restUrl: 'http://51.38.132.13:1339/',
    pages: [
        {
            name: 'openweathermap',
            protocol: 'http',
            isActive: true,
            currentWeatherUrls: {
                // byCity: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&q=#$%REPLACE%$#', // f.e. 'Warsaw'
                byCoordinates: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&#$%REPLACE%$#',
            },
            forecastUrls: {
                // byCity: 'http://api.openweathermap.org/data/2.5/forecast?appid=212e48f40836a854c1a266834563a0b5&q=#$%REPLACE%$#', // f.e. 'Warsaw'
                byCoordinates: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&#$%REPLACE%$#' // f.e.: lat=35&lon=139
            }
        },
        {
            name: 'darksky',
            protocol: 'https',
            isActive: true,
            currentWeatherUrls: {
                byCoordinates: 'https://api.darksky.net/forecast/204218e843ea261cb878ec13a243cd71/#$%REPLACE%$#'
            },
            forecastUrls: {
                byCoordinates: 'https://api.darksky.net/forecast/204218e843ea261cb878ec13a243cd71/#$%REPLACE%$#'
            }
        },
        {
            name: 'aerisapi',
            protocol: 'https',
            isActive: true,
            currentWeatherUrls: {
                byCoordinates: 'https://api.aerisapi.com/forecasts/#$%REPLACE%$#?from=today&to=+1day&limit=1&filter=daynight&client_id=pfDGPRSS5D3I6Ixo5bYNb&client_secret=IAIzVEk5GBolHBFk39CeIUPFlHXtr6WiZNFtxxuv'
            },
            forecastUrls: {
                byCoordinates: 'https://api.aerisapi.com/forecasts/#$%REPLACE%$#?from=today&to=+5day&limit=50&filter=daynight&client_id=pfDGPRSS5D3I6Ixo5bYNb&client_secret=IAIzVEk5GBolHBFk39CeIUPFlHXtr6WiZNFtxxuv'
            }
        },
        {
            name: 'worldweatheronline',
            protocol: 'http',
            isActive: true,
            currentWeatherUrls: {
                byCoordinates: 'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=8f53b968759f48c083f213632182510&q=#$%REPLACE%$#&num_of_days=1&tp=24&format=json&fbclid=IwAR3y3AkNyCm25KOmOl-NQPHdGMcnYceAQuEfBKK6nT-48wRh6wnA3UCEQvg'
            },
            forecastUrls: {
                byCoordinates: 'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=8f53b968759f48c083f213632182510&q=#$%REPLACE%$#&num_of_days=5&tp=1&format=json&fbclid=IwAR3y3AkNyCm25KOmOl-NQPHdGMcnYceAQuEfBKK6nT-48wRh6wnA3UCEQvg'
            }
        },
        {
            name: 'heredestinationweather',
            protocol: 'https',
            isActive: true,
            currentWeatherUrls: {
                byCity: 'https://weather.cit.api.here.com/weather/1.0/report.json?product=forecast_hourly&name=#$%REPLACE%$#&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg'
            },
            forecastUrls: {
                byCity: 'https://weather.cit.api.here.com/weather/1.0/report.json?product=forecast_hourly&name=#$%REPLACE%$#&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg'
            }
        }
    ]
};
var Weather = /** @class */ (function () {
    function Weather(uuid, date, placeId, weatherTypeId, windDirectionId, temperature, temperatureMax, temperatureMin, cloudCover, humidityPercent, pressureMb, windSpeed, isForecast) {
        this._uuid = uuid;
        this._date = date;
        this._placeId = placeId;
        this._weatherTypeId = weatherTypeId;
        this._windDirectionId = windDirectionId;
        this._temperature = temperature;
        this._temperatureMax = temperatureMax;
        this._temperatureMin = temperatureMin;
        this._cloudCover = cloudCover;
        this._humidityPercent = humidityPercent;
        this._pressureMb = pressureMb;
        this._windSpeed = windSpeed;
        this._isForecast = isForecast;
    }
    Object.defineProperty(Weather.prototype, "uuid", {
        get: function () {
            return this._uuid;
        },
        set: function (value) {
            this._uuid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (value) {
            this._date = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "placeId", {
        get: function () {
            return this._placeId;
        },
        set: function (value) {
            this._placeId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "weatherTypeId", {
        get: function () {
            return this._weatherTypeId;
        },
        set: function (value) {
            this._weatherTypeId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "windDirectionId", {
        get: function () {
            return this._windDirectionId;
        },
        set: function (value) {
            this._windDirectionId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "temperature", {
        get: function () {
            return this._temperature;
        },
        set: function (value) {
            this._temperature = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "temperatureMax", {
        get: function () {
            return this._temperatureMax;
        },
        set: function (value) {
            this._temperatureMax = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "temperatureMin", {
        get: function () {
            return this._temperatureMin;
        },
        set: function (value) {
            this._temperatureMin = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "cloudCover", {
        get: function () {
            return this._cloudCover;
        },
        set: function (value) {
            this._cloudCover = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "humidityPercent", {
        get: function () {
            return this._humidityPercent;
        },
        set: function (value) {
            this._humidityPercent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "pressureMb", {
        get: function () {
            return this._pressureMb;
        },
        set: function (value) {
            this._pressureMb = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "windSpeed", {
        get: function () {
            return this._windSpeed;
        },
        set: function (value) {
            this._windSpeed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Weather.prototype, "isForecast", {
        get: function () {
            return this._isForecast;
        },
        set: function (value) {
            this._isForecast = value;
        },
        enumerable: true,
        configurable: true
    });
    Weather.prototype.toJson = function () {
        var weatherType = getWeatherTypeById(this._weatherTypeId);
        return {
            PlaceId: this._placeId,
            Main: _.isNull(weatherType) ? null : weatherType.main,
            Desc: _.isNull(weatherType) ? null : weatherType.description,
            Wind_DirId: 1,
            Date: this._date,
            Temperature: this._temperature,
            Temperature_Max: this._temperatureMax,
            Temperature_Min: this._temperatureMin,
            Cloud_cover: this._cloudCover,
            Humidity_percent: this._humidityPercent,
            Pressure_mb: this._pressureMb,
            Wind_speed: this._windSpeed,
            IsForecast: this._isForecast
        };
    };
    return Weather;
}());
var Place = /** @class */ (function () {
    function Place(id, name, latitude, longitude, country) {
        this._id = id;
        this._name = name;
        this._latitude = latitude;
        this._longitude = longitude;
        this._country = country;
    }
    Object.defineProperty(Place.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Place.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Place.prototype, "latitude", {
        get: function () {
            return this._latitude;
        },
        set: function (value) {
            this._latitude = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Place.prototype, "longitude", {
        get: function () {
            return this._longitude;
        },
        set: function (value) {
            this._longitude = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Place.prototype, "country", {
        get: function () {
            return this._country;
        },
        set: function (value) {
            this._country = value;
        },
        enumerable: true,
        configurable: true
    });
    return Place;
}());
var WeatherType = /** @class */ (function () {
    function WeatherType(id, main, description) {
        this._id = id;
        this._main = main;
        this._description = description;
    }
    Object.defineProperty(WeatherType.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WeatherType.prototype, "main", {
        get: function () {
            return this._main;
        },
        set: function (value) {
            this._main = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WeatherType.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (value) {
            this._description = value;
        },
        enumerable: true,
        configurable: true
    });
    return WeatherType;
}());
var WindDirection;
(function (WindDirection) {
    WindDirection[WindDirection["N"] = 1] = "N";
    WindDirection[WindDirection["NNE"] = 2] = "NNE";
    WindDirection[WindDirection["NE"] = 3] = "NE";
    WindDirection[WindDirection["ENE"] = 4] = "ENE";
    WindDirection[WindDirection["E"] = 5] = "E";
    WindDirection[WindDirection["ESE"] = 6] = "ESE";
    WindDirection[WindDirection["SE"] = 7] = "SE";
    WindDirection[WindDirection["SSE"] = 8] = "SSE";
    WindDirection[WindDirection["S"] = 9] = "S";
    WindDirection[WindDirection["SSW"] = 10] = "SSW";
    WindDirection[WindDirection["SW"] = 11] = "SW";
    WindDirection[WindDirection["WSW"] = 12] = "WSW";
    WindDirection[WindDirection["W"] = 13] = "W";
    WindDirection[WindDirection["WNW"] = 14] = "WNW";
    WindDirection[WindDirection["NW"] = 15] = "NW";
    WindDirection[WindDirection["NNW"] = 16] = "NNW";
})(WindDirection || (WindDirection = {}));
function generateUuid() {
    var d = new Date().getTime();
    if (Date.now) {
        d = Date.now(); //high-precision timer
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
var places = [];
var weatherTypes = [];
var weathersQueue = [];
var weathersQueueToSave = [];
var isQueueManagingRemain = false;
function compare(otherArray) {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.value == current.value && other.display == current.display;
        }).length == 0;
    };
}
function initializePlaces(remotePlaces) {
    var diff = [];
    var _loop_1 = function (rp) {
        var index = _.findIndex(places, function (o) { return o._id === rp.Id; });
        if (index < 0
            && _.has(rp, 'Id')
            && _.has(rp, 'Name')
            && _.has(rp, 'Latitude')
            && _.has(rp, 'Longitude')
            && _.has(rp, 'Country')) {
            diff.push(new Place(rp.Id, rp.Name, rp.Latitude, rp.Longitude, rp.Country));
        }
    };
    for (var _i = 0, remotePlaces_1 = remotePlaces; _i < remotePlaces_1.length; _i++) {
        var rp = remotePlaces_1[_i];
        _loop_1(rp);
    }
    console.log(diff);
    for (var _a = 0, diff_1 = diff; _a < diff_1.length; _a++) {
        var p = diff_1[_a];
        places.push(p);
        gatherData(p);
    }
}
function getWeatherTypeId(main, description) {
    var weatherTypeId = -1;
    for (var _i = 0, weatherTypes_1 = weatherTypes; _i < weatherTypes_1.length; _i++) {
        var weatherType = weatherTypes_1[_i];
        if (weatherType.main === main && weatherType.description === description) {
            weatherTypeId = weatherType.id;
        }
    }
    if (weatherTypeId < 0) {
        weatherTypeId = weatherTypes.length < 1 ? 1 : _.maxBy(weatherTypes, '_id')._id + 1;
        weatherTypes.push(new WeatherType(weatherTypeId, main, description));
    }
    return weatherTypeId;
}
function getWeatherTypeById(id) {
    var result = null;
    for (var _i = 0, weatherTypes_2 = weatherTypes; _i < weatherTypes_2.length; _i++) {
        var weatherType = weatherTypes_2[_i];
        if (weatherType.id === id) {
            result = weatherType;
        }
    }
    return result;
}
function gatherData(specificPlace) {
    if (specificPlace === void 0) { specificPlace = null; }
    console.log('Crawling...');
    logger.info('Crawling...');
    if (specificPlace === null) {
        for (var _i = 0, _a = config.pages; _i < _a.length; _i++) {
            var page = _a[_i];
            if (page.isActive) {
                for (var _b = 0, places_1 = places; _b < places_1.length; _b++) {
                    var place = places_1[_b];
                    console.log('Page: ' + page.name, Date.now());
                    logger.info('Page: ' + page.name, Date.now());
                    getDataFromExternalApi(page, place, false);
                    getDataFromExternalApi(page, place, true);
                }
            }
        }
    }
    else {
        for (var _c = 0, _d = config.pages; _c < _d.length; _c++) {
            var page = _d[_c];
            if (page.isActive) {
                console.log('Page: ' + page.name, Date.now());
                logger.info('Page: ' + page.name, Date.now());
                getDataFromExternalApi(page, specificPlace, false);
                getDataFromExternalApi(page, specificPlace, true);
            }
        }
    }
}
function getDataFromExternalApi(page, place, isForecastNeeded) {
    var url = prepareUrl(page, _.has(page, 'currentWeatherUrls.byCity'), isForecastNeeded, place);
    var weather = null;
    var weathers = [];
    if (page.protocol === 'https') {
        https.get(url, function (res) {
            var data = '';
            console.log('request started', url);
            logger.info('request started', url);
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if (isForecastNeeded) {
                    weathers = initializeForecast(JSON.parse(data), page, place);
                    for (var w = 0; w < weathers.length; w++) {
                        if (!_.isNull(w)) {
                            addWeatherToQueue(weathers[w]);
                        }
                    }
                }
                else {
                    weather = initializeWeather(JSON.parse(data), page, place);
                    if (!_.isNull(weather)) {
                        addWeatherToQueue(weather);
                    }
                }
            });
            console.log('request success', url);
            logger.info('request success', url);
        }).on('error', function (error) {
            logger.info('request failed', url);
            logger.info('error with: ' + page + '\n' + error.message);
        });
    }
    else {
        http.get(url, function (res) {
            var data = '';
            console.log('request started', url);
            logger.info('request started', url);
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if (isForecastNeeded) {
                    for (var w = 0; w < weathers.length; w++) {
                        if (!_.isNull(w)) {
                            addWeatherToQueue(weathers[w]);
                        }
                    }
                }
                else {
                    weather = initializeWeather(JSON.parse(data), page, place);
                    if (!_.isNull(weather)) {
                        addWeatherToQueue(weather);
                    }
                }
            });
            console.log('request success', url);
            logger.info('request success', url);
        }).on('error', function (error) {
            logger.info('request failed', url);
            logger.info('error with: ' + page + '\n' + error.message);
        });
    }
}
function prepareUrl(page, cityMode, isForecastNeeded, place) {
    var url = '';
    var replacePrefix = '#$%REPLACE%$#';
    if (isForecastNeeded) {
        if (cityMode) {
            url = page.forecastUrls.byCity;
        }
        else {
            url = page.forecastUrls.byCoordinates;
        }
    }
    else {
        if (cityMode) {
            url = page.currentWeatherUrls.byCity;
        }
        else {
            url = page.currentWeatherUrls.byCoordinates;
        }
    }
    switch (page.name) {
        case 'openweathermap': {
            if (cityMode) {
                url = url.replace(replacePrefix, place.name);
            }
            else {
                url = url.replace(replacePrefix, 'lat=' + place.latitude + '&lon=' + place.longitude);
            }
            break;
        }
        case 'darksky': {
            url = url.replace(replacePrefix, place.latitude + ',' + place.longitude);
            break;
        }
        case 'aerisapi': {
            url = url.replace(replacePrefix, place.latitude + ',' + place.longitude);
            break;
        }
        case 'worldweatheronline': {
            url = url.replace(replacePrefix, place.latitude + ',' + place.longitude);
            break;
        }
        case 'heredestinationweather': {
            url = url.replace(replacePrefix, place.name);
            break;
        }
        default: {
            url = '';
        }
    }
    return url;
}
function initializeWeather(data, page, place) {
    var weather;
    var date = new Date();
    var dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    switch (page.name) {
        case 'openweathermap': {
            weather = getCurrentWeatherFromOpenWeatherMap(data, dateUTC, place);
            break;
        }
        case 'darksky': {
            weather = getCurrentWeatherFromDarkSky(data, dateUTC, place);
            break;
        }
        case 'aerisapi': {
            weather = getCurrentWeatherFromAerisApi(data, dateUTC, place);
            break;
        }
        case 'worldweatheronline': {
            weather = getCurrentWeatherFromWorldWeatherOnline(data, dateUTC, place);
            break;
        }
        case 'heredestinationweather': {
            weather = null;
            break;
        }
        default: {
            weather = null;
        }
    }
    logger.info(weather);
    return weather;
}
function initializeForecast(data, page, place) {
    var forecast = [];
    var date = new Date();
    var dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    switch (page.name) {
        case 'openweathermap': {
            forecast = getForecastFromOpenWeatherMap(data, dateUTC, place);
            break;
        }
        case 'darksky': {
            forecast = getForecastFromDarkSky(data, dateUTC, place);
            break;
        }
        case 'aerisapi': {
            forecast = getForecastFromAerisApi(data, dateUTC, place);
            break;
        }
        case 'worldweatheronline': {
            forecast = getForecastFromWorldWeatherOnline(data, dateUTC, place);
            break;
        }
        case 'heredestinationweather': {
            forecast = getForecastFromHereDestinationWeather(data, dateUTC, place);
            break;
        }
        default: {
            forecast = [];
        }
    }
    return forecast;
}
function getCurrentWeatherFromOpenWeatherMap(data, dateUTC, place) {
    return new Weather(generateUuid(), dateUTC, place.id, _.has(data, 'weather[0].main') && _.has(data, 'weather[0].description') ? getWeatherTypeId(data.weather[0].main, data.weather[0].description) : null, _.has(data, 'wind.deg') ? getWindDirectionFromDegrees(data.wind.deg) : null, _.has(data, 'main.temp') ? convertCalvinToCelsius(data.main.temp) : null, _.has(data, 'main.temp_max') ? convertCalvinToCelsius(data.main.temp_max) : null, _.has(data, 'main.temp_min') ? convertCalvinToCelsius(data.main.temp_min) : null, _.has(data, 'clouds.all') ? data.clouds.all : null, _.has(data, 'main.humidity') ? data.main.humidity : null, _.has(data, 'main.pressure') ? data.main.pressure : null, _.has(data, 'wind.speed') ? data.wind.speed : null, 0);
}
function getForecastFromOpenWeatherMap(data, dateUTC, place) {
    var forecast = [];
    if (_.has(data, 'list')) {
        for (var _i = 0, _a = data.list; _i < _a.length; _i++) {
            var item = _a[_i];
            var weather = new Weather(generateUuid(), _.has(item, 'dt') ? item.dt * 1000 : null, place.id, _.has(item, 'weather[0].main') && _.has(item, 'weather[0].description') ? getWeatherTypeId(item.weather[0].main, item.weather[0].description) : null, _.has(item, 'wind.deg') ? getWindDirectionFromDegrees(item.wind.deg) : null, _.has(item, 'main.temp') ? convertCalvinToCelsius(item.main.temp) : null, _.has(item, 'main.temp_max') ? convertCalvinToCelsius(item.main.temp_max) : null, _.has(item, 'main.temp_min') ? convertCalvinToCelsius(item.main.temp_min) : null, _.has(item, 'clouds.all') ? item.clouds.all : null, _.has(item, 'main.humidity') ? item.main.humidity : null, _.has(item, 'main.pressure') ? item.main.pressure : null, _.has(item, 'wind.speed') ? item.wind.speed : null, 1);
            forecast.push(weather);
            logger.info(weather);
        }
    }
    return forecast;
}
function getCurrentWeatherFromDarkSky(data, dateUTC, place) {
    return new Weather(generateUuid(), dateUTC, place.id, _.has(data, 'currently.summary') ? getWeatherTypeId(data.currently.summary, '') : null, null, _.has(data, 'currently.temperature') ? convertFahrenheitToCelsius(data.currently.temperature) : null, null, null, _.has(data, 'currently.cloudCover') ? data.currently.cloudCover * 100 : null, _.has(data, 'currently.humidity') ? data.currently.humidity * 100 : null, _.has(data, 'currently.pressure') ? data.currently.pressure : null, _.has(data, 'currently.windSpeed') ? convertMilesPerHourToMetersPerSecond(data.currently.windSpeed) : null, 0);
}
function getForecastFromDarkSky(data, dateUTC, place) {
    var forecast = [];
    if (_.has(data, 'hourly.data')) {
        for (var _i = 0, _a = data.hourly.data; _i < _a.length; _i++) {
            var item = _a[_i];
            var weather = new Weather(generateUuid(), _.has(item, 'time') ? item.time * 1000 : null, place.id, _.has(item, 'summary') ? getWeatherTypeId(item.summary, '') : null, null, _.has(item, 'temperature') ? convertFahrenheitToCelsius(item.temperature) : null, null, null, _.has(item, 'cloudCover') ? item.cloudCover * 100 : null, _.has(item, 'humidity') ? item.humidity * 100 : null, _.has(item, 'pressure') ? item.pressure : null, _.has(item, 'windSpeed') ? convertMilesPerHourToMetersPerSecond(item.windSpeed) : null, 1);
            forecast.push(weather);
            logger.info(weather);
        }
    }
    if (_.has(data, 'daily.data')) {
        for (var _b = 0, _c = data.daily.data; _b < _c.length; _b++) {
            var item = _c[_b];
            var weather = new Weather(generateUuid(), _.has(item, 'time') ? item.time * 1000 : null, place.id, _.has(item, 'summary') ? getWeatherTypeId(item.summary, '') : null, null, _.has(item, 'temperature') ? convertFahrenheitToCelsius(item.temperature) : null, null, null, _.has(item, 'cloudCover') ? item.cloudCover * 100 : null, _.has(item, 'humidity') ? item.humidity * 100 : null, _.has(item, 'pressure') ? item.pressure : null, _.has(item, 'windSpeed') ? convertMilesPerHourToMetersPerSecond(item.windSpeed) : null, 1);
            forecast.push(weather);
            logger.info(weather);
        }
    }
    return forecast;
}
function getCurrentWeatherFromAerisApi(data, dateUTC, place) {
    return new Weather(generateUuid(), dateUTC, place.id, _.has(data, 'response[0].periods[0].weatherPrimary') && _.has(data, 'response[0].periods[0].weather') ? getWeatherTypeId(data.response[0].periods[0].weatherPrimary, data.response[0].periods[0].weather) : null, _.has(data, 'response[0].periods[0].windDirDEG') ? getWindDirectionFromDegrees(data.response[0].periods[0].windDirDEG) : null, _.has(data, 'response[0].periods[0].avgTempC') ? data.response[0].periods[0].avgTempC : null, _.has(data, 'response[0].periods[0].minTempC') ? data.response[0].periods[0].minTempC : null, _.has(data, 'response[0].periods[0].maxTempC') ? data.response[0].periods[0].maxTempC : null, null, _.has(data, 'response[0].periods[0].humidity') ? data.response[0].periods[0].humidity : null, _.has(data, 'response[0].periods[0].pressureMB') ? data.response[0].periods[0].pressureMB : null, _.has(data, 'response[0].periods[0].windSpeedKPH') ? convertKilometersPerHourToMetersPerSecond(data.response[0].periods[0].windSpeedKPH) : null, 0);
}
function getForecastFromAerisApi(data, dateUTC, place) {
    var forecast = [];
    if (_.has(data, 'response[0].periods')) {
        for (var _i = 0, _a = data.response[0].periods; _i < _a.length; _i++) {
            var item = _a[_i];
            var weather = new Weather(generateUuid(), _.has(item, 'timestamp') ? item.timestamp * 1000 : null, place.id, _.has(item, 'weatherPrimary') && _.has(item, 'weather') ? getWeatherTypeId(item.weatherPrimary, item.weather) : null, _.has(item, 'windDirDEG') ? getWindDirectionFromDegrees(item.windDirDEG) : null, _.has(item, 'avgTempC') ? item.avgTempC : null, _.has(item, 'minTempC') ? item.minTempC : null, _.has(item, 'maxTempC') ? item.maxTempC : null, null, _.has(item, 'humidity') ? item.humidity : null, _.has(item, 'pressureMB') ? item.pressureMB : null, _.has(item, 'windSpeedKPH') ? convertKilometersPerHourToMetersPerSecond(item.windSpeedKPH) : null, 1);
            forecast.push(weather);
            logger.info(weather);
        }
    }
    return forecast;
}
function getCurrentWeatherFromWorldWeatherOnline(data, dateUTC, place) {
    return new Weather(generateUuid(), dateUTC, place.id, null, _.has(data, 'data.current_condition[0].winddirDegree') ? getWindDirectionFromDegrees(data.data.current_condition[0].winddirDegree) : null, _.has(data, 'data.current_condition[0].temp_C') ? +data.data.current_condition[0].temp_C : null, null, null, _.has(data, 'data.current_condition[0].cloudcover') ? +data.data.current_condition[0].cloudcover : null, _.has(data, 'data.current_condition[0].humidity') ? +data.data.current_condition[0].humidity : null, _.has(data, 'data.current_condition[0].pressure') ? +data.data.current_condition[0].pressure : null, _.has(data, 'data.current_condition[0].windspeedKmph') ? convertKilometersPerHourToMetersPerSecond(data.data.current_condition[0].windspeedKmph) : null, 0);
}
function getForecastFromWorldWeatherOnline(data, dateUTC, place) {
    var forecast = [];
    if (_.has(data, 'data.weather')) {
        var weatherArray = data.data.weather;
        var startDate = new Date(dateUTC);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setMilliseconds(0);
        startDate.setDate(startDate.getDate() + 1);
        for (var i = 1; i < weatherArray.length; i++) {
            if (_.has(weatherArray[i], 'hourly')) {
                for (var h = 0; h < weatherArray[i].hourly.length; h++) {
                    var weather = new Weather(generateUuid(), startDate.setHours(h), place.id, null, _.has(weatherArray[i].hourly[h], 'winddirDegree') ? getWindDirectionFromDegrees(weatherArray[i].hourly[h].winddirDegree) : null, _.has(weatherArray[i].hourly[h], 'tempC') ? +weatherArray[i].hourly[h].tempC : null, null, null, _.has(weatherArray[i].hourly[h], 'cloudcover') ? +weatherArray[i].hourly[h].cloudcover : null, _.has(weatherArray[i].hourly[h], 'humidity') ? +weatherArray[i].hourly[h].humidity : null, _.has(weatherArray[i].hourly[h], 'pressure') ? +weatherArray[i].hourly[h].pressure : null, _.has(weatherArray[i].hourly[h], 'windspeedKmph') ? convertKilometersPerHourToMetersPerSecond(weatherArray[i].hourly[h].windspeedKmph) : null, 1);
                    forecast.push(weather);
                    logger.info(weather);
                }
            }
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setMilliseconds(0);
            startDate.setDate(startDate.getDate() + 1);
        }
    }
    return forecast;
}
function getForecastFromHereDestinationWeather(data, dateUTC, place) {
    var forecast = [];
    if (_.has(data, 'hourlyForecasts.forecastLocation.forecast')) {
        for (var _i = 0, _a = data.hourlyForecasts.forecastLocation.forecast; _i < _a.length; _i++) {
            var item = _a[_i];
            var weather = new Weather(generateUuid(), _.has(item, 'utcTime') ? parseHereDestinationWeatherUtcDate(item.utcTime) : null, place.id, _.has(item, 'skyInfo') && _.has(item, 'description') ? getWeatherTypeId(getWeatherMainTypeFromHereDestinationWeather(item.skyInfo), item.description) : null, _.has(item, 'windDirection') ? getWindDirectionFromDegrees(item.windDirection) : null, _.has(item, 'temperature') ? +item.temperature : null, null, null, null, _.has(item, 'humidity') ? +item.humidity : null, null, _.has(item, 'windSpeed') ? convertKilometersPerHourToMetersPerSecond(item.windSpeed) : null, 1);
            forecast.push(weather);
            logger.info(weather);
        }
    }
    return forecast;
}
function roundToTwoDecimals(num) {
    return (Math.round(num * 100) / 100);
}
function convertCalvinToCelsius(temperature) {
    return roundToTwoDecimals(temperature - 273.15);
}
function convertFahrenheitToCelsius(temperature) {
    return roundToTwoDecimals((temperature - 32) / 1.8);
}
function convertMilesPerHourToMetersPerSecond(value) {
    return roundToTwoDecimals(value * 0.44704);
}
function convertKilometersPerHourToMetersPerSecond(value) {
    return roundToTwoDecimals(value / 3.6);
}
function parseHereDestinationWeatherUtcDate(date) {
    var splittedDate = _.split(date, 'T');
    var splittedDateDate = _.split(splittedDate[0], '-');
    var splittedDateTime = _.split(splittedDate[1], ':', 2);
    return +new Date(splittedDateDate[0], splittedDateDate[1] - 1, splittedDateDate[2], splittedDateTime[0], splittedDateTime[1], 0, 0);
}
function getWeatherMainTypeFromHereDestinationWeather(mainTypeCode) {
    var map = {
        1: 'Sunny',
        2: 'Clear',
        3: 'Mostly Sunny',
        4: 'Mostly Clear',
        5: 'Hazy Sunshine',
        6: 'Haze',
        7: 'Passing Clouds',
        8: 'More Sun than Clouds',
        9: 'Scattered Clouds',
        10: 'Partly Cloudy',
        11: 'A Mixture of Sun and Clouds',
        12: 'High Level Clouds',
        13: 'More Clouds than Sun',
        14: 'Partly Sunny',
        15: 'Broken Clouds',
        16: 'Mostly Cloudy',
        17: 'Cloudy',
        18: 'Overcast',
        19: 'Low Clouds',
        20: 'Light Fog',
        21: 'Fog',
        22: 'Dense Fog',
        23: 'Ice Fog',
        24: 'Sandstorm',
        25: 'Duststorm',
        26: 'Increasing Cloudiness',
        27: 'Decreasing Cloudiness',
        28: 'Clearing Skies',
        29: 'Breaks of Sun Later',
        30: 'Early Fog Followed by Sunny Skies',
        31: 'Afternoon Clouds',
        32: 'Morning Clouds',
        33: 'Smoke',
        34: 'Low Level Haze'
    };
    return map[mainTypeCode];
}
function getWindDirectionFromDegrees(degrees) {
    if (degrees >= 348.75 || degrees <= 11.25)
        return WindDirection.N;
    if (degrees > 11.25 && degrees < 33.75)
        return WindDirection.NNE;
    if (degrees >= 33.75 && degrees <= 56.25)
        return WindDirection.NE;
    if (degrees > 56.25 && degrees < 78.75)
        return WindDirection.ENE;
    if (degrees >= 78.75 && degrees <= 101.25)
        return WindDirection.E;
    if (degrees > 101.25 && degrees < 123.75)
        return WindDirection.ESE;
    if (degrees >= 123.75 && degrees <= 146.25)
        return WindDirection.SE;
    if (degrees > 146.25 && degrees < 168.75)
        return WindDirection.SSE;
    if (degrees >= 168.75 && degrees <= 191.25)
        return WindDirection.S;
    if (degrees > 191.25 && degrees < 213.75)
        return WindDirection.SSW;
    if (degrees >= 213.75 && degrees <= 236.25)
        return WindDirection.SW;
    if (degrees > 236.25 && degrees < 258.75)
        return WindDirection.WSW;
    if (degrees >= 258.75 && degrees <= 281.25)
        return WindDirection.W;
    if (degrees > 281.25 && degrees < 303.75)
        return WindDirection.WNW;
    if (degrees >= 303.75 && degrees <= 326.25)
        return WindDirection.NW;
    if (degrees > 326.25 && degrees < 348.75)
        return WindDirection.NNW;
}
function getPlaces() {
    var getPlacesUrl = config.restUrl + 'places';
    http.get(getPlacesUrl, function (res) {
        var data = '';
        console.log('request started', getPlacesUrl);
        logger.info('request started', getPlacesUrl);
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            initializePlaces(JSON.parse(data));
        });
        console.log('request success', getPlacesUrl);
        logger.info('request success', getPlacesUrl);
    }).on('error', function (error) {
        console.log('request failed', getPlacesUrl);
        console.log('error with: ' + getPlacesUrl + '\n' + error.message);
        logger.info('request failed', getPlacesUrl);
        logger.info('error with: ' + getPlacesUrl + '\n' + error.message);
    });
}
function addWeatherToQueue(weather) {
    weathersQueue.push(weather);
}
function manageWeatherQueue() {
    setInterval(function () {
        console.log('weathersQueueSize:', weathersQueue.length);
        if (!isQueueManagingRemain) {
            isQueueManagingRemain = true;
            weathersQueueToSave.length = 0;
            weathersQueueToSave = _.concat(weathersQueueToSave, weathersQueue);
            weathersQueueToSave = weathersQueueToSave.filter(function (el) {
                return el !== undefined;
            });
            if (weathersQueueToSave.length > 0) {
                var _loop_2 = function (i) {
                    if (weathersQueueToSave[i]) {
                        setTimeout(function () {
                            console.log('post', weathersQueueToSave[i].uuid);
                            postWeather(weathersQueueToSave[i]);
                            weathersQueue = weathersQueue.filter(function (weather) { return weather.uuid !== weathersQueueToSave[i].uuid; });
                            if (i === weathersQueueToSave.length - 1) {
                                weathersQueueToSave.length = 0;
                                isQueueManagingRemain = false;
                            }
                        }, config.backendCallsDelay * i);
                    }
                };
                for (var i = 0; i < weathersQueueToSave.length; i++) {
                    _loop_2(i);
                }
            }
            else {
                weathersQueueToSave.length = 0;
                isQueueManagingRemain = false;
            }
        }
    }, 2000);
}
function postWeather(weather) {
    if (weather) {
        request({
            url: config.restUrl + 'forecast',
            method: 'POST',
            json: true,
            body: weather.toJson()
        }, function (error, response, body) {
            if (response && _.has(response, 'statusCode')) {
                console.log(+new Date(), 'POST WEATHER', response.statusCode);
            }
        });
    }
}
http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');
logger.info('Server running at http://' + config.ip + ':' + config.port + '/');
manageWeatherQueue();
setInterval(getPlaces, 2000);
setInterval(gatherData, config.intervalDuration);
