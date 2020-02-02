'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, BIGINT } = Sequelize;
    const Model = queryInterface.sequelize.define(
      'manager',
      {
        managerId: {
          type: BIGINT.UNSIGNED,
          comment: '权限用户id',
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: STRING(26),
          comment: '权限用户名称',
          allowNull: false
        },
        phone: {
          type: STRING(26),
          comment: '电话',
          allowNull: true
        }
      },
      {
        comment: '权限用户表'
      }
    );
    return Model.sync();
  },
  down: queryInterface => {
    return queryInterface.dropTable('manager');
  }
};
