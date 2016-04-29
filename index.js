var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var flash = require('connect-flash');
var db = require("./models");
var moment = require('moment');
var util = require('./util/util');
    
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


app.get('/settings', function(req, res){
  if(req.currentUser && req.currentUser.groupId) {
  db.group.findOne({where: {id: req.currentUser.groupId}}).then(function(group){
    console.log(group);
  res.render('settings', {group: group, alerts: req.flash()});
});
} else if (req.currentUser && !req.currentUser.groupId){
    res.redirect('/auth/group');
   req.flash('danger', 'You must be a member of a group.');
    
  } else {
    res.redirect('/');
    req.flash('danger', 'You must be logged in, buddy...');
    
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
      req.flash('danger', 'Your email or password is invalid. Try again.');
      res.redirect('/');
    }
  });
});



app.get('/today', function(req, res) {
  if(req.currentUser && req.currentUser.groupId) {
    var userTimeZone = moment.tz.guess();
    var now = moment().tz(userTimeZone).format('MM/DD/YYYY');
    var nowText = moment().tz(userTimeZone).format('MMMM Do, YYYY');
// 
    // var MyDate = new Date();
    // var now;
    // MyDate.setDate(MyDate.getDate());

    // now = ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
    //          + ('0' + MyDate.getDate()).slice(-2) + '/'
    //          + MyDate.getFullYear();
    // var nowText = moment().format('MMMM Do, YYYY');

    var dateForDow = moment().tz(userTimeZone);
    var thisDayOfWeek = dateForDow.format('dddd');

// I want to pass data from event and itinItem to 'today.ejs' connected by groupId
    db.event.findOne({where: {date: now, groupId: req.currentUser.groupId},include:[db.itinItem],order: '"startTime" ASC'}).then(function(event){
      if(event && event.lng && event.lat){
      var api = 'http://api.openweathermap.org/data/2.5/weather?'; 
      var lat = 'lat=' + event.lat;
      var lng = '&lon=' + event.lng;
      
      var key = process.env.WEATHER_KEY;
          
      request(api + lat + lng + '&appid=' + key, function(err, response, body) {
      var weatherData = JSON.parse(body);
      console.log(weatherData);
      res.render('showday', {date: nowText, event: event, weatherData: weatherData, dayName: thisDayOfWeek, moment: moment, alerts: req.flash()});
      });
      } else {
        var weatherData = {lon: 0, lat: 0};
        res.render('showday', {date: nowText, event: event, weatherData: weatherData, dayName: thisDayOfWeek, moment: moment, alerts: req.flash()});
        }
      });
  } else if (req.currentUser && !req.currentUser.groupId){
    
   req.flash('danger', 'You must be a member of a group.');
   res.redirect('/auth/group');
    
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
// ------------------- Managing an Itinerary Item 

app.get('/new-itin', function(req, res){
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, order: '"date" ASC'}).then(function(events){
    console.log("events should be ",events);
  res.render('new-itin', {events: events, alerts: req.flash()});
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
});

app.get('/edit-itin', function(req, res){
  
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, include:[db.itinItem], order: '"date" ASC, "startTime" ASC'}).then(function(events){
  res.render('edit-itin', {events: events, moment: moment, alerts: req.flash()});
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
  });

app.post('/edit-itinChange', function(req, res){
  var id = req.body.currentEventId;
     if(req.currentUser) {
  db.event.findOne({where: {groupId: req.currentUser.groupId, id: id}, include:[db.itinItem], order: '"date" ASC'}).then(function(events){
  res.send({events: events, alerts: req.flash()}); 
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
  });

app.delete('/edit-itin/delete', function(req, res) {
  var id = req.body.id;
  console.log('entering delete route');
  db.itinItem.find({where: {id: id}}).then(function(id){
    id.destroy().then(function(u){
      res.send('success');
    });
  });
});

// EDITING/DELETING EVENTS

app.get('/edit-event', function(req, res){
  
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, order: '"date" ASC'}).then(function(events){
  res.render('edit-event', {events: events, moment: moment, alerts: req.flash()});
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
});


app.delete('/edit-event/delete', function(req, res) {
  var id = req.body.id;
  console.log('entering delete route');
  db.event.find({where: {id: id}}).then(function(id){
    id.destroy().then(function(u){
      res.send('success');
    });
  });
});

app.get('/edit-event/show/:id', function(req, res){
  var id = req.params.id;
  if(req.currentUser) {
    db.event.findOne({where: {groupId: req.currentUser.groupId, id: id}}).then(function(event){
      res.render('show-one-event', {event: event, moment: moment, alerts: req.flash()});
    });
  } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
});

app.put('/edit-event/show', function(req, res){
  var venueDate = req.body.date;
  var venueName = req.body.venue;
  var venueCity = req.body.city;
  var venueAddress = req.body.address;
  var venueInfo = req.body.info;
  var id = req.body.id;
  db.event.findOne({where: {groupId: req.currentUser.groupId, id: id}}).then(function(event){
    if (event.date !== venueDate){
      event.date = venueDate;
    }
    if (event.name !== venueName){
      event.venue = venueName;
    }
    if (event.city !== venueCity){
      event.city = venueCity;
    }
    if (event.address !== venueAddress){
      event.address = venueAddress;
    }
    if (event.info !== venueInfo){
      event.info = venueInfo;
    }
    event.save().then(function() {
      res.send('success');
    });
  });
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
    req.flash('info', 'Your event was created!');
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
    req.flash('info', 'Your itinerary item was created!');
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


app.get('/logout', function(req, res){
  req.session.userId = false;
  res.redirect('/');
});


app.use('/auth', require('./controllers/auth'));

app.listen(process.env.PORT || 3000)



