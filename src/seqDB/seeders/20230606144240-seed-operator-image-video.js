"use strict";

/** @type {import('sequelize-cli').Migration} */
const operatorData = require("./data-source/operator-data.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert("Operator", operatorData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Operator", null, {});

    return await queryInterface.dropTable("Operator");
  },
};
