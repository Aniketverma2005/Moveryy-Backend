'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');

    // Add googleId column if it doesn't exist
    if (!tableDescription.googleId) {
      await queryInterface.addColumn('users', 'googleId', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      });
    }

    // Add authProvider column if it doesn't exist
    if (!tableDescription.authProvider) {
      await queryInterface.addColumn('users', 'authProvider', {
        type: Sequelize.ENUM('local', 'google'),
        defaultValue: 'local',
        allowNull: false
      });
    }

    // Add profilePicture column if it doesn't exist
    if (!tableDescription.profilePicture) {
      await queryInterface.addColumn('users', 'profilePicture', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Make password nullable for Google users
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'googleId');
    await queryInterface.removeColumn('users', 'authProvider');
    await queryInterface.removeColumn('users', 'profilePicture');
    
    // Revert password to NOT NULL
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
