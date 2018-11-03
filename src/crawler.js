// @ts-ignore
var http = require('http');
// @ts-ignore
var https = require('https');
// @ts-ignore
var _ = require('lodash');
// @ts-ignore
var log4js = require('log4js');
log4js.configure({
    appenders: { info: { type: 'file', filename: 'crawler.log' } },
    categories: { default: { appenders: ['info'], level: 'info' } }
});
var logger = log4js.getLogger('cheese');
var config = {
    ip: '127.0.0.1',
    port: 1337,
    intervalDuration: 10000,
    pages: [
        {
            name: 'openweathermap',
            protocol: 'http',
            isActive: false,
            currentWeatherUrls: {
                byCity: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&q=#$%REPLACE%$#',
                byCoordinates: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&#$%REPLACE%$#',
            },
            forecastUrls: {
                byCity: 'http://api.openweathermap.org/data/2.5/forecast?appid=212e48f40836a854c1a266834563a0b5&q=#$%REPLACE%$#',
                byCoordinates: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&#$%REPLACE%$#' // f.e.: lat=35&lon=139
            }
        },
        {
            name: 'darksky',
            protocol: 'https',
            isActive: false,
            currentWeatherUrls: {
                byCoordinates: 'https://api.darksky.net/forecast/204218e843ea261cb878ec13a243cd71/#$%REPLACE%$#'
            },
            forecastUrls: {
                byCoordinates: 'https://api.darksky.net/forecast/204218e843ea261cb878ec13a243cd71/#$%REPLACE%$#'
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
var weathers = [];
var places = [];
var weatherTypes = [];
function initializePlaces() {
    places.push(new Place(1, 'London', 51.5100, -0.1300, 'uk'));
    places.push(new Place(2, 'Warsaw', 52.2300, 21.0100, 'pl'));
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
function gatherData() {
    for (var _i = 0, _a = config.pages; _i < _a.length; _i++) {
        var page = _a[_i];
        if (page.isActive) {
            for (var _b = 0, places_1 = places; _b < places_1.length; _b++) {
                var place = places_1[_b];
                getDataFromExternalApi(page, place, false);
                getDataFromExternalApi(page, place, true);
            }
        }
    }
}
function getDataFromExternalApi(page, place, isForecastNeeded) {
    var url = prepareUrl(page, _.has(page, 'currentWeatherUrls.byCity'), isForecastNeeded, place);
    if (page.protocol === 'https') {
        https.get(url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if (isForecastNeeded) {
                    weathers = weathers.concat(initializeForecast(JSON.parse(data), page, place));
                }
                else {
                    weathers.push(initializeWeather(JSON.parse(data), page, place));
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
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if (isForecastNeeded) {
                    weathers = weathers.concat(initializeForecast(JSON.parse(data), page, place));
                }
                else {
                    weathers.push(initializeWeather(JSON.parse(data), page, place));
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
http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');
logger.info('Server running at http://' + config.ip + ':' + config.port + '/');
initializePlaces();
setInterval(gatherData, config.intervalDuration);
