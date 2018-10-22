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
            city: 'London',
            url: 'http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=212e48f40836a854c1a266834563a0b5'
        },
        {
            city: 'Warsaw',
            url: 'http://api.openweathermap.org/data/2.5/weather?q=Warsaw,pl&appid=212e48f40836a854c1a266834563a0b5'
        },
        {
            city: 'Wrocław',
            url: 'http://api.openweathermap.org/data/2.5/weather?q=Wroclaw,pl&appid=212e48f40836a854c1a266834563a0b5'
        }
    ]
};
http.createServer().listen(config.port, config.ip);
console.log('Server running at http://' + config.ip + ':' + config.port + '/');
function gatherData() {
    var _loop_1 = function (page) {
        http.get(page.url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                prepareData(data, page);
            });
        }).on('error', function (error) {
            console.log('error with: ' + page + '\n' + error.message);
        });
    };
    for (var _i = 0, _a = config.pages; _i < _a.length; _i++) {
        var page = _a[_i];
        _loop_1(page);
    }
}
setInterval(gatherData, config.intervalDuration);
function prepareData(data, page) {
    var parsedData = JSON.parse(data);
    if (_.has(parsedData, 'main.temp')) {
        console.log(_.now() + ' ' + page.city + ': ' + convertToCelsius(parsedData.main.temp) + ' Celsius');
    }
}
function convertToCelsius(temperature) {
    return (temperature - 273.15).toFixed(2);
}
// test connection