const request = require('request')

const forecast = (
  latitude,
  longitude, callback) => {
  const url = 'http://api.weatherstack.com/current?access_key=3096e475546d366b7ebfd68284d4b118&query=' + latitude + ',' + longitude + '&units=m';
  request({
    url,
    json: true
  }, (error, {
    body
  }) => {
    if (error) {
      callback('Unable to connect to weather service.', undefined);
    } else if (body.error) {
      callback('Unable to find location.', undefined);
    } else {
      let callbackMessage = "It is currently " + body.current['temperature'] + ". It feels like " + body.current['feelslike'] + " degrees out."
      callback(undefined, callbackMessage);
    }
  })
}

module.exports = forecast