'use strict';
module.exports = function(sequelize, DataTypes) {
  var event = sequelize.define('event', {
    date: DataTypes.STRING,
    venue: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    place_id: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT, 
    info: DataTypes.TEXT,
    groupId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.event.belongsTo(models.group);
        models.event.hasMany(models.itinItem);
      }
    }
  });
  return event;
};