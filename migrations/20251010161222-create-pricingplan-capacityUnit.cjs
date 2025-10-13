'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pricingplan', 'capacityUnit', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'tons', // You can change this default if needed
      after: 'maxCapacity'  // Places the new column right after maxCapacity (optional)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('pricingplan', 'capacityUnit');
  }
};
