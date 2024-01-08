'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.belongsTo(models.Role, { foreignKey: { allowNull: false, defaultValue: 3 }});
      Account.belongsTo(models.Operator, { foreignKey: { unique: true }});
      Account.belongsTo(models.Client, { foreignKey: { unique: true }});
      
      Account.hasOne(models.Statistics, { sourceKey: 'api_key', foreignKey: 'api_key' });

      Account.hasMany(models.Image);
    };
  }
  Account.init({
    login: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false
    },
    api_key: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Account',
    freezeTableName: true,
    updatedAt: false,
    createdAt: true
  });

  Account.authenticate = async function(login, password) {
    const account = await Account.findOne({ where: {
        login: login
    }});
    if (account && bcrypt.compareSync(password, account.hash)) {
        return account;
    };
    return null;
  }

  return Account;
};