'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Statistics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Statistics.belongsTo(models.Account, { foreignKey: { name: 'api_key', allowNull: false, unique: true, targetKey: 'api_key' }});

    }
  }
  Statistics.init({
    numerOfRequests: {
        type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Statistics',
    freezeTableName: true,
    timestamps: false,
  });
  return Statistics;
};