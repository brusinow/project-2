var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var flash = require('connect-flash');
var db = require("./models");
var moment = require('moment');
var util = require('./util/util');
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


var app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/static'));

app.use(session({
  secret: 'dsalkfjasdflkjgdfblknbadiadsnkl',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(function(req, res, next){
  res.locals.util = util;
  next()
});



app.use(flash());

app.use(function(req, res, next){
  if(req.session.userId) {
    db.user.findById(req.session.userId).then(function(user) {
      req.currentUser = user;
      res.locals.currentUser = user;
      next();
    });
  } else {
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
});





app.get('/', function(req, res){
  res.render('auth/login', {alerts: req.flash()});
});





app.post('/', function(req, res) {
  console.log("entering post route");
  var email = req.body.email;
  var password = req.body.password;
  var now = req.body.now;
  var nowEpoch = req.body.nowEpoch;
  var twoDaysAgo = req.body.twoDaysAgo;
  console.log('this is now: ',now);
  var nowText = req.body.nowText;
  var thisDayOfWeek = req.body.thisDayOfWeek;
  db.user.authenticate(email, password, function(err, user) {
    if(err){
      res.send(err);
    } else if (user){
      console.log('there is a user');
      req.session.userId = user.id;
      req.session.now = now;
      req.session.epoch = nowEpoch;
      req.session.twoDaysAgo = twoDaysAgo;
      req.session.nowText = nowText;
      req.session.thisDayOfWeek = thisDayOfWeek;
      res.send('success');
    } else {
      req.flash('danger', 'Your email or password is invalid. Try again.');
      res.redirect('/');
    }
  });
});



app.get('/today', function(req, res) {
  console.log('entering today page get route')
  if(req.currentUser && req.currentUser.groupId && req.currentUser.type) {
    var now = req.session.now;
    var nowText = req.session.nowText;
    var thisDayOfWeek = req.session.thisDayOfWeek;
// I want to pass data from event and itinItem to 'today.ejs' connected by groupId
    db.event.findOne({where: {date: now, groupId: req.currentUser.groupId},include:[db.itinItem],order: '"startTime" ASC'}).then(function(event){
      console.log("should now render showday");
      res.render('showday', {date: nowText, event: event, dayName: thisDayOfWeek});
      });
  } else if (req.currentUser && !req.currentUser.groupId){
   req.flash('danger', 'You must be a member of a group.');
   res.redirect('/auth/group');
   } else if (req.currentUser && req.currentUser.groupId && !req.currentUser.type){
    req.flash('info', 'Your admin needs to approve your request to join their group. You should receive email confirmation shortly.');
    res.redirect('/');
  } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
    
 }
});



app.get('/showlist', function(req, res){
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

// app.get('/new-event/result/:id', function(req, res){
//   var id = req.params.id;
//   console.log(id);
// })


// app.post('/new-event/result/', function(req, res){
 
// });

app.get('/showlist/:id', function(req, res) {
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



app.use('/auth', require('./controllers/auth'));
app.use('/weather', require('./controllers/weather'));
app.use('/yelp', require('./controllers/yelp'));
app.use('/google', require('./controllers/google'));
app.use('/settings', require('./controllers/settings'));


app.listen(process.env.PORT || 3000)
