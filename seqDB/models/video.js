'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Video.belongsTo(models.Operator)
    }
  }
  Video.init({
    video_path: DataTypes.STRING,
    video_name: {
      type: DataTypes.STRING,
      unique: true
    },
    video_extension: DataTypes.STRING,
    video_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Video',
    freezeTableName: true,
    timestamps: false,
  });
  return Video;
};