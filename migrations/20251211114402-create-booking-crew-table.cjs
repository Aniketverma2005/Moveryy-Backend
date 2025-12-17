'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookingcrew', {
      bookingCrewId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',   // MUST match actual DB table name (lowercase)
          key: 'bookingId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees',  // MUST match actual DB table name
          key: 'employeeId'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },

      role: {
        type: Sequelize.ENUM('driver', 'crew'),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('assigned', 'in-progress', 'completed'),
        defaultValue: 'assigned',
        allowNull: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('bookingcrew');
  }
};
