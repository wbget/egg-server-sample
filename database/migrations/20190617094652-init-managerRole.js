'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, BIGINT } = Sequelize;
    const Model = queryInterface.sequelize.define(
      'managerRole',
      {
        id: {
          type: INTEGER,
          comment: '权限关系id',
          primaryKey: true,
          autoIncrement: true
        },
        managerId: {
          type: BIGINT.UNSIGNED,
          comment: '权限用户id',
          allowNull: false
        },
        roleId: {
          type: INTEGER,
          comment: '管理员级别id',
          allowNull: true
        }
      },
      {
        comment: '权限角色关系表',
        timestamps: false
      }
    );
    return Model.sync();
  },
  down: queryInterface => {
    return queryInterface.dropTable('managerRole');
  }
};
