'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      token: {
        type: Sequelize.STRING,
        unique: true
      },
      displayName: {
        type: Sequelize.STRING
      },
      googleID: {
        type: Sequelize.STRING,
        unique: true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }

    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.dropTable('user');
  }
};
