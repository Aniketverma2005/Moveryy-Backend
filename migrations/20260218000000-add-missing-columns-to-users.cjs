'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');

    if (!tableDescription.phone) {
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableDescription.refreshToken) {
      await queryInterface.addColumn('users', 'refreshToken', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');

    if (tableDescription.phone) {
      await queryInterface.removeColumn('users', 'phone');
    }

    if (tableDescription.refreshToken) {
      await queryInterface.removeColumn('users', 'refreshToken');
    }
  }
};
