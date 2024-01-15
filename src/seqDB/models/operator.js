"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Operator extends Model {
    static associate(models) {
      Operator.hasOne(models.Account, { foreignKey: { unique: true } });
      Operator.hasMany(models.Video);
      Operator.hasMany(models.Commission, { as: "ContractorCommissions", foreignKey: "contractor" });
      Operator.belongsToMany(models.Commission, {
        through: {
          model: sequelize.define(
            "Application",
            {
              offered_payment: {
                type: Sequelize.FLOAT,
                allowNull: false,
              },
              accepted: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
              },
            },
            {
              createdAt: true,
              updatedAt: false,
            }
          ),
          unique: false, // Jeśli tabela asocjacyjna ma mieć indeksy dla kolumn, ustaw na true
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
