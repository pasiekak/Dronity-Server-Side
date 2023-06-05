'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('User', [{
      username: 'Adminstrator',
      hash: 'hashpass',
    }, {
      username: 'Moderator',
      hash: 'hashpass',
    }, {
      username: 'Client',
      hash: 'hashpass',
    }], {});
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
