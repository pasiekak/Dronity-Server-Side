'use strict';

/** @type {import('sequelize-cli').Migration} */
const clientData = require('./data-source/client-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Client', clientData, {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Client', null, {});
     
     return await queryInterface.dropTable('Client');
  }
};
