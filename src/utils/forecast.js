const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url =
    'https://api.darksky.net/forecast/8fe54de15783f4cbd607a1c987059a7f/' +
    latitude +
    ',' +
    longitude +
    '?lang=ko';

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback('Unable to find location', undefined);
    } else {
      const data =
        body.daily.data[0].summary +
        ' It is currently ' +
        body.currently.temperature +
        ' degrees out. This high today is ' +
        body.daily.data[0].temperatureHigh +
        ' with a low of ' +
        body.daily.data[0].temperatureLow +
        '. There is a ' +
        body.currently.precipProbability +
        '% chance of rain';
      callback(undefined, data);
    }
  });
};

//
module.exports = forecast;
