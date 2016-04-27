var express = require('express');
var db = require('../models');
var router = express.Router();




router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.get('/group', function(req, res) {
  if(req.currentUser) {
  res.render('auth/group');
 } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});

router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password}
  }).spread(function(user, created){
    req.session.userId = user.id;
    res.redirect('group')
  }).catch(function(err){
    res.send(err);
  });
});
//trying to save groupId value to user table under current user
router.post('/addgroup', function(req, res) {
  db.user.findById(req.currentUser.id).then(function(user){
    db.group.findOrCreate({where: {groupName: req.body.group}}).spread(function(group, created){
      if (group){
      user.updateAttributes({groupId: group.id});
      res.redirect('/today');
      } else {
        req.flash('danger', 'A group by that name already exists.');
        res.redirect('joingroup').catch(function(err){
        res.send(err);
        }); 
      }
    
    });
  });
});

router.post('/joingroup', function(req, res) {
  db.user.findById(req.currentUser.id).then(function(user){
    db.group.findOne({where: {groupName: req.body.group}}).then(function(group){
      if (group){
      user.updateAttributes({groupId: group.id});
      res.redirect('/today');
      } else {
        req.flash('danger', 'A group by that name already exists.');
        res.redirect('joingroup').catch(function(err){
        res.send(err);
        }); 
      }
    });
  });
});


router.get('/addgroup', function(req, res) {
 if(req.currentUser) {
  res.render('auth/addgroup');
 } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});

router.get('/joingroup', function(req, res) {
    if(req.currentUser) {

  res.render('auth/joingroup');
 } else {
    req.flash('danger', 'You must be logged in, buddy...');
    res.redirect('/');
  }
});




module.exports = router;