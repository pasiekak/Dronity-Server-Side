'use strict';

/** @type {import('sequelize-cli').Migration} */
const operatorData = require('./data-source/operator-data.json');
const imageData = require('./data-source/image-data.json');
const videoData = require('./data-source/video-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Operator', operatorData, {});
    await queryInterface.bulkInsert('Video', videoData, {});
    return await queryInterface.bulkInsert('Image', imageData, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
