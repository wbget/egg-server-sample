import { Application } from 'egg';
import { IUser } from '../dao/client';

export default (app: Application) => {
  const { STRING, BIGINT } = app.Sequelize;
  const Model = app.model.define(
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
  ) as IUser;
  return class User extends Model {
    static associate = () => {};
  };
};
