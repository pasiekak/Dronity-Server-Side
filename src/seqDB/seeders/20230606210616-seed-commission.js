"use strict";

/** @type {import('sequelize-cli').Migration} */
const commissionData = require("./data-source/commission-data.json");
const applicationData = require("./data-source/application-data.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Commission", commissionData, {});
    return await queryInterface.bulkInsert("Application", applicationData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Application", null, {});
    await queryInterface.bulkDelete("Commission", null, {});

    await queryInterface.dropTable("Application");
    return await queryInterface.dropTable("Commission");
  },
};
