'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add googleId column
    await queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    
    // Add authProvider column
    await queryInterface.addColumn('users', 'authProvider', {
      type: Sequelize.ENUM('local', 'google'),
      defaultValue: 'local',
      allowNull: false
    });
    
    // Add profilePicture column
    await queryInterface.addColumn('users', 'profilePicture', {
      type: Sequelize.STRING,
      allowNull: true
    });
    s
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
