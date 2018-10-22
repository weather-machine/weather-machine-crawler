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
    for (let page of config.pages) {
        http.get(page.url, function(res) {
            let data: string = '';
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                prepareData(data, page);
            });
        }).on('error', function(error) {
            console.log('error with: ' + page + '\n' + error.message);
        });
    }
} setInterval(gatherData, config.intervalDuration);

function prepareData(data: string, page: any) {
    let parsedData: any = JSON.parse(data);
    if (_.has(parsedData, 'main.temp')) {
        console.log(_.now() + ' ' + page.city + ': ' + convertToCelsius(parsedData.main.temp) + ' Celsius');
    }
}

function convertToCelsius(temperature: number) {
    return (temperature - 273.15).toFixed(2);
}

