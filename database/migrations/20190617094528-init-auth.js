'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER } = Sequelize;
    const Model = queryInterface.sequelize.define(
      'auth',
      {
        authId: {
          type: INTEGER,
          comment: '权限id',
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: STRING(26),
          comment: '权限名称',
          allowNull: false
        }
      },
      {
        comment: '权限详情表',
        timestamps: false
      }
    );
    return Model.sync();
  },
  down: queryInterface => {
    return queryInterface.dropTable('auth');
  }
};
