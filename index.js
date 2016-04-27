var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var flash = require('connect-flash');
var db = require("./models");
var moment = require('moment');

    
var app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: false}));

app.use("/", express.static(__dirname + '/views'));
app.use("/static", express.static(__dirname + '/static'));

app.use(session({
  secret: 'dsalkfjasdflkjgdfblknbadiadsnkl',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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


app.get('/settings', function(req, res){
  if(req.currentUser) {
  db.group.findOne({where: {id: req.currentUser.groupId}}).then(function(group){
    console.log(group);
  res.render('settings', {group: group, alerts: req.flash()});
});
} else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});


app.post('/', function(req, res) {
  console.log("entering route");
  var email = req.body.email;
  var password = req.body.password;
  db.user.authenticate(email, password, function(err, user) {
    if(err){
      res.send(err);
    } else if (user){
      req.session.userId = user.id;
      res.redirect('/today');
    } else {
      res.send('email and/or password invalid');
    }
  });
});



app.get('/today', function(req, res) {
  if(req.currentUser) {
    var MyDate = new Date();
    var now;
    MyDate.setDate(MyDate.getDate());

    now = ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
             + ('0' + MyDate.getDate()).slice(-2) + '/'
             + MyDate.getFullYear();
    var nowText = moment().format('MMMM Do, YYYY');

// I want to pass data from event and itinItem to 'today.ejs' connected by groupId
db.event.findOne({where: {date: now, groupId: req.currentUser.groupId},include:[db.itinItem],order: '"startTime" ASC'}).then(function(event){
  if(event && event.lng && event.lat){
  var api = 'http://api.openweathermap.org/data/2.5/weather?'; 
  var lat = 'lat=' + event.lat;
  var lng = '&lon=' + event.lng;
  
  var key = process.env.WEATHER_KEY;
      
  request(api + lat + lng + '&appid=' + key, function(err, response, body) {
  var weatherData = JSON.parse(body);
  res.render('showday', {date: nowText, event: event, weatherData: weatherData});
  });
  } else {
    var weatherData = {lon: 0, lat: 0};
    res.render('showday', {date: nowText, event: event, weatherData: weatherData});
    }
  });
  } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});



app.get('/new-event', function(req, res){
   if(req.currentUser) {
  res.render('new-event', {alerts: req.flash()});
  } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});

app.get('/new-itin', function(req, res){
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}}).then(function(events){
    // console.log(events);
  res.render('new-itin', {events: events, alerts: req.flash()});
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
});

app.get('/showlist', function(req, res){
  if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, order: '"date" ASC'}).then(function(events){
    res.render('showlist', {events: events})
 });
 } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
 }
});

// app.get('/new-event/result', function(req, res){
//   var query = req.query.q;
//   var fullQuery = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + query + '&key='+process.env.KEY;
//   console.log(fullQuery);
//   console.log("running get request route");
//   request(fullQuery, function(err, response, body) {
//       var data = JSON.parse(body);
    
//     if (!err && response.statusCode == 200) {   
//       res.send(data);
//     } else {
//       res.render('error')
//     } 
//   });
// });

// app.get('/new-event/result/:id', function(req, res){
//   var id = req.params.id;
//   console.log(id);
// })

app.post('/new-event/submit', function(req, res){
  var venueDate = req.body.datepicker;
  var venueName = req.body.venue;
  var venueCity = req.body.city;
  var venueAddress = req.body.address;
  var venueInfo = req.body.info;
  var currentGroup = req.currentUser.groupId;
  db.event.create({date: venueDate, venue: venueName, address: venueAddress, city: venueCity, info: venueInfo, groupId: currentGroup}).then(function(data){
    req.flash('default', 'Your event was created!');
    res.redirect('/settings')
  });
});

app.post('/new-itin/submit', function(req, res){
  var startTimeItin = req.body.startTime;
  var endTimeItin = req.body.endTime;
  var taskItin = req.body.task;
  var currentEvent = req.body.currentEventId;
  console.log(req.body);
  console.log("Current event should be "+currentEvent)
  db.itinItem.create({startTime: startTimeItin, endTime: endTimeItin, task: taskItin, eventId: currentEvent}).then(function(data){
    req.flash('default', 'Your itinerary item was created!');
    res.redirect('/settings')
  });
});
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

  if(event && event.lng && event.lat){

  var api = 'http://api.openweathermap.org/data/2.5/forecast?'; 
  var lat = 'lat=' + event.lat;
  var lng = '&lon=' + event.lng;
  
  var key = process.env.WEATHER_KEY;
      
  request(api + lat + lng + '&appid=' + key, function(err, response, body) {
  var weatherData = JSON.parse(body);
  res.render('selectdays', {date: thisEventDate, event: event, weatherData: weatherData, forecastTime: forecastTime});
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


app.get('/logout', function(req, res){
  req.session.userId = false;
  res.redirect('/');
});


app.use('/auth', require('./controllers/auth'));

app.listen(3000);



