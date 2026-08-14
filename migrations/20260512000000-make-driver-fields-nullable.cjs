'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make all fields except email nullable for step-by-step registration
    await queryInterface.changeColumn('independent_drivers', 'fullName', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.changeColumn('independent_drivers', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'others'),
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'address', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'city', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'state', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'pincode', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'licenseNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.changeColumn('independent_drivers', 'licenseExpiry', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'licenseType', {
      type: Sequelize.ENUM('two_wheeler', 'four_wheeler', 'commercial'),
      allowNull: true
    });
    await queryInterface.changeColumn('independent_drivers', 'aadharNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.changeColumn('independent_drivers', 'panNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add OTP fields for email-based login
    await queryInterface.addColumn('independent_drivers', 'emailOTP', {
      type: Sequelize.STRING(6),
      allowNull: true
    });
    await queryInterface.addColumn('independent_drivers', 'emailOTPExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('independent_drivers', 'emailVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('independent_drivers', 'emailOTP');
    await queryInterface.removeColumn('independent_drivers', 'emailOTPExpires');
    await queryInterface.removeColumn('independent_drivers', 'emailVerified');
  }
};
