'use strict';

/** @type {import('sequelize-cli').Migration} */
const operatorData = require('./data-source/operator-data.json');
const videoData = require('./data-source/video-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Operator', operatorData, {});
      return await queryInterface.bulkInsert('Video', videoData, {});

    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Video', null, {});
     await queryInterface.bulkDelete('Operator', null, {});
     
     await queryInterface.dropTable('Video');
     return await queryInterface.dropTable('Operator');
  }
};
