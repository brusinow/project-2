'use strict';
module.exports = function(sequelize, DataTypes) {
  var almostUser = sequelize.define('almostUser', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.almostUser.belongsTo(models.user);
        models.almostUser.belongsTo(models.group);
      }
    }
  });
  return almostUser;
};