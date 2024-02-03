'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');
    await queryInterface.renameColumn('coaches', 'createdAt', 'created_at');
    await queryInterface.renameColumn('coaches', 'updatedAt', 'updated_at');
    await queryInterface.renameColumn('students', 'createdAt', 'created_at');
    await queryInterface.renameColumn('students', 'updatedAt', 'updated_at');

    await queryInterface.renameColumn('students', 'userId', 'user_id');
    await queryInterface.renameColumn('coaches', 'userId', 'user_id');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'created_at', 'createdAt');
    await queryInterface.renameColumn('users', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('coaches', 'created_at', 'createdAt');
    await queryInterface.renameColumn('coaches', 'updated_at', 'updatedAt');
    await queryInterface.renameColumn('students', 'created_at', 'createdAt');
    await queryInterface.renameColumn('students', 'updated_at', 'updatedAt');

    await queryInterface.renameColumn('students', 'user_id', 'userId');
    await queryInterface.renameColumn('coaches', 'user_id', 'userId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
