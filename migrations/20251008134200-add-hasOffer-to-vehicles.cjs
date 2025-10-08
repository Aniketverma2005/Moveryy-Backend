'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('vehicles', 'hasOffer', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // initially false for all existing vehicles
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('vehicles', 'hasOffer');
  }
};
