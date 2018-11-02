// @ts-ignore
let http = require('http');
// @ts-ignore
let _ = require('lodash');

const config = {
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

class Weather {
    private _date: number;
    private _placeId: number;
    private _weatherTypeId: number;
    private _windDirectionId: number;
    private _temperature: number;
    private _temperatureMax: number;
    private _temperatureMin: number;
    private _skyDescription: string;
    private _humidityPercent: number;
    private _pressureMb: number;
    private _windSpeed: number;
    private _isForecast: number;

    constructor(date: number, placeId: number, weatherTypeId: number, windDirectionId: number, temperature: number, temperatureMax: number, temperatureMin: number, skyDescription: string, humidityPercent: number, pressureMb: number, windSpeed: number, isForecast: number) {
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

    get skyDescription(): string {
        return this._skyDescription;
    }

    set skyDescription(value: string) {
        this._skyDescription = value;
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

class weatherType {
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

enum windDirection {
    N = 'N',
    E = 'E',
    S = 'S',
    W = 'W',
    NE = 'NE',
    NW = 'NW',
    SE = 'SE',
    SW = 'SW'
}

http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');

let weathers: Weather[] = [];
let places: Place[] = [];

function initializePlaces() {
    let place = new Place(1, 'London', 0, 0, 'uk');
    places.push(place);
}

function gatherData() {
    for (let page of config.pages) {
        for (let place of places) {
            http.get(page.url + place.name, function (res) {
                let data: string = '';
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
    }
}

function initializeWeather(data: any, page: any) {
    let date = new Date();
    let dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    return new Weather(
        dateUTC,
        1,
        1,
        1,
        _.has(data, 'main.temp') ? convertToCelsius(data.main.temp) : null,
        _.has(data, 'main.temp_max') ? convertToCelsius(data.main.temp_max) : null,
        _.has(data, 'main.temp_min') ? convertToCelsius(data.main.temp_min) : null,
        'it will be find :D',
        _.has(data, 'main.humidity') ? data.main.humidity : null,
        _.has(data, 'main.pressure') ? data.main.pressure : null,
        _.has(data, 'wind.speed') ? data.wind.speed : null,
        0
    );
}

function convertToCelsius(temperature: number) {
    return (temperature - 273.15);
}

initializePlaces();
setInterval(gatherData, config.intervalDuration);
