'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('bookings', 'capacityValue', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    });

    await queryInterface.addColumn('bookings', 'capacityUnit', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'unit'
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('bookings', 'capacityValue');
    await queryInterface.removeColumn('bookings', 'capacityUnit');

  }
};
