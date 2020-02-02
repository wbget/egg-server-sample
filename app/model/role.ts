import { Application } from 'egg';
import { IRole, IRoleAuth } from '../dao/adminLogin';

export default (app: Application) => {
  const { STRING, INTEGER } = app.Sequelize;
  const Model = app.model.define(
    'role',
    {
      roleId: {
        type: INTEGER,
        comment: '角色id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: STRING(26),
        comment: '角色级别',
        allowNull: false,
      },
    },
    {
      comment: '角色表',
    },
  ) as IRole;
  return class Role extends Model {
    roleAuth: IRoleAuth;
    static associate = () => {
      app.model.Role.hasMany(app.model.RoleAuth, {
        foreignKey: 'roleId',
        sourceKey: 'roleId',
        constraints: false,
      });
    }
  };
};
