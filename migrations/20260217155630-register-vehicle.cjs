'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ride_vehicles', {
      vehicleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'independent_drivers',
          key: 'driverId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      vehicleType: {
        type: Sequelize.ENUM('bike', 'auto', 'cab_mini', 'cab_sedan', 'cab_suv'),
        allowNull: false,
      },
      vehicleNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      vehicleModel: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vehicleBrand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vehicleColor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      manufacturingYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      
      // RC Details
      rcNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      rcExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      rcPhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      // Insurance Details
      insuranceNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      insuranceProvider: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      insuranceExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      insurancePhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      // Fitness & Permit (for commercial vehicles)
      fitnessExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      fitnessPhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      permitNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      permitExpiryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      permitPhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      // Vehicle Specifications
      seatingCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      fuelType: {
        type: Sequelize.ENUM('petrol', 'diesel', 'cng', 'electric'),
        allowNull: false,
      },
      
      // Vehicle Photos
      vehiclePhotoFront: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehiclePhotoBack: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehiclePhotoSide: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      // Status & Verification
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verificationStatus: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      rejectionReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Add indexes
    await queryInterface.addIndex('ride_vehicles', ['driverId']);
    await queryInterface.addIndex('ride_vehicles', ['vehicleNumber']);
    await queryInterface.addIndex('ride_vehicles', ['vehicleType']);
    await queryInterface.addIndex('ride_vehicles', ['isAvailable']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ride_vehicles');
  }
};
