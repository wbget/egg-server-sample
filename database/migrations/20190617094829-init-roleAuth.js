'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER } = Sequelize;
    const Model = queryInterface.sequelize.define(
      'roleAuth',
      {
        id: {
          type: INTEGER,
          comment: '角色权限id',
          primaryKey: true,
          autoIncrement: true
        },
        authId: {
          type: INTEGER,
          comment: '权限id',
          allowNull: false
        },
        roleId: {
          type: INTEGER,
          comment: '角色id',
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
    return queryInterface.dropTable('roleAuth');
  }
};
