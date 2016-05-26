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

router.get('/logout', function(req, res){
  req.session.userId = false;
  res.redirect('/');
});


module.exports = router;