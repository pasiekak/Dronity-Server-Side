"use strict";
const { Model } = require("sequelize");
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
        foreignKey: "contractor",
        as: "Contractor",
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
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      started: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      suggested_payment: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      agreed_payment: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Commission",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Commission;
};
