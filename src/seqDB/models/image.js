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
      Image.belongsTo(models.Account)
    }

    // Dodajemy własną metodę walidacji przed zapisem
    async validateProfileFlag() {
      if (this.profile) {
        // Sprawdź, czy już istnieje inne zdjęcie z profile === true dla tego AccountID
        const existingProfileImage = await Image.findOne({
          where: {
            AccountId: this.AccountId,
            profile: true,
          },
        });

        if (existingProfileImage && existingProfileImage.id !== this.id) {
          throw new Error('There can be only one profile image');
        }
      }
    }
  }
  Image.init({
    image_path: DataTypes.STRING,
    image_name: {
      type: DataTypes.STRING,
      unique: true
    },
    image_extension: DataTypes.STRING,
    image_url: DataTypes.STRING,
    profile: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Image',
    freezeTableName: true,
    timestamps: false,
  });


  Image.beforeSave(async (image, options) => {
    await image.validateProfileFlag();
  });

  return Image;
};