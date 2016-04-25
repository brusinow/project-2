'use strict';
module.exports = function(sequelize, DataTypes) {
  var group = sequelize.define('group', {
    groupName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
       models.group.hasMany(models.event);
       models.group.hasMany(models.user);
      }
    }
  });
  return group;
};