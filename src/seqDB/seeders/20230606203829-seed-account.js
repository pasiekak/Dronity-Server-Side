'use strict';

/** @type {import('sequelize-cli').Migration} */
const accountData = require('./data-source/account-data.json');
const statsData = require('./data-source/statistics-data.json');
const imageData = require('./data-source/image-data.json');
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.bulkInsert('Account', accountData, {});
      await queryInterface.bulkInsert('Statistics', statsData, {});
      return await queryInterface.bulkInsert('Image', imageData, {});
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Image', null, {});
     await queryInterface.bulkDelete('Statistics', null, {});
     await queryInterface.bulkDelete('Account', null, {});

     await queryInterface.dropTable('Image');
     await queryInterface.dropTable('Statistics');
     return await queryInterface.dropTable('Account');
  }
};
