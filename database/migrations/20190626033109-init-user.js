'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, BIGINT } = Sequelize;
    const Model = queryInterface.sequelize.define(
      'user',
      {
        uid: {
          type: BIGINT.UNSIGNED,
          primaryKey: true,
          allowNull: false,
          comment: '唯一id',
        },
        name: { type: STRING(32), comment: '名称' },
      },
      {
        comment: '用户表',
      },
    );
    return Model.sync();
  },
  down: queryInterface => {
    return queryInterface.dropTable('user');
  },
};
