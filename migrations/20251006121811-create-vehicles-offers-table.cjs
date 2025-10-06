'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehiclesOffers', {
      vehicleOfferId: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false 
      },

      vehicleId: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'vehicles', key: 'vehicleId' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      organizationId: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'organizations', key: 'organizationId' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      offerName: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },

      startDate: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },

      endDate: { 
        type: Sequelize.DATE, 
        allowNull: false 
      },

      discountValue: { 
        type: Sequelize.DECIMAL(10, 2), 
        allowNull: false 
      },

      discountType: { 
        type: Sequelize.ENUM('percentage', 'value'), 
        allowNull: false 
      },

      isActive: { 
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: true 
      },

      createdBy: { 
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      updatedBy: { 
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },

      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.fn('NOW') 
      },

      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.fn('NOW') 
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehiclesOffers');
  }
};
