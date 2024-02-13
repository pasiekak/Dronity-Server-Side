"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Operator extends Model {
    static associate(models) {
      Operator.hasOne(models.Account, { foreignKey: { unique: true } });
      Operator.hasMany(models.Commission, { as: "ContractorCommissions", foreignKey: "contractor" });
      Operator.belongsToMany(models.Commission, {
        through: {
          model: sequelize.define(
            "Application",
            {
              id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
              },
              offered_payment: {
                type: Sequelize.FLOAT,
                allowNull: false,
              },
              accepted: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
              },
              rejectType: {
                type: Sequelize.INTEGER,
                allowNull: true,
              },
              customComment: {
                type: Sequelize.STRING,
                allowNull: true,
              },
            },
            {
              createdAt: true,
              updatedAt: false,
            }
          ),
          unique: false,
        },
        as: "ApplicationOperator",
      });
    }
  }
  Operator.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phone: DataTypes.STRING,
      license: DataTypes.STRING,
      city: DataTypes.STRING,
      operational_range: DataTypes.INTEGER,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Operator",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Operator;
};
