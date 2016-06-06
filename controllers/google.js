var express = require('express');
var db = require('../models');
var router = express.Router();
var request = require('request');


router.get('/', function(req, res){
  var venueName = req.query.venueName;
  var venueCity = req.query.venueCity;
  var fullQuery = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + venueName +" "+ venueCity + '&key='+process.env.GOOGLE_PLACES_KEY;
  console.log(fullQuery);
  console.log("running get request route");
  request(fullQuery, function(err, response, body) {
      var data = JSON.parse(body);
      console.log(data);
    if (!err && response.statusCode == 200) {   
      res.send(data);
    } else {
      res.render('error')
    } 
  });
});



module.exports = router;