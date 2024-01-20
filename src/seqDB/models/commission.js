"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Commission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Commission.belongsTo(models.Client, {
        foreignKey: { name: "author", allowNull: false },
        as: "Author",
      });
      Commission.belongsTo(models.Operator, {
        foreignKey: { name: "contractor", allowNull: true },
        as: "Contractor",
      });
      Commission.belongsToMany(models.Operator, {
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
  Commission.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      city: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isIn: {
            args: [[1, 2, 3, 4, 5]],
            msg: "Status zlecenia musi być liczbą jedną z 1,2,3,4, 5",
          },
        },
      },
      suggested_payment: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1.0,
          max: 99999.0,
        },
      },
      agreed_payment: {
        type: DataTypes.FLOAT,
        validate: {
          min: 1.0,
          max: 99999.0,
        },
      },
    },
    {
      sequelize,
      modelName: "Commission",
      freezeTableName: true,
      updatedAt: false,
      createdAt: true,
      hooks: {},
    }
  );

  return Commission;
};
