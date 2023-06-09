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
      Account.belongsTo(models.Role, { foreignKey: { allowNull: false }});
      Account.belongsTo(models.Operator, { foreignKey: { unique: true }});
      Account.belongsTo(models.Client, { foreignKey: { unique: true }});

      Account.hasMany(models.Commission, { foreignKey: { name: 'author', allowNull: false }})
      Account.hasMany(models.Commission, { foreignKey: 'contractor' })
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
  }, {
    sequelize,
    modelName: 'Account',
    freezeTableName: true,
    timestamps: false,
  });

  Account.validate

  return Account;
};