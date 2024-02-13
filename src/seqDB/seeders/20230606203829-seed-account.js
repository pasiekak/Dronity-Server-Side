"use strict";

/** @type {import('sequelize-cli').Migration} */
const accountData = require("./data-source/account-data.json");
const statsData = require("./data-source/statistics-data.json");
const imageData = require("./data-source/image-data.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Account", accountData, {});
    await queryInterface.bulkInsert("Image", imageData, {});
    await queryInterface.bulkInsert("Statistics", statsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Image", null, {});
    await queryInterface.bulkDelete("Statistics", null, {});
    await queryInterface.bulkDelete("Account", null, {});

    await queryInterface.dropTable("Image");
    await queryInterface.dropTable("Statistics");
    return await queryInterface.dropTable("Account");
  },
};
