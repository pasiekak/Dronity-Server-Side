'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username: 'Admin',
      hash: 'hashpass',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      username: 'Moderator',
      hash: 'hashpass',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      username: 'Client',
      hash: 'hashpass',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }])
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
