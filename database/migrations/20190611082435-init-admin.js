'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, BIGINT } = Sequelize;
    const Model = queryInterface.sequelize.define(
      'admin',
      {
        id: {
          type: INTEGER,
          comment: '账号id',
          primaryKey: true,
          autoIncrement: true
        },
        account: {
          type: STRING(26),
          comment: '账户',
          allowNull: false
        },
        password: {
          type: STRING(26),
          comment: '密码',
          allowNull: false
        },
        managerId: {
          type: BIGINT.UNSIGNED,
          comment: '角色id',
          allowNull: true
        }
      },
      {
        comment: '后台用户表'
      }
    );
    return Model.sync();
  },
  down: queryInterface => {
    return queryInterface.dropTable('admin');
  }
};
