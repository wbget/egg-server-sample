import { Application } from 'egg';
import { EnumAuth } from './auth';

export default (app: Application) => {
  const { controller, router } = app;
  const { auth } = app.middleware;

  router.get('/', controller.home.index);
  if (app.env === 'local') {
    router.post('/', controller.home.debug);
  }
  // ======================= 客户端 start =======================

  // ======================= 客户端 end =======================

  // ======================= 后台 start =======================
  router.get('/admin/login', controller.admin.index); // 登陆状态
  router.post('/admin/login', controller.admin.login); // 后台登陆
  router.get('/admin/logout', controller.admin.logout); // 注销账号

  // 上传接口
  router.post(
    '/admin/upload',
    auth([EnumAuth.upload]),
    controller.upload.index,
  );

  // 账号管理
  router.post(
    '/accountAdmin/accountList',
    auth(EnumAuth.admin),
    controller.admin.accountList,
  ); // 登陆信息列表
  router.put(
    '/accountAdmin/updateAccount/:managerId',
    auth(EnumAuth.admin),
    controller.admin.updateAccount,
  ); // 修改登陆信息
  router.put(
    '/accountAdmin/updatePassword/:managerId',
    auth(EnumAuth.admin),
    controller.admin.updatePassword,
  ); // 修改登陆信息
  router.post(
    '/accountAdmin/addAccount',
    auth(EnumAuth.admin),
    controller.admin.addAccount,
  ); // 增加管理员

  // 权限管理
  router.put(
    '/authAdmin/updateAuth/:managerId',
    auth(EnumAuth.root),
    controller.admin.updateAuth,
  ); // 修改管理员权限
  router.delete(
    '/authAdmin/deleteAuth/:managerId',
    auth(EnumAuth.root),
    controller.admin.deleteAuth,
  ); // 删除管理员权限
  // 角色分配管理
  router.post(
    '/roleAdmin/authRoleList',
    auth(EnumAuth.role),
    controller.admin.authRoleList,
  ); // 查看角色权限列表
  router.put(
    '/roleAdmin/updateRoleAuth/:roleId',
    auth(EnumAuth.role),
    controller.admin.updateRoleAuth,
  ); // 修改角色权限
  router.delete(
    '/roleAdmin/deleteRoleAuth/:roleId',
    auth(EnumAuth.role),
    controller.admin.deleteRoleAuth,
  ); //  删除角色权限
  router.post(
    '/roleAdmin/addRoleAuth',
    auth(EnumAuth.role),
    controller.admin.addRoleAuth,
  ); // 分配角色权限
  // ======================= 后台 end =======================
};
