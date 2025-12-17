'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      bookingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'organizationId'
        },
        onDelete: 'CASCADE'
      },

      customerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },

      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "employeeId"   // <-- FIX THIS
        },
        onDelete: "SET NULL"
      },


      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vehicles',
          key: 'vehicleId'
        },
        onDelete: 'CASCADE'
      },

      pricingPlanId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'pricingplan',
          key: 'pricingPlanId'
        },
        onDelete: 'SET NULL'
      },

      offerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'offers',
          key: 'offerId'
        },
        onDelete: 'SET NULL'
      },

      vehicleOfferId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'vehiclesOffers',
          key:  'vehicleOfferId'
        },
        onDelete: 'SET NULL'
      },

      serviceType: {
        type: Sequelize.ENUM("Home Shift", "Office Shift", "Vehicle Shift"),
        allowNull: false
      },

      startLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },

      endLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },

      distance: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      duration: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },

      tripDate: {
        type: Sequelize.DATE,
        allowNull: false
      },

      baseRate: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      distanceCost: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      fuelSurcharge: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },

      totalPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      discount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0
      },

      finalPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },

      bookingStatus: {
        type: Sequelize.ENUM("pending", "confirmed", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending"
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};
