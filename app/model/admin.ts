import { Application } from 'egg';
import { IAdmin, IManager } from '../dao/adminLogin';

export default (app: Application) => {
  const { STRING, INTEGER, BIGINT } = app.Sequelize;
  const Model = app.model.define(
    'admin',
    {
      id: {
        type: INTEGER,
        comment: '账号id',
        primaryKey: true,
        autoIncrement: true,
      },
      account: {
        type: STRING(26),
        comment: '账户',
        allowNull: false,
      },
      password: {
        type: STRING(26),
        comment: '密码',
        allowNull: false,
      },
      managerId: {
        type: BIGINT.UNSIGNED,
        comment: '角色id',
        allowNull: true,
      },
    },
    {
      comment: '后台用户表',
    },
  ) as IAdmin;
  return class Admin extends Model {
    manager: IManager;
    static associate = () => {
      app.model.Admin.belongsTo(app.model.Manager, {
        foreignKey: 'managerId',
        targetKey: 'managerId',
        constraints: false,
      });
    };
  };
};
