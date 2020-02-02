import { Application } from 'egg';
import { IRole, IRoleAuth, IAuth } from '../dao/adminLogin';

export default (app: Application) => {
  const { INTEGER } = app.Sequelize;
  const Model = app.model.define(
    'roleAuth',
    {
      id: {
        type: INTEGER,
        comment: '角色权限id',
        primaryKey: true,
        autoIncrement: true,
      },
      authId: {
        type: INTEGER,
        comment: '权限id',
        allowNull: false,
      },
      roleId: {
        type: INTEGER,
        comment: '角色id',
        allowNull: true,
      },
    },
    {
      comment: '权限角色关系表',
      timestamps: false,
    },
  ) as IRoleAuth;
  return class RoleAuth extends Model {
    auth: IAuth;
    role: IRole;
    static associate = () => {
      app.model.RoleAuth.belongsTo(app.model.Auth, {
        foreignKey: 'authId',
        targetKey: 'authId',
        constraints: false,
      });
      app.model.RoleAuth.belongsTo(app.model.Role, {
        foreignKey: 'roleId',
        targetKey: 'roleId',
        constraints: false,
      });
    };
  };
};
