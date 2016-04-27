var express = require('express');
var request = require('request');

var app = express();

app.get('/today', function(req, res) {
    var MyDate = new Date();
    var now;

    MyDate.setDate(MyDate.getDate());

    now = ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
             + ('0' + MyDate.getDate()).slice(-2) + '/'
             + MyDate.getFullYear();

// I want to pass data from event and itinItem to 'today.ejs' connected by groupId

    db.event.findOne({where: {date: now, groupId: req.currentUser.groupId},include:[db.itinItem],order: '"startTime" ASC'}).then(function(event){
    request('http://api.openweathermap.org/data/2.5/weather?lat='+ event.lat +'&lon='+event.lng+'&APPID='+ process.env.WEATHER_KEY, function(weather) {
    var weatherData = JSON.parse(weather);  
    }).then(function(data){
      console.log(data);
  });
  });
  })