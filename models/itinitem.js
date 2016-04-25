'use strict';
module.exports = function(sequelize, DataTypes) {
  var itinItem = sequelize.define('itinItem', {
    task: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    eventId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.itinItem.belongsTo(models.event);
      }
    }
  });
  return itinItem;
};