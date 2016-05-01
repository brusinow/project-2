var express = require('express');
var db = require('../models');
var router = express.Router();


router.get('/showlist', function(req, res){
  if(req.currentUser && req.currentUser.groupId) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, order: '"date" ASC'}).then(function(events){

    res.render('showlist', {events: events, moment: moment, alerts: req.flash()})
 });
  } else if (req.currentUser && !req.currentUser.groupId){
  req.flash('danger', 'You must be a member of a group.');
    res.redirect('/auth/group');
     
  } else {
  req.flash('danger', 'You must be logged in, buddy...');
  res.redirect('/');
  }
});

router.get('/showlist/:id', function(req, res) {
  if(req.currentUser) {

// I want to pass data from event and itinItem to 'today.ejs' connected by groupId
db.event.findOne({where: {id: req.params.id, groupId: req.currentUser.groupId},include:[db.itinItem],order: '"startTime" ASC'}).then(function(event){
  var eachDate = event.date;
  var month = eachDate.slice(0,2);
  var day = eachDate.slice(3,5);
  var year = eachDate.slice(6,10);
  var forecastTime = year + '-' + month + '-' + day;
  var thisEventDate = moment(forecastTime).format('MMMM Do, YYYY');
  var dateForDow = moment(forecastTime);
  var thisDayOfWeek = dateForDow.format('dddd');
  
  console.log(thisDayOfWeek);

  if(event && event.lng && event.lat){

  var api = 'http://api.openweathermap.org/data/2.5/forecast?'; 
  var lat = 'lat=' + event.lat;
  var lng = '&lon=' + event.lng;
  
  var key = process.env.WEATHER_KEY;
      
  request(api + lat + lng + '&appid=' + key, function(err, response, body) {
  var weatherData = JSON.parse(body);
  res.render('selectdays', {date: thisEventDate, event: event, weatherData: weatherData, forecastTime: forecastTime, dayName: thisDayOfWeek});
  });
  } else {
    var weatherData = {lon: 0, lat: 0};
    res.render('selectdays', {date: nowText, event: event, weatherData: weatherData});
    }
  });
  } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});


module.exports = router;