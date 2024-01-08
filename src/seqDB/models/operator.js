'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Operator extends Model {
    static associate(models) {
      Operator.hasOne(models.Account, { foreignKey: { unique: true }});
      Operator.hasMany(models.Video);
      Operator.hasMany(models.Commission, { as: 'ContractorCommissions', foreignKey: 'contractor' })
    }
  }
  Operator.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    license: DataTypes.STRING,
    city: DataTypes.STRING,
    operational_range: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Operator',
    freezeTableName: true,
    timestamps: false,
  });
  return Operator;
};