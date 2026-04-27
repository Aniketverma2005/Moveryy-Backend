'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add emailVerified column
    await queryInterface.addColumn('users', 'emailVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // Add emailOTP column
    await queryInterface.addColumn('users', 'emailOTP', {
      type: Sequelize.STRING(6),
      allowNull: true
    });

    // Add emailOTPExpires column
    await queryInterface.addColumn('users', 'emailOTPExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn('users', 'emailOTPExpires');
    await queryInterface.removeColumn('users', 'emailOTP');
    await queryInterface.removeColumn('users', 'emailVerified');
  }
};
