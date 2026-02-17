// migrations/20260217120000-create-independent-drivers.cjs

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('independent_drivers', {
      driverId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'others'),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      // License Details
      licenseNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      licenseExpiry: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      licenseType: {
        type: Sequelize.ENUM('two_wheeler', 'four_wheeler', 'commercial'),
        allowNull: false,
      },
      
      // Identity Documents
      aadharNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      panNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      
      // Bank Details
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankIfscCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankAccountHolderName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      // Profile
      profilePhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      // Status & Verification
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'suspended'),
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
      isOnline: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      
      // Location
      currentLatitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      currentLongitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      lastLocationUpdate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      
      // Ratings & Stats
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.00,
      },
      totalRides: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalEarnings: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      
      // Tokens
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.addIndex('independent_drivers', ['email']);
    await queryInterface.addIndex('independent_drivers', ['phone']);
    await queryInterface.addIndex('independent_drivers', ['status']);
    await queryInterface.addIndex('independent_drivers', ['isOnline']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('independent_drivers');
  }
};
