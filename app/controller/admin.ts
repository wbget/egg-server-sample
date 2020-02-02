'use strict';

import { Controller } from 'egg';
import { isEmpty } from 'lodash';
import { AdminToken } from '../extend/interface';

export default class Admin extends Controller {
  public async index() {
    if (!this.ctx.session.token) {
      this.ctx.body = { result: false };
      return;
    }
    const { managerId }: AdminToken = this.ctx.helper.verify(
      this.ctx.session.token,
    );
    const manager = await this.ctx.model.Manager.findOne({
      where: { managerId },
    });
    if (!manager) {
      this.ctx.body = { result: false, msg: '用户不存在' };
      return;
    }
    const role = await this.ctx.model.ManagerRole.findOne({
      where: {
        managerId,
      },
      include: [{ model: this.app.model.Role }],
    });
    if (!role) {
      this.ctx.body = { result: false, msg: '您没有登陆权限,请联系权限管理员' };
      return;
    }
    const auths = await this.ctx.model.RoleAuth.findAll({
      where: {
        roleId: role.roleId,
      },
      // include: [{ model: this.app.model.Auth, attributes: [ 'authId', 'name' ] }],
    });
    this.ctx.body = {
      result: true,
      user: manager,
      role: role.role,
      auths: auths.map(a => a.authId),
    };
  }
  public async login() {
    const { account, password } = this.ctx.request.body;
    if (isEmpty(account) || isEmpty(password)) return;
    const admin = await this.app.model.Admin.findOne({
      where: {
        account,
        password,
      },
    });
    if (!admin) {
      this.ctx.body = { result: false, msg: '账号/密码错误' };
      return;
    }
    // 生成token
    const token = this.ctx.helper.signAdmin({ managerId: admin.managerId });
    this.ctx.session.token = token;
    this.ctx.body = { result: true };
  }
  public async logout() {
    this.ctx.session.token = null;
    this.ctx.body = { result: false };
  }
  // ============ 账号管理============ //
  // 后台管理人员列表信息
  public async accountList() {
    const {
      page,
      order: rawOrder,
      where: rawWhere,
      limit,
    } = this.ctx.request.body;
    const offset = (parseInt(page) - 1) * limit;
    const where = this.ctx.helper.parseWhere(rawWhere);
    const order = this.ctx.helper.parseOrder(rawOrder);
    const usersPromise = this.ctx.model.Manager.findAndCountAll({
      include: [
        { model: this.app.model.Admin },
        { model: this.app.model.ManagerRole },
      ],
      offset,
      limit,
      order: order
        ? order
        : [
            [this.ctx.model.col('createdAt'), 'desc'],
            ['createdAt', 'desc'],
          ],
      where: where ? where : null,
      raw: true,
    });
    const rolesPromise = this.app.model.Role.findAll({
      attributes: ['roleId', 'name'],
      include: [this.ctx.model.RoleAuth],
    });

    const authsPromise = this.app.model.Auth.findAll();

    const [users, roles, auths] = await Promise.all([
      usersPromise,
      rolesPromise,
      authsPromise,
    ]);
    this.ctx.body = { users, roles, auths };
  }
  // 修改账号管理员登陆or用户名密码
  public async updateAccount() {
    const { managerId } = this.ctx.params;
    const { name, phone } = this.ctx.request.body;

    if (isEmpty(managerId)) return;
    const manager = await this.ctx.model.Manager.findOne({
      where: { managerId },
    });
    if (!manager) {
      this.ctx.body = { result: false, msg: '用户不存在' };
      return;
    }
    await manager.update({ name, phone });

    this.ctx.body = { result: true };
  }
  // 重置登陆密码为初始密码：123456
  public async updatePassword() {
    const { managerId } = this.ctx.params;
    if (isEmpty(managerId)) return;
    const manager = await this.ctx.model.Admin.findOne({
      where: { managerId },
    });
    if (!manager) {
      this.ctx.body = { result: false, msg: '用户不存在' };
      return;
    }
    await manager.update({ password: '123456' });

    this.ctx.body = { result: true };
  }
  // 增加账号管理(不分配权限)
  public async addAccount() {
    const { name, account, password, phone } = this.ctx.request.body;
    if (isEmpty(account) || isEmpty(name) || isEmpty(password)) {
      this.ctx.body = { result: false, msg: '账号名称登陆信息不能为空' };
      return;
    }
    const admin = await this.app.model.Admin.findOne({
      where: {
        account,
      },
    });
    if (admin) {
      this.ctx.body = { result: false, msg: '登陆账号已创建,请换其他名字' };
      return;
    }
    const cnt = await this.app.model.Manager.findOne({
      where: {
        name,
      },
    });
    if (cnt) {
      this.ctx.body = { result: false, msg: '管理员名称已创建,请换其他名字' };
      return;
    }
    const transaction = await this.app.model.transaction();
    try {
      const role = await this.ctx.model.Manager.create(
        { name, phone },
        { transaction },
      );
      await this.ctx.model.Admin.create(
        { account, password, managerId: role.managerId },
        { transaction },
      );
      await transaction.commit();
      this.ctx.body = { result: true, role };
    } catch (error) {
      this.ctx.body = { result: false, msg: '存库异常' };
      this.ctx.logger.error(error);
      await transaction.rollback();
    }
  }

  // ============ 权限管理============ //
  // 修改管理员权限
  public async updateAuth() {
    const { managerId } = this.ctx.params;
    const body = this.ctx.request.body;
    if (managerId === '' || isEmpty(body)) return;
    const admin = await this.app.model.ManagerRole.findOne({
      where: {
        managerId,
      },
    });
    if (!admin) {
      await this.app.model.ManagerRole.create({
        roleId: body.roleId,
        managerId,
      });
      this.ctx.body = { result: true, msg: '新增权限成功' };
      return;
    }
    if (admin.roleId === body.roleId) {
      this.ctx.body = { result: false, msg: '该用户现在就是该权限' };
      return;
    }
    const results = await admin.update(body);
    this.ctx.body = { result: true, results, msg: '更新权限成功' };
  }
  // 删除管理员权限
  public async deleteAuth() {
    const { managerId } = this.ctx.params;
    if (managerId === '') return;
    const managerRole = await this.ctx.model.ManagerRole.findOne({
      where: {
        managerId,
      },
    });
    if (!managerRole) {
      this.ctx.body = { result: false, msg: '此用户暂无分配权限' };
      return;
    }
    await managerRole.destroy();
    this.ctx.body = { result: true };
  }
  // ============ 角色分配管理============ //
  // 查看角色权限列表
  public async authRoleList() {
    const {
      page,
      order: rawOrder,
      where: rawWhere,
      limit,
    } = this.ctx.request.body;
    const offset = (parseInt(page) - 1) * limit;
    const order = this.ctx.helper.parseOrder(rawOrder);
    const where = this.ctx.helper.parseWhere(rawWhere);

    const usersPromise = this.ctx.model.Role.findAndCountAll({
      include: [
        {
          model: this.ctx.model.RoleAuth,
        },
      ],
      offset,
      limit,
      order: order
        ? order
        : [
            [this.ctx.model.col('createdAt'), 'desc'],
            ['createdAt', 'desc'],
          ],
      where: where ? where : null,
    });
    const rolesPromise = this.app.model.Auth.findAll();
    const [users, auths] = await Promise.all([usersPromise, rolesPromise]);
    this.ctx.body = { users, auths };
  }
  // 分配角色权限
  public async addRoleAuth() {
    const { name, auths } = this.ctx.request.body;
    if (isEmpty(name) || isEmpty(auths)) return;
    const role = await this.app.model.Role.findOne({
      where: {
        name,
      },
    });
    if (role) {
      this.ctx.body = { result: false, msg: '角色权限已分配,请调用修改接口' };
      return;
    }
    const roleCre = await this.app.model.Role.create({ name });
    const arr = auths.map(item => {
      const res: { roleId: any; authId: any } = { roleId: null, authId: null };
      res.roleId = roleCre.roleId;
      res.authId = item;
      return res;
    });
    await this.ctx.model.RoleAuth.bulkCreate(arr);
    this.ctx.body = { result: true };
  }
  // 修改角色权限
  public async updateRoleAuth() {
    const { roleId } = this.ctx.params;

    const { name, auths } = this.ctx.request.body;
    if (isEmpty(name) || isEmpty(auths)) return;
    let role = await this.app.model.Role.findOne({
      where: {
        roleId,
      },
    });
    if (!role) {
      role = await this.app.model.Role.create({ name });
    }
    await this.app.model.RoleAuth.destroy({
      where: {
        roleId: role.roleId,
      },
    });
    const arr: object[] = [];
    auths.map(authId => {
      const obj = { roleId, authId };
      arr.push(obj);
      return arr;
    });
    await role.update({ name });
    await this.app.model.RoleAuth.bulkCreate(arr);
    this.ctx.body = { result: true };
  }
  // 删除角色权限
  public async deleteRoleAuth() {
    const { roleId } = this.ctx.params;
    if (isEmpty(roleId)) return;
    const role = await this.app.model.Role.findOne({
      where: {
        roleId,
      },
    });
    if (!role) {
      this.ctx.body = { result: false, msg: '角色不存在' };
      return;
    }
    await role.destroy();
    await this.app.model.RoleAuth.destroy({
      where: {
        roleId,
      },
    });
    this.ctx.body = { result: true };
  }
}
