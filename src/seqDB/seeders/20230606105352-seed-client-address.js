'use strict';

/** @type {import('sequelize-cli').Migration} */
const addressData = require('./data-source/address-data.json');
const clientData = require('./data-source/client-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Client', clientData, {});
    return await queryInterface.bulkInsert('Address', addressData, {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Address', null, {});
     await queryInterface.bulkDelete('Client', null, {});
     
     await queryInterface.dropTable('Address');
     return await queryInterface.dropTable('Client');
  }
};
