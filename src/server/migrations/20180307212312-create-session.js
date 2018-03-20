'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('sessions', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
      },
      expires: {
        type: Sequelize.DATE
      },
      data: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('sessions');
  }
};
