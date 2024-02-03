'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('students', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('coaches', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'deleted_at');
    await queryInterface.removeColumn('students', 'deleted_at');
    await queryInterface.removeColumn('coaches', 'deleted_at');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
