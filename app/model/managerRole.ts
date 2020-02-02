import { Application } from 'egg';
import { IManagerRole, IRole, IManager } from '../dao/adminLogin';

export default (app: Application) => {
  const { INTEGER, BIGINT } = app.Sequelize;
  const Model = app.model.define(
    'managerRole',
    {
      id: {
        type: INTEGER,
        comment: '权限关系id',
        primaryKey: true,
        autoIncrement: true,
      },
      managerId: {
        type: BIGINT.UNSIGNED,
        comment: '权限用户id',
        allowNull: false,
      },
      roleId: {
        type: INTEGER,
        comment: '管理员级别id',
        allowNull: true,
      },
    },
    {
      comment: '权限角色关系表',
      timestamps: false,
    },
  ) as IManagerRole;
  return class ManagerRole extends Model {
    role: IRole;
    manager: IManager;
    static associate = () => {
      app.model.ManagerRole.belongsTo(app.model.Role, {
        foreignKey: 'roleId',
        targetKey: 'roleId',
        constraints: false,
      });
      app.model.ManagerRole.belongsTo(app.model.Manager, {
        foreignKey: 'managerId',
        targetKey: 'managerId',
        constraints: false,
      });
    }
  };
};
