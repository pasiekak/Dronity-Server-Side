'use strict';

/** @type {import('sequelize-cli').Migration} */
const accountData = require('./data-source/account-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('Account', accountData, {});
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
