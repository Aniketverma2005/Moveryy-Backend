'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      employeeId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: false },
      employeeName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false },
      gender: { type: Sequelize.STRING, allowNull: false },
      aadharNumber: { type: Sequelize.STRING, allowNull: false },
      panNumber: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: "available" },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      isBlacklisted: { type: Sequelize.BOOLEAN, defaultValue: false },
      blacklistReason: { type: Sequelize.STRING, allowNull: true },
      createdBy: { type: Sequelize.INTEGER, allowNull: false },
      updatedBy: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};
