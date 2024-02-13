'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      Client.hasOne(models.Account, { foreignKey: { unique: true }});
      Client.hasMany(models.Commission, { as: 'AuthorCommissions', foreignKey: { name: 'author', allowNull: false }})
    }
  }
  Client.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Client',
    freezeTableName: true,
    timestamps: false
  });
  return Client;
};