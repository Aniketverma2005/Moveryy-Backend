'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pricingplan', {
      pricingPlanId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'organizationId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      serviceType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vehicleType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      minCapacity: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      maxCapacity: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      baseRate: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      pricePerKm: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      surgeCharges: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        comment: 'Fuel surcharge or surge rate (e.g. 0.05 = 5%)',
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pricingplan');
  },
};
