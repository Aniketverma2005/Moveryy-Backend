'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns
    await queryInterface.addColumn('organizations', 'gstNumber', {
      type: Sequelize.STRING(15),
      allowNull: true,
    });

    await queryInterface.addColumn('organizations', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Make old columns nullable (keep data, don't delete yet)
    await queryInterface.changeColumn('organizations', 'domain', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('organizations', 'subdomain', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('organizations', 'gstNumber');
    await queryInterface.removeColumn('organizations', 'website');

    await queryInterface.changeColumn('organizations', 'domain', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('organizations', 'subdomain', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
