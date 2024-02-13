"use strict";

/** @type {import('sequelize-cli').Migration} */
const roleData = require("./data-source/role-data.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert("Role", roleData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Role", null, {});

    return await queryInterface.dropTable("Role");
  },
};
