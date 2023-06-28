'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Commission.belongsTo(models.Account, { foreignKey: { name: 'author', allowNull: false }})
      Commission.belongsTo(models.Account, { foreignKey: 'contractor' })
    }
  }
  Commission.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    city: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    completed: DataTypes.BOOLEAN,
    payment: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Commission',
    freezeTableName: true,
    timestamps: false,
  });
  return Commission;
};