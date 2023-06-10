'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Operator)
    }
  }
  Image.init({
    image_path: DataTypes.STRING,
    image_name: {
      type: DataTypes.STRING,
      unique: true
    },
    image_extension: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
    freezeTableName: true,
    timestamps: false,
  });
  return Image;
};