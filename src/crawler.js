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
            url: 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=212e48f40836a854c1a266834563a0b5'
        },
        {
            url: 'http://api.openweathermap.org/data/2.5/weather?q=Warsaw,pl&appid=212e48f40836a854c1a266834563a0b5'
        },
        {
            url: 'http://api.openweathermap.org/data/2.5/weather?q=Wroclaw,pl&appid=212e48f40836a854c1a266834563a0b5'
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
http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');
var weather = new Weather(1541168536046, 10, 103, 34, 35.5, 32.0, 36.6, 'It will be funny', 37.1, 1003.5, 5.5, 0);
// function gatherData() {
//     for (let page of config.pages) {
//         http.get(page.url, function(res) {
//             let data: string = '';
//             res.on('data', function(chunk) {
//                 data += chunk;
//             });
//             res.on('end', function() {
//                 prepareData(data, page);
//             });
//         }).on('error', function(error) {
//             console.log('error with: ' + page + '\n' + error.message);
//         });
//     }
// } setInterval(gatherData, config.intervalDuration);
//
// function prepareData(data: string, page: any) {
//     let parsedData: any = JSON.parse(data);
//     if (_.has(parsedData, 'main.temp')) {
//         console.log(_.now() + ' ' + page.city + ': ' + convertToCelsius(parsedData.main.temp) + ' Celsius');
//     }
// }
//
// function convertToCelsius(temperature: number) {
//     return (temperature - 273.15).toFixed(2);
// }
