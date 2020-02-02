import { Application } from 'egg';
import * as UUID from 'uuid-int';

import { IManager, IAdmin, IManagerRole } from '../dao/adminLogin';

const gen = UUID(1, 1580626679);

export default (app: Application) => {
  const { STRING, BIGINT } = app.Sequelize;
  const Model = app.model.define(
    'manager',
    {
      managerId: {
        type: BIGINT.UNSIGNED,
        comment: '权限用户id',
        allowNull: false,
        primaryKey: true,
        defaultValue: () => gen.uuid(),
      },
      name: {
        type: STRING(26),
        comment: '权限用户名称',
        allowNull: false,
      },
      phone: {
        type: STRING(26),
        comment: '电话',
        allowNull: true,
      },
    },
    {
      comment: '权限用户表',
    },
  ) as IManager;
  return class Manager extends Model {
    admin: IAdmin;
    managerRole: IManagerRole;
    static associate() {
      app.model.Manager.belongsTo(app.model.Admin, {
        foreignKey: 'managerId',
        targetKey: 'managerId',
        constraints: false,
      });
      app.model.Manager.belongsTo(app.model.ManagerRole, {
        foreignKey: 'managerId',
        targetKey: 'managerId',
        constraints: false,
      });
    }
  };
};
