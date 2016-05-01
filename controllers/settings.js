var express = require('express');
var db = require('../models');
var router = express.Router();



router.get('/new-event', function(req, res){
   if(req.currentUser) {
  res.render('new-event', {alerts: req.flash()});
  } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});
// ------------------- Managing an Itinerary Item 

router.get('/new-itin', function(req, res){
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

router.get('/edit-itin', function(req, res){
  
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, include:[db.itinItem], order: '"date" ASC, "startTime" ASC'}).then(function(events){
  res.render('edit-itin', {events: events, moment: moment, alerts: req.flash()});
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
  });

router.post('/edit-itinChange', function(req, res){
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

router.delete('/edit-itin/delete', function(req, res) {
  var id = req.body.id;
  console.log('entering delete route');
  db.itinItem.find({where: {id: id}}).then(function(id){
    id.destroy().then(function(u){
      res.send('success');
    });
  });
});

// EDITING/DELETING EVENTS

router.get('/edit-event', function(req, res){
  
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, order: '"date" ASC'}).then(function(events){
  res.render('edit-event', {events: events, moment: moment, alerts: req.flash()});
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
});


router.delete('/edit-event/delete', function(req, res) {
  var id = req.body.id;
  console.log('entering delete route');
  db.event.find({where: {id: id}}).then(function(id){
    id.destroy().then(function(u){
      req.flash('info', 'Your event was successfully deleted.');
      res.send('success');
    });
  });
});

router.get('/edit-event/show/:id', function(req, res){
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

router.put('/edit-event/show', function(req, res){
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
      req.flash('info', 'Your event was successfully edited.');
      res.send('success');
    });
  });
});

router.post('/new-event/submit', function(req, res){
  var venueDate = req.body.datepicker;
  var venueName = req.body.venue;
  var venueCity = req.body.city;
  var venueAddress = req.body.address;
  var venueInfo = req.body.info;
  var currentGroup = req.currentUser.groupId;
  db.event.create({date: venueDate, venue: venueName, address: venueAddress, city: venueCity, info: venueInfo, groupId: currentGroup}).then(function(data){
    req.flash('info', 'Your event was created.');
    res.redirect('/settings')
  });
});

router.post('/new-itin/submit', function(req, res){
  var startTimeItin = req.body.startTime;
  var endTimeItin = req.body.endTime;
  var taskItin = req.body.task;
  var currentEvent = req.body.currentEventId;
  console.log(req.body);
  console.log("Current event should be "+currentEvent)
  db.itinItem.create({startTime: startTimeItin, endTime: endTimeItin, task: taskItin, eventId: currentEvent}).then(function(data){
    req.flash('info', 'Your itinerary item was created.');
    res.redirect('/settings')
  });
});

router.get('/logout', function(req, res){
  req.session.userId = false;
  res.redirect('/');
});







module.exports = router;