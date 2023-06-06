'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.belongsTo(models.Role);
      Account.belongsTo(models.Operator, { unique: true });
      Account.belongsTo(models.Client, { unique: true });

      Account.hasMany(models.Commission, { foreignKey: 'author' })
      Account.hasMany(models.Commission, { foreignKey: 'contractor' })
    };
  }
  Account.init({
    login: DataTypes.STRING,
    hash: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Account',
    freezeTableName: true,
    timestamps: false,
  });

  Account.validate

  return Account;
};