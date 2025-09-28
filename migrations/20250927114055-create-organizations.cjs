'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
      organizationId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      organizationName: { type: Sequelize.STRING, allowNull: false },
      organizationType: { type: Sequelize.STRING, allowNull: false },
      businessName: { type: Sequelize.STRING, allowNull: false },
      about: { type: Sequelize.STRING, allowNull: true },
      domain: { type: Sequelize.STRING, allowNull: false },
      subdomain: { type: Sequelize.STRING, allowNull: false },
      logo: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      country: { type: Sequelize.STRING, allowNull: false },
      state: { type: Sequelize.STRING, allowNull: false },
      city: { type: Sequelize.STRING, allowNull: false },
      pincode: { type: Sequelize.INTEGER, allowNull: false },
      addressLine1: { type: Sequelize.STRING, allowNull: false },
      addressLine2: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.ENUM('active','inactive'), defaultValue: 'inactive' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('organizations');
  }
};
