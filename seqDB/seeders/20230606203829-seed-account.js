'use strict';

/** @type {import('sequelize-cli').Migration} */
const accountData = require('./data-source/account-data.json');
const statsData = require('./data-source/statistics-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Account', accountData, {});
    return queryInterface.bulkInsert('Statistics', statsData, {});
    } catch (err) {
      console.log(err);
    }
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
