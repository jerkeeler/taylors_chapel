'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('photo', {
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
      favorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ext: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('photo');
  }
};
