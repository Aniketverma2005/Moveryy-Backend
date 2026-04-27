'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change emailVerified to BOOLEAN (TINYINT(1)) with default value
    await queryInterface.changeColumn('users', 'emailVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back
    await queryInterface.changeColumn('users', 'emailVerified', {
      type: Sequelize.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    });
  }
};