var express = require('express');
var db = require('../models');
var router = express.Router();
var request = require('request');


router.get('/', function(req, res) {
  var lat = req.query.lat;
  var lng = req.query.lng;
// I want to pass data from event and itinItem to 'today.ejs' connected by groupId
      if(lng && lat){
        // **********open weather api*******
      var api = 'http://api.openweathermap.org/data/2.5/weather?'; 
      lat = 'lat=' + lat;
      lng = '&lon=' + lng;
      var key = process.env.WEATHER_KEY; 
      request(api + lat + lng + '&appid=' + key, function(err, response, body) {
        var weatherData = JSON.parse(body);
          res.send({weatherData: weatherData});
        });    
      } else {
        var weatherData = {lon: 0, lat: 0};
        console.log('no longitude and latitude');
        }      
});




module.exports = router;