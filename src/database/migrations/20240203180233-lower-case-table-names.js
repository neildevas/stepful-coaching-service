'use strict';

/** @type {import('sequelize-cli').Migration} */
// Renaming tables to lowercase, just because it is my preference
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('Users', 'users');
    await queryInterface.renameTable('Coaches', 'coaches');
    await queryInterface.renameTable('Students', 'students');
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('students', 'Students');
    await queryInterface.renameTable('coaches', 'Coaches');
    await queryInterface.renameTable('users', 'Users');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
