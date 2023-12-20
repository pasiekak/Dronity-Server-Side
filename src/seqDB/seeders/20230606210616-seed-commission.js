'use strict';

/** @type {import('sequelize-cli').Migration} */
const commissionData = require('./data-source/commission-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Commission', commissionData, {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Commission', null, {});
     return await queryInterface.dropTable('Commission');
  }
};
