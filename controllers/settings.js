var express = require('express');
var moment = require('moment');
var db = require('../models');
var router = express.Router();



router.get('/', function(req, res){
  if(req.currentUser && req.currentUser.groupId) {
  db.group.findOne({where: {id: req.currentUser.groupId}}).then(function(group){
  
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

router.get('/new-event', function(req, res){
   if(req.currentUser) {
  res.render('new-event', {alerts: req.flash()});
  } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});

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

router.get('/new-itin', function(req, res){
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, order: '"date" ASC'}).then(function(events){

  res.render('new-itin', {events: events, moment: moment, alerts: req.flash()});
  });
    } else {
      req.flash('danger', 'You must be logged in, buddy...');
      res.redirect('/');
    }
});

router.get('/edit-itin', function(req, res){
    var now = req.session.now;
    var nowEpoch = req.session.epoch;
    var twoDaysAgo = req.session.twoDaysAgo;
    var nowText = req.session.nowText;
    var thisDayOfWeek = req.session.thisDayOfWeek;
  
     if(req.currentUser) {
  db.event.findAll({where: {groupId: req.currentUser.groupId}, include:[db.itinItem], order: '"date" ASC, "startTime" ASC'}).then(function(events){
  res.render('edit-itin', {events: events, moment: moment, now: now, nowEpoch: nowEpoch, twoDaysAgo: twoDaysAgo, nowText: nowText, alerts: req.flash()});
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

router.get('/pending', function(req, res){
  db.almostUser.findAll({where: {groupId: req.currentUser.groupId}, order: '"lastName" ASC' }).then(function(almostUsers){
   res.render('pending', {almostUsers: almostUsers, alerts: req.flash()}) 
  })
})

router.post('/accept', function(req, res){
  var id = req.body.userId;
 
  db.user.findOne({where: {groupId: req.currentUser.groupId, id: id}}).then(function(data){
    data.updateAttributes({type: "user"}).then(function(data){
       
       res.send('success') 
    })
  })
})


router.delete('/accept', function(req, res) {
  var id = req.body.userId;
  console.log('entering delete route');
  db.almostUser.findOne({where: {groupId: req.currentUser.groupId, userId: id}}).then(function(user){
   
    user.destroy().then(function(data){
      req.flash('info', 'Your user was successfully added to the group.');
      res.send('success');
    });
  });
});

router.delete('/decline', function(req, res) {
  var id = req.body.userId;
  console.log('entering delete route');
  db.almostUser.findOne({where: {groupId: req.currentUser.groupId, userId: id}}).then(function(almostUser){
    almostUser.destroy().then(function(data){
        db.user.update({ groupId: null}, { where: {id:id}}).then(function(data){
         req.flash('info', 'You declined this user.');
      res.send('success'); 
       
      });
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