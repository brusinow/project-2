'use strict';
var bcrypt = require('bcrypt'); 

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    title: DataTypes.STRING,
    type: DataTypes.STRING,
     password: {
      type: DataTypes.STRING,
      validate: {
        len: [8, 99]
      }
    },
    groupId: DataTypes.INTEGER
  }, 
  {
     classMethods: {
      associate: function(models) {
        models.user.belongsTo(models.group);
      },
      authenticate: function(email, password, callback) {
        this.find({where: {email: email}}).then(function(user){
          if(!user) callback(null, false);

          bcrypt.compare(password, user.password, function(err, result) {
            if(err) return callback(err);

            callback(null, result ? user : false);
          });
        });
      }
    },
    hooks: {
      beforeCreate: function(user, options, callback){
        if(user.password) {
          bcrypt.hash(user.password, 10, function(err, hash) {
            if(err) return callback(err);

            user.password = hash;
            callback(null, user);
          });
        }
      }
    }
  });
  return user;
};