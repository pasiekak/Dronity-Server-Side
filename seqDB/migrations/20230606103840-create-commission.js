'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Commission', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_data: {
        type: Sequelize.DATE
      },
      completed: {
        type: Sequelize.BOOLEAN
      },
      payment: {
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Account',
          },
          key: 'id'
        },
      },
      contractor: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Account',
          },
          key: 'id'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Commission');
  }
};