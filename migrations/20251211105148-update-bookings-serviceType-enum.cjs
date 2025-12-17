'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Remove old ENUM type
    await queryInterface.changeColumn('bookings', 'serviceType', {
      type: Sequelize.ENUM('houseshift', 'officeshift', 'vehicleshift'),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // 2️⃣ Revert ENUM back to original (if needed)
    await queryInterface.changeColumn('bookings', 'serviceType', {
      type: Sequelize.ENUM('Home Shift', 'Office Shift', 'Vehicle Shift'),
      allowNull: false
    });
  }
};
