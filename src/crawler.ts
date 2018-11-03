// @ts-ignore
let http = require('http');
// @ts-ignore
let https = require('https');
// @ts-ignore
let _ = require('lodash');
// @ts-ignore
let log4js = require('log4js');

log4js.configure({
    appenders: { info: { type: 'file', filename: 'crawler.log' } },
    categories: { default: { appenders: ['info'], level: 'info' } }
});

const logger = log4js.getLogger('cheese');

const config = {
    ip: '127.0.0.1',
    port: 1337,
    intervalDuration: 10000,
    pages: [
        {
            name: 'openweathermap',
            protocol: 'http',
            isActive: true,
            currentWeatherUrls: {
                byCity: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&q=#$%REPLACE%$#', // f.e. 'Warsaw'
                byCoordinates: 'http://api.openweathermap.org/data/2.5/weather?appid=212e48f40836a854c1a266834563a0b5&#$%REPLACE%$#', // f.e.: lat=35&lon=139
            },
            forecastUrls: {
                byCity: 'http://api.openweathermap.org/data/2.5/forecast?appid=212e48f40836a854c1a266834563a0b5&q=#$%REPLACE%$#', // f.e. 'Warsaw'
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
        }
    ]
};

class Weather {
    private _uuid: string;
    private _date: number;
    private _placeId: number;
    private _weatherTypeId: number;
    private _windDirectionId: number;
    private _temperature: number;
    private _temperatureMax: number;
    private _temperatureMin: number;
    private _cloudCover: number;
    private _humidityPercent: number;
    private _pressureMb: number;
    private _windSpeed: number;
    private _isForecast: number;

    constructor(uuid: string, date: number, placeId: number, weatherTypeId: number, windDirectionId: number, temperature: number, temperatureMax: number, temperatureMin: number, cloudCover: number, humidityPercent: number, pressureMb: number, windSpeed: number, isForecast: number) {
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

    get uuid(): string {
        return this._uuid;
    }

    set uuid(value: string) {
        this._uuid = value;
    }

    get date(): number {
        return this._date;
    }

    set date(value: number) {
        this._date = value;
    }

    get placeId(): number {
        return this._placeId;
    }

    set placeId(value: number) {
        this._placeId = value;
    }

    get weatherTypeId(): number {
        return this._weatherTypeId;
    }

    set weatherTypeId(value: number) {
        this._weatherTypeId = value;
    }

    get windDirectionId(): number {
        return this._windDirectionId;
    }

    set windDirectionId(value: number) {
        this._windDirectionId = value;
    }

    get temperature(): number {
        return this._temperature;
    }

    set temperature(value: number) {
        this._temperature = value;
    }

    get temperatureMax(): number {
        return this._temperatureMax;
    }

    set temperatureMax(value: number) {
        this._temperatureMax = value;
    }

    get temperatureMin(): number {
        return this._temperatureMin;
    }

    set temperatureMin(value: number) {
        this._temperatureMin = value;
    }

    get cloudCover(): number {
        return this._cloudCover;
    }

    set cloudCover(value: number) {
        this._cloudCover = value;
    }

    get humidityPercent(): number {
        return this._humidityPercent;
    }

    set humidityPercent(value: number) {
        this._humidityPercent = value;
    }

    get pressureMb(): number {
        return this._pressureMb;
    }

    set pressureMb(value: number) {
        this._pressureMb = value;
    }

    get windSpeed(): number {
        return this._windSpeed;
    }

    set windSpeed(value: number) {
        this._windSpeed = value;
    }

    get isForecast(): number {
        return this._isForecast;
    }

    set isForecast(value: number) {
        this._isForecast = value;
    }
}

class Place {
    private _id: number;
    private _name: string;
    private _latitude: number;
    private _longitude: number;
    private _country: string;

    constructor(id: number, name: string, latitude: number, longitude: number, country: string) {
        this._id = id;
        this._name = name;
        this._latitude = latitude;
        this._longitude = longitude;
        this._country = country;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get latitude(): number {
        return this._latitude;
    }

    set latitude(value: number) {
        this._latitude = value;
    }

    get longitude(): number {
        return this._longitude;
    }

    set longitude(value: number) {
        this._longitude = value;
    }

    get country(): string {
        return this._country;
    }

    set country(value: string) {
        this._country = value;
    }
}

class WeatherType {
    private _id: number;
    private _main: string;
    private _description: string;

    constructor(id: number, main: string, description: string) {
        this._id = id;
        this._main = main;
        this._description = description;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get main(): string {
        return this._main;
    }

    set main(value: string) {
        this._main = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}

enum WindDirection {
    N = 1,
    NNE = 2,
    NE = 3,
    ENE = 4,
    E = 5,
    ESE = 6,
    SE = 7,
    SSE = 8,
    S = 9,
    SSW = 10,
    SW = 11,
    WSW = 12,
    W = 13,
    WNW = 14,
    NW = 15,
    NNW = 16
}

function generateUuid() {
    let d = new Date().getTime();
    if(Date.now){
        d = Date.now(); //high-precision timer
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
}

let weathers: Weather[] = [];
let places: Place[] = [];
let weatherTypes: WeatherType[] = [];

function initializePlaces() {
    places.push(new Place(1, 'London', 51.5100, -0.1300, 'uk'));
    places.push(new Place(2, 'Warsaw', 52.2300, 21.0100, 'pl'));
}

function getWeatherTypeId(main: string, description: string) {
    let weatherTypeId: number = -1;
    for (let weatherType of weatherTypes) {
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
    for (let page of config.pages) {
        if (page.isActive) {
            for (let place of places) {
                getDataFromExternalApi(page, place, false);
                getDataFromExternalApi(page, place, true);
            }
        }
    }
}

function getDataFromExternalApi(page: any, place: Place, isForecastNeeded: boolean) {
    let url: string = prepareUrl(page, _.has(page, 'currentWeatherUrls.byCity'), isForecastNeeded, place);

    if (page.protocol === 'https') {
        https.get(url, function (res) {
            let data: string = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if (isForecastNeeded) {
                    weathers = [ ...weathers, ...initializeForecast(JSON.parse(data), page, place)];
                } else {
                    weathers.push(initializeWeather(JSON.parse(data), page, place));
                }
            });
            console.log('request success', url);
            logger.info('request success', url);
        }).on('error', function (error) {
            logger.info('request failed', url);
            logger.info('error with: ' + page + '\n' + error.message);
        });
    } else {
        http.get(url, function (res) {
            let data: string = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if (isForecastNeeded) {
                    weathers = [ ...weathers, ...initializeForecast(JSON.parse(data), page, place)];
                } else {
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

function prepareUrl(page: any, cityMode: boolean, isForecastNeeded: boolean, place: Place) {
    let url: string = '';
    const replacePrefix: string = '#$%REPLACE%$#';
    if (isForecastNeeded) {
        if (cityMode) {
            url = page.forecastUrls.byCity;
        } else {
            url = page.forecastUrls.byCoordinates;
        }
    } else {
        if (cityMode) {
            url = page.currentWeatherUrls.byCity;
        } else {
            url = page.currentWeatherUrls.byCoordinates;
        }
    }
    switch (page.name) {
        case 'openweathermap': {
            if (cityMode) {
                url = url.replace(replacePrefix, place.name);
            } else {
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
        default: {
            url = '';
        }
    }

    return url;
}

function initializeWeather(data: any, page: any, place: Place) {
    let weather: Weather;
    let date = new Date();
    let dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

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
        default: {
            weather = null;
        }
    }
    logger.info(weather);

    return weather;
}

function initializeForecast(data: any, page: any, place: Place) {
    let forecast: Weather[] = [];
    let date = new Date();
    let dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

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
        default: {
            forecast = [];
        }
    }

    return forecast;
}

function getCurrentWeatherFromOpenWeatherMap(data: any, dateUTC: number, place: Place) {
    return new Weather(
        generateUuid(),
        dateUTC,
        place.id,
        _.has(data, 'weather[0].main') && _.has(data, 'weather[0].description') ? getWeatherTypeId(data.weather[0].main, data.weather[0].description) : null,
        _.has(data, 'wind.deg') ? getWindDirectionFromDegrees(data.wind.deg) : null,
        _.has(data, 'main.temp') ? convertCalvinToCelsius(data.main.temp) : null,
        _.has(data, 'main.temp_max') ? convertCalvinToCelsius(data.main.temp_max) : null,
        _.has(data, 'main.temp_min') ? convertCalvinToCelsius(data.main.temp_min) : null,
        _.has(data, 'clouds.all') ? data.clouds.all : null,
        _.has(data, 'main.humidity') ? data.main.humidity : null,
        _.has(data, 'main.pressure') ? data.main.pressure : null,
        _.has(data, 'wind.speed') ? data.wind.speed : null,
        0
    );
}

function getForecastFromOpenWeatherMap(data: any, dateUTC: number, place: Place) {
    let forecast: Weather[] = [];

    if (_.has(data, 'list')) {
        for (let item of data.list) {
            let weather = new Weather(
                generateUuid(),
                _.has(item, 'dt') ? item.dt * 1000 : null,
                place.id,
                _.has(item, 'weather[0].main') && _.has(item, 'weather[0].description') ? getWeatherTypeId(item.weather[0].main, item.weather[0].description) : null,
                _.has(item, 'wind.deg') ? getWindDirectionFromDegrees(item.wind.deg) : null,
                _.has(item, 'main.temp') ? convertCalvinToCelsius(item.main.temp) : null,
                _.has(item, 'main.temp_max') ? convertCalvinToCelsius(item.main.temp_max) : null,
                _.has(item, 'main.temp_min') ? convertCalvinToCelsius(item.main.temp_min) : null,
                _.has(item, 'clouds.all') ? item.clouds.all : null,
                _.has(item, 'main.humidity') ? item.main.humidity : null,
                _.has(item, 'main.pressure') ? item.main.pressure : null,
                _.has(item, 'wind.speed') ? item.wind.speed : null,
                1
            );
            forecast.push(weather);
            logger.info(weather);
        }
    }

    return forecast;
}

function getCurrentWeatherFromDarkSky(data: any, dateUTC: number, place: Place) {
    return new Weather(
        generateUuid(),
        dateUTC,
        place.id,
        _.has(data, 'currently.summary') ? getWeatherTypeId(data.currently.summary, '') : null,
        null,
        _.has(data, 'currently.temperature') ? convertFahrenheitToCelsius(data.currently.temperature) : null,
        null,
        null,
        _.has(data, 'currently.cloudCover') ? data.currently.cloudCover * 100 : null,
        _.has(data, 'currently.humidity') ? data.currently.humidity * 100 : null,
        _.has(data, 'currently.pressure') ? data.currently.pressure : null,
        _.has(data, 'currently.windSpeed') ? convertMilesPerHourToMetersPerSecond(data.currently.windSpeed) : null,
        0
    );
}

function getForecastFromDarkSky(data: any, dateUTC: number, place: Place) {
    let forecast: Weather[] = [];

    if (_.has(data, 'hourly.data')) {
        for (let item of data.hourly.data) {
            let weather = new Weather(
                generateUuid(),
                _.has(item, 'time') ? item.time * 1000 : null,
                place.id,
                _.has(item, 'summary') ? getWeatherTypeId(item.summary, '') : null,
                null,
                _.has(item, 'temperature') ? convertFahrenheitToCelsius(item.temperature) : null,
                null,
                null,
                _.has(item, 'cloudCover') ? item.cloudCover * 100 : null,
                _.has(item, 'humidity') ? item.humidity * 100 : null,
                _.has(item, 'pressure') ? item.pressure : null,
                _.has(item, 'windSpeed') ? convertMilesPerHourToMetersPerSecond(item.windSpeed) : null,
                1
            );
            forecast.push(weather);
            logger.info(weather);
        }
    }
    if (_.has(data, 'daily.data')) {
        for (let item of data.daily.data) {
            let weather = new Weather(
                generateUuid(),
                _.has(item, 'time') ? item.time * 1000 : null,
                place.id,
                _.has(item, 'summary') ? getWeatherTypeId(item.summary, '') : null,
                null,
                _.has(item, 'temperature') ? convertFahrenheitToCelsius(item.temperature) : null,
                null,
                null,
                _.has(item, 'cloudCover') ? item.cloudCover * 100 : null,
                _.has(item, 'humidity') ? item.humidity * 100 : null,
                _.has(item, 'pressure') ? item.pressure : null,
                _.has(item, 'windSpeed') ? convertMilesPerHourToMetersPerSecond(item.windSpeed) : null,
                1
            );
            forecast.push(weather);
            logger.info(weather);
        }
    }

    return forecast;
}

function getCurrentWeatherFromAerisApi(data: any, dateUTC: number, place: Place) {
    return new Weather(
        generateUuid(),
        dateUTC,
        place.id,
        _.has(data, 'response[0].periods[0].weatherPrimary') && _.has(data, 'response[0].periods[0].weather') ? getWeatherTypeId(data.response[0].periods[0].weatherPrimary, data.response[0].periods[0].weather) : null,
        _.has(data, 'response[0].periods[0].windDirDEG') ? getWindDirectionFromDegrees(data.response[0].periods[0].windDirDEG) : null,
        _.has(data, 'response[0].periods[0].avgTempC') ? data.response[0].periods[0].avgTempC : null,
        _.has(data, 'response[0].periods[0].minTempC') ? data.response[0].periods[0].minTempC : null,
        _.has(data, 'response[0].periods[0].maxTempC') ? data.response[0].periods[0].maxTempC : null,
        null,
        _.has(data, 'response[0].periods[0].humidity') ? data.response[0].periods[0].humidity : null,
        _.has(data, 'response[0].periods[0].pressureMB') ? data.response[0].periods[0].pressureMB : null,
        _.has(data, 'response[0].periods[0].windSpeedKPH') ? convertKilometersPerHourToMetersPerSecond(data.response[0].periods[0].windSpeedKPH) : null,
        0
    );
}

function getForecastFromAerisApi(data: any, dateUTC: number, place: Place) {
    let forecast: Weather[] = [];

    if (_.has(data, 'response[0].periods')) {
        for (let item of data.response[0].periods) {
            let weather = new Weather(
                generateUuid(),
                _.has(item, 'timestamp') ? item.timestamp * 1000 : null,
                place.id,
                _.has(item, 'weatherPrimary') && _.has(item, 'weather') ? getWeatherTypeId(item.weatherPrimary, item.weather) : null,
                _.has(item, 'windDirDEG') ? getWindDirectionFromDegrees(item.windDirDEG) : null,
                _.has(item, 'avgTempC') ? item.avgTempC : null,
                _.has(item, 'minTempC') ? item.minTempC : null,
                _.has(item, 'maxTempC') ? item.maxTempC : null,
                null,
                _.has(item, 'humidity') ? item.humidity : null,
                _.has(item, 'pressureMB') ? item.pressureMB : null,
                _.has(item, 'windSpeedKPH') ? convertKilometersPerHourToMetersPerSecond(item.windSpeedKPH) : null,
                1
            );
            forecast.push(weather);
            logger.info(weather);
        }
    }

    return forecast;
}

function roundToTwoDecimals(num: number) {
    return (Math.round(num * 100) / 100);
}

function convertCalvinToCelsius(temperature: number) {
    return roundToTwoDecimals(temperature - 273.15);
}

function convertFahrenheitToCelsius(temperature: number) {
    return roundToTwoDecimals((temperature - 32) / 1.8);
}

function convertMilesPerHourToMetersPerSecond(value: number) {
    return roundToTwoDecimals(value * 0.44704);
}

function convertKilometersPerHourToMetersPerSecond(value: number) {
    return roundToTwoDecimals(value / 3.6);
}

function getWindDirectionFromDegrees(degrees: number) {
    if (degrees >= 348.75 || degrees <= 11.25) return WindDirection.N;
    if (degrees > 11.25 && degrees < 33.75) return WindDirection.NNE;
    if (degrees >= 33.75 && degrees <= 56.25) return WindDirection.NE;
    if (degrees > 56.25 && degrees < 78.75) return WindDirection.ENE;
    if (degrees >= 78.75 && degrees <= 101.25) return WindDirection.E;
    if (degrees > 101.25 && degrees < 123.75) return WindDirection.ESE;
    if (degrees >= 123.75 && degrees <= 146.25) return WindDirection.SE;
    if (degrees > 146.25 && degrees < 168.75) return WindDirection.SSE;
    if (degrees >= 168.75 && degrees <= 191.25) return WindDirection.S;
    if (degrees > 191.25 && degrees < 213.75) return WindDirection.SSW;
    if (degrees >= 213.75 && degrees <= 236.25) return WindDirection.SW;
    if (degrees > 236.25 && degrees < 258.75) return WindDirection.WSW;
    if (degrees >= 258.75 && degrees <= 281.25) return WindDirection.W;
    if (degrees > 281.25 && degrees < 303.75) return WindDirection.WNW;
    if (degrees >= 303.75 && degrees <= 326.25) return WindDirection.NW;
    if (degrees > 326.25 && degrees < 348.75) return WindDirection.NNW;
}

http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');
logger.info('Server running at http://' + config.ip + ':' + config.port + '/');
initializePlaces();
setInterval(gatherData, config.intervalDuration);
