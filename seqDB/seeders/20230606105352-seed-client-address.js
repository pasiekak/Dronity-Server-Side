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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
