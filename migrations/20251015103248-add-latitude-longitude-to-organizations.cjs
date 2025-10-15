'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add latitude and longitude columns
    await queryInterface.addColumn('Organizations', 'latitude', {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });

    await queryInterface.addColumn('Organizations', 'longitude', {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove latitude and longitude columns
    await queryInterface.removeColumn('Organizations', 'latitude');
    await queryInterface.removeColumn('Organizations', 'longitude');
  }
};
