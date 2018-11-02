// @ts-ignore
var http = require('http');
// @ts-ignore
var _ = require('lodash');
var config = {
    ip: '127.0.0.1',
    port: 1337,
    intervalDuration: 2000,
    pages: [
        {
            name: 'openweathermap',
            url: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&q='
        }
    ]
};
var Weather = /** @class */ (function () {
    function Weather(date, placeId, weatherTypeId, windDirectionId, temperature, temperatureMax, temperatureMin, skyDescription, humidityPercent, pressureMb, windSpeed, isForecast) {
        this._date = date;
        this._placeId = placeId;
        this._weatherTypeId = weatherTypeId;
        this._windDirectionId = windDirectionId;
        this._temperature = temperature;
        this._temperatureMax = temperatureMax;
        this._temperatureMin = temperatureMin;
        this._skyDescription = skyDescription;
        this._humidityPercent = humidityPercent;
        this._pressureMb = pressureMb;
        this._windSpeed = windSpeed;
        this._isForecast = isForecast;
    }
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
    Object.defineProperty(Weather.prototype, "skyDescription", {
        get: function () {
            return this._skyDescription;
        },
        set: function (value) {
            this._skyDescription = value;
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
var weatherType = /** @class */ (function () {
    function weatherType(id, main, description) {
        this._id = id;
        this._main = main;
        this._description = description;
    }
    Object.defineProperty(weatherType.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(weatherType.prototype, "main", {
        get: function () {
            return this._main;
        },
        set: function (value) {
            this._main = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(weatherType.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (value) {
            this._description = value;
        },
        enumerable: true,
        configurable: true
    });
    return weatherType;
}());
var windDirection;
(function (windDirection) {
    windDirection["N"] = "N";
    windDirection["E"] = "E";
    windDirection["S"] = "S";
    windDirection["W"] = "W";
    windDirection["NE"] = "NE";
    windDirection["NW"] = "NW";
    windDirection["SE"] = "SE";
    windDirection["SW"] = "SW";
})(windDirection || (windDirection = {}));
var weathers = [];
var places = [];
function initializePlaces() {
    var place = new Place(1, 'London', 0, 0, 'uk');
    places.push(place);
}
function gatherData() {
    var _loop_1 = function (page) {
        for (var _i = 0, places_1 = places; _i < places_1.length; _i++) {
            var place = places_1[_i];
            http.get(page.url + place.name, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    weathers.push(initializeWeather(JSON.parse(data), page));
                    console.log(weathers);
                });
            }).on('error', function (error) {
                console.log('error with: ' + page + '\n' + error.message);
            });
        }
    };
    for (var _i = 0, _a = config.pages; _i < _a.length; _i++) {
        var page = _a[_i];
        _loop_1(page);
    }
}
function initializeWeather(data, page) {
    var date = new Date();
    var dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return new Weather(dateUTC, 1, 1, 1, _.has(data, 'main.temp') ? convertToCelsius(data.main.temp) : null, _.has(data, 'main.temp_max') ? convertToCelsius(data.main.temp_max) : null, _.has(data, 'main.temp_min') ? convertToCelsius(data.main.temp_min) : null, 'it will be find :D', _.has(data, 'main.humidity') ? data.main.humidity : null, _.has(data, 'main.pressure') ? data.main.pressure : null, _.has(data, 'wind.speed') ? data.wind.speed : null, 0);
}
function convertToCelsius(temperature) {
    return (temperature - 273.15);
}
http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');
initializePlaces();
setInterval(gatherData, config.intervalDuration);
