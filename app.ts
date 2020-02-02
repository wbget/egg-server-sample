import { Application, IBoot } from 'egg';
import { AUTH } from './app/auth';

const initAuth = async (app: Application) => {
  const { model } = app;
  const cnt = await model.Auth.count();
  if (AUTH.length === cnt) return;
  app.logger.info('服务器权限开始更新');
  // 同步
  await model.Auth.truncate();
  await model.Auth.bulkCreate(AUTH);
  app.logger.info('服务器权限更新完成');
};

const initRoot = async (app: Application) => {
  const { model } = app;
  const admin = await model.Admin.findOne({
    where: {
      account: 'root',
    },
  });
  if (admin !== null) {
    // 更新root的权限
    const role = await model.ManagerRole.findOne({
      where: {
        managerId: admin.managerId,
      },
      rejectOnEmpty: true,
    });
    const cnt = await model.RoleAuth.findAll({
      where: {
        roleId: role.roleId,
      },
    });
    // 不需要更新
    if (AUTH.length === cnt.length) return;
    // 事务
    const transaction = await model.transaction();
    try {
      // 更新权限
      await model.RoleAuth.destroy({
        where: {
          roleId: role.roleId,
        },
        transaction,
      });
      await model.RoleAuth.bulkCreate(
        AUTH.map(value => ({
          roleId: role.roleId,
          authId: value.authId,
        })),
        { transaction },
      );
      await transaction.commit();
      app.logger.info('超级管理员权限已修改');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return;
  }
  // 事务
  const transaction = await model.transaction();
  try {
    const manager = await model.Manager.create(
      {
        name: '超级管理员',
      },
      { transaction },
    );
    await model.Admin.create(
      {
        account: 'root',
        password: '123456',
        managerId: manager.managerId,
      },
      { transaction },
    );

    const role = await model.Role.create(
      {
        roleId: 0,
        name: '超级管理员',
      },
      { transaction },
    );
    await model.ManagerRole.create(
      {
        roleId: role.roleId,
        managerId: manager.managerId,
      },
      { transaction },
    );
    await model.RoleAuth.bulkCreate(
      AUTH.map(value => ({
        roleId: role.roleId,
        authId: value.authId,
      })),
      { transaction },
    );
    await transaction.commit();
    app.logger.info('超级管理员初始化完成');
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
export default class Boot implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  async serverDidReady() {
    // 同步权限
    await initAuth(this.app);
    // 是否需要初始化root用户
    await initRoot(this.app);
  }
}
