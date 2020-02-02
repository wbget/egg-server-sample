import { Application } from 'egg';

import { IAuth } from '../dao/adminLogin';

export default (app: Application) => {
  const { STRING, INTEGER } = app.Sequelize;
  const Model = app.model.define(
    'auth',
    {
      authId: {
        type: INTEGER,
        comment: '权限id',
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: STRING(26),
        comment: '权限名称',
        allowNull: false,
      },
    },
    {
      comment: '权限详情表',
      timestamps: false,
    },
  ) as IAuth;

  return class Auth extends Model {
    static associate = () => {};
  };
};
