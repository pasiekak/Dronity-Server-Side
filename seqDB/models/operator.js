'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Operator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Operator.hasOne(models.Account, { unique: true });
      Operator.hasMany(models.Video);
      Operator.hasMany(models.Image);
    }
  }
  Operator.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    license: DataTypes.STRING,
    city: DataTypes.STRING,
    operational_range: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Operator',
    freezeTableName: true,
    timestamps: false,
  });
  return Operator;
};