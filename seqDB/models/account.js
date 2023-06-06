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
      Account.belongsTo(models.Role, { as: 'role' });
      Account.belongsTo(models.Operator, { as: 'profile' });
      Account.belongsTo(models.Client, { as: 'profile' });
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

  // TODO: Nadpisać metodę tworzenia konta tak żeby przed utworzeniem stworzyć dla niego role i profil (operator/client)

  return Account;
};