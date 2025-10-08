'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add unique constraint on vehicleId
    await queryInterface.changeColumn('vehiclesOffers', 'vehicleId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'vehicles',
        key: 'vehicleId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert: remove unique constraint
    await queryInterface.changeColumn('vehiclesOffers', 'vehicleId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'vehicles',
        key: 'vehicleId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
