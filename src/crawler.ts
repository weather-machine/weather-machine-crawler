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

http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');
let weather = new Weather(
    1541168536046,
    10,
    103,
    34,
    35.5,
    32.0,
    36.6,
    'It will be funny',
    37.1,
    1003.5,
    5.5,
    0
);
console.log(weather);

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

