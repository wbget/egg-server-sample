'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER } = Sequelize;
    const Model = queryInterface.sequelize.define(
      'role',
      {
        roleId: {
          type: INTEGER,
          comment: '角色id',
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: STRING(26),
          comment: '角色级别',
          allowNull: false
        }
      },
      {
        comment: '角色表'
      }
    );
    return Model.sync();
  },
  down: queryInterface => {
    return queryInterface.dropTable('role');
  }
};
