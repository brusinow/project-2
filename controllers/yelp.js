var express = require('express');
var db = require('../models');
var router = express.Router();
var request = require('request');
var oauthSignature = require('oauth-signature');  
var n = require('nonce')();   
var qs = require('querystring');  
var _ = require('lodash');

var request_yelp = function(set_parameters, callback) {

  /* The type of request */
  var httpMethod = 'GET';

  /* The url we are using for the request */
  var url = 'http://api.yelp.com/v2/search';

  /* We can setup default parameters here */
  var default_parameters = {
    radius_filter: 500
  };

  
  /* We set the require parameters here */
  var required_parameters = {
    oauth_consumer_key : process.env.YELP_CONSUMER_KEY,
    oauth_token : process.env.YELP_TOKEN,
    oauth_nonce : n(),
    oauth_timestamp : n().toString().substr(0,10),
    oauth_signature_method : 'HMAC-SHA1',
    oauth_version : '1.0'
  };

  /* We combine all the parameters in order of importance */ 
  var parameters = _.assign(default_parameters, set_parameters, required_parameters);

  /* We set our secrets here */
  var consumerSecret = process.env.YELP_CONSUMER_SECRET;
  var tokenSecret = process.env.YELP_TOKEN_SECRET;

  /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
  /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

  /* We add the signature to the list of paramters */
  parameters.oauth_signature = signature;

  /* Then we turn the paramters object, to a query string */
  var paramURL = qs.stringify(parameters);

  /* Add the query string to the url */
  var apiURL = url+'?'+paramURL;
  /* Then we use request to send make the API Request */
  request(apiURL, function(error, response, body){
    return callback(error, response, body);
  });

};



router.get('/', function(req, res) {  
        var lat = req.query.lat;
        var lng = req.query.lng;
        var address = req.query.address;
        if(lng && lat){
        request_yelp({term: "restaurants", limit: 5, sort: '2', location: address, cll: lat+','+lng}, function(error, response, body){
          var restaurantData = JSON.parse(body);
          // console.log(restaurantData.businesses[0]);

          request_yelp({term: "coffee", limit: 2, sort: '2', location: address, cll: lat+','+lng}, function(error, response, body){
          var coffeeData = JSON.parse(body); 

            request_yelp({term: "pharmacy", limit: 1, sort: '1', location: address, cll: lat+','+lng}, function(error, response, body){
              var pharmacyData = JSON.parse(body); 
          res.send({yelpFoodData: restaurantData, yelpCoffeeData: coffeeData, yelpPharmacyData: pharmacyData});
          });
        });
      });
      } else {
        var weatherData = {lon: 0, lat: 0};
        console.log('no longitude and latitude');
        }
});





module.exports = router;