'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      vehicleId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      organizationId: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'organizations', key: 'organizationId' },
        onDelete: 'CASCADE'
      },
      vehicleName: { type: Sequelize.STRING, allowNull: false },
      registrationNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      manufacturer: { type: Sequelize.STRING, allowNull: false },
      vehicleType: { type: Sequelize.STRING, allowNull: false },
      capacityValue: { type: Sequelize.FLOAT, allowNull: false },
      capacityUnit: { type: Sequelize.STRING, allowNull: false }, // e.g., bhk, tons, cubic_meters
      serviceType: { type: Sequelize.STRING, allowNull: false }, // e.g., houseshift, vehicletransport, officeshift
      registrarName: { type: Sequelize.STRING, allowNull: false },
      chassisNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      status: { type: Sequelize.ENUM('available','on-duty'), defaultValue: 'on-duty' },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdBy: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      updatedBy: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicles');
  }
};
